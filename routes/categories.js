var express = require('express');
var mysql = require('../config/mysql');
var router = express.Router();

// get all categories
router.get('/', function (req, res) {
  mysql.query('SELECT * FROM categories', (err, rows, fields) => {
    if (err) {
      return res.sendStatus(500);
    }
    return res.status(200).json(rows);
  });
});

// get main categories
router.get('/main-categories', function (req, res) {
  mysql.query(
    'SELECT * FROM categories WHERE parent_id IS NULL',
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.status(200).json(rows);
    }
  );
});

// get category
router.get('/:id', function (req, res) {
  mysql.query(
    'SELECT * FROM categories WHERE id=' + req.params.id,
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (rows.length == 0) {
        return res.status(200).json(rows[0]);
      } else {
        return res.sendStatus(404);
      }
    }
  );
});

// get category's children
router.get('/:id/child-categories', function (req, res) {
  mysql.query(
    'SELECT * FROM categories WHERE parent_id=' + req.params.id,
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.status(200).json(rows);
    }
  );
});

module.exports = router;
