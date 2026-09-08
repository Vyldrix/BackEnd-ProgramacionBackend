import { Producto } from "../../entities/producto.entity.js";
import { IProductoRepository } from "../interfaces/producto.repository.interface.js";

export class ProductoMockRepository implements IProductoRepository {
  private productos: Producto[] = [];
  private currentId: number = 1;

  constructor(initialData: Producto[] = []) {
    this.productos = initialData.map((p) => new Producto({ ...p }));
    if (this.productos.length > 0) {
      this.currentId = Math.max(...this.productos.map((p) => p.id)) + 1;
    }
  }

  public crear(producto: Producto): Producto {
    const nuevoProducto = new Producto({
      id: producto.id && producto.id > 0 ? producto.id : this.currentId++,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      creadoEn: producto.creadoEn
    });
    this.productos.push(nuevoProducto);
    return nuevoProducto;
  }

  public obtenerTodos(): Producto[] {
    return [...this.productos];
  }

  public obtenerPorId(id: number): Producto | null {
    const producto = this.productos.find((p) => p.id === id);
    return producto ? new Producto({ ...producto }) : null;
  }

  public actualizar(
    id: number,
    datos: Partial<Omit<Producto, "id" | "creadoEn">>
  ): Producto | null {
    const index = this.productos.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const actual = this.productos[index];
    const actualizado = new Producto({
      id: actual.id,
      nombre: datos.nombre ?? actual.nombre,
      descripcion: datos.descripcion ?? actual.descripcion,
      precio: datos.precio !== undefined ? datos.precio : actual.precio,
      stock: datos.stock !== undefined ? datos.stock : actual.stock,
      creadoEn: actual.creadoEn
    });

    this.productos[index] = actualizado;
    return actualizado;
  }

  public eliminar(id: number): boolean {
    const index = this.productos.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.productos.splice(index, 1);
    return true;
  }

  public reset(): void {
    this.productos = [];
    this.currentId = 1;
  }
}
