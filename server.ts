import "dotenv/config";
import { createServer } from "node:http";
import { app } from "./src/app.js";
import { conectarPrisma, desconectarPrisma } from "./src/config/prisma.js";

const puerto = Number(process.env.PORT ?? 3000);

const servidor = createServer(app);

if (process.env.NODE_ENV !== "test") {
  servidor.listen(puerto, async () => {
    try {
      await conectarPrisma();
      console.log("Conectado exitosamente a PostgreSQL mediante Prisma ORM.");
    } catch (error) {
      console.warn("Advertencia: No se pudo conectar inmediatamente a PostgreSQL.", (error as Error).message);
      console.warn("Asegúrate de que PostgreSQL esté activo y las credenciales en .env sean correctas.");
    }
    console.log(`Servidor disponible en http://localhost:${puerto}`);
  });

  const cerrarServidor = async () => {
    console.log("\nCerrando servidor...");
    await desconectarPrisma();
    servidor.close(() => {
      console.log("Servidor cerrado.");
      process.exit(0);
    });
  };

  process.on("SIGINT", cerrarServidor);
  process.on("SIGTERM", cerrarServidor);
}

export { app, servidor };
