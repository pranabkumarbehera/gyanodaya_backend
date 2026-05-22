const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const teacherRoutes = require("./teacher.routes");
const courseRoutes = require("./course.routes");
const mockTestRoutes = require("./mock-test.routes");
const resultRoutes = require("./result.routes");
const adminRoutes = require("./admin.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/teachers", teacherRoutes);
router.use("/courses", courseRoutes);
router.use("/mock-tests", mockTestRoutes);
router.use("/results", resultRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
