var express = require('express');
var mysql = require('../config/mysql');
var router = express.Router();

router.post('/', function (req, res) {
  res.json('comment added');
});

module.exports = router;
