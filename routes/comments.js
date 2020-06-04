var express = require('express');
var mysql = require('../config/mysql');
var router = express.Router();

router.post('/', function (req, res) {
  mysql.query(
    'INSERT INTO comments(item_id, user_id, text) VALUES(?,?,?)',
    [req.body.item_id, req.userData.id, req.body.text],
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      } else {
        return res.sendStatus(201);
      }
    }
  );
});

module.exports = router;
