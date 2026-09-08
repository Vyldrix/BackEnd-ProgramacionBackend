import { Router } from "express";
import { ProductoController } from "../controllers/producto.controller.js";
import { ProductoSQLiteRepository } from "../repositories/sqlite/producto.sqlite.repository.js";
import { ProductoService } from "../services/producto.service.js";

export function createProductoRouter(customService?: ProductoService): Router {
  const router = Router();
  const repository = new ProductoSQLiteRepository();
  const service = customService ?? new ProductoService(repository);
  const controller = new ProductoController(service);

  router.post("/", controller.crear);
  router.get("/", controller.obtenerTodos);
  router.get("/:id", controller.obtenerPorId);
  router.put("/:id", controller.actualizar);
  router.delete("/:id", controller.eliminar);

  return router;
}

export const productoRouter = createProductoRouter();
