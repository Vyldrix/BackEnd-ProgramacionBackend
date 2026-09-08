import { Producto } from "../../entities/producto.entity.js";

export interface IProductoRepository {
  crear(producto: Producto): Producto;
  obtenerTodos(): Producto[];
  obtenerPorId(id: number): Producto | null;
  actualizar(id: number, datos: Partial<Omit<Producto, "id" | "creadoEn">>): Producto | null;
  eliminar(id: number): boolean;
}
