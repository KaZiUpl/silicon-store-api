var express = require('express');
var checkAuth = require('../middleware/check-auth');
var router = express.Router();

var CartController = require('../controllers/cart');

router.use(checkAuth);
// update cart
router.patch('/', CartController.patchCartItem);
// get cart
router.get('/', CartController.getCartItems);
// get cart item
router.get('/:item_id', CartController.getCartItem);
// delete cart item
router.delete('/:item_id', CartController.deleteCartItem);

module.exports = router;
