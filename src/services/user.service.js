const { StatusCodes } = require("http-status-codes");
const Result = require("../models/Result");
const User = require("../models/User");
const ApiError = require("../utils/api-error");
const userRepository = require("../repositories/user.repository");

class UserService {
  async getProfile(userId) {
    const user = await User.findById(userId)
      .select("-password")
      .populate("followedTeachers", "name specialization profileImage ratings");

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const latestResults = await Result.find({ user: userId }).populate("mockTest").sort({ createdAt: -1 }).limit(5);

    return {
      user,
      latestResults
    };
  }

  async updateProfile(userId, payload) {
    const user = await userRepository.updateById(userId, payload);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    return user;
  }

  async uploadProfileImage(userId, file) {
    return this.updateProfile(userId, { profileImage: `/uploads/${file.filename}` });
  }

  async getStatistics(userId) {
    const user = await User.findById(userId).select("statistics performanceAnalytics");
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    return user;
  }
}

module.exports = new UserService();
