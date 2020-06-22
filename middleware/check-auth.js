var jwt = require('jsonwebtoken');
var mysql = require('../config/mysql');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    let userData = await mysql.query('SELECT id, email, role FROM users WHERE api_key = ?', token);

    if(userData.length == 0) {
      return res.sendStatus(401);
    }

    const user = userData[0];
    req.userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      api_key: token
    }
    next();
  } catch (error) {
    if(error.statusCode == 500)
    {
      res.sendStatus(500);
      throw error;
    }
    res.status(401).json({message: 'Token expired'});

    throw error;
  }
};
