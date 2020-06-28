var express = require('express');
var checkAuth = require('../middleware/check-auth');
const { check } = require('express-validator');
var router = express.Router();

var UsersController = require('../controllers/users');

// user register
router.post(
  '/',
  [
    check('email').isEmail({require_tld: false}).withMessage('Invalid email'),
    check('name').exists().withMessage('Name is required'),
    check('password').exists().withMessage('Password is required'),
  ],
  UsersController.register
);

// user login
router.post(
  '/token',
  [
    check('email').isEmail({require_tld: false}).withMessage('Invalid email'),
    check('password').exists().withMessage('Password is required'),
  ],
  UsersController.login
);

//user logout
router.post('/logout', checkAuth, UsersController.logout);

// get user profile
router.get('/profile', checkAuth, UsersController.getProfile);

module.exports = router;
