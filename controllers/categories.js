var mysql = require('../config/mysql');

exports.getAllCategories = function (req, res) {
  mysql.query('SELECT * FROM categories', (err, rows, fields) => {
    if (err) {
      return res.sendStatus(500);
    }
    return res.status(200).json(rows);
  });
};

exports.getMainCategories = function (req, res) {
  mysql.query(
    'SELECT * FROM categories WHERE parent_id IS NULL',
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.status(200).json(rows);
    }
  );
};

exports.getChildrenCategories = function (req, res) {
  mysql.query(
    'SELECT * FROM categories WHERE parent_id=' + req.params.id,
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.status(200).json(rows);
    }
  );
};

exports.getCategory = function (req, res) {
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
};
