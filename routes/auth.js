const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb, writeDb } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'gyanodaya_secret_key_123';

// Generate Token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register a student
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password, gender } = req.body;

  if (!firstName || !lastName || !email || !password || !gender) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  const db = readDb();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }

  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser = {
    id: String(db.users.length + 1),
    email: email.toLowerCase(),
    passwordHash,
    firstName,
    lastName,
    gender,
    rank: 100 + db.users.length, // Initial default rank
    points: 100, // Starting points
    accuracy: 0, // Starting accuracy
    rankAllIndia: 10000 + db.users.length,
    avgScore: 0,
    tier: "Bronze Scholar",
    targetExam: "JEE Aspirant • 12th Grade",
    subjectPerformance: {
      Physics: 0,
      Chemistry: 0,
      Mathematics: 0
    }
  };

  db.users.push(newUser);
  writeDb(db);

  const token = generateToken({ id: newUser.id, email: newUser.email });

  // Exclude password from return
  const { passwordHash: _, ...userResponse } = newUser;

  res.status(201).json({
    token,
    user: userResponse
  });
});

// @route   POST /api/auth/login
// @desc    Login a student
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: user.id, email: user.email });

  const { passwordHash: _, ...userResponse } = user;

  res.json({
    token,
    user: userResponse
  });
});

// @route   POST /api/auth/social
// @desc    Simulate Google or Apple social login
router.post('/social', (req, res) => {
  const { email, firstName, lastName, provider } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required for social login' });
  }

  const db = readDb();
  let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Create new user for social signup
    user = {
      id: String(db.users.length + 1),
      email: email.toLowerCase(),
      passwordHash: bcrypt.hashSync(Math.random().toString(36), 10), // Random password
      firstName: firstName || 'Student',
      lastName: lastName || 'Gyanodaya',
      gender: 'Male', // Default
      rank: 150 + db.users.length,
      points: 120,
      accuracy: 0,
      rankAllIndia: 12000 + db.users.length,
      avgScore: 0,
      tier: "Bronze Scholar",
      targetExam: "JEE Aspirant • 12th Grade",
      subjectPerformance: {
        Physics: 0,
        Chemistry: 0,
        Mathematics: 0
      }
    };
    db.users.push(user);
    writeDb(db);
  }

  const token = generateToken({ id: user.id, email: user.email });

  const { passwordHash: _, ...userResponse } = user;

  res.json({
    token,
    user: userResponse,
    provider: provider || 'google'
  });
});

module.exports = router;
