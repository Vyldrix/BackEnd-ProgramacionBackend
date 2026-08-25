import { describe, it, expect } from "vitest";
import request from "supertest";
import { servidor } from "../server.js";

describe("Test Endpoints de la API", () => {
    it("GET /salud debe retornar estado 200 y el objeto con estado ok y fecha", async () => {
        const respuesta = await request(servidor).get("/salud");
        
        expect(respuesta.status).toBe(200);
        expect(respuesta.headers["content-type"]).toContain("application/json");
        expect(respuesta.body).toHaveProperty("estado", "ok");
        expect(respuesta.body).toHaveProperty("fecha");
        expect(new Date(respuesta.body.fecha).toString()).not.toBe("Invalid Date");
    });

    it("GET /Hola debe retornar estado 200 y el mensaje 'Hola Lautaro'", async () => {
        const respuesta = await request(servidor).get("/Hola");
        
        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toEqual({
            estado: "ok",
            mensaje: "Hola Lautaro"
        });
    });

    it("GET /Adios debe retornar estado 200 y el mensaje 'Adios Lautaro'", async () => {
        const respuesta = await request(servidor).get("/Adios");
        
        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toEqual({
            estado: "ok",
            mensaje: "Adios Lautaro"
        });
    });

    it("POST /NarcisoPerez debe retornar estado 201 y mensaje de éxito", async () => {
        const respuesta = await request(servidor).post("/NarcisoPerez");
        
        expect(respuesta.status).toBe(201);
        expect(respuesta.body).toEqual({
            estado: "ok",
            mensaje: "Narciso Perez Creado con exito"
        });
    });

    it("GET /ruta-inexistente debe retornar 404 y mensaje de error", async () => {
        const respuesta = await request(servidor).get("/ruta-inexistente");
        
        expect(respuesta.status).toBe(404);
        expect(respuesta.body).toEqual({
            error: "Recurso no encontrado"
        });
    });
});
