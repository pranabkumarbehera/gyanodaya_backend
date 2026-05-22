const express = require("express");
const controller = require("../../controllers/teacher.controller");
const { protect } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { rateTeacherValidator } = require("../../validators/teacher.validator");

const router = express.Router();

router.get("/", controller.list);
router.get("/:teacherId", controller.details);
router.get("/:teacherId/courses", controller.courses);
router.get("/:teacherId/ratings", controller.ratings);
router.post("/:teacherId/follow", protect, controller.follow);
router.post("/:teacherId/ratings", protect, rateTeacherValidator, validate, controller.rate);

module.exports = router;
