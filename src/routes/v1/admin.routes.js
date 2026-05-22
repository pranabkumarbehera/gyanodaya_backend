const express = require("express");
const controller = require("../../controllers/admin.controller");
const { protect } = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/dashboard", controller.dashboard);
router.get("/users", controller.users);
router.patch("/users/:userId/status", controller.updateUserStatus);
router.get("/teachers", controller.teachers);
router.post("/teachers", controller.createTeacher);
router.patch("/teachers/:teacherId", controller.updateTeacher);
router.get("/courses", controller.courses);
router.post("/courses", controller.createCourse);
router.patch("/courses/:courseId", controller.updateCourse);
router.get("/mock-tests", controller.mockTests);
router.post("/mock-tests", controller.createMockTest);
router.patch("/mock-tests/:mockTestId", controller.updateMockTest);
router.get("/questions", controller.questions);
router.post("/questions", controller.createQuestion);
router.patch("/questions/:questionId", controller.updateQuestion);

module.exports = router;
