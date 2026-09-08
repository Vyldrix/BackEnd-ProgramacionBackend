import { Router } from "express";
import { LegacyController } from "../controllers/legacy.controller.js";

const router = Router();
const controller = new LegacyController();

router.get("/salud", controller.salud);
router.get("/Hola", controller.hola);
router.get("/Adios", controller.adios);
router.post("/NarcisoPerez", controller.narcisoPerez);

export const legacyRouter = router;
