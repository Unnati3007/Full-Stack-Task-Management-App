exports.errorHandler = (err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.statusCode ? err.message : "Internal server error",
  });
};
