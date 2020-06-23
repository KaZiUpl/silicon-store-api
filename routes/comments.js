var express = require('express');
var checkAuth = require('../middleware/check-auth');
const { check } = require('express-validator');
var router = express.Router();

var CommentsController = require('../controllers/comments');

router.post(
  '/',
  checkAuth,
  [
    check('item_id').exists().withMessage('Item id is required'),
    check('text').exists().withMessage('Text is required'),
  ],
  CommentsController.newComment
);

router.put('/:id', checkAuth, [
  check('text').exists().withMessage('Text is required'),
  CommentsController.modifyComment
]);

router.get('/:id', CommentsController.getComment);

router.delete('/:id', checkAuth, CommentsController.deleteComment);

module.exports = router;
