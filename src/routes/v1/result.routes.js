const express = require("express");
const controller = require("../../controllers/result.controller");
const { protect } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/my", protect, controller.myResults);
router.get("/leaderboard/:mockTestId", controller.leaderboard);

module.exports = router;
