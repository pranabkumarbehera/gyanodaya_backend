const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { readDb } = require('../db');

// @route   GET /api/profile
// @desc    Get detailed user profile statistics and subject analytics
router.get('/', auth, (req, res) => {
  const db = readDb();
  const user = db.users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Calculate detailed stats or retrieve history
  const userResults = db.testResults.filter(r => r.userId === req.user.id);
  
  // Format response matching the profile mockup
  res.json({
    profile: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      tier: user.tier,
      targetExam: user.targetExam,
      points: user.points,
      rank: user.rank,
      accuracy: user.accuracy,
      rankAllIndia: user.rankAllIndia,
      avgScore: user.avgScore,
      subjectPerformance: user.subjectPerformance
    },
    activityLogs: userResults.map(r => ({
      testTitle: r.testTitle,
      score: `${r.totalScore}/${r.maxPossibleScore}`,
      percentage: r.percentage,
      date: r.submittedAt
    }))
  });
});

module.exports = router;
