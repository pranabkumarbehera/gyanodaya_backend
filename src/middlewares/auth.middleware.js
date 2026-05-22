const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const ApiError = require("../utils/api-error");
const { verifyAccessToken } = require("../utils/jwt");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Authorization token missing"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub).select("-password");

    if (!user || !user.isActive) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "User not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired token"));
  }
};

module.exports = { protect };
