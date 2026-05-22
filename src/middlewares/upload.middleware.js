const fs = require("fs");
const path = require("path");
const multer = require("multer");
const env = require("../config/env");
const ApiError = require("../utils/api-error");

const destination = path.resolve(process.cwd(), env.uploadDir);
if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, destination),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: env.maxFileSizeMb * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new ApiError(400, "Only image uploads are allowed"));
    }
    cb(null, true);
  }
});

module.exports = upload;
