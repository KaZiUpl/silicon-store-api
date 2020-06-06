var mysql = require('../config/mysql');
const { validationResult } = require('express-validator');

exports.newComment = function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var created_at = new Date();
  mysql.query(
    'SELECT item_id FROM comments WHERE item_id = ? AND user_id = ?',
    [req.body.item_id, req.userData.id],
    (err, rows, fields) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (rows.length > 0) {
        res.statusMessage = 'You already commented on this product';
        return res.sendStatus(400);
      }

      mysql.query(
        'INSERT INTO comments(item_id, user_id, text, created_at, updated_at) VALUES(?,?,?,?,?)',
        [
          req.body.item_id,
          req.userData.id,
          req.body.text,
          created_at,
          created_at,
        ],
        (err, rows, fields) => {
          if (err) {
            return res.sendStatus(500);
          }
          return res.sendStatus(201);
        }
      );
    }
  );
};
