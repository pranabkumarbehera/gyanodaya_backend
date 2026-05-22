const { StatusCodes } = require("http-status-codes");

const notFoundMiddleware = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
};

module.exports = notFoundMiddleware;
