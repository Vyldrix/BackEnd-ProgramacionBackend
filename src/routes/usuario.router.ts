import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller.js";
import { UsuarioSQLiteRepository } from "../repositories/sqlite/usuario.sqlite.repository.js";
import { UsuarioService } from "../services/usuario.service.js";

export function createUsuarioRouter(customService?: UsuarioService): Router {
  const router = Router();
  const repository = new UsuarioSQLiteRepository();
  const service = customService ?? new UsuarioService(repository);
  const controller = new UsuarioController(service);

  router.post("/", controller.crear);
  router.get("/", controller.obtenerTodos);
  router.get("/:id", controller.obtenerPorId);
  router.put("/:id", controller.actualizar);
  router.delete("/:id", controller.eliminar);

  return router;
}

export const usuarioRouter = createUsuarioRouter();
