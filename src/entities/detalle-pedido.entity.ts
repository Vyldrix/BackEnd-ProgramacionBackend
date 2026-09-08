export interface IDetallePedido {
  id: number;
  pedidoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export class DetallePedido implements IDetallePedido {
  public id: number;
  public pedidoId: number;
  public productoId: number;
  public cantidad: number;
  public precioUnitario: number;
  public subtotal: number;

  constructor(datos: {
    id?: number;
    pedidoId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal?: number;
  }) {
    this.id = datos.id ?? 0;
    this.pedidoId = datos.pedidoId;
    this.productoId = datos.productoId;
    this.cantidad = datos.cantidad;
    this.precioUnitario = datos.precioUnitario;
    this.subtotal =
      datos.subtotal ??
      Number((datos.cantidad * datos.precioUnitario).toFixed(2));
  }
}
