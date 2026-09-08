import { NextFunction, Request, Response } from "express";
import { UsuarioService } from "../services/usuario.service.js";

export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  public crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const nuevoUsuario = this.usuarioService.crearUsuario(req.body);
      res.status(201).json({
        estado: "ok",
        mensaje: "Usuario creado exitosamente",
        datos: nuevoUsuario
      });
    } catch (error) {
      next(error);
    }
  };

  public obtenerTodos = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usuarios = this.usuarioService.obtenerTodos();
      res.status(200).json({
        estado: "ok",
        total: usuarios.length,
        datos: usuarios
      });
    } catch (error) {
      next(error);
    }
  };

  public obtenerPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const usuario = this.usuarioService.obtenerPorId(id);
      res.status(200).json({
        estado: "ok",
        datos: usuario
      });
    } catch (error) {
      next(error);
    }
  };

  public actualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const usuarioActualizado = this.usuarioService.actualizarUsuario(id, req.body);
      res.status(200).json({
        estado: "ok",
        mensaje: "Usuario actualizado exitosamente",
        datos: usuarioActualizado
      });
    } catch (error) {
      next(error);
    }
  };

  public eliminar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      this.usuarioService.eliminarUsuario(id);
      res.status(200).json({
        estado: "ok",
        mensaje: "Usuario eliminado exitosamente"
      });
    } catch (error) {
      next(error);
    }
  };
}
