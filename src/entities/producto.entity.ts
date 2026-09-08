export interface IProducto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  creadoEn: string;
}

export class Producto implements IProducto {
  public id: number;
  public nombre: string;
  public descripcion: string;
  public precio: number;
  public stock: number;
  public creadoEn: string;

  constructor(datos: {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    creadoEn?: string;
  }) {
    this.id = datos.id ?? 0;
    this.nombre = datos.nombre;
    this.descripcion = datos.descripcion;
    this.precio = datos.precio;
    this.stock = datos.stock;
    this.creadoEn = datos.creadoEn ?? new Date().toISOString();
  }
}
