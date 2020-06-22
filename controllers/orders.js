var mysql = require('../config/mysql');
const { validationResult } = require('express-validator');

exports.getAll = async function (req, res) {
  try {
    let orders = await mysql.query('SELECT * FROM orders WHERE user_id = ?', [
      req.userData.id,
    ]);

    return res.status(200).json(orders);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.getOrder = async function (req, res) {
  try {
    let order = await mysql.query(
      'SELECT * FROM orders WHERE id = ' + req.params.id
    );
    if (order.length == 0) {
      return res.sendStatus(404);
    }
    // check order's recipient
    if (order[0].user_id != req.userData.id) {
      return res.sendStatus(403);
    }
    return res.status(200).json(order[0]);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.postOrder = async function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    await mysql.beginTransaction();

    let created_at = new Date();

    let newOrder = await mysql.query(
      'INSERT INTO orders(user_id, name, surname, address, city, postal_code, created_at, updated_at) VALUES(?,?,?,?,?,?,?,?)',
      [
        req.userData.id,
        req.body.name,
        req.body.surname,
        req.body.address,
        req.body.city,
        req.body.postal_code,
        created_at,
        created_at,
      ]
    );
    let orderId = newOrder.insertId;

    // get cart items
    var orderItems = await mysql.query(
      'SELECT * FROM cart_items WHERE user_id = ?',
      req.userData.id
    );

    if (orderItems.length == 0) {
      await mysql.rollback();
      return res.status(400).json({ message: 'You have no items in the cart' });
    }
    //check for availability of item
    for (const orderItem of orderItems) {
      let storageAmount;

      // get storage amount
      storageAmount = await mysql.query(
        'SELECT amount FROM amounts WHERE item_id = ?',
        orderItem.item_id
      );

      if (
        storageAmount.length == 0 ||
        storageAmount[0].amount < orderItem.amount
      ) {
        await mysql.rollback();
        return res.status(400).json({
          message: 'Not enough item in storage',
          item_id: orderItem.item_id,
        });
      }

      // subtract ordered amount from storage
      await mysql.query(
        'UPDATE amounts SET amount = amount - ? WHERE item_id = ?',
        [orderItem.amount, orderItem.id]
      );

      // insert new row into order_items
      await mysql.query(
        'INSERT INTO order_items(order_id, item_id, amount, price) VALUES(?,?,?, (SELECT price FROM items WHERE id = ?))',
        [orderId, orderItem.item_id, orderItem.amount, orderItem.item_id]
      );
    }

    // delete cart items
    await mysql.query('DELETE FROM cart_items WHERE user_id = ?', [
      req.userData.id,
    ]);

    await mysql.commit();
    return res.status(200).json();
  } catch (error) {
    await mysql.rollback();
    res.sendStatus(500);
    throw error;
  }
};

exports.getOrderItems = async function (req, res) {
  try {
    let order = await mysql.query(
      'SELECT * FROM orders WHERE id = ?',
      req.params.id
    );
    if (order.length == 0) {
      return res.sendStatus(404);
    }
    // check order's recipient
    if (order[0].user_id != req.userData.id) {
      return res.sendStatus(403);
    }

    let items = await mysql.query(
      'SELECT order_id, item_id, name AS item_name, amount, order_items.price FROM order_items INNER JOIN items ON (order_items.item_id = items.id) WHERE order_id = ?',
      req.params.id
    );

    return res.status(200).json(items);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};
