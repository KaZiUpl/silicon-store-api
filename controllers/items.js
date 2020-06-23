var mysql = require('../config/mysql');

exports.getAllItems = async function (req, res) {
  const category = parseInt(req.query.category);
  try {
    let items;
    if (category) {
      // find all items connected with category or any of its descendants
      items = await mysql.query(
        'SELECT id, category_id, name, price, short_specification, specification, description, photo, amount FROM items INNER JOIN amounts ON (items.id = amounts.item_id) WHERE amount > 0 AND category_id IN (SELECT id FROM categories WHERE path REGEXP "^([0-9]+/)*?(/[0-9]+)*$")',
        category
      );
    } else {
      // get all items
      items = await mysql.query(
        'SELECT id, category_id, name, price, short_specification, specification, description, photo, amount FROM items INNER JOIN amounts ON (items.id = amounts.item_id) WHERE amount > 0'
      );
    }
    items.forEach((element) => {
      element.photo = 'http://localhost:3000/images/' + element.photo;
    });
    return res.status(200).json(items);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.getItem = async function (req, res) {
  try {
    let item = await mysql.query(
      'SELECT * FROM items INNER JOIN amounts ON (items.id = amounts.item_id) WHERE id= ?',
      req.params.id
    );
    if (item.length == 0) {
      return res.sendStatus(404);
    }

    item[0].photo = 'http://localhost:3000/images/' + item[0].photo;
    return res.status(200).json(item[0]);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.getItemComments = async function (req, res) {
  try {
    let comments = await mysql.query(
      'SELECT comments.id, user_id, item_id, text, created_at, updated_at, name as author FROM comments INNER JOIN users ON (comments.user_id = users.id) WHERE item_id = ' +
        req.params.id
    );

    return res.status(200).json(comments);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.getItemBreadcrumbs = async function (req, res) {
  try {
    let breadcrumbs = await mysql.query(
      'SELECT * FROM categories WHERE FIND_IN_SET(categories.id, (SELECT REPLACE((SELECT categories.path FROM categories INNER JOIN items ON (items.category_id = categories.id) WHERE items.id = ?), "/",",")))',
      [req.params.id]
    );

    return res.status(200).json(breadcrumbs);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};
