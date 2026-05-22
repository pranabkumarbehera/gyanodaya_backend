const { StatusCodes } = require("http-status-codes");
const adminService = require("../services/admin.service");
const asyncHandler = require("../utils/async-handler");

exports.dashboard = asyncHandler(async (req, res) => {
  const data = await adminService.dashboard();
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.users = asyncHandler(async (req, res) => {
  const data = await adminService.manageUsers();
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.teachers = asyncHandler(async (req, res) => {
  const data = await adminService.manageTeachers();
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.courses = asyncHandler(async (req, res) => {
  const data = await adminService.manageCourses();
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.mockTests = asyncHandler(async (req, res) => {
  const data = await adminService.manageMockTests();
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.questions = asyncHandler(async (req, res) => {
  const data = await adminService.manageQuestions();
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.updateUserStatus = asyncHandler(async (req, res) => {
  const data = await adminService.updateUserStatus(req.params.userId, req.body.isActive);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.createTeacher = asyncHandler(async (req, res) => {
  const data = await adminService.createTeacher(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data });
});

exports.updateTeacher = asyncHandler(async (req, res) => {
  const data = await adminService.updateTeacher(req.params.teacherId, req.body);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.createCourse = asyncHandler(async (req, res) => {
  const data = await adminService.createCourse(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data });
});

exports.updateCourse = asyncHandler(async (req, res) => {
  const data = await adminService.updateCourse(req.params.courseId, req.body);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.createMockTest = asyncHandler(async (req, res) => {
  const data = await adminService.createMockTest(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data });
});

exports.updateMockTest = asyncHandler(async (req, res) => {
  const data = await adminService.updateMockTest(req.params.mockTestId, req.body);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.createQuestion = asyncHandler(async (req, res) => {
  const data = await adminService.createQuestion(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data });
});

exports.updateQuestion = asyncHandler(async (req, res) => {
  const data = await adminService.updateQuestion(req.params.questionId, req.body);
  res.status(StatusCodes.OK).json({ success: true, data });
});
