import express, { Express } from "express";
import { errorHandlerMiddleware } from "./middlewares/error.middleware.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { notFoundMiddleware } from "./middlewares/notfound.middleware.js";
import { mainRouter } from "./routes/index.js";

export function createApp(): Express {
  const app = express();

  // Middlewares globales
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(loggerMiddleware);

  // Router principal
  app.use(mainRouter);

  // Middleware 404
  app.use(notFoundMiddleware);

  // Middleware de manejo de errores global
  app.use(errorHandlerMiddleware);

  return app;
}

export const app = createApp();
