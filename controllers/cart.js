var mysql = require('../config/mysql');

exports.patchCartItem = function (req, res) {
  // check if item is already in the cart
  mysql.query(
    'SELECT * from cart_items WHERE user_id = ? AND item_id = ?',
    [req.userData.id, req.body.item_id],
    (err, rows, fields) => {
      if (err) {
        res.sendStatus(500);
      }
      // if item is in the cart
      if (rows.length > 0) {
        let newAmount = req.body.amount;
        if (newAmount < 1) {
          return res.sendStatus(400);
        }
        // update cart item
        mysql.query(
          'UPDATE cart_items SET amount = ? WHERE user_id = ? AND item_id = ?',
          [newAmount, req.userData.id, req.body.item_id],
          (err, rows, fields) => {
            if (err) {
              return res.sendStatus(500);
            }
            return res.sendStatus(200);
          }
        );
      } else {
        // add item to the cart
        mysql.query(
          'INSERT INTO cart_items(user_id, item_id, amount) VALUES(?,?,?)',
          [req.userData.id, req.body.item_id, 1],
          (err, rows, fields) => {
            if (err) {
              return res.sendStatus(500);
            }
            return res.sendStatus(201);
          }
        );
      }
    }
  );
};

exports.getCartItems = function (req, res) {
  mysql.query(
    'SELECT * FROM cart_items WHERE user_id = ?',
    [req.userData.id],
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.status(200).json(rows);
    }
  );
};

exports.getCartItem = function (req, res) {
  mysql.query(
    'SELECT * FROM cart_items WHERE user_id = ? AND item_id = ?',
    [req.userData.id, req.params.item_id],
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (rows.length == 0) {
        return res.sendStatus(404);
      }
      return res.status(200).json(rows[0]);
    }
  );
};

exports.deleteCartItem = function (req, res) {
  mysql.query(
    'DELETE FROM cart_items WHERE user_id = ? AND item_id = ?',
    [req.userData.id, req.params.item_id],
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.sendStatus(200);
    }
  );
};
