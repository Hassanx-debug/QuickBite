/**
 * Admin Authorization Middleware
 * Must be used AFTER the auth middleware so that req.user is available.
 * Checks that the authenticated user has the 'admin' role.
 */
const admin = (req, res, next) => {
  // req.user is set by the auth middleware
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }

  next();
};

export default admin;
