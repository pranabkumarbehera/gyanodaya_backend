const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    selectedOptions: [Number],
    timeSpent: { type: Number, default: 0 }
  },
  { _id: false }
);

const testSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mockTest: { type: mongoose.Schema.Types.ObjectId, ref: "MockTest", required: true },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ["in_progress", "submitted"], default: "in_progress" },
    answers: [answerSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestSession", testSessionSchema);
