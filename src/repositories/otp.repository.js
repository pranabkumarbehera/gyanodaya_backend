const Otp = require("../models/Otp");

class OtpRepository {
  create(payload) {
    return Otp.create(payload);
  }

  findValidOtp(email, otp) {
    return Otp.findOne({
      email: email.toLowerCase(),
      otp,
      expiresAt: { $gt: new Date() }
    });
  }

  verify(id) {
    return Otp.findByIdAndUpdate(id, { verified: true }, { new: true });
  }

  findLatestVerified(email) {
    return Otp.findOne({ email: email.toLowerCase(), verified: true }).sort({ createdAt: -1 });
  }
}

module.exports = new OtpRepository();
