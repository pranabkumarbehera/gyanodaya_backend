const express = require("express");
const controller = require("../../controllers/user.controller");
const { protect } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const upload = require("../../middlewares/upload.middleware");
const { updateProfileValidator } = require("../../validators/user.validator");

const router = express.Router();

router.get("/profile", protect, controller.getProfile);
router.patch("/profile", protect, updateProfileValidator, validate, controller.updateProfile);
router.post("/profile/image", protect, upload.single("profileImage"), controller.uploadProfileImage);
router.get("/statistics", protect, controller.getStatistics);

module.exports = router;
