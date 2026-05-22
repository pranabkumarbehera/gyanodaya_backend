const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { readDb, writeDb } = require('../db');

// @route   GET /api/tests
// @desc    Get all mock tests
router.get('/', (req, res) => {
  const db = readDb();
  res.json(db.mockTests);
});

// @route   GET /api/tests/:id/questions
// @desc    Get questions for a specific mock test
router.get('/:id/questions', auth, (req, res) => {
  const db = readDb();
  const testId = req.params.id;

  const testExists = db.mockTests.find(t => t.id === testId);
  if (!testExists) {
    return res.status(404).json({ message: 'Mock test not found' });
  }

  // Check if test is premium and user is eligible (simulated)
  if (testExists.isPremium) {
    const user = db.users.find(u => u.id === req.user.id);
    if (user && user.tier !== 'Gold Tier Scholar') {
      // Allow for mock purposes, but tag a warning
      console.log(`User ${user.email} is access-testing premium test ${testId}`);
    }
  }

  const questions = db.questions[testId] || [];
  
  // Return questions without the correctIndex to prevent cheating
  const safeQuestions = questions.map(({ correctIndex, ...q }) => q);

  res.json({
    test: testExists,
    questions: safeQuestions
  });
});

// @route   POST /api/tests/:id/submit
// @desc    Submit answers and calculate mock test performance
router.post('/:id/submit', auth, (req, res) => {
  const { answers } = req.body; // Array of { questionId, selectedIndex }
  const testId = req.params.id;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'Invalid submission format' });
  }

  const db = readDb();
  const test = db.mockTests.find(t => t.id === testId);
  if (!test) {
    return res.status(404).json({ message: 'Mock test not found' });
  }

  const questions = db.questions[testId] || [];
  if (questions.length === 0) {
    return res.status(400).json({ message: 'No questions set for this mock test' });
  }

  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  const negPenalty = Math.abs(parseFloat(test.negativeMarking || '0'));

  questions.forEach(q => {
    const submission = answers.find(a => a.questionId === q.id);
    if (!submission || submission.selectedIndex === null || submission.selectedIndex === undefined) {
      unattemptedCount++;
    } else if (submission.selectedIndex === q.correctIndex) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  // Calculate score (4 points per correct answer, deduct negPenalty for incorrect)
  const positiveScore = correctCount * 4;
  const negativePenaltyScore = incorrectCount * negPenalty;
  const totalScore = Math.max(0, positiveScore - negativePenaltyScore);
  const maxPossibleScore = questions.length * 4;
  const percentage = Math.round((totalScore / maxPossibleScore) * 100) || 0;

  // Find user and update statistics
  const userIndex = db.users.findIndex(u => u.id === req.user.id);
  if (userIndex !== -1) {
    const user = db.users[userIndex];
    
    // Gain points: +50 for completing test, +10 per correct answer
    const pointsGained = 50 + (correctCount * 10);
    user.points += pointsGained;

    // Accuracy: blend with previous accuracy
    const sessionAccuracy = Math.round((correctCount / (correctCount + incorrectCount || 1)) * 100);
    user.accuracy = user.accuracy === 0 ? sessionAccuracy : Math.round((user.accuracy * 0.7) + (sessionAccuracy * 0.3));
    
    // Average score
    user.avgScore = user.avgScore === 0 ? percentage : Math.round((user.avgScore * 0.7) + (percentage * 0.3));

    // Boost rank slightly if score is high
    if (percentage > 70) {
      user.rank = Math.max(1, user.rank - 2);
      user.rankAllIndia = Math.max(10, user.rankAllIndia - 150);
    }

    // Dynamic subject accuracy update
    if (test.subjects.toLowerCase().includes('physics')) {
      user.subjectPerformance.Physics = Math.min(100, Math.round((user.subjectPerformance.Physics + percentage) / 2));
    }
    if (test.subjects.toLowerCase().includes('chemistry')) {
      user.subjectPerformance.Chemistry = Math.min(100, Math.round((user.subjectPerformance.Chemistry + percentage) / 2));
    }
    if (test.subjects.toLowerCase().includes('math')) {
      user.subjectPerformance.Mathematics = Math.min(100, Math.round((user.subjectPerformance.Mathematics + percentage) / 2));
    }

    db.users[userIndex] = user;
  }

  // Log test result
  const testResult = {
    id: String(db.testResults.length + 1),
    userId: req.user.id,
    testId,
    testTitle: test.title,
    correctCount,
    incorrectCount,
    unattemptedCount,
    totalScore,
    maxPossibleScore,
    percentage,
    submittedAt: new Date().toISOString()
  };
  
  db.testResults.push(testResult);
  writeDb(db);

  res.json({
    result: testResult,
    userStats: {
      points: db.users[userIndex].points,
      accuracy: db.users[userIndex].accuracy,
      rank: db.users[userIndex].rank,
      rankAllIndia: db.users[userIndex].rankAllIndia,
      avgScore: db.users[userIndex].avgScore,
      subjectPerformance: db.users[userIndex].subjectPerformance
    }
  });
});

module.exports = router;
