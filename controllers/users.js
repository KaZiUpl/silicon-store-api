var mysql = require('../config/mysql');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
var { v4: uuidv4 } = require('uuid');

exports.register = async function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    // check whether email is taken
    let userMail = await mysql.query(
      'SELECT email FROM users where email = ?',
      [req.body.email]
    );
    if (userMail.length > 0) {
      return res.status(400).json({
        message: 'Mail taken',
      });
    }
    // check whether name is taken
    let userName = await mysql.query('SELECT name FROM users where name = ?', [
      req.body.name,
    ]);
    if (userName.length > 0) {
      return res.status(400).json({
        message: 'Name taken',
      });
    }

    try {
      await mysql.beginTransaction();

      let passwordHash = await bcrypt.hash(req.body.password, 10);
      // create user
      await mysql.query(
        'INSERT INTO users(email, name, password, role) VALUES(?,?,?,?)',
        [req.body.email, req.body.name, passwordHash, 'Customer']
      );

      await mysql.commit();
      return res.status(201).end();
    } catch (error) {
      await mysql.rollback();
      throw error;
    }
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.login = async function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    //check provided credentials
    let user = await mysql.query(
      'SELECT id, email, password, role, api_key FROM users WHERE email = ?',
      [req.body.email]
    );
    // user doesn't exists
    if (user.length == 0) {
      return res.status(401).json({
        message: 'Bad credentials',
      });
    }
    //login data correct
    user = user[0];
    let passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Bad credentials' });
    }
    //success login
    //check for existing api key
    let apiKey = await mysql.query(
      'SELECT api_key FROM users WHERE id = ?',
      user.id
    );
    if (apiKey.length == 0) {
      return res.sendStatus(500);
    }

    //if key exists
    if (apiKey[0].api_key != '') {
      return res.status(200).json({
        api_key: apiKey[0].api_key,
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } else {
      // create api key
      const apiKey = uuidv4();
      await mysql.query('UPDATE users SET api_key = ? WHERE id = ?', [
        apiKey,
        user.id,
      ]);

      res.status(200).json({
        api_key: apiKey,
        id: user.id,
        email: user.email,
        role: user.role,
      });
    }
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.logout = async function (req, res) {
  //input error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    // delete api key from a database
    await mysql.query(
      'UPDATE users SET api_key = "" WHERE api_key = ?',
      req.userData.api_key
    );
    res.status(200).json();
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

exports.getProfile = async function (req, res) {
  try {
    let profile = await mysql.query(
      'SELECT id, email, name FROM users WHERE id = ?',
      [req.userData.id]
    );
    if (profile.length == 0) {
      return res.sendStatus(404);
    }

    return res.status(200).json(profile[0]);
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};
