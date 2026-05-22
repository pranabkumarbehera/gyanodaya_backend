const RefreshToken = require("../models/RefreshToken");

class RefreshTokenRepository {
  create(payload) {
    return RefreshToken.create(payload);
  }

  findValidToken(token) {
    return RefreshToken.findOne({ token, isRevoked: false, expiresAt: { $gt: new Date() } });
  }

  revoke(token) {
    return RefreshToken.findOneAndUpdate({ token }, { isRevoked: true }, { new: true });
  }

  revokeAllForUser(userId) {
    return RefreshToken.updateMany({ user: userId, isRevoked: false }, { isRevoked: true });
  }
}

module.exports = new RefreshTokenRepository();
