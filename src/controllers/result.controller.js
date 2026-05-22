const { StatusCodes } = require("http-status-codes");
const resultService = require("../services/result.service");
const asyncHandler = require("../utils/async-handler");

exports.myResults = asyncHandler(async (req, res) => {
  const data = await resultService.myResults(req.user._id);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.leaderboard = asyncHandler(async (req, res) => {
  const data = await resultService.leaderboard(req.params.mockTestId);
  res.status(StatusCodes.OK).json({ success: true, data });
});
