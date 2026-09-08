import { NextFunction, Request, Response } from "express";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const inicio = Date.now();
  res.on("finish", () => {
    const duracion = Date.now() - inicio;
    if (process.env.NODE_ENV !== "test") {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duracion}ms)`);
    }
  });
  next();
}
