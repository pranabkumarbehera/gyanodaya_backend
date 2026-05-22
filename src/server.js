const app = require("./app");
const env = require("./config/env");
const connectDatabase = require("./config/database");

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Server bootstrap failed", error);
    process.exit(1);
  }
};

startServer();
