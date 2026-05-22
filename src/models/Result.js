const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mockTest: { type: mongoose.Schema.Types.ObjectId, ref: "MockTest", required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "TestSession", required: true },
    score: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    leaderboardPercentile: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    unattemptedCount: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    subjectPerformance: [
      {
        subject: String,
        attempted: Number,
        correct: Number,
        accuracy: Number
      }
    ],
    weakTopics: [{ subject: String, topic: String, accuracy: Number }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
