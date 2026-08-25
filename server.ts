import { createServer } from "node:http";

const puerto = Number(process.env.PORT ?? 3000);

const servidor = createServer((solicitud, respuesta) => {
    respuesta.setHeader(
        "Content-Type",
        "application/json; charset=utf-8"
    );

    // Endpoint 1: GET /salud
    if (solicitud.method === "GET" && solicitud.url === "/salud") {
        respuesta.writeHead(200);
        respuesta.end(
            JSON.stringify({
                estado: "ok",
                fecha: new Date().toISOString()
            })
        );
        return;
    }

    // Endpoint 2: GET /Hola
    if (solicitud.method === "GET" && solicitud.url === "/Hola") {
        respuesta.writeHead(200);
        respuesta.end(
            JSON.stringify({
                estado: "ok",
                mensaje: "Hola Lautaro"
            })
        );
        return;
    }
    // Endpoint 3: /Adios
    if (solicitud.method === "GET" && solicitud.url === "/Adios") {
        respuesta.writeHead(200);
        respuesta.end(
            JSON.stringify({
                estado: "ok",
                mensaje: "Adios Lautaro"
            })
        );
        return;
    }
    // Endpoint 4: POST /NarcisoPerez
    if (solicitud.method === "POST" && solicitud.url === "/NarcisoPerez") {
        respuesta.writeHead(201);
        respuesta.end(
            JSON.stringify({
                estado: "ok",
                mensaje: "Narciso Perez Creado con exito"
            })
        );
        return;
    }

    // 404 final si no coincide con ninguna ruta
    respuesta.writeHead(404);
    respuesta.end(
        JSON.stringify({
            error: "Recurso no encontrado"
        })
    );
});

if (process.env.NODE_ENV !== "test") {
    servidor.listen(puerto, () => {
        console.log(`Servidor disponible en http://localhost:${puerto}`);
    });
}

export { servidor };
