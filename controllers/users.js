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
    'SELECT id, email, password, role, api_key FROM users WHERE email = ?',
    [req.body.email],
    (err, rows, fields) => {
      if(err) {
        return res.sendStatus(500);
      }
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
          if (err || result == false) {
            return res.status(401).json({
              message: 'Bad credentials',
            });
          } else {
            console.log(result);
            //success login
            if (result) {
              //check for existing api key
              mysql.query(
                'SELECT api_key FROM users WHERE id = ?',
                user.id,
                (err, rows) => {
                  if (err || rows.length == 0) {
                    return res.sendStatus(500);
                  }
                  //if key exists
                  if (rows[0].api_key != '') {
                    return res
                      .status(200)
                      .json({
                        api_key: rows[0].api_key,
                        id: user.id,
                        email: user.email,
                        role: user.role,
                      });
                  } else {
                    // create api key
                    const apiKey = uuidv4();
                    mysql.query(
                      'UPDATE users SET api_key = ? WHERE id = ?',
                      [apiKey, user.id],
                      (err, rows) => {
                        if (err || rows.length == 0) {
                          return res.sendStatus(500);
                        }
                        res
                          .status(200)
                          .json({
                            api_key: apiKey,
                            id: user.id,
                            email: user.email,
                            role: user.role,
                          });
                      }
                    );
                  }
                }
              );
            }
          }
        });
      }
    }
  );
};

exports.logout = function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // delete api key from a database
  mysql.query(
    'UPDATE users SET api_key = "" WHERE api_key = ?',
    req.userData.api_key,
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      res.status(200).json();
    }
  );
};

exports.getProfile = function (req, res) {
  mysql.query(
    'SELECT id, email, name FROM users WHERE id = ?',
    [req.userData.id],
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (rows.length < 1) {
        return res.sendStatus(404);
      }
      res.status(200).json(rows);
    }
  );
};
