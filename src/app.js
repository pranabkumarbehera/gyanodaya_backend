const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const env = require("./config/env");
const mountSwagger = require("./docs/swagger");
const errorMiddleware = require("./middlewares/error.middleware");
const notFoundMiddleware = require("./middlewares/not-found.middleware");
const { apiLimiter } = require("./middlewares/rate-limit.middleware");
const routes = require("./routes/v1");

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({
  origin: env.allowedOrigins,
  credentials: true
}));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve(process.cwd(), env.uploadDir)));
app.use(apiLimiter);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    environment: env.nodeEnv
  });
});

mountSwagger(app);
app.use(env.apiPrefix, routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
