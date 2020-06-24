var mysql = require('../config/mysql');

exports.getAllCategories = async function (req, res) {
  try {
    let categories = await mysql.query('SELECT * FROM categories');

    return res.status(200).json(categories);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.getMainCategories = async function (req, res) {
  try {
    let mainCategories = await mysql.query(
      'SELECT * FROM categories WHERE parent_id IS NULL'
    );

    return res.status(200).json(mainCategories);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.getChildrenCategories = async function (req, res) {
  try {
    let childrenCategories = await mysql.query(
      'SELECT * FROM categories WHERE parent_id=' + req.params.id
    );

    return res.status(200).json(childrenCategories);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.getCategoryBreadcrumbs = async function (req, res) {
  try {
    let categoryBreadcrumbs = await mysql.query(
      'SELECT * FROM categories WHERE FIND_IN_SET(categories.id, (SELECT REPLACE((SELECT categories.path FROM categories WHERE categories.id = ?), "/",",")))',
      req.params.id
    );

    return res.status(200).json(categoryBreadcrumbs);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.getCategory = async function (req, res) {
  try {
    let category = await mysql.query(
      'SELECT * FROM categories WHERE id = ?',
      req.params.id
    );

    if (category.length == 0) {
      return res.sendStatus(404);
    }

    return res.status(200).json(category);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};
