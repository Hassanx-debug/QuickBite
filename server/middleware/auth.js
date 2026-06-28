import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware
 * Extracts and verifies a JWT from the Authorization header.
 * On success, attaches the decoded payload (id, role) to req.user.
 *
 * Expected header format: "Bearer <token>"
 */
const auth = (req, res, next) => {
  try {
    // 1. Extract the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // 2. Pull the token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token is malformed.',
      });
    }

    // 3. Verify token — throws if expired or signature mismatch
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user payload to request for downstream middleware/controllers
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // jsonwebtoken throws specific error types we can use for better messages
    const message =
      error.name === 'TokenExpiredError'
        ? 'Token has expired. Please log in again.'
        : 'Invalid token. Authentication failed.';

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

export default auth;
