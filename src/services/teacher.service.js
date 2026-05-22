const { StatusCodes } = require("http-status-codes");
const Teacher = require("../models/Teacher");
const ApiError = require("../utils/api-error");
const ApiFeatures = require("../utils/api-features");
const cache = require("../utils/cache");

class TeacherService {
  async list(queryString) {
    const cacheKey = `teachers:${JSON.stringify(queryString)}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const features = new ApiFeatures(Teacher.find(), queryString)
      .search(["name", "specialization"])
      .sort("-createdAt")
      .paginate();

    const teachers = await features.query;
    const response = { data: teachers, pagination: features.pagination };
    cache.set(cacheKey, response);
    return response;
  }

  async details(id) {
    const teacher = await Teacher.findById(id).populate("courses");
    if (!teacher) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Teacher not found");
    }
    return teacher;
  }

  async follow(user, teacherId) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Teacher not found");
    }

    const alreadyFollowed = user.followedTeachers.some((item) => String(item) === teacherId);
    if (!alreadyFollowed) {
      user.followedTeachers.push(teacher._id);
      teacher.followers.push(user._id);
      await Promise.all([user.save(), teacher.save()]);
    }

    return { message: "Teacher followed successfully" };
  }

  async rate(teacherId, rating) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Teacher not found");
    }

    const total = teacher.ratings.average * teacher.ratings.count + rating;
    teacher.ratings.count += 1;
    teacher.ratings.average = Number((total / teacher.ratings.count).toFixed(2));
    await teacher.save();

    return teacher.ratings;
  }
}

module.exports = new TeacherService();
