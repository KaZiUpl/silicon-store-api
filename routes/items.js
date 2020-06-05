var express = require('express');
var router = express.Router();

var ItemsController = require('../controllers/items');

// /items?category=:id
router.get('/', ItemsController.getAllItems);
// get item
router.get('/:id', ItemsController.getItem);
// get item's comments
router.get('/:id/comments', ItemsController.getItemComments);
// get item's breadcrumbs
router.get('/:id/breadcrumbs', ItemsController.getItemBreadcrumbs);

module.exports = router;
