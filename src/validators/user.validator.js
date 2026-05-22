const { body } = require("express-validator");

exports.updateProfileValidator = [
  body("firstName").optional().trim().notEmpty(),
  body("lastName").optional().trim().notEmpty(),
  body("gender").optional().isIn(["male", "female", "other"])
];
