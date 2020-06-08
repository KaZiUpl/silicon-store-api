var express = require('express');
const { check } = require('express-validator');
var router = express.Router();

var CategoriesController = require('../controllers/categories');

// get all categories
router.get('/', CategoriesController.getAllCategories);
// get main categories
router.get('/main-categories', CategoriesController.getMainCategories);
// get category
router.get('/:id', CategoriesController.getCategory);
// get category's breadcrumbs
router.get(':id/breadcrumbs', CategoriesController.getCategoryBreadcrumbs);
// get category's children categories
router.get('/:id/child-categories', CategoriesController.getChildrenCategories);

module.exports = router;
