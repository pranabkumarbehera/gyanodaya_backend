const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true },
    experience: {
      years: { type: Number, default: 0 },
      summary: { type: String, default: "" }
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    studentsCount: { type: Number, default: 0 },
    profileImage: { type: String, default: "" },
    bio: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
