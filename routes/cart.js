var express = require('express');
var checkAuth = require('../middleware/check-auth');
const { check } = require('express-validator');
var router = express.Router();

var CartController = require('../controllers/cart');

router.use(checkAuth);
// add item to cart
router.post(
  '/',
  [check('item_id').exists().withMessage('Item id is required')],
  CartController.addCartItem
);
// modify item in cart
router.put('/', [
  check('item_id').exists().withMessage('Item id is required'),
  check('amount').exists().withMessage('Amount is required'),
  check('amount').isDecimal({ decimal_digits: 0 }).withMessage('Wrong number'),
], CartController.updateCartItem);

// get cart
router.get('/', CartController.getCartItems);
// get cart item
router.get('/:item_id', CartController.getCartItem);
// delete cart item
router.delete('/:item_id', CartController.deleteCartItem);

module.exports = router;
