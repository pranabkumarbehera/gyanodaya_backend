const express = require("express");
const controller = require("../../controllers/mock-test.controller");
const { protect } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { saveAnswerValidator } = require("../../validators/mock-test.validator");

const router = express.Router();

router.get("/", controller.list);
router.get("/free", controller.freeTests);
router.get("/premium", controller.premiumTests);
router.get("/categories", controller.categories);
router.get("/:mockTestId", controller.details);
router.get("/:mockTestId/questions", protect, controller.questions);
router.post("/:mockTestId/start", protect, controller.start);
router.patch("/sessions/:sessionId/answer", protect, saveAnswerValidator, validate, controller.saveAnswer);
router.get("/sessions/:sessionId/timer", protect, controller.timer);
router.get("/sessions/:sessionId/palette", protect, controller.palette);
router.post("/sessions/:sessionId/submit", protect, controller.submit);

module.exports = router;
