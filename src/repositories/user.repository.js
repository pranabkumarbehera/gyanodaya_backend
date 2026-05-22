const User = require("../models/User");

class UserRepository {
  create(payload) {
    return User.create(payload);
  }

  findByEmail(email, includePassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    return includePassword ? query.select("+password") : query;
  }

  findById(id) {
    return User.findById(id);
  }

  updateById(id, payload) {
    return User.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  }

  list(filter = {}) {
    return User.find(filter).select("-password");
  }
}

module.exports = new UserRepository();
