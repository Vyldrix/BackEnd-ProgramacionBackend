import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../src/app.js";
import { getDatabase } from "../../src/config/database.js";

describe("API REST Usuario - Tests de Integración con SQLite", () => {
  beforeEach(() => {
    // Limpiar tabla usuarios antes de cada test para aislamiento
    const db = getDatabase();
    db.exec("DELETE FROM usuarios;");
    db.exec("DELETE FROM sqlite_sequence WHERE name='usuarios';");
  });

  describe("POST /api/usuarios (Crear Usuario)", () => {
    it("debe crear un usuario nuevo y retornar código 201", async () => {
      const payload = {
        nombre: "Lucas Silva",
        email: "lucas.silva@example.com",
        edad: 24
      };

      const res = await request(app).post("/api/usuarios").send(payload);

      expect(res.status).toBe(201);
      expect(res.body.estado).toBe("ok");
      expect(res.body.mensaje).toBe("Usuario creado exitosamente");
      expect(res.body.datos).toHaveProperty("id");
      expect(res.body.datos.nombre).toBe("Lucas Silva");
      expect(res.body.datos.email).toBe("lucas.silva@example.com");
      expect(res.body.datos.edad).toBe(24);
      expect(res.body.datos).toHaveProperty("creadoEn");
    });

    it("debe retornar código 400 si faltan campos obligatorios", async () => {
      const payload = {
        email: "sin.nombre@example.com",
        edad: 20
      };

      const res = await request(app).post("/api/usuarios").send(payload);

      expect(res.status).toBe(400);
      expect(res.body.estado).toBe("error");
      expect(res.body.mensaje).toContain("nombre");
    });

    it("debe retornar código 409 si el email ya está registrado", async () => {
      const payload = {
        nombre: "Primer Registro",
        email: "repetido@example.com",
        edad: 25
      };

      await request(app).post("/api/usuarios").send(payload);
      const res = await request(app).post("/api/usuarios").send(payload);

      expect(res.status).toBe(409);
      expect(res.body.estado).toBe("error");
      expect(res.body.mensaje).toContain("ya se encuentra registrado");
    });
  });

  describe("GET /api/usuarios (Listar Usuarios)", () => {
    it("debe retornar una lista vacía cuando no hay registros", async () => {
      const res = await request(app).get("/api/usuarios");

      expect(res.status).toBe(200);
      expect(res.body.estado).toBe("ok");
      expect(res.body.total).toBe(0);
      expect(res.body.datos).toEqual([]);
    });

    it("debe listar todos los usuarios creados", async () => {
      await request(app).post("/api/usuarios").send({
        nombre: "Usuario 1",
        email: "user1@example.com",
        edad: 20
      });
      await request(app).post("/api/usuarios").send({
        nombre: "Usuario 2",
        email: "user2@example.com",
        edad: 30
      });

      const res = await request(app).get("/api/usuarios");

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(2);
      expect(res.body.datos).toHaveLength(2);
      expect(res.body.datos[0].nombre).toBe("Usuario 1");
      expect(res.body.datos[1].nombre).toBe("Usuario 2");
    });
  });

  describe("GET /api/usuarios/:id (Buscar Usuario por ID)", () => {
    it("debe retornar el usuario correspondiente al ID", async () => {
      const creadoRes = await request(app).post("/api/usuarios").send({
        nombre: "Valeria Gómez",
        email: "valeria@example.com",
        edad: 27
      });
      const usuarioId = creadoRes.body.datos.id;

      const res = await request(app).get(`/api/usuarios/${usuarioId}`);

      expect(res.status).toBe(200);
      expect(res.body.estado).toBe("ok");
      expect(res.body.datos.id).toBe(usuarioId);
      expect(res.body.datos.nombre).toBe("Valeria Gómez");
    });

    it("debe retornar código 404 si el usuario no existe", async () => {
      const res = await request(app).get("/api/usuarios/999");

      expect(res.status).toBe(404);
      expect(res.body.estado).toBe("error");
      expect(res.body.mensaje).toContain("no encontrado");
    });

    it("debe retornar código 400 si el ID no es numérico", async () => {
      const res = await request(app).get("/api/usuarios/abc");

      expect(res.status).toBe(400);
      expect(res.body.estado).toBe("error");
    });
  });

  describe("PUT /api/usuarios/:id (Actualizar Usuario)", () => {
    it("debe actualizar los datos del usuario y retornar 200", async () => {
      const creadoRes = await request(app).post("/api/usuarios").send({
        nombre: "Nombre Original",
        email: "original@example.com",
        edad: 22
      });
      const usuarioId = creadoRes.body.datos.id;

      const res = await request(app)
        .put(`/api/usuarios/${usuarioId}`)
        .send({
          nombre: "Nombre Modificado",
          edad: 23
        });

      expect(res.status).toBe(200);
      expect(res.body.estado).toBe("ok");
      expect(res.body.datos.nombre).toBe("Nombre Modificado");
      expect(res.body.datos.edad).toBe(23);
      expect(res.body.datos.email).toBe("original@example.com");
    });

    it("debe retornar 404 si el usuario no existe", async () => {
      const res = await request(app).put("/api/usuarios/999").send({
        nombre: "Cualquiera"
      });

      expect(res.status).toBe(404);
      expect(res.body.estado).toBe("error");
    });
  });

  describe("DELETE /api/usuarios/:id (Eliminar Usuario)", () => {
    it("debe eliminar el usuario y retornar código 200", async () => {
      const creadoRes = await request(app).post("/api/usuarios").send({
        nombre: "Para Borrar",
        email: "borrar@example.com",
        edad: 33
      });
      const usuarioId = creadoRes.body.datos.id;

      const deleteRes = await request(app).delete(`/api/usuarios/${usuarioId}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.mensaje).toContain("eliminado");

      const getRes = await request(app).get(`/api/usuarios/${usuarioId}`);
      expect(getRes.status).toBe(404);
    });

    it("debe retornar 404 al intentar eliminar un usuario inexistente", async () => {
      const res = await request(app).delete("/api/usuarios/999");
      expect(res.status).toBe(404);
      expect(res.body.estado).toBe("error");
    });
  });
});
