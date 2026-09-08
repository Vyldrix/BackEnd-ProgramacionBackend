import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.js";

describe("Documentación OpenAPI y Swagger UI (GET /api/docs)", () => {
  it("debe servir la interfaz de Swagger UI en /api/docs/", async () => {
    const res = await request(app).get("/api/docs/");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/html");
    expect(res.text).toContain("Swagger UI");
  });

  it("debe servir la especificación OpenAPI en formato JSON en /api/docs.json", async () => {
    const res = await request(app).get("/api/docs.json");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/json");

    const spec = res.body;
    expect(spec.openapi).toBe("3.2.0");
    expect(spec.info).toHaveProperty("title");
    expect(spec.info).toHaveProperty("version");
    expect(spec.info.title).toContain("API de Comercio");

    // Endpoint POST /api/pedidos
    expect(spec.paths).toHaveProperty("/api/pedidos");
    expect(spec.paths["/api/pedidos"]).toHaveProperty("post");

    const postPedidos = spec.paths["/api/pedidos"].post;
    expect(postPedidos.summary).toBeDefined();
    expect(postPedidos.requestBody).toBeDefined();

    // DTOs en requestBody
    const schemaRef =
      postPedidos.requestBody.content["application/json"].schema.$ref;
    expect(schemaRef).toBe("#/components/schemas/CrearPedidoDTO");

    // Respuestas 201, 400 y 422
    expect(postPedidos.responses).toHaveProperty("201");
    expect(postPedidos.responses).toHaveProperty("400");
    expect(postPedidos.responses).toHaveProperty("422");

    // Schemas en components
    expect(spec.components.schemas).toHaveProperty("CrearPedidoDTO");
    expect(spec.components.schemas).toHaveProperty("ProductoCompradoDTO");
    expect(spec.components.schemas).toHaveProperty("PedidoCreadoResponseDTO");
  });

  it("debe redirigir /docs a /api/docs", async () => {
    const res = await request(app).get("/docs");

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/api/docs");
  });
});
