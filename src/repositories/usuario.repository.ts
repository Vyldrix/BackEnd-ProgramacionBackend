import { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "../config/prisma.js";
import { Usuario } from "../entities/usuario.entity.js";
import { IUsuarioRepository } from "./interfaces/usuario.repository.interface.js";

export class UsuarioRepository implements IUsuarioRepository {
  /**
   * Inyección de dependencia del cliente Prisma ORM
   */
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  /**
   * Operación CREATE: inserta un nuevo registro de usuario usando prisma.usuario.create
   */
  public async crear(usuario: Usuario): Promise<Usuario> {
    const registro = await this.prisma.usuario.create({
      data: {
        nombre: usuario.nombre,
        email: usuario.email.toLowerCase(),
        edad: usuario.edad
      }
    });

    return new Usuario({
      id: registro.id,
      nombre: registro.nombre,
      email: registro.email,
      edad: registro.edad,
      creadoEn: registro.creadoEn.toISOString()
    });
  }

  /**
   * Operación READ (todos): recupera los registros usando prisma.usuario.findMany
   */
  public async obtenerTodos(): Promise<Usuario[]> {
    const registros = await this.prisma.usuario.findMany({
      orderBy: { id: "asc" }
    });

    return registros.map(
      (r) =>
        new Usuario({
          id: r.id,
          nombre: r.nombre,
          email: r.email,
          edad: r.edad,
          creadoEn: r.creadoEn.toISOString()
        })
    );
  }

  /**
   * Operación READ (por ID): busca un registro usando prisma.usuario.findUnique
   */
  public async obtenerPorId(id: number): Promise<Usuario | null> {
    const registro = await this.prisma.usuario.findUnique({
      where: { id }
    });

    if (!registro) return null;

    return new Usuario({
      id: registro.id,
      nombre: registro.nombre,
      email: registro.email,
      edad: registro.edad,
      creadoEn: registro.creadoEn.toISOString()
    });
  }

  /**
   * Operación READ (por email único): busca un registro usando prisma.usuario.findUnique
   */
  public async obtenerPorEmail(email: string): Promise<Usuario | null> {
    const registro = await this.prisma.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!registro) return null;

    return new Usuario({
      id: registro.id,
      nombre: registro.nombre,
      email: registro.email,
      edad: registro.edad,
      creadoEn: registro.creadoEn.toISOString()
    });
  }

  /**
   * Operación UPDATE: actualiza los campos usando prisma.usuario.update
   */
  public async actualizar(
    id: number,
    datos: Partial<Omit<Usuario, "id" | "creadoEn">>
  ): Promise<Usuario | null> {
    const existente = await this.obtenerPorId(id);
    if (!existente) return null;

    const registro = await this.prisma.usuario.update({
      where: { id },
      data: {
        ...(datos.nombre !== undefined && { nombre: datos.nombre }),
        ...(datos.email !== undefined && { email: datos.email.toLowerCase() }),
        ...(datos.edad !== undefined && { edad: datos.edad })
      }
    });

    return new Usuario({
      id: registro.id,
      nombre: registro.nombre,
      email: registro.email,
      edad: registro.edad,
      creadoEn: registro.creadoEn.toISOString()
    });
  }

  /**
   * Operación DELETE: elimina el registro usando prisma.usuario.delete
   */
  public async eliminar(id: number): Promise<boolean> {
    const existente = await this.obtenerPorId(id);
    if (!existente) return false;

    await this.prisma.usuario.delete({
      where: { id }
    });

    return true;
  }
}
