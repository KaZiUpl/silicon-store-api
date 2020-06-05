var express = require('express');
var checkAuth = require('../middleware/check-auth');
var router = express.Router();

var OrdersController = require('../controllers/orders');

router.use(checkAuth);

router.get('/', OrdersController.getAll);

// place new order
router.post('/', checkAuth, OrdersController.postOrder);

// get order data
router.get('/:id', checkAuth, OrdersController.getOrder);

// get order items
router.get('/:id/items', checkAuth, OrdersController.getOrderItems);

module.exports = router;
