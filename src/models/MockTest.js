const mongoose = require("mongoose");

const mockTestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    duration: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    markingType: { type: Number, enum: [-2.5, -0.5, 0], default: -0.5 },
    premiumStatus: { type: Boolean, default: false },
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
    recent: { type: Boolean, default: false },
    instructions: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("MockTest", mockTestSchema);
