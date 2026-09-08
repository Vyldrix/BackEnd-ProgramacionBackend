import { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "../../config/prisma.js";
import { Producto } from "../../entities/producto.entity.js";
import { IProductoRepository } from "../interfaces/producto.repository.interface.js";

export class ProductoPrismaRepository implements IProductoRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient ?? defaultPrisma;
  }

  public async crear(producto: Producto): Promise<Producto> {
    const registro = await this.prisma.producto.create({
      data: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock
      }
    });

    return new Producto({
      id: registro.id,
      nombre: registro.nombre,
      descripcion: registro.descripcion,
      precio: registro.precio,
      stock: registro.stock,
      creadoEn: registro.creadoEn.toISOString()
    });
  }

  public async obtenerTodos(): Promise<Producto[]> {
    const registros = await this.prisma.producto.findMany({
      orderBy: { id: "asc" }
    });

    return registros.map(
      (r) =>
        new Producto({
          id: r.id,
          nombre: r.nombre,
          descripcion: r.descripcion,
          precio: r.precio,
          stock: r.stock,
          creadoEn: r.creadoEn.toISOString()
        })
    );
  }

  public async obtenerPorId(id: number): Promise<Producto | null> {
    const registro = await this.prisma.producto.findUnique({
      where: { id }
    });

    if (!registro) return null;

    return new Producto({
      id: registro.id,
      nombre: registro.nombre,
      descripcion: registro.descripcion,
      precio: registro.precio,
      stock: registro.stock,
      creadoEn: registro.creadoEn.toISOString()
    });
  }

  public async actualizar(
    id: number,
    datos: Partial<Omit<Producto, "id" | "creadoEn">>
  ): Promise<Producto | null> {
    const existente = await this.obtenerPorId(id);
    if (!existente) return null;

    const registro = await this.prisma.producto.update({
      where: { id },
      data: {
        ...(datos.nombre !== undefined && { nombre: datos.nombre }),
        ...(datos.descripcion !== undefined && { descripcion: datos.descripcion }),
        ...(datos.precio !== undefined && { precio: datos.precio }),
        ...(datos.stock !== undefined && { stock: datos.stock })
      }
    });

    return new Producto({
      id: registro.id,
      nombre: registro.nombre,
      descripcion: registro.descripcion,
      precio: registro.precio,
      stock: registro.stock,
      creadoEn: registro.creadoEn.toISOString()
    });
  }

  public async eliminar(id: number): Promise<boolean> {
    const existente = await this.obtenerPorId(id);
    if (!existente) return false;

    await this.prisma.producto.delete({
      where: { id }
    });

    return true;
  }
}
