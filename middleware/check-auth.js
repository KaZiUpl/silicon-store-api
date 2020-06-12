var jwt = require('jsonwebtoken');
var mysql = require('../config/mysql');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    mysql.query('SELECT id, email, role FROM users WHERE api_key = ?', token, (err, rows) => {
      if(err)
      {
        return res.sendStatus(500);
      }
      if(rows.length == 0) {
        return res.sendStatus(401);
      }
      const user = rows[0];
      req.userData = {
        id: user.id,
        email: user.email,
        role: user.role,
        api_key: token
      }
      next();
    });
  } catch (error) {
    return res.status(401).json({message: 'Token expired'});
  }
};
