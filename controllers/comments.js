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
    let newComment = await mysql.query(
      'INSERT INTO comments(item_id, user_id, text, created_at, updated_at) VALUES(?,?,?,?,?)',
      [req.body.item_id, req.userData.id, req.body.text, created_at, created_at]
    );
    await mysql.commit();

    return res
      .status(201)
      .json({ message: 'Comment added', id: newComment.insertId });
  } catch (error) {
    await mysql.rollback();
    res.sendStatus(500);
    throw error;
  }
};

exports.modifyComment = async function (req, res) {
  try {
    let comment = await mysql.query(
      'SELECT * FROM comments WHERE id = ?',
      req.params.id
    );
    if (comment.length == 0) {
      return res.status(400).json({ message: 'No comments with provided id' });
    }
    if (comment[0].user_id != req.userData.id) {
      return res.sendStatus(403);
    }
    await mysql.query(
      'UPDATE comments SET text = ?, updated_at = ? WHERE id = ?',
      [req.body.text, new Date(), req.params.id]
    );

    return res.status(200).end();
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.getComment = async function (req, res) {
  try {
    let comment = await mysql.query(
      'SELECT * FROM comments WHERE id = ?',
      req.params.id
    );
    if (comment.length == 0) {
      return res.sendStatus(404);
    }

    return res.status(200).json(comment[0]);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.deleteComment = async function (req, res) {
  try {
    let comment = await mysql.query(
      'SELECT * FROM comments WHERE id = ?',
      req.params.id
    );
    if (comment.length == 0) {
      return res.status(400).json({ message: 'No comments with provided id' });
    }
    if (comment[0].user_id != req.userData.id) {
      return res.sendStatus(403);
    }
    let result = await mysql.query(
      'DELETE FROM comments WHERE id = ?',
      req.params.id
    );

    return res.status(200).end();
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};
