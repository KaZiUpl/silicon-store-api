var express = require('express');
var router = express.Router();

var CategoriesController = require('../controllers/categories');

// get all categories
router.get('/', CategoriesController.getAllCategories);
// get main categories
router.get('/main-categories', CategoriesController.getMainCategories);
// get category
router.get('/:id', CategoriesController.getCategory);
// get category's children categories
router.get('/:id/child-categories', CategoriesController.getChildrenCategories);

module.exports = router;
