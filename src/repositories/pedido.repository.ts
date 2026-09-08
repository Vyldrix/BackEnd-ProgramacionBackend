import { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "../config/prisma.js";
import { Pedido } from "../entities/pedido.entity.js";
import { IPedidoRepository } from "./interfaces/pedido.repository.interface.js";

export class PedidoRepository implements IPedidoRepository {
  /**
   * Inyección de dependencia del cliente Prisma ORM
   */
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  /**
   * Operación CREATE: inserta un nuevo pedido usando prisma.pedido.create
   */
  public async crear(pedido: Pedido): Promise<Pedido> {
    const registro = await this.prisma.pedido.create({
      data: {
        usuarioId: pedido.usuarioId,
        total: pedido.total,
        estado: pedido.estado
      }
    });

    return new Pedido({
      id: registro.id,
      usuarioId: registro.usuarioId,
      total: registro.total,
      estado: registro.estado,
      creadoEn: registro.creadoEn.toISOString()
    });
  }

  /**
   * Operación READ (todos): recupera todos los pedidos usando prisma.pedido.findMany con inclusión de detalles
   */
  public async obtenerTodos(): Promise<Pedido[]> {
    const registros = await this.prisma.pedido.findMany({
      orderBy: { id: "asc" },
      include: { detalles: true }
    });

    return registros.map(
      (r) =>
        new Pedido({
          id: r.id,
          usuarioId: r.usuarioId,
          total: r.total,
          estado: r.estado,
          creadoEn: r.creadoEn.toISOString(),
          detalles: r.detalles.map((d) => ({
            id: d.id,
            pedidoId: d.pedidoId,
            productoId: d.productoId,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            subtotal: d.subtotal
          }))
        })
    );
  }

  /**
   * Operación READ (por ID): busca un pedido por su clave primaria con prisma.pedido.findUnique
   */
  public async obtenerPorId(id: number): Promise<Pedido | null> {
    const registro = await this.prisma.pedido.findUnique({
      where: { id },
      include: { detalles: true }
    });

    if (!registro) return null;

    return new Pedido({
      id: registro.id,
      usuarioId: registro.usuarioId,
      total: registro.total,
      estado: registro.estado,
      creadoEn: registro.creadoEn.toISOString(),
      detalles: registro.detalles.map((d) => ({
        id: d.id,
        pedidoId: d.pedidoId,
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal
      }))
    });
  }

  /**
   * Operación READ (por usuario): filtra pedidos por usuarioId usando prisma.pedido.findMany
   */
  public async obtenerPorUsuarioId(usuarioId: number): Promise<Pedido[]> {
    const registros = await this.prisma.pedido.findMany({
      where: { usuarioId },
      orderBy: { id: "desc" },
      include: { detalles: true }
    });

    return registros.map(
      (r) =>
        new Pedido({
          id: r.id,
          usuarioId: r.usuarioId,
          total: r.total,
          estado: r.estado,
          creadoEn: r.creadoEn.toISOString(),
          detalles: r.detalles.map((d) => ({
            id: d.id,
            pedidoId: d.pedidoId,
            productoId: d.productoId,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            subtotal: d.subtotal
          }))
        })
    );
  }

  /**
   * Operación UPDATE: actualiza el estado del pedido usando prisma.pedido.update
   */
  public async actualizarEstado(id: number, estado: string): Promise<Pedido | null> {
    const existente = await this.obtenerPorId(id);
    if (!existente) return null;

    const registro = await this.prisma.pedido.update({
      where: { id },
      data: { estado }
    });

    return new Pedido({
      id: registro.id,
      usuarioId: registro.usuarioId,
      total: registro.total,
      estado: registro.estado,
      creadoEn: registro.creadoEn.toISOString()
    });
  }

  /**
   * Operación DELETE: elimina un pedido usando prisma.pedido.delete
   */
  public async eliminar(id: number): Promise<boolean> {
    const existente = await this.obtenerPorId(id);
    if (!existente) return false;

    await this.prisma.pedido.delete({
      where: { id }
    });

    return true;
  }
}
