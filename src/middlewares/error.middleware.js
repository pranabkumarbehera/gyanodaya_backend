const { StatusCodes } = require("http-status-codes");

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    details: err.details || null,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};

module.exports = errorMiddleware;
