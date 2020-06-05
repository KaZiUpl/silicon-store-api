var express = require('express');
var checkAuth = require('../middleware/check-auth');
var router = express.Router();

var CommentsController = require('../controllers/comments');

router.post('/', checkAuth, CommentsController.newComment);

module.exports = router;
