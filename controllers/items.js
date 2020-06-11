var mysql = require('../config/mysql');

exports.getAllItems = function (req, res) {
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
  } else {
    // get all items
    mysql.query(
      'SELECT id, name, price, short_specification, specification, description, photo, amount FROM items INNER JOIN amounts ON (items.id = amounts.item_id) WHERE amount > 0',
      (err, rows, fields) => {
        if (err) {
          return res.sendStatus(500);
        }
        rows.forEach((element) => {
          element.photo = 'http://localhost:3000/images/' + element.photo;
        });
        return res.status(200).json(rows);
      }
    );
  }
};

exports.getItem = function (req, res) {
  mysql.query(
    'SELECT * FROM items INNER JOIN amounts ON (items.id = amounts.item_id) WHERE id= ?',
    [req.params.id],
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (rows.length == 0) {
        return res.sendStatus(404);
      }
      rows[0].photo = 'http://localhost:3000/images/' + rows[0].photo;
      res.status(200).json(rows[0]);
    }
  );
};

exports.getItemComments = function (req, res) {
  mysql.query(
    'SELECT comments.id, user_id, item_id, text, created_at, updated_at, name as author FROM comments INNER JOIN users ON (comments.user_id = users.id) WHERE item_id = ' + req.params.id,
    (err, rows, fields) => {
      if (err) {
        res.sendStatus(500);
        throw err;
      }
      res.status(200).json(rows);
    }
  );
};

exports.getItemBreadcrumbs = function (req, res) {
  mysql.query(
    'SELECT * FROM categories WHERE FIND_IN_SET(categories.id, (SELECT REPLACE((SELECT categories.path FROM categories INNER JOIN items ON (items.category_id = categories.id) WHERE items.id = ?), "/",",")))',
    [req.params.id],
    (err, rows, fields) => {
      if (err) {
        res.sendStatus(500);
      }
      res.status(200).json(rows);
    }
  );
};
