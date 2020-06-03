var express = require('express');
var mysql = require('../config/mysql');
var router = express.Router();

// /items?category
router.get('/', function (req, res) {
  let category = req.query.category;
  if (category) {
    // find all categories from tree
    let childCategories = [];
  }
  const items = mysql.query('select * from items', (err, rows, fields) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.json(rows);
  });
});

// get item
router.get('/:id', function (req, res) {
  mysql.query(
    'SELECT * FROM items WHERE id=' + req.params.id,
    (err, rows, fields) => {
      res.json(rows[0]);
    }
  );
});

// get item's comments
router.get('/:id/comments', function (req, res) {
  mysql.query(
    'SELECT * FROM comments WHERE item_id=' + req.params.id,
    (err, rows, fields) => {
      res.json(rows);
    }
  );
});

function descendants(child_array) {
  child_array.forEach((element) => {});
}

module.exports = router;
