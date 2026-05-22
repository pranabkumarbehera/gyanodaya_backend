const express = require("express");
const controller = require("../../controllers/auth.controller");
const { authLimiter } = require("../../middlewares/rate-limit.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  registerValidator,
  loginValidator,
  googleValidator,
  forgotPasswordValidator,
  verifyOtpValidator,
  resetPasswordValidator,
  refreshTokenValidator
} = require("../../validators/auth.validator");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a user
 *     tags: [Auth]
 */
router.post("/register", authLimiter, registerValidator, validate, controller.register);
router.post("/login", authLimiter, loginValidator, validate, controller.login);
router.post("/google-signin", authLimiter, googleValidator, validate, controller.googleSignIn);
router.post("/forgot-password", authLimiter, forgotPasswordValidator, validate, controller.forgotPassword);
router.post("/verify-otp", authLimiter, verifyOtpValidator, validate, controller.verifyOtp);
router.post("/reset-password", authLimiter, resetPasswordValidator, validate, controller.resetPassword);
router.post("/refresh-token", refreshTokenValidator, validate, controller.refreshToken);
router.post("/logout", refreshTokenValidator, validate, controller.logout);

module.exports = router;
