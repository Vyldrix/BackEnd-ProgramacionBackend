import { Producto } from "../../entities/producto.entity.js";

export interface IProductoRepository {
  crear(producto: Producto): Promise<Producto>;
  obtenerTodos(): Promise<Producto[]>;
  obtenerPorId(id: number): Promise<Producto | null>;
  actualizar(
    id: number,
    datos: Partial<Omit<Producto, "id" | "creadoEn">>
  ): Promise<Producto | null>;
  eliminar(id: number): Promise<boolean>;
}
