var express = require('express');
var mysql = require('../config/mysql');
var router = express.Router();

// get all categories
router.get('/', function (req, res) {
  if (req.query.category) {
    mysql.query(
      'SELECT * FROM categories WHERE id =' + req.query.category,
      (err, rows, fields) => {
        res.json(rows);
      }
    );
  } else {
    mysql.query('SELECT * FROM categories', (err, rows, fields) => {
      res.json(rows);
    });
  }
});
// get main categories
router.get('/main-categories', function (req, res) {
  mysql.query(
    'SELECT * FROM categories WHERE parent_id IS NULL',
    (err, rows, fields) => {
      res.json(rows);
    }
  );
});
// get category
router.get('/:id', function (req, res) {
  mysql.query(
    'SELECT * FROM categories WHERE id=' + req.params.id,
    (err, rows, fields) => {
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.sendStatus(404);
      }
    }
  );
});
// get category's children
router.get('/:id/child-categories', function (req, res) {
  mysql.query(
    'SELECT * FROM categories WHERE parent_id=' + req.params.id,
    (err, rows, fields) => {
      if (rows.length > 0) {
        res.json(rows);
      } else {
        res.sendStatus(404);
      }
    }
  );
});

module.exports = router;
