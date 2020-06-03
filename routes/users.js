var express = require('express');
var mysql = require('../config/mysql');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var checkAuth = require('../middleware/check-auth');
var router = express.Router();

// user register
router.post('/', function (req, res) {
  // check whether email is taken
  mysql.query(
    'SELECT email FROM users where email = ?',
    [req.body.email],
    (err, fields, rows) => {
      if (err) {
        return res.sendStatus(500);
      } else {
        if (fields.length > 0) {
          return res.status(400).json({
            message: 'Mail taken',
          });
        }
        // create password hash and add new user to database
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.sendStatus(500);
          } else {
            // create new user
            mysql.query(
              'INSERT INTO users(email, name, password, role) VALUES(?,?,?,?)',
              [req.body.email, req.body.name, hash, 'Customer'],
              (err, rows, fields) => {
                if (err) {
                  return res.sendStatus(500);
                } else {
                  return res.status(201).json({
                    message: 'Customer created',
                  });
                }
              }
            );
          }
        });
      }
    }
  );
});

// user login
router.post('/token', function (req, res) {
  mysql.query(
    'SELECT id,email, password, role from users WHERE email = ?',
    [req.body.email],
    (err, rows, fields) => {
      // user doesn't exists
      if (rows.length < 1) {
        return res.status(401).json({
          message: 'Bad credentials',
        });
      } else {
        user = rows[0];
        console.log(user);

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
                id: user.id,
                mail: user.email,
              });
            } else {
              return res.status(401).json({
                message: 'Bad credentials',
              });
            }
          }
        });
      }
    }
  );
});

// get user profile
router.get('/:id', checkAuth, function (req, res) {
  mysql.query(
    'SELECT id, email, name FROM users WHERE id = ?',
    [req.params.id],
    (err, rows, fields) => {
      if (rows.length < 1) {
        return res.sendStatus(404);
      }
      return res.status(200).json(rows);
    }
  );
});

// getting order list
router.get('/:id/orders', function (req, res) {
  mysql.query(
    'SELECT * from orders WHERE user_id = ?',
    [req.params.id],
    (err, rows, fields) => {
      return res.json(rows);
    }
  );
});

//get shopping cart
router.get('/:id/cart', function (req, res) {
  mysql.query(
    'SELECT * FROM cart_items WHERE user_id = ?',
    [req.params.id],
    (err, rows, fields) => {
      return res.json(rows);
    }
  );
});

module.exports = router;
