const { StatusCodes } = require("http-status-codes");
const Teacher = require("../models/Teacher");
const teacherService = require("../services/teacher.service");
const asyncHandler = require("../utils/async-handler");

exports.list = asyncHandler(async (req, res) => {
  const data = await teacherService.list(req.query);
  res.status(StatusCodes.OK).json({ success: true, ...data });
});

exports.details = asyncHandler(async (req, res) => {
  const data = await teacherService.details(req.params.teacherId);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.courses = asyncHandler(async (req, res) => {
  const data = await teacherService.details(req.params.teacherId);
  res.status(StatusCodes.OK).json({ success: true, data: data.courses });
});

exports.follow = asyncHandler(async (req, res) => {
  const data = await teacherService.follow(req.user, req.params.teacherId);
  res.status(StatusCodes.OK).json({ success: true, ...data });
});

exports.rate = asyncHandler(async (req, res) => {
  const data = await teacherService.rate(req.params.teacherId, req.body.rating);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.ratings = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.teacherId).select("ratings");
  if (!teacher) {
    return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Teacher not found" });
  }
  res.status(StatusCodes.OK).json({ success: true, data: teacher.ratings });
});
