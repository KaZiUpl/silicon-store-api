var express = require('express');
var mysql = require('../config/mysql');
var router = express.Router();

router.use(function (req, res, next) {
  next();
});

// add item to cart
router.post('/', function (req, res) {
  res.json('added item to cart');
});

// get cart item
router.get('/:id', function (req, res) {
  res.json('Got item ' + req.params.id);
});

// modify cart item
router.put('/:id', function (req, res) {
  res.json('Modified cart item ' + req.params.id);
});

router.delete('/:id', function (req, res) {
  res.json('Deleted cart item ' + req.params.id);
});

module.exports = router;
