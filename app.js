require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var mysql = require('./config/mysql');

var app = express();
var port = process.env.PORT || 3000;

var items = require('./routes/items');
var users = require('./routes/users');
var orders = require('./routes/orders');
var cart = require('./routes/cart');
var categories = require('./routes/categories');
var comments = require('./routes/comments');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/images', express.static(__dirname + '/public/img'));
app.use('/items', items);
app.use('/users', users);
app.use('/orders', orders);
app.use('/cart', cart);
app.use('/categories', categories);
app.use('/comments', comments);

// catching errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// catching errors
app.use((error, req, res, next) => {
  console.log(error);

  return res.sendStatus(error.status || 500);
});

app.listen(port, () => {
  console.log(
    new Date().toString() +
      ': server is up and listening on port ' +
      port +
      '...'
  );
  //every 10 minuts the query is sent to a database in order to maintain connection
  setInterval(async () => {
    try {
      await mysql.query('SELECT 1');
      console.log(
        new Date().toString() + ': sent query to maintain database connection'
      );
    } catch (error) {
      throw error;
    }
  }, 600000);
});
