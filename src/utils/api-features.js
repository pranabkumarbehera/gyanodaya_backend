class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search(fields = []) {
    if (this.queryString.search && fields.length) {
      const regex = new RegExp(this.queryString.search, "i");
      this.query = this.query.find({
        $or: fields.map((field) => ({ [field]: regex }))
      });
    }
    return this;
  }

  filter(allowedFilters = []) {
    const filters = {};
    allowedFilters.forEach((key) => {
      if (this.queryString[key] !== undefined) {
        filters[key] = this.queryString[key];
      }
    });

    if (Object.keys(filters).length) {
      this.query = this.query.find(filters);
    }
    return this;
  }

  sort(defaultSort = "-createdAt") {
    this.query = this.query.sort(this.queryString.sort || defaultSort);
    return this;
  }

  paginate() {
    const page = Math.max(Number(this.queryString.page || 1), 1);
    const limit = Math.min(Math.max(Number(this.queryString.limit || 10), 1), 100);
    const skip = (page - 1) * limit;
    this.pagination = { page, limit, skip };
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
