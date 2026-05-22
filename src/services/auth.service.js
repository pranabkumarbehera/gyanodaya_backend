const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { StatusCodes } = require("http-status-codes");
const env = require("../config/env");
const ApiError = require("../utils/api-error");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const { generateOtp } = require("../utils/otp");
const otpRepository = require("../repositories/otp.repository");
const refreshTokenRepository = require("../repositories/refresh-token.repository");
const userRepository = require("../repositories/user.repository");
const { ROLES } = require("../constants/enums");

const googleClient = new OAuth2Client(env.googleClientId || undefined);

class AuthService {
  async register(payload) {
    const existingUser = await userRepository.findByEmail(payload.email);
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, "User already exists with this email");
    }

    const password = await bcrypt.hash(payload.password, 10);
    const user = await userRepository.create({
      ...payload,
      password,
      role: payload.role || ROLES.STUDENT
    });

    return this.buildAuthResponse(user);
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    user.lastLoginAt = new Date();
    await user.save();

    return this.buildAuthResponse(user);
  }

  async googleSignIn(idToken) {
    if (!env.googleClientId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Google sign-in is not configured");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.googleClientId
    });

    const payload = ticket.getPayload();
    let user = await userRepository.findByEmail(payload.email);

    if (!user) {
      user = await userRepository.create({
        firstName: payload.given_name || "Student",
        lastName: payload.family_name || "User",
        email: payload.email,
        password: await bcrypt.hash(`${payload.sub}-${Date.now()}`, 10),
        profileImage: payload.picture || "",
        googleId: payload.sub,
        role: ROLES.STUDENT
      });
    }

    return this.buildAuthResponse(user);
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const otp = generateOtp();
    await otpRepository.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    return {
      message: "OTP generated successfully",
      otp
    };
  }

  async verifyOtp(email, otp) {
    const record = await otpRepository.findValidOtp(email, otp);
    if (!record) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid or expired OTP");
    }

    await otpRepository.verify(record._id);
    return { message: "OTP verified successfully" };
  }

  async resetPassword(email, newPassword) {
    const verifiedOtp = await otpRepository.findLatestVerified(email);
    if (!verifiedOtp) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "OTP verification required");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await userRepository.findByEmail(email);
    await userRepository.updateById(user._id, { password: hashedPassword });
    await refreshTokenRepository.revokeAllForUser(user._id);

    return { message: "Password reset successful" };
  }

  async refreshAccessToken(refreshToken) {
    verifyRefreshToken(refreshToken);
    const tokenRecord = await refreshTokenRepository.findValidToken(refreshToken);
    if (!tokenRecord) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    const user = await userRepository.findById(tokenRecord.user);
    return {
      accessToken: signAccessToken({ sub: user._id, role: user.role, email: user.email })
    };
  }

  async logout(refreshToken) {
    await refreshTokenRepository.revoke(refreshToken);
    return { message: "Logged out successfully" };
  }

  async buildAuthResponse(userDocument) {
    const user = userDocument.toObject ? userDocument.toObject() : userDocument;
    const accessToken = signAccessToken({ sub: user._id, role: user.role, email: user.email });
    const refreshToken = signRefreshToken({ sub: user._id });
    await refreshTokenRepository.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    delete user.password;

    return {
      accessToken,
      refreshToken,
      user
    };
  }
}

module.exports = new AuthService();
