import { DatabaseSync } from "node:sqlite";
import { getDatabase } from "../../config/database.js";
import { Producto } from "../../entities/producto.entity.js";
import { IProductoRepository } from "../interfaces/producto.repository.interface.js";

export class ProductoSQLiteRepository implements IProductoRepository {
  private db: DatabaseSync;

  constructor(db?: DatabaseSync) {
    this.db = db ?? getDatabase();
  }

  public async crear(producto: Producto): Promise<Producto> {
    const stmt = this.db.prepare(`
      INSERT INTO productos (nombre, descripcion, precio, stock, creadoEn)
      VALUES (?, ?, ?, ?, ?)
    `);
    const resultado = stmt.run(
      producto.nombre,
      producto.descripcion,
      producto.precio,
      producto.stock,
      producto.creadoEn
    );

    return new Producto({
      id: Number(resultado.lastInsertRowid),
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      creadoEn: producto.creadoEn
    });
  }

  public async obtenerTodos(): Promise<Producto[]> {
    const stmt = this.db.prepare(`
      SELECT id, nombre, descripcion, precio, stock, creadoEn FROM productos ORDER BY id ASC
    `);
    const filas = stmt.all() as unknown as Array<{
      id: number;
      nombre: string;
      descripcion: string;
      precio: number;
      stock: number;
      creadoEn: string;
    }>;

    return filas.map(
      (f) =>
        new Producto({
          id: Number(f.id),
          nombre: f.nombre,
          descripcion: f.descripcion,
          precio: Number(f.precio),
          stock: Number(f.stock),
          creadoEn: f.creadoEn
        })
    );
  }

  public async obtenerPorId(id: number): Promise<Producto | null> {
    const stmt = this.db.prepare(`
      SELECT id, nombre, descripcion, precio, stock, creadoEn FROM productos WHERE id = ?
    `);
    const fila = stmt.get(id) as unknown as
      | {
          id: number;
          nombre: string;
          descripcion: string;
          precio: number;
          stock: number;
          creadoEn: string;
        }
      | undefined;

    if (!fila) return null;

    return new Producto({
      id: Number(fila.id),
      nombre: fila.nombre,
      descripcion: fila.descripcion,
      precio: Number(fila.precio),
      stock: Number(fila.stock),
      creadoEn: fila.creadoEn
    });
  }

  public async actualizar(
    id: number,
    datos: Partial<Omit<Producto, "id" | "creadoEn">>
  ): Promise<Producto | null> {
    const existente = await this.obtenerPorId(id);
    if (!existente) return null;

    const nombreActualizado = datos.nombre ?? existente.nombre;
    const descripcionActualizada = datos.descripcion ?? existente.descripcion;
    const precioActualizado = datos.precio ?? existente.precio;
    const stockActualizado = datos.stock ?? existente.stock;

    const stmt = this.db.prepare(`
      UPDATE productos
      SET nombre = ?, descripcion = ?, precio = ?, stock = ?
      WHERE id = ?
    `);
    stmt.run(
      nombreActualizado,
      descripcionActualizada,
      precioActualizado,
      stockActualizado,
      id
    );

    return new Producto({
      id,
      nombre: nombreActualizado,
      descripcion: descripcionActualizada,
      precio: precioActualizado,
      stock: stockActualizado,
      creadoEn: existente.creadoEn
    });
  }

  public async eliminar(id: number): Promise<boolean> {
    const stmt = this.db.prepare(`DELETE FROM productos WHERE id = ?`);
    const resultado = stmt.run(id);
    return Number(resultado.changes) > 0;
  }
}
