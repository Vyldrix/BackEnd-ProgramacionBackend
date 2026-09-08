import { Pedido } from "../../entities/pedido.entity.js";

export interface IPedidoRepository {
  crear(pedido: Pedido): Promise<Pedido>;
  obtenerTodos(): Promise<Pedido[]>;
  obtenerPorId(id: number): Promise<Pedido | null>;
  obtenerPorUsuarioId(usuarioId: number): Promise<Pedido[]>;
  actualizarEstado(id: number, estado: string): Promise<Pedido | null>;
  eliminar(id: number): Promise<boolean>;
}
