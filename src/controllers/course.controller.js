const { StatusCodes } = require("http-status-codes");
const courseService = require("../services/course.service");
const asyncHandler = require("../utils/async-handler");

exports.list = asyncHandler(async (req, res) => {
  const data = await courseService.list(req.query);
  res.status(StatusCodes.OK).json({ success: true, ...data });
});

exports.featured = asyncHandler(async (req, res) => {
  const data = await courseService.featured();
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.recent = asyncHandler(async (req, res) => {
  const data = await courseService.recent();
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.premium = asyncHandler(async (req, res) => {
  const data = await courseService.premium();
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.details = asyncHandler(async (req, res) => {
  const data = await courseService.details(req.params.courseId);
  res.status(StatusCodes.OK).json({ success: true, data });
});
