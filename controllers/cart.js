var mysql = require('../config/mysql');
const { validationResult } = require('express-validator');

exports.addCartItem = async function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    //check if item is in a cart
    let cartItem = await mysql.query(
      'SELECT item_id FROM cart_items WHERE user_id = ? AND item_id = ?',
      [req.userData.id, req.body.item_id]
    );
    if (cartItem.length > 0) {
      return res
        .status(400)
        .json({ message: 'This item is already in a cart' });
    }

    await mysql.query(
      'INSERT INTO cart_items(user_id, item_id, amount) VALUES(?,?,1)',
      [req.userData.id, req.body.item_id]
    );
    return res.status(201).json();
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.updateCartItem = async function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    // check if item is already in the cart
    let cartItem = await mysql.query(
      'SELECT * from cart_items WHERE user_id = ? AND item_id = ?',
      [req.userData.id, req.body.item_id]
    );

    // if item is in the cart
    if (cartItem.length > 0) {
      let newAmount = req.body.amount;
      // return bad request if amount < 0
      if (newAmount < 1) {
        return res
          .status(400)
          .json({ message: 'You cannot order amount lower than 1' });
      }
      //update cart item
      await mysql.query(
        'UPDATE cart_items SET amount = ? WHERE user_id = ? AND item_id = ?',
        [newAmount, req.userData.id, req.body.item_id]
      );

      return res.status(200).end();
    } else {
      //create new cart item
      await mysql.query(
        'INSERT INTO cart_items(user_id, item_id, amount) VALUES(?,?,?)',
        [req.userData.id, req.body.item_id, req.body.amount]
      );

      return res.status(201).end();
    }
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.getCartItems = async function (req, res) {
  try {
    let cartItems = await mysql.query(
      'SELECT user_id, item_id, amount, name, photo, price FROM cart_items INNER JOIN items ON (items.id = cart_items.item_id) WHERE user_id = ?',
      req.userData.id
    );

    return res.status(200).json(cartItems);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.getCartItem = async function (req, res) {
  try {
    let cartItem = await mysql.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND item_id = ?',
      [req.userData.id, req.params.item_id]
    );
    if (cartItem.length == 0) {
      return res.sendStatus(404);
    }
    return res.status(200).json(cartItem[0]);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.deleteCartItem = async function (req, res) {
  try {
    await mysql.query(
      'DELETE FROM cart_items WHERE user_id = ? AND item_id = ?',
      [req.userData.id, req.params.item_id]
    );

    return res.status(200).end();
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};
