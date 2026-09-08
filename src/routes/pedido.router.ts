import { Router } from "express";
import { PedidoController } from "../controllers/pedido.controller.js";
import { PedidoService } from "../services/pedido.service.js";

export function createPedidoRouter(customService?: PedidoService): Router {
  const router = Router();
  const service = customService ?? new PedidoService();
  const controller = new PedidoController(service);

  // Endpoint principal: POST /api/pedidos
  router.post("/", controller.crear);

  // Endpoint alternativo / alias: POST /api/pedidos/checkout
  router.post("/checkout", controller.crear);

  // Endpoints de consulta
  router.get("/", controller.obtenerTodos);
  router.get("/:id", controller.obtenerPorId);

  return router;
}

export const pedidoRouter = createPedidoRouter();
