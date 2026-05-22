const mongoose = require("mongoose");
const { QUESTION_TYPES } = require("../constants/enums");

const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    image: { type: String, default: "" }
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    mockTest: { type: mongoose.Schema.Types.ObjectId, ref: "MockTest", required: true },
    title: { type: String, required: true },
    type: { type: String, enum: Object.values(QUESTION_TYPES), default: QUESTION_TYPES.SINGLE_CORRECT },
    subject: { type: String, required: true },
    topic: { type: String, default: "" },
    options: { type: [optionSchema], validate: [(value) => value.length >= 2, "At least two options are required"] },
    correctAnswers: { type: [Number], required: true },
    explanation: { type: String, default: "" },
    positiveMarks: { type: Number, default: 4 },
    negativeMarks: { type: Number, default: -0.5 },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
