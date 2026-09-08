import { Request, Response } from "express";

export class LegacyController {
  public salud = (_req: Request, res: Response): void => {
    res.status(200).json({
      estado: "ok",
      fecha: new Date().toISOString()
    });
  };

  public hola = (_req: Request, res: Response): void => {
    res.status(200).json({
      estado: "ok",
      mensaje: "Hola Lautaro"
    });
  };

  public adios = (_req: Request, res: Response): void => {
    res.status(200).json({
      estado: "ok",
      mensaje: "Adios Lautaro"
    });
  };

  public narcisoPerez = (_req: Request, res: Response): void => {
    res.status(201).json({
      estado: "ok",
      mensaje: "Narciso Perez Creado con exito"
    });
  };
}
