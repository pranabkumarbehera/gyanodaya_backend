const mongoose = require("mongoose");
const { ROLES } = require("../constants/enums");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    profileImage: { type: String, default: "" },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.STUDENT },
    googleId: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
    statistics: {
      testsAttempted: { type: Number, default: 0 },
      questionsAttempted: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 },
      rank: { type: Number, default: 0 },
      allIndiaRank: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
      accuracyPercentage: { type: Number, default: 0 }
    },
    performanceAnalytics: {
      progressChart: [{ label: String, score: Number, attemptedAt: Date }],
      weakTopics: [{ subject: String, topic: String, accuracy: Number }],
      subjectPerformance: [
        {
          subject: String,
          accuracy: Number,
          averageScore: Number
        }
      ]
    },
    followedTeachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
    refreshTokens: [{ type: mongoose.Schema.Types.ObjectId, ref: "RefreshToken" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
