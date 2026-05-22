const Result = require("../models/Result");

class ResultRepository {
  create(payload) {
    return Result.create(payload);
  }

  findByUser(userId) {
    return Result.find({ user: userId }).populate("mockTest").sort({ createdAt: -1 });
  }

  leaderboard(mockTestId) {
    return Result.find({ mockTest: mockTestId })
      .populate("user", "firstName lastName profileImage")
      .sort({ score: -1, createdAt: 1 });
  }
}

module.exports = new ResultRepository();
