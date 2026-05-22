const { StatusCodes } = require("http-status-codes");
const userService = require("../services/user.service");
const asyncHandler = require("../utils/async-handler");

exports.getProfile = asyncHandler(async (req, res) => {
  const data = await userService.getProfile(req.user._id);
  res.status(StatusCodes.OK).json({ success: true, ...data });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const data = await userService.updateProfile(req.user._id, req.body);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Profile image is required" });
  }
  const data = await userService.uploadProfileImage(req.user._id, req.file);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.getStatistics = asyncHandler(async (req, res) => {
  const data = await userService.getStatistics(req.user._id);
  res.status(StatusCodes.OK).json({ success: true, data });
});
