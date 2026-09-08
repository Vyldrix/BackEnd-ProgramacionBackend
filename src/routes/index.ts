import { Router } from "express";
import { legacyRouter } from "./legacy.router.js";
import { pedidoRouter } from "./pedido.router.js";
import { productoRouter } from "./producto.router.js";
import { usuarioRouter } from "./usuario.router.js";

const apiRouter = Router();

apiRouter.use("/usuarios", usuarioRouter);
apiRouter.use("/productos", productoRouter);
apiRouter.use("/pedidos", pedidoRouter);

const mainRouter = Router();

mainRouter.use("/api", apiRouter);
mainRouter.use("/", legacyRouter);

export { mainRouter };
