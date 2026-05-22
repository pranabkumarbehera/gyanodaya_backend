const { StatusCodes } = require("http-status-codes");
const mockTestService = require("../services/mock-test.service");
const asyncHandler = require("../utils/async-handler");

exports.list = asyncHandler(async (req, res) => {
  const data = await mockTestService.list(req.query);
  res.status(StatusCodes.OK).json({ success: true, ...data });
});

exports.freeTests = asyncHandler(async (req, res) => {
  const data = await mockTestService.freeTests();
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.premiumTests = asyncHandler(async (req, res) => {
  const data = await mockTestService.premiumTests();
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.categories = asyncHandler(async (req, res) => {
  const data = await mockTestService.categories();
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.details = asyncHandler(async (req, res) => {
  const data = await mockTestService.details(req.params.mockTestId);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.start = asyncHandler(async (req, res) => {
  const data = await mockTestService.startTest(req.user, req.params.mockTestId);
  res.status(StatusCodes.CREATED).json({ success: true, data });
});

exports.questions = asyncHandler(async (req, res) => {
  const data = await mockTestService.getQuestions(req.params.mockTestId);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.saveAnswer = asyncHandler(async (req, res) => {
  const data = await mockTestService.saveAnswer(req.user._id, req.params.sessionId, req.body);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.timer = asyncHandler(async (req, res) => {
  const data = await mockTestService.timer(req.user._id, req.params.sessionId);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.palette = asyncHandler(async (req, res) => {
  const data = await mockTestService.palette(req.user._id, req.params.sessionId);
  res.status(StatusCodes.OK).json({ success: true, data });
});

exports.submit = asyncHandler(async (req, res) => {
  const data = await mockTestService.submit(req.user, req.params.sessionId);
  res.status(StatusCodes.OK).json({ success: true, data });
});
