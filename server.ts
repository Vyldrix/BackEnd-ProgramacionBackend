import { createServer } from "node:http";
import { app } from "./src/app.js";
import { getDatabase } from "./src/config/database.js";

const puerto = Number(process.env.PORT ?? 3000);

// Inicializar base de datos SQLite
getDatabase();

const servidor = createServer(app);

if (process.env.NODE_ENV !== "test") {
  servidor.listen(puerto, () => {
    console.log(`Servidor disponible en http://localhost:${puerto}`);
  });
}

export { app, servidor };
