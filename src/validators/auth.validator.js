const { body } = require("express-validator");

exports.registerValidator = [
  body("firstName").trim().notEmpty(),
  body("lastName").trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("gender").optional().isIn(["male", "female", "other"]),
  body("role").optional().isIn(["admin", "student", "teacher"])
];

exports.loginValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty()
];

exports.googleValidator = [body("idToken").notEmpty()];
exports.forgotPasswordValidator = [body("email").isEmail().normalizeEmail()];
exports.verifyOtpValidator = [body("email").isEmail(), body("otp").isLength({ min: 6, max: 6 })];
exports.resetPasswordValidator = [body("email").isEmail(), body("newPassword").isLength({ min: 6 })];
exports.refreshTokenValidator = [body("refreshToken").notEmpty()];
