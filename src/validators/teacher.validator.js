const { body } = require("express-validator");

exports.rateTeacherValidator = [
  body("rating").isFloat({ min: 1, max: 5 })
];
