import { NextFunction, Request, Response } from "express";
import { ProductoService } from "../services/producto.service.js";

export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  public crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const nuevoProducto = this.productoService.crearProducto(req.body);
      res.status(201).json({
        estado: "ok",
        mensaje: "Producto creado exitosamente",
        datos: nuevoProducto
      });
    } catch (error) {
      next(error);
    }
  };

  public obtenerTodos = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productos = this.productoService.obtenerTodos();
      res.status(200).json({
        estado: "ok",
        total: productos.length,
        datos: productos
      });
    } catch (error) {
      next(error);
    }
  };

  public obtenerPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const producto = this.productoService.obtenerPorId(id);
      res.status(200).json({
        estado: "ok",
        datos: producto
      });
    } catch (error) {
      next(error);
    }
  };

  public actualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const productoActualizado = this.productoService.actualizarProducto(id, req.body);
      res.status(200).json({
        estado: "ok",
        mensaje: "Producto actualizado exitosamente",
        datos: productoActualizado
      });
    } catch (error) {
      next(error);
    }
  };

  public eliminar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      this.productoService.eliminarProducto(id);
      res.status(200).json({
        estado: "ok",
        mensaje: "Producto eliminado exitosamente"
      });
    } catch (error) {
      next(error);
    }
  };
}
