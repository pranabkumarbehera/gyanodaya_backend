const dotenv = require("dotenv");

dotenv.config();

const env = {
  MONGO_URI: process.env.MONGO_URI || "mongodb+srv://admin:StrongPassword123@cluster0.sycvfbs.mongodb.net/gyanodaya?retryWrites=true&w=majority&appName=Cluster0",
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5002),
  apiPrefix: process.env.API_PREFIX || "/api/v1",
  mongoUri: process.env.MONGO_URI || "mongodb+srv://admin:StrongPassword123@cluster0.sycvfbs.mongodb.net/gyanodaya?retryWrites=true&w=majority&appName=Cluster0",
  accessSecret: process.env.JWT_ACCESS_SECRET || "access-secret",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(","),
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 5),
  swaggerEnabled: process.env.SWAGGER_ENABLED !== "false",
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "",
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : ""
};

module.exports = env;