export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const response = err.response || {
    message: "Something went wrong with the server",
  };
  const cause = err.cause;

  res.status(status).json({
    success: false,
    status,
    ...response,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
    cause: process.env.NODE_ENV === "development" ? cause : "",
  });
}

export function noRouteFoundHandler(req, res) {
  res.status(404).json({ message: "No route found." });
}
