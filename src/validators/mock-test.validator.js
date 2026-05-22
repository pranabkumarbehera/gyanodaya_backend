const { body } = require("express-validator");

exports.saveAnswerValidator = [
  body("questionId").notEmpty(),
  body("selectedOptions").isArray(),
  body("timeSpent").optional().isNumeric()
];
