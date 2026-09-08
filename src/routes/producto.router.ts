import { Router } from "express";
import { ProductoController } from "../controllers/producto.controller.js";
import { IProductoRepository } from "../repositories/interfaces/producto.repository.interface.js";
import { ProductoRepository } from "../repositories/producto.repository.js";
import { ProductoSQLiteRepository } from "../repositories/sqlite/producto.sqlite.repository.js";
import { ProductoService } from "../services/producto.service.js";

export function getDefaultProductoRepository(): IProductoRepository {
  if (process.env.DB_DRIVER === "sqlite") {
    return new ProductoSQLiteRepository();
  }
  return new ProductoRepository();
}

export function createProductoRouter(customService?: ProductoService): Router {
  const router = Router();
  const repository = getDefaultProductoRepository();
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
