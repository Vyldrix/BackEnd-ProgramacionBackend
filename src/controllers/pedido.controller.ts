import { NextFunction, Request, Response } from "express";
import { PedidoService } from "../services/pedido.service.js";
import {
  BadRequestError,
  InsufficientStockError
} from "../services/errors/app.errors.js";

export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  /**
   * Procesa la creación de un nuevo pedido extrayendo usuarioId y productosComprados del cuerpo de la petición (JSON).
   * Valida la información de entrada y retorna:
   * - 400 Bad Request ante información incompleta o falta de stock.
   * - 201 Created con el pedido finalizado en caso de éxito.
   */
  public crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { usuarioId, productosComprados, items } = req.body ?? {};
      const listaProductos = productosComprados ?? items;

      // 1. Validación de información incompleta: usuarioId
      if (usuarioId === undefined || usuarioId === null || usuarioId === "") {
        res.status(400).json({
          estado: "error",
          mensaje: "Información incompleta: el campo 'usuarioId' es obligatorio"
        });
        return;
      }

      if (
        typeof usuarioId !== "number" ||
        isNaN(usuarioId) ||
        usuarioId <= 0 ||
        !Number.isInteger(usuarioId)
      ) {
        res.status(400).json({
          estado: "error",
          mensaje: "El campo 'usuarioId' debe ser un número entero positivo válido"
        });
        return;
      }

      // 2. Validación de información incompleta: productosComprados
      if (
        !listaProductos ||
        !Array.isArray(listaProductos) ||
        listaProductos.length === 0
      ) {
        res.status(400).json({
          estado: "error",
          mensaje: "Información incompleta: debe incluir 'productosComprados' con al menos un ítem"
        });
        return;
      }

      // 3. Validación de cada ítem en productosComprados
      for (let i = 0; i < listaProductos.length; i++) {
        const item = listaProductos[i];
        const idProd = item?.productoId ?? item?.id;
        const cantidad = item?.cantidad;

        if (
          idProd === undefined ||
          typeof idProd !== "number" ||
          isNaN(idProd) ||
          idProd <= 0 ||
          !Number.isInteger(idProd)
        ) {
          res.status(400).json({
            estado: "error",
            mensaje: `Información incompleta en producto [${i}]: 'productoId' debe ser un entero positivo`
          });
          return;
        }

        if (
          cantidad === undefined ||
          typeof cantidad !== "number" ||
          isNaN(cantidad) ||
          cantidad <= 0 ||
          !Number.isInteger(cantidad)
        ) {
          res.status(400).json({
            estado: "error",
            mensaje: `Información incompleta en producto con ID ${idProd}: 'cantidad' debe ser un número entero mayor a 0`
          });
          return;
        }
      }

      // Normalizar estructura de items para el servicio
      const itemsNormalizados = listaProductos.map((item: any) => ({
        productoId: item.productoId ?? item.id,
        cantidad: item.cantidad
      }));

      // Procesar el checkout transaccional
      const pedidoFinalizado = await this.pedidoService.procesarCheckout({
        usuarioId,
        items: itemsNormalizados
      });

      // Retorno exitoso 201 Created con el pedido finalizado
      res.status(201).json({
        estado: "ok",
        mensaje: "Pedido procesado y creado exitosamente",
        datos: pedidoFinalizado
      });
    } catch (error) {
      // Manejo específico de falta de stock o datos incorrectos -> 400 Bad Request
      if (
        error instanceof InsufficientStockError ||
        error instanceof BadRequestError
      ) {
        res.status(400).json({
          estado: "error",
          mensaje: error.message
        });
        return;
      }
      next(error);
    }
  };

  /**
   * Alias de compatibilidad para POST /api/pedidos/checkout
   */
  public checkout = this.crear;

  /**
   * Consulta de todos los pedidos
   */
  public obtenerTodos = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const pedidos = await this.pedidoService.obtenerTodos();
      res.status(200).json({
        estado: "ok",
        total: pedidos.length,
        datos: pedidos
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Consulta de pedido por ID
   */
  public obtenerPorId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const pedido = await this.pedidoService.obtenerPorId(id);
      res.status(200).json({
        estado: "ok",
        datos: pedido
      });
    } catch (error) {
      next(error);
    }
  };
}
