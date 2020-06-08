var mysql = require('../config/mysql');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
var { v4: uuidv4 } = require('uuid');

exports.register = function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var userId;
  // check whether email is taken
  mysql.query(
    'SELECT email FROM users where email = ?',
    [req.body.email],
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (rows.length > 0) {
        return res.status(400).json({
          message: 'Mail taken',
        });
      }

      // check whether name is taken
      mysql.query(
        'SELECT name FROM users where name = ?',
        [req.body.name],
        (err, rows, fields) => {
          if (err) {
            return res.status(500);
          }
          if (rows.length > 0) {
            return res.status(400).json({
              message: 'Name taken',
            });
          }

          mysql.beginTransaction(function (errBegin) {
            if (errBegin) {
              return res.sendStatus(500);
            }
            // create password hash and add new user to database
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                mysql.rollback(function () {
                  return res.sendStatus(500);
                });
              } else {
                // create user
                mysql.query(
                  'INSERT INTO users(email, name, password, role) VALUES(?,?,?,?)',
                  [req.body.email, req.body.name, hash, 'Customer'],
                  (err, rows, fields) => {
                    if (err) {
                      mysql.rollback(function () {
                        return res.sendStatus(500);
                      });
                    }

                    // create refresh token
                    var refresh_token = uuidv4();
                    mysql.query(
                      'INSERT INTO refresh_tokens(user_id, refresh_token) VALUES(?,?)',
                      [rows.insertId, refresh_token],
                      (err, rows, fields) => {
                        if (err) {
                          mysql.rollback(function () {
                            return res.sendStatus(500);
                          });
                        }
                      }
                    );
                  }
                );
              }
            });

            mysql.commit(function (err) {
              if (err) {
                return res.sendStatus(500);
              }
            });
            res.sendStatus(201);
          });
        }
      );
    }
  );
};

exports.login = function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  mysql.query(
    'SELECT id, email, password, role, refresh_token FROM users INNER JOIN refresh_tokens ON users.id = refresh_tokens.user_id WHERE email = ?',
    [req.body.email],
    (err, rows, fields) => {
      // user doesn't exists
      if (rows.length < 1) {
        return res.status(401).json({
          message: 'Bad credentials',
        });
      } else {
        user = rows[0];

        // compare passwords
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: 'Bad credentials',
            });
          } else {
            //success login
            if (result) {
              const token = jwt.sign(
                {
                  email: user.email,
                  id: user.id,
                  role: user.role,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: '1h',
                }
              );
              return res.status(200).json({
                token: token,
                refresh_token: user.refresh_token,
              });
            }
            res.status(401).json({
              message: 'Bad credentials',
            });
          }
        });
      }
    }
  );
};

exports.logout = function (req, res) {
  let newRefreshToken = uuidv4();
  // create new refresh token
  mysql.query(
    'UPDATE refresh_tokens SET refresh_token = ? WHERE user_id = ?',
    [newRefreshToken, req.userData.id],
    (err, rows, fields) => {
      if (err) {
        mysql.rollback(function () {
          return res.sendStatus(500);
        });
      }
      res.sendStatus(200);
    }
  );
};

exports.getRefreshToken = function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  //get refresh token from database
  mysql.query(
    'SELECT user_id, refresh_token FROM refresh_tokens WHERE refresh_token = ? AND user_id = ?',
    [req.body.refresh_token, req.userData.id],
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (rows.length == 0) {
        return res.sendStatus(400);
      }
      const token = jwt.sign(
        {
          email: req.userData.email,
          id: req.userData.id,
          role: req.userData.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );
      res.status(200).json({ token: token });
    }
  );
};

exports.getProfile = function (req, res) {
  if (req.params.id != req.userData.id) {
    return res.sendStatus(403);
  }
  mysql.query(
    'SELECT id, email, name FROM users WHERE id = ?',
    [req.userData.id],
    (err, rows, fields) => {
      if (rows.length < 1) {
        return res.sendStatus(404);
      }
      res.status(200).json(rows);
    }
  );
};
