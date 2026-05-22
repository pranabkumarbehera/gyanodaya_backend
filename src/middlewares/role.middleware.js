const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/api-error");

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(StatusCodes.FORBIDDEN, "Insufficient permissions"));
  }
  next();
};

module.exports = authorize;
