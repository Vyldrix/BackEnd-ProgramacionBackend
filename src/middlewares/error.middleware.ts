import { NextFunction, Request, Response } from "express";
import { AppError } from "../services/errors/app.errors.js";

export function errorHandlerMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      estado: "error",
      mensaje: err.message
    });
    return;
  }

  // Error de sintaxis JSON en el body
  if ("type" in err && (err as { type: string }).type === "entity.parse.failed") {
    res.status(400).json({
      estado: "error",
      mensaje: "Formato JSON inválido en el cuerpo de la solicitud"
    });
    return;
  }

  // Error no controlado
  console.error("Error no controlado:", err);
  res.status(500).json({
    estado: "error",
    mensaje: "Error interno del servidor"
  });
}
