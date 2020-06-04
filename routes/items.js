var express = require('express');
var mysql = require('../config/mysql');
var router = express.Router();

// /items?category=:id
router.get('/', function (req, res) {
  const category = parseInt(req.query.category);
  if (category) {
    // find all items connected with category or any of its descendants
    mysql.query(
      'SELECT id, name, price, short_specification, specification, description, photo, amount FROM items INNER JOIN amounts ON (items.id = amounts.item_id) WHERE amount > 0 AND category_id IN (SELECT id FROM categories WHERE path REGEXP "^([0-9]/)*?(/[0-9]+)*$")',
      [category],
      (err, rows, fields) => {
        if (err) {
          return res.sendStatus(500);
        }
        return res.status(200).json(rows);
      }
    );
  }
  else {
    // get all items
    mysql.query('SELECT id, name, price, short_specification, specification, description, photo, amount FROM items INNER JOIN amounts ON (items.id = amounts.item_id) WHERE amount > 0', (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.status(200).json(rows);
    });
  }
});

// get item
router.get('/:id', function (req, res) {
  mysql.query(
    'SELECT * FROM items WHERE id= ? ',
    [req.params.id],
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (rows.length == 0) {
        return res.sendStatus(404);
      }
      res.status(200).json(rows[0]);
    }
  );
});

// get item's comments
router.get('/:id/comments', function (req, res) {
  mysql.query(
    'SELECT * FROM comments WHERE item_id=' + req.params.id,
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      res.status(200).json(rows);
    }
  );
});

// get item's breadcrumbs
router.get('/:id/breadcrumbs', function(req,res) {
  mysql.query('SELECT * FROM categories WHERE FIND_IN_SET(categories.id, (SELECT REPLACE((SELECT categories.path FROM categories INNER JOIN items ON (items.category_id = categories.id) WHERE items.id = ?), "\/",",")))', [req.params.id], (err, rows, fields) => {
    if(err) {
      res.sendStatus(500)
    }
    res.status(200).json(rows);
  })
})

module.exports = router;
