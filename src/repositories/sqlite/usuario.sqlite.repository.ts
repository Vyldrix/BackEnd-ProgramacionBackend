import { DatabaseSync } from "node:sqlite";
import { getDatabase } from "../../config/database.js";
import { Usuario } from "../../entities/usuario.entity.js";
import { IUsuarioRepository } from "../interfaces/usuario.repository.interface.js";

export class UsuarioSQLiteRepository implements IUsuarioRepository {
  private db: DatabaseSync;

  constructor(db?: DatabaseSync) {
    this.db = db ?? getDatabase();
  }

  public async crear(usuario: Usuario): Promise<Usuario> {
    const stmt = this.db.prepare(`
      INSERT INTO usuarios (nombre, email, edad, creadoEn)
      VALUES (?, ?, ?, ?)
    `);
    const resultado = stmt.run(
      usuario.nombre,
      usuario.email,
      usuario.edad,
      usuario.creadoEn
    );

    return new Usuario({
      id: Number(resultado.lastInsertRowid),
      nombre: usuario.nombre,
      email: usuario.email,
      edad: usuario.edad,
      creadoEn: usuario.creadoEn
    });
  }

  public async obtenerTodos(): Promise<Usuario[]> {
    const stmt = this.db.prepare(`
      SELECT id, nombre, email, edad, creadoEn FROM usuarios ORDER BY id ASC
    `);
    const filas = stmt.all() as unknown as Array<{
      id: number;
      nombre: string;
      email: string;
      edad: number;
      creadoEn: string;
    }>;

    return filas.map(
      (f) =>
        new Usuario({
          id: Number(f.id),
          nombre: f.nombre,
          email: f.email,
          edad: Number(f.edad),
          creadoEn: f.creadoEn
        })
    );
  }

  public async obtenerPorId(id: number): Promise<Usuario | null> {
    const stmt = this.db.prepare(`
      SELECT id, nombre, email, edad, creadoEn FROM usuarios WHERE id = ?
    `);
    const fila = stmt.get(id) as unknown as
      | {
          id: number;
          nombre: string;
          email: string;
          edad: number;
          creadoEn: string;
        }
      | undefined;

    if (!fila) return null;

    return new Usuario({
      id: Number(fila.id),
      nombre: fila.nombre,
      email: fila.email,
      edad: Number(fila.edad),
      creadoEn: fila.creadoEn
    });
  }

  public async obtenerPorEmail(email: string): Promise<Usuario | null> {
    const stmt = this.db.prepare(`
      SELECT id, nombre, email, edad, creadoEn FROM usuarios WHERE email = ?
    `);
    const fila = stmt.get(email) as unknown as
      | {
          id: number;
          nombre: string;
          email: string;
          edad: number;
          creadoEn: string;
        }
      | undefined;

    if (!fila) return null;

    return new Usuario({
      id: Number(fila.id),
      nombre: fila.nombre,
      email: fila.email,
      edad: Number(fila.edad),
      creadoEn: fila.creadoEn
    });
  }

  public async actualizar(
    id: number,
    datos: Partial<Omit<Usuario, "id" | "creadoEn">>
  ): Promise<Usuario | null> {
    const existente = await this.obtenerPorId(id);
    if (!existente) return null;

    const nombreActualizado = datos.nombre ?? existente.nombre;
    const emailActualizado = datos.email ?? existente.email;
    const edadActualizada = datos.edad ?? existente.edad;

    const stmt = this.db.prepare(`
      UPDATE usuarios
      SET nombre = ?, email = ?, edad = ?
      WHERE id = ?
    `);
    stmt.run(nombreActualizado, emailActualizado, edadActualizada, id);

    return new Usuario({
      id,
      nombre: nombreActualizado,
      email: emailActualizado,
      edad: edadActualizada,
      creadoEn: existente.creadoEn
    });
  }

  public async eliminar(id: number): Promise<boolean> {
    const stmt = this.db.prepare(`DELETE FROM usuarios WHERE id = ?`);
    const resultado = stmt.run(id);
    return Number(resultado.changes) > 0;
  }
}
