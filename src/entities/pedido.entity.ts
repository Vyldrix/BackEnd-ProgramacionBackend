import { IDetallePedido } from "./detalle-pedido.entity.js";

export interface IPedido {
  id: number;
  usuarioId: number;
  total: number;
  estado: string;
  creadoEn: string;
  detalles?: IDetallePedido[];
}

export class Pedido implements IPedido {
  public id: number;
  public usuarioId: number;
  public total: number;
  public estado: string;
  public creadoEn: string;
  public detalles?: IDetallePedido[];

  constructor(datos: {
    id?: number;
    usuarioId: number;
    total?: number;
    estado?: string;
    creadoEn?: string;
    detalles?: IDetallePedido[];
  }) {
    this.id = datos.id ?? 0;
    this.usuarioId = datos.usuarioId;
    this.total = datos.total ?? 0;
    this.estado = datos.estado ?? "PENDIENTE";
    this.creadoEn = datos.creadoEn ?? new Date().toISOString();
    this.detalles = datos.detalles;
  }
}
