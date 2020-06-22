const mysql = require('mysql');
const util = require('util');

const config = {
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

function makeDb(config) {
  const connection = mysql.createConnection(config);

  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    beginTransaction() {
      return util.promisify(connection.beginTransaction).call(connection);
    },
    commit() {
      return util.promisify(connection.commit).call(connection);
    },
    rollback() {
      return util.promisify(connection.rollback).call(connection);
    },
  };
}

const db = makeDb(config);

module.exports = db;
