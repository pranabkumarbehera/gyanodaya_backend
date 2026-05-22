const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { readDb } = require('../db');

// @route   GET /api/dashboard
// @desc    Get dashboard metrics, courses, and top teachers
router.get('/', auth, (req, res) => {
  const db = readDb();
  
  // Find current user
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Get user details excluding password
  const { passwordHash, ...userStats } = user;

  res.json({
    user: userStats,
    recentCourses: db.courses,
    topTeachers: db.teachers.map(t => ({
      id: t.id,
      name: t.name,
      subject: t.subject,
      rating: t.rating,
      image: t.image
    }))
  });
});

module.exports = router;
