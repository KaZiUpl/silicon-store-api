var jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET,[{maxAge: '1h'}]);
    req.userData = decoded;
    console.log(decoded);
    

    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};
