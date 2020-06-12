var express = require('express');
var checkAuth = require('../middleware/check-auth');
const { check } = require('express-validator');
var router = express.Router();

var UsersController = require('../controllers/users');

// user register
router.post(
  '/',
  [
    check('email').isEmail().withMessage('Invalid email'),
    check('name').exists().withMessage('Name is required'),
    check('password').exists().withMessage('Password is required'),
  ],
  UsersController.register
);

// user login
router.post(
  '/token',
  [
    check('email').isEmail().withMessage('Invalid email'),
    check('password').exists().withMessage('Password is required'),
  ],
  UsersController.login
);

//get new access token
router.post(
  '/refresh-token', checkAuth,
  [check('refresh_token').exists().withMessage('Refresh token is required')],
  UsersController.refreshToken
);

//user logout
router.post('/logout', checkAuth, [
  check('token').exists().withMessage('Token is required'),
  UsersController.logout
])

// get user profile
router.get('/profile', checkAuth, UsersController.getProfile);

module.exports = router;
