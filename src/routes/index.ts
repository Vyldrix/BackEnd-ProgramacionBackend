import { Router } from "express";
import { legacyRouter } from "./legacy.router.js";
import { productoRouter } from "./producto.router.js";
import { usuarioRouter } from "./usuario.router.js";

const apiRouter = Router();

apiRouter.use("/usuarios", usuarioRouter);
apiRouter.use("/productos", productoRouter);

const mainRouter = Router();

mainRouter.use("/api", apiRouter);
mainRouter.use("/", legacyRouter);

export { mainRouter };
