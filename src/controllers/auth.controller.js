const { StatusCodes } = require("http-status-codes");
const authService = require("../services/auth.service");
const asyncHandler = require("../utils/async-handler");

exports.register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, ...data });
});

exports.login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body.email, req.body.password);
  res.status(StatusCodes.OK).json({ success: true, ...data });
});

exports.googleSignIn = asyncHandler(async (req, res) => {
  const data = await authService.googleSignIn(req.body.idToken);
  res.status(StatusCodes.OK).json({ success: true, ...data });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const data = await authService.forgotPassword(req.body.email);
  res.status(StatusCodes.OK).json({ success: true, ...data });
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  const data = await authService.verifyOtp(req.body.email, req.body.otp);
  res.status(StatusCodes.OK).json({ success: true, ...data });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const data = await authService.resetPassword(req.body.email, req.body.newPassword);
  res.status(StatusCodes.OK).json({ success: true, ...data });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const data = await authService.refreshAccessToken(req.body.refreshToken);
  res.status(StatusCodes.OK).json({ success: true, ...data });
});

exports.logout = asyncHandler(async (req, res) => {
  const data = await authService.logout(req.body.refreshToken);
  res.status(StatusCodes.OK).json({ success: true, ...data });
});
