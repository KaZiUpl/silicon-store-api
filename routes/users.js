var express = require('express');
var mysql = require('../config/mysql');
var router = express.Router();

// user register
router.post('/', function (req, res) {
  res.json('user created');
});

// user login
router.post('/key', function (req, res) {
  res.json('user logged in');
});

// get user profile
router.get('/:id', function (req, res) {
  mysql.query(
    'SELECT id, email, name FROM users WHERE id=' + req.params.id,
    (err, rows, fields) => {
      res.json(rows);
    }
  );
});

// getting order list
router.get('/:id/orders', function (req, res) {
  mysql.query(
    'SELECT * from orders WHERE user_id = ' + req.params.id,
    (err, rows, fields) => {
      res.json(rows);
    }
  );
});

//get shopping cart
router.get('/:id/cart', function (req, res) {
  res.json('your shopping cart');
});

module.exports = router;
