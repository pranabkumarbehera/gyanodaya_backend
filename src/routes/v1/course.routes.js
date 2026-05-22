const express = require("express");
const controller = require("../../controllers/course.controller");

const router = express.Router();

router.get("/", controller.list);
router.get("/featured", controller.featured);
router.get("/recent", controller.recent);
router.get("/premium", controller.premium);
router.get("/:courseId", controller.details);

module.exports = router;
