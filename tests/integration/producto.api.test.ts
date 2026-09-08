import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../src/app.js";
import { getDatabase } from "../../src/config/database.js";

describe("API REST Producto - Tests de Integración con SQLite", () => {
  beforeEach(() => {
    // Limpiar tabla productos antes de cada test para aislamiento
    const db = getDatabase();
    db.exec("DELETE FROM productos;");
    db.exec("DELETE FROM sqlite_sequence WHERE name='productos';");
  });

  describe("POST /api/productos (Crear Producto)", () => {
    it("debe crear un producto nuevo y retornar código 201", async () => {
      const payload = {
        nombre: "Monitor 27 pulgadas",
        descripcion: "Panel IPS 144Hz 1ms",
        precio: 299.99,
        stock: 8
      };

      const res = await request(app).post("/api/productos").send(payload);

      expect(res.status).toBe(201);
      expect(res.body.estado).toBe("ok");
      expect(res.body.mensaje).toBe("Producto creado exitosamente");
      expect(res.body.datos).toHaveProperty("id");
      expect(res.body.datos.nombre).toBe("Monitor 27 pulgadas");
      expect(res.body.datos.precio).toBe(299.99);
      expect(res.body.datos.stock).toBe(8);
      expect(res.body.datos).toHaveProperty("creadoEn");
    });

    it("debe retornar código 400 si el precio es negativo", async () => {
      const payload = {
        nombre: "Monitor",
        descripcion: "Descripción",
        precio: -50,
        stock: 5
      };

      const res = await request(app).post("/api/productos").send(payload);

      expect(res.status).toBe(400);
      expect(res.body.estado).toBe("error");
      expect(res.body.mensaje).toContain("precio");
    });
  });

  describe("GET /api/productos (Listar Productos)", () => {
    it("debe retornar lista vacía si no hay productos", async () => {
      const res = await request(app).get("/api/productos");

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(0);
      expect(res.body.datos).toEqual([]);
    });

    it("debe retornar todos los productos existentes", async () => {
      await request(app).post("/api/productos").send({
        nombre: "Producto A",
        descripcion: "Desc A",
        precio: 100,
        stock: 10
      });
      await request(app).post("/api/productos").send({
        nombre: "Producto B",
        descripcion: "Desc B",
        precio: 200,
        stock: 20
      });

      const res = await request(app).get("/api/productos");

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(2);
      expect(res.body.datos).toHaveLength(2);
    });
  });

  describe("GET /api/productos/:id (Buscar Producto por ID)", () => {
    it("debe retornar el producto según su ID", async () => {
      const creadoRes = await request(app).post("/api/productos").send({
        nombre: "Silla Gamer",
        descripcion: "Ergonómica reclinable",
        precio: 180,
        stock: 4
      });
      const prodId = creadoRes.body.datos.id;

      const res = await request(app).get(`/api/productos/${prodId}`);

      expect(res.status).toBe(200);
      expect(res.body.estado).toBe("ok");
      expect(res.body.datos.id).toBe(prodId);
      expect(res.body.datos.nombre).toBe("Silla Gamer");
    });

    it("debe retornar 404 si el ID del producto no existe", async () => {
      const res = await request(app).get("/api/productos/9999");

      expect(res.status).toBe(404);
      expect(res.body.estado).toBe("error");
    });
  });

  describe("PUT /api/productos/:id (Actualizar Producto)", () => {
    it("debe actualizar el precio y el stock correctamente", async () => {
      const creadoRes = await request(app).post("/api/productos").send({
        nombre: "Webcam Full HD",
        descripcion: "1080p con micrófono",
        precio: 50,
        stock: 15
      });
      const prodId = creadoRes.body.datos.id;

      const res = await request(app)
        .put(`/api/productos/${prodId}`)
        .send({
          precio: 45,
          stock: 20
        });

      expect(res.status).toBe(200);
      expect(res.body.datos.precio).toBe(45);
      expect(res.body.datos.stock).toBe(20);
      expect(res.body.datos.nombre).toBe("Webcam Full HD");
    });

    it("debe retornar 404 si el producto a actualizar no existe", async () => {
      const res = await request(app).put("/api/productos/999").send({
        precio: 100
      });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/productos/:id (Eliminar Producto)", () => {
    it("debe eliminar el producto y verificar que ya no existe", async () => {
      const creadoRes = await request(app).post("/api/productos").send({
        nombre: "Gabinete ATX",
        descripcion: "Vidrio templado",
        precio: 75,
        stock: 3
      });
      const prodId = creadoRes.body.datos.id;

      const deleteRes = await request(app).delete(`/api/productos/${prodId}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.mensaje).toContain("eliminado");

      const getRes = await request(app).get(`/api/productos/${prodId}`);
      expect(getRes.status).toBe(404);
    });
  });
});
