var mysql = require('../config/mysql');
const { validationResult } = require('express-validator');

exports.addCartItem = function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  mysql.query(
    'SELECT item_id FROM cart_items WHERE user_id = ? AND item_id = ?',
    [req.userData.id, req.body.item_id],
    (err, rows) => {
      if (err) {
        return res.sendStatus(500);
      }
      //if item is already in a cart
      if (rows.length > 0) {
        res.statusMessage = 'This item is already in a cart';
        return res.sendStatus(400);
      }

      mysql.query(
        'INSERT INTO cart_items(user_id, item_id, amount) VALUES(?,?,1)',
        [req.userData.id, req.body.item_id],
        (err, rows) => {
          if (err) {
            return res.sendStatus(500);
          }
          res.sendStatus(201);
        }
      );
    }
  );
};

exports.updateCartItem = function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

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
        // return bad request if amount < 0
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
          [req.userData.id, req.body.item_id, req.body.amount],
          (err, rows, fields) => {
            if (err) {
              return res.sendStatus(500);
            }
            res.sendStatus(201);
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
