const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const env = require("../config/env");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Gyanodaya EdTech API",
      version: "2.0.0",
      description: "Scalable backend APIs for EdTech mock tests, teachers, courses, users, and admin workflows."
    },
    servers: [
      {
        url: `http://localhost:${env.port}${env.apiPrefix}`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/routes/v1/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

const mountSwagger = (app) => {
  if (!env.swaggerEnabled) {
    return;
  }

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = mountSwagger;
