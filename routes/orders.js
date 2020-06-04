var express = require('express');
var mysql = require('../config/mysql');
var checkAuth = require('../middleware/check-auth');
var router = express.Router();

router.use(function (req, res, next) {
  next();
});

// place new order
router.post('/', function (req, res) {
  res.json('placed order');
});

// get order data
router.get('/:id', checkAuth, function (req, res) {
  if(req.params.id != req.userData.id) {
    return res.sendStatus(403);
  }
  mysql.query(
    'SELECT * FROM orders WHERE id=' + req.params.id,
    (err, rows, fields) => {
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.sendStatus(404);
      }
    }
  );
});

// get order items
router.get('/:id/items', function (req, res) {
  if(req.params.id != req.userData.id) {
    return res.sendStatus(403);
  }
  mysql.query(
    'SELECT * FROM order_items WHERE order_id=' + req.params.id,
    (err, rows, fields) => {
      res.json(rows);
    }
  );
});

module.exports = router;
