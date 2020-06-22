var mysql = require('../config/mysql');
const { validationResult } = require('express-validator');

exports.newComment = async function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    await mysql.beginTransaction();
    let created_at = new Date();
    let comment = await mysql.query(
      'SELECT item_id FROM comments WHERE item_id = ? AND user_id = ?',
      [req.body.item_id, req.userData.id]
    );
    if (comment.length > 0) {
      await mysql.rollback();
      return res
        .status(400)
        .json({ message: 'You already commented on this product' });
    }
    await mysql.query(
      'INSERT INTO comments(item_id, user_id, text, created_at, updated_at) VALUES(?,?,?,?,?)',
      [req.body.item_id, req.userData.id, req.body.text, created_at, created_at]
    );
    await mysql.commit();

    return res.status(201).json({ message: 'Comment added' });
  } catch (error) {
    await mysql.rollback();
    res.sendStatus(500);
    throw error;
  }
};
