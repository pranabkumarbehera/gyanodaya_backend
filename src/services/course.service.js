const Course = require("../models/Course");
const ApiFeatures = require("../utils/api-features");
const cache = require("../utils/cache");
const ApiError = require("../utils/api-error");

class CourseService {
  async list(queryString) {
    const cacheKey = `courses:${JSON.stringify(queryString)}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const baseQuery = Course.find().populate("teacher");
    const features = new ApiFeatures(baseQuery, queryString)
      .search(["title", "subject"])
      .filter(["subject", "premiumStatus", "featured"])
      .sort("-createdAt")
      .paginate();

    const courses = await features.query;
    const response = { data: courses, pagination: features.pagination };
    cache.set(cacheKey, response);
    return response;
  }

  featured() {
    return Course.find({ featured: true }).populate("teacher").sort({ createdAt: -1 });
  }

  recent() {
    return Course.find().populate("teacher").sort({ createdAt: -1 }).limit(10);
  }

  premium() {
    return Course.find({ premiumStatus: true }).populate("teacher").sort({ createdAt: -1 });
  }

  async details(id) {
    const course = await Course.findById(id).populate("teacher");
    if (!course) {
      throw new ApiError(404, "Course not found");
    }
    return course;
  }
}

module.exports = new CourseService();
