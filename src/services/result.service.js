const resultRepository = require("../repositories/result.repository");

class ResultService {
  myResults(userId) {
    return resultRepository.findByUser(userId);
  }

  leaderboard(mockTestId) {
    return resultRepository.leaderboard(mockTestId);
  }
}

module.exports = new ResultService();
