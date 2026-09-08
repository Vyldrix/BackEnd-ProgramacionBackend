import express, { Express } from "express";
import { readFileSync } from "node:fs";
import swaggerUi from "swagger-ui-express";
import { errorHandlerMiddleware } from "./middlewares/error.middleware.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { notFoundMiddleware } from "./middlewares/notfound.middleware.js";
import { mainRouter } from "./routes/index.js";

// Cargar la especificación OpenAPI 3.2.0
const openapiDocument = JSON.parse(
  readFileSync(new URL("./docs/openapi.json", import.meta.url), "utf-8")
);

export function createApp(): Express {
  const app = express();

  // Middlewares globales
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(loggerMiddleware);

  // Documentación interactiva Swagger UI
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
  app.get("/api/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json(openapiDocument);
  });
  app.get("/docs", (_req, res) => {
    res.redirect("/api/docs");
  });

  // Router principal de la API
  app.use(mainRouter);

  // Middleware 404
  app.use(notFoundMiddleware);

  // Middleware de manejo de errores global
  app.use(errorHandlerMiddleware);

  return app;
}

export const app = createApp();
