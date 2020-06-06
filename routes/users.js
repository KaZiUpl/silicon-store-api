var express = require('express');
var checkAuth = require('../middleware/check-auth');
var router = express.Router();

var UsersController = require('../controllers/users');

// user register
router.post('/', UsersController.register);

// user login
router.post('/token', UsersController.login);

//get new access token
router.post('/refresh-token', UsersController.getRefreshToken);

// get user profile
router.get('/:id', checkAuth, UsersController.getProfile);

module.exports = router;
