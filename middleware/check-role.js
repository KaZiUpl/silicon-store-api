/**
 * Middleware for checking whether user's role is the same as provided.
 * This middleware is used in pair with check-auth middleware.
 */
module.exports = function (requiredRole) {
  return function (req, res, next) {
    userRole = req.userData.role;
    if (userRole != requiredRole) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
