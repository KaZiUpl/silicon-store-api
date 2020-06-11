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

                    // create refresh token row
                    mysql.query(
                      'INSERT INTO refresh_tokens(user_id, refresh_token) VALUES(?,?)',
                      [rows.insertId, ''],
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

  // check provided credentials
  mysql.query(
    'SELECT id, email, password, role FROM users WHERE email = ?',
    [req.body.email],
    (err, rows, fields) => {
      // user doesn't exists
      if (rows.length < 1) {
        return res.status(401).json({
          message: 'Bad credentials',
        });
      } else {
        //login data correct
        user = rows[0];

        // compare passwords
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          // handle incorrect password
          if (err) {
            return res.status(401).json({
              message: 'Bad credentials',
            });
          } else {
            //success login
            if (result) {
              //generate refresh token and insert it into database
              let new_refresh_token = uuidv4();
              mysql.query(
                'UPDATE refresh_tokens SET refresh_token = ? WHERE user_id = ?',
                [new_refresh_token, user.id],
                (err, rows) => {
                  if (err) {
                    return res.sendStatus(500);
                  }
                  //generate access token
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
                    refresh_token: new_refresh_token,
                    id: user.id,
                    email: user.email,
                    role: user.role,
                  });
                }
              );
            }
          }
        });
      }
    }
  );
};

exports.refreshToken = function (req, res) {
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
      // user is trying to get someone else access token
      if (rows.length == 0) {
        return res.sendStatus(404);
      }
      //create new access token
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
      res.status(200).json({
        token: token,
        refresh_token: req.body.refresh_token,
        id: req.userData.id,
        email: req.userData.email,
        role: req.userData.role,
      });
    }
  );
};

exports.logout = function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // delete refresh token from database
  mysql.query(
    'UPDATE refresh_tokens SET refresh_token = "" WHERE user_id = ?',
    req.userData.id,
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      res.status(200).json();
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
