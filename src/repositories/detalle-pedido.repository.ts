import { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "../config/prisma.js";
import { DetallePedido } from "../entities/detalle-pedido.entity.js";
import { IDetallePedidoRepository } from "./interfaces/detalle-pedido.repository.interface.js";

export class DetallePedidoRepository implements IDetallePedidoRepository {
  /**
   * Inyección de dependencia del cliente Prisma ORM
   */
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  /**
   * Operación CREATE: inserta un nuevo detalle de pedido usando prisma.detallePedido.create
   */
  public async crear(detalle: DetallePedido): Promise<DetallePedido> {
    const registro = await this.prisma.detallePedido.create({
      data: {
        pedidoId: detalle.pedidoId,
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        subtotal: detalle.subtotal
      }
    });

    return new DetallePedido({
      id: registro.id,
      pedidoId: registro.pedidoId,
      productoId: registro.productoId,
      cantidad: registro.cantidad,
      precioUnitario: registro.precioUnitario,
      subtotal: registro.subtotal
    });
  }

  /**
   * Operación READ (por pedido): recupera los ítems de un pedido usando prisma.detallePedido.findMany
   */
  public async obtenerPorPedidoId(pedidoId: number): Promise<DetallePedido[]> {
    const registros = await this.prisma.detallePedido.findMany({
      where: { pedidoId },
      orderBy: { id: "asc" }
    });

    return registros.map(
      (r) =>
        new DetallePedido({
          id: r.id,
          pedidoId: r.pedidoId,
          productoId: r.productoId,
          cantidad: r.cantidad,
          precioUnitario: r.precioUnitario,
          subtotal: r.subtotal
        })
    );
  }

  /**
   * Operación READ (por ID): busca un detalle de pedido usando prisma.detallePedido.findUnique
   */
  public async obtenerPorId(id: number): Promise<DetallePedido | null> {
    const registro = await this.prisma.detallePedido.findUnique({
      where: { id }
    });

    if (!registro) return null;

    return new DetallePedido({
      id: registro.id,
      pedidoId: registro.pedidoId,
      productoId: registro.productoId,
      cantidad: registro.cantidad,
      precioUnitario: registro.precioUnitario,
      subtotal: registro.subtotal
    });
  }

  /**
   * Operación DELETE: elimina un detalle de pedido usando prisma.detallePedido.delete
   */
  public async eliminar(id: number): Promise<boolean> {
    const existente = await this.obtenerPorId(id);
    if (!existente) return false;

    await this.prisma.detallePedido.delete({
      where: { id }
    });

    return true;
  }
}
