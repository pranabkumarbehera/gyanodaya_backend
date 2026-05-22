const Course = require("../models/Course");

class CourseRepository {
  find(filter = {}) {
    return Course.find(filter).populate("teacher");
  }

  findById(id) {
    return Course.findById(id).populate("teacher");
  }

  create(payload) {
    return Course.create(payload);
  }

  updateById(id, payload) {
    return Course.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  }
}

module.exports = new CourseRepository();
