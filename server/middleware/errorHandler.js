/**
 * Global Error Handler Middleware
 * Catches all errors passed via next(error) and returns a consistent
 * JSON response. Handles common Mongoose error types gracefully.
 *
 * Response format: { success: false, message: string, errors?: array }
 */
const errorHandler = (err, req, res, next) => {
  // Log the full error in development for debugging
  console.error('❌ Error:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // --- Mongoose Validation Error ---
  // Triggered when a document fails schema validation (required fields, enums, etc.)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // --- Mongoose Duplicate Key Error ---
  // Error code 11000 is thrown when a unique index constraint is violated
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for '${field}'. This ${field} is already in use.`;
  }

  // --- Mongoose Cast Error ---
  // Thrown when an invalid ObjectId (or other type) is passed in a query
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // --- JWT Errors (fallback if not caught in auth middleware) ---
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // Build the response object
  const response = { success: false, message };
  if (errors) response.errors = errors;

  res.status(statusCode).json(response);
};

export default errorHandler;
