const Course = require("../models/Course");
const MockTest = require("../models/MockTest");
const Question = require("../models/Question");
const Teacher = require("../models/Teacher");
const User = require("../models/User");

class AdminService {
  async dashboard() {
    const [users, teachers, courses, tests, questions] = await Promise.all([
      User.countDocuments(),
      Teacher.countDocuments(),
      Course.countDocuments(),
      MockTest.countDocuments(),
      Question.countDocuments()
    ]);

    return {
      users,
      teachers,
      courses,
      tests,
      questions
    };
  }

  manageUsers() {
    return User.find().select("-password").sort({ createdAt: -1 });
  }

  manageTeachers() {
    return Teacher.find().sort({ createdAt: -1 });
  }

  manageCourses() {
    return Course.find().populate("teacher").sort({ createdAt: -1 });
  }

  manageMockTests() {
    return MockTest.find().sort({ createdAt: -1 });
  }

  manageQuestions() {
    return Question.find().populate("mockTest").sort({ createdAt: -1 });
  }

  createTeacher(payload) {
    return Teacher.create(payload);
  }

  updateTeacher(id, payload) {
    return Teacher.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  }

  createCourse(payload) {
    return Course.create(payload);
  }

  updateCourse(id, payload) {
    return Course.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  }

  createMockTest(payload) {
    return MockTest.create(payload);
  }

  updateMockTest(id, payload) {
    return MockTest.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  }

  createQuestion(payload) {
    return Question.create(payload);
  }

  updateQuestion(id, payload) {
    return Question.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  }

  updateUserStatus(id, isActive) {
    return User.findByIdAndUpdate(id, { isActive }, { new: true }).select("-password");
  }
}

module.exports = new AdminService();
