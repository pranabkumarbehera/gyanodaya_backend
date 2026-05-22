const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    description: { type: String, default: "" },
    lessonsCount: { type: Number, default: 0 },
    premiumStatus: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    thumbnail: { type: String, default: "" },
    tags: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
