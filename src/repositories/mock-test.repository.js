const MockTest = require("../models/MockTest");
const Question = require("../models/Question");
const TestSession = require("../models/TestSession");

class MockTestRepository {
  find(filter = {}) {
    return MockTest.find(filter);
  }

  findById(id) {
    return MockTest.findById(id);
  }

  create(payload) {
    return MockTest.create(payload);
  }

  updateById(id, payload) {
    return MockTest.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  }

  listQuestions(mockTestId) {
    return Question.find({ mockTest: mockTestId }).sort({ order: 1 });
  }

  createQuestion(payload) {
    return Question.create(payload);
  }

  startSession(payload) {
    return TestSession.create(payload);
  }

  findSessionById(id) {
    return TestSession.findById(id);
  }

  updateSession(id, payload) {
    return TestSession.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  }
}

module.exports = new MockTestRepository();
