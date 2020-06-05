var mysql = require('../config/mysql');

exports.getAll = function (req, res) {
  mysql.query(
    'SELECT * FROM orders WHERE user_id = ?',
    [req.userData.id],
    (err, orders, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.status(200).json(orders);
    }
  );
};

exports.getOrder = function (req, res) {
  // select requested order
  mysql.query(
    'SELECT * FROM orders WHERE id = ' + req.params.id,
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      // check order's recipient
      if (rows[0].user_id != req.userData.id) {
        return res.sendStatus(403);
      }
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.sendStatus(404);
      }
    }
  );
};

exports.postOrder = function (req, res) {
  var created_at = new Date();
  var oderId;
  mysql.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    // create new order
    mysql.query(
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
      ],
      (error, rows, fields) => {
        if (error) {
          mysql.rollback(function () {
            return res.sendStatus(500);
          });
        }
        orderId = rows.insertId;
      }
    );

    // get cart items
    var orderItems;
    mysql.query(
      'SELECT * FROM cart_items WHERE user_id = ?',
      [req.userData.id],
      (error, rows, fields) => {
        if (error) {
          mysql.rollback(function () {
            return res.sendStatus(500);
          });
        }
        if (rows.length == 0) {
          res.statusMessage = 'You have no items in the cart';
          return res.sendStatus(400);
        }
        orderItems = rows;

        orderItems.forEach((orderItem) => {
          // get storage amount
          mysql.query(
            'SELECT amount FROM amounts WHERE item_id = ?',
            [orderItem.id],
            (error, rows, fields) => {
              if (error) {
                mysql.rollback(function () {
                  return res.sendStatus(500);
                });
              }
              // if there is not enough item in storage
              if (rows.length == 0 || rows[0].amount < orderItem.amount) {
                mysql.rollback(function () {
                  res.statusMessage = 'Tego produktu nie ma w magazynie';
                  return res.status(400);
                });
              }
              // subtract ordered amount from storage
              mysql.query(
                'UPDATE amounts SET amount = amount - ? WHERE item_id = ?',
                [orderItem.amount, orderItem.id],
                (err, result, fields) => {
                  if (error) {
                    mysql.rollback(function () {
                      return res.sendStatus(500);
                    });
                  }
                }
              );
              // get price of product
              mysql.query(
                'SELECT price FROM items WHERE id = ?',
                [orderItem.item_id],
                (err, price, fields) => {
                  console.log('got order item price');

                  if (err || price.length == 0) {
                    mysql.rollback(function () {
                      return res.sendStatus(500);
                    });
                  }
                  // insert new row into order_items
                  mysql.query(
                    'INSERT INTO order_items(order_id, item_id, amount, price) VALUES(?,?,?,?)',
                    [
                      orderId,
                      orderItem.item_id,
                      orderItem.amount,
                      orderItem.amount * price[0].price,
                    ],
                    (err, result, fields) => {
                      if (this.err) {
                        mysql.rollback(function () {
                          return res.sendStatus(500);
                        });
                      }
                    }
                  );
                }
              );
            }
          );
        });

        // delete cart items
        mysql.query(
          'DELETE FROM cart_items WHERE user_id = ?',
          [req.userData.id],
          (err, rows, fields) => {
            if (error) {
              mysql.rollback(function () {
                return res.sendStatus(500);
              });
            }
          }
        );
        mysql.commit(function (err) {
          if (error) {
            mysql.rollback(function () {
              return res.sendStatus(500);
            });
          }
        });
        return res.sendStatus(201);
      }
    );
  });
};

exports.getOrderItems = function (req, res) {
  // select order
  mysql.query(
    'SELECT * FROM orders WHERE id = ' + req.params.id,
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      // check order's recipient
      if (rows[0].user_id != req.userData.id) {
        return res.sendStatus(403);
      }
    }
  );
  mysql.query(
    'SELECT * FROM order_items WHERE order_id=' + req.params.id,
    (err, rows, fields) => {
      res.json(rows);
    }
  );
};
