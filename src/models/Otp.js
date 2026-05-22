const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true },
    otp: { type: String, required: true },
    purpose: { type: String, enum: ["forgot_password"], default: "forgot_password" },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
