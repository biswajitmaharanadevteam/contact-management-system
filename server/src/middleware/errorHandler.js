export function errorHandler(err, req, res, next) {
  console.error('[SERVER ERROR]:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An internal server error occurred',
    errors: err.errors || null
  });
}

export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
}
