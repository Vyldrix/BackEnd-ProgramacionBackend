import { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "../config/prisma.js";
import {
  CheckoutDTO,
  CheckoutResponseDTO,
  DetalleCheckoutResponseDTO
} from "../dtos/pedido.dto.js";
import {
  BadRequestError,
  InsufficientStockError,
  NotFoundError
} from "./errors/app.errors.js";

export class PedidoService {
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  /**
   * Procesa el checkout de compras completo garantizando integridad ACID mediante prisma.$transaction.
   */
  public async procesarCheckout(dto: CheckoutDTO): Promise<CheckoutResponseDTO> {
    this.validarCheckoutDTO(dto);

    const items = (dto.productosComprados ?? dto.items)!;

    // Ejecución transaccional ACID: cualquier error disparará automáticamente un ROLLBACK
    return await this.prisma.$transaction(async (tx) => {
      // 1. Validar que el usuario exista
      const usuario = await tx.usuario.findUnique({
        where: { id: dto.usuarioId }
      });

      if (!usuario) {
        throw new NotFoundError(`Usuario con ID ${dto.usuarioId} no encontrado`);
      }

      // 2. Crear pedido inicial con estado PENDIENTE y total 0, asociado al usuario
      const pedidoInicial = await tx.pedido.create({
        data: {
          usuarioId: usuario.id,
          total: 0,
          estado: "PENDIENTE"
        }
      });

      let totalCalculado = 0;
      const detallesCreados: DetalleCheckoutResponseDTO[] = [];

      // 3. Recorrer los productos solicitados
      for (const item of items) {
        const producto = await tx.producto.findUnique({
          where: { id: item.productoId }
        });

        if (!producto) {
          throw new NotFoundError(
            `Producto con ID ${item.productoId} no encontrado`
          );
        }

        // Validación crítica: si el stock queda en negativo -> ROLLBACK
        const stockRestante = producto.stock - item.cantidad;
        if (stockRestante < 0) {
          throw new InsufficientStockError(
            `Stock insuficiente para el producto '${producto.nombre}'. Stock disponible: ${producto.stock}, solicitado: ${item.cantidad}`
          );
        }

        // Restar el inventario modificando el atributo stock del Producto
        await tx.producto.update({
          where: { id: producto.id },
          data: { stock: stockRestante }
        });

        // Calcular subtotal
        const subtotal = Number((item.cantidad * producto.precio).toFixed(2));
        totalCalculado += subtotal;

        // Crear registro en DetallePedido
        await tx.detallePedido.create({
          data: {
            pedidoId: pedidoInicial.id,
            productoId: producto.id,
            cantidad: item.cantidad,
            precioUnitario: producto.precio,
            subtotal: subtotal
          }
        });

        detallesCreados.push({
          productoId: producto.id,
          nombreProducto: producto.nombre,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
          subtotal: subtotal
        });
      }

      totalCalculado = Number(totalCalculado.toFixed(2));

      // 4. Actualizar el pedido con el total final y confirmar estado
      const pedidoConfirmado = await tx.pedido.update({
        where: { id: pedidoInicial.id },
        data: {
          total: totalCalculado,
          estado: "CONFIRMADO"
        }
      });

      // Retorno exitoso -> Prisma ejecuta COMMIT
      return {
        pedidoId: pedidoConfirmado.id,
        usuarioId: pedidoConfirmado.usuarioId,
        total: pedidoConfirmado.total,
        estado: pedidoConfirmado.estado,
        detalles: detallesCreados,
        creadoEn: pedidoConfirmado.creadoEn.toISOString()
      };
    });
  }

  /**
   * Obtiene todos los pedidos con sus detalles
   */
  public async obtenerTodos(): Promise<CheckoutResponseDTO[]> {
    const pedidos = await this.prisma.pedido.findMany({
      include: {
        detalles: {
          include: {
            producto: true
          }
        }
      },
      orderBy: { id: "asc" }
    });

    return pedidos.map((p) => ({
      pedidoId: p.id,
      usuarioId: p.usuarioId,
      total: p.total,
      estado: p.estado,
      detalles: p.detalles.map((d) => ({
        productoId: d.productoId,
        nombreProducto: d.producto.nombre,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal
      })),
      creadoEn: p.creadoEn.toISOString()
    }));
  }

  /**
   * Obtiene un pedido por su ID
   */
  public async obtenerPorId(id: number): Promise<CheckoutResponseDTO> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError("El ID del pedido debe ser un número entero positivo válido");
    }

    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        detalles: {
          include: {
            producto: true
          }
        }
      }
    });

    if (!pedido) {
      throw new NotFoundError(`Pedido con ID ${id} no encontrado`);
    }

    return {
      pedidoId: pedido.id,
      usuarioId: pedido.usuarioId,
      total: pedido.total,
      estado: pedido.estado,
      detalles: pedido.detalles.map((d) => ({
        productoId: d.productoId,
        nombreProducto: d.producto.nombre,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal
      })),
      creadoEn: pedido.creadoEn.toISOString()
    };
  }

  private validarCheckoutDTO(dto: CheckoutDTO): void {
    if (!dto || typeof dto !== "object") {
      throw new BadRequestError("El cuerpo de la solicitud no puede estar vacío");
    }

    if (
      dto.usuarioId === undefined ||
      typeof dto.usuarioId !== "number" ||
      dto.usuarioId <= 0 ||
      !Number.isInteger(dto.usuarioId)
    ) {
      throw new BadRequestError("usuarioId debe ser un número entero positivo válido");
    }

    const items = dto.productosComprados ?? dto.items;

    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestError("El pedido debe contener al menos un producto en 'productosComprados' o 'items'");
    }

    for (const item of items) {
      if (
        item.productoId === undefined ||
        typeof item.productoId !== "number" ||
        item.productoId <= 0 ||
        !Number.isInteger(item.productoId)
      ) {
        throw new BadRequestError("productoId debe ser un número entero positivo válido");
      }

      if (
        item.cantidad === undefined ||
        typeof item.cantidad !== "number" ||
        item.cantidad <= 0 ||
        !Number.isInteger(item.cantidad)
      ) {
        throw new BadRequestError("La cantidad solicitada debe ser un número entero mayor a 0");
      }
    }
  }
}
