var express = require('express');
var checkAuth = require('../middleware/check-auth');
const { check } = require('express-validator');
var router = express.Router();

var OrdersController = require('../controllers/orders');

router.use(checkAuth);

router.get('/', OrdersController.getAll);

// place new order
router.post(
  '/',
  checkAuth,
  [
    check('name').exists(),
    check('surname').exists(),
    check('address').exists(),
    check('city').exists(),
    check('postal_code').exists(),
  ],
  OrdersController.postOrder
);

// get order data
router.get('/:id', checkAuth, OrdersController.getOrder);

// get order items
router.get('/:id/items', checkAuth, OrdersController.getOrderItems);

module.exports = router;
