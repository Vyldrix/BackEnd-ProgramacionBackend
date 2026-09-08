import { DetallePedido } from "../../entities/detalle-pedido.entity.js";

export interface IDetallePedidoRepository {
  crear(detalle: DetallePedido): Promise<DetallePedido>;
  obtenerPorPedidoId(pedidoId: number): Promise<DetallePedido[]>;
  obtenerPorId(id: number): Promise<DetallePedido | null>;
  eliminar(id: number): Promise<boolean>;
}
