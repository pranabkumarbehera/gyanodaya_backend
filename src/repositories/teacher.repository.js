const Teacher = require("../models/Teacher");

class TeacherRepository {
  find(filter = {}) {
    return Teacher.find(filter).populate("courses");
  }

  findById(id) {
    return Teacher.findById(id).populate("courses");
  }

  create(payload) {
    return Teacher.create(payload);
  }

  updateById(id, payload) {
    return Teacher.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  }
}

module.exports = new TeacherRepository();
