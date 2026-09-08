import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../src/app.js";
import { getDatabase } from "../../src/config/database.js";

describe("Pruebas BDD con Gherkin (Especificaciones .feature)", () => {
  beforeEach(() => {
    const db = getDatabase();
    db.exec("DELETE FROM usuarios; DELETE FROM productos;");
    db.exec("DELETE FROM sqlite_sequence WHERE name IN ('usuarios', 'productos');");
  });

  describe("Característica: Gestión de Usuarios (usuario_crud.feature)", () => {
    it("Escenario: Crear un usuario nuevo exitosamente", async () => {
      // Dado que el sistema no tiene un usuario con el email "martin.dev@example.com"
      const precheck = await request(app).get("/api/usuarios");
      expect(precheck.body.datos).toHaveLength(0);

      // Cuando envío una solicitud POST a "/api/usuarios" con los datos indicados
      const res = await request(app).post("/api/usuarios").send({
        nombre: "Martin Gomez",
        email: "martin.dev@example.com",
        edad: 29
      });

      // Entonces la respuesta debe tener el código de estado 201
      expect(res.status).toBe(201);
      // Y el cuerpo de la respuesta debe contener el estado "ok"
      expect(res.body.estado).toBe("ok");
      // Y el usuario debe tener un ID asignado
      expect(res.body.datos).toHaveProperty("id");
      expect(res.body.datos.id).toBeGreaterThan(0);
    });

    it("Escenario: Intentar registrar un usuario con email duplicado", async () => {
      // Dado que existe un usuario registrado con el email "martin.dev@example.com"
      await request(app).post("/api/usuarios").send({
        nombre: "Martin Original",
        email: "martin.dev@example.com",
        edad: 30
      });

      // Cuando envío una solicitud POST a "/api/usuarios" con el mismo email
      const res = await request(app).post("/api/usuarios").send({
        nombre: "Martin Clon",
        email: "martin.dev@example.com",
        edad: 35
      });

      // Entonces la respuesta debe tener el código de estado 409
      expect(res.status).toBe(409);
      // Y el cuerpo de la respuesta debe contener el estado "error"
      expect(res.body.estado).toBe("error");
    });

    it("Escenario: Consultar un usuario por su ID", async () => {
      // Dado que existe un usuario con nombre "Laura Paez", email "laura.paez@example.com" y edad 22
      const creado = await request(app).post("/api/usuarios").send({
        nombre: "Laura Paez",
        email: "laura.paez@example.com",
        edad: 22
      });
      const userId = creado.body.datos.id;

      // Cuando realizo una petición GET a "/api/usuarios/{id}" con el ID del usuario
      const res = await request(app).get(`/api/usuarios/${userId}`);

      // Entonces la respuesta debe tener el código de estado 200
      expect(res.status).toBe(200);
      // Y los datos del usuario deben tener el email "laura.paez@example.com"
      expect(res.body.datos.email).toBe("laura.paez@example.com");
      expect(res.body.datos.nombre).toBe("Laura Paez");
    });

    it("Escenario: Actualizar un usuario existente", async () => {
      // Dado que existe un usuario con nombre "Pedro Antes", email "pedro.antes@example.com" y edad 40
      const creado = await request(app).post("/api/usuarios").send({
        nombre: "Pedro Antes",
        email: "pedro.antes@example.com",
        edad: 40
      });
      const userId = creado.body.datos.id;

      // Cuando envío una solicitud PUT a "/api/usuarios/{id}" con los nuevos datos
      const res = await request(app).put(`/api/usuarios/${userId}`).send({
        nombre: "Pedro Despues",
        edad: 41
      });

      // Entonces la respuesta debe tener el código de estado 200
      expect(res.status).toBe(200);
      // Y los datos del usuario deben reflejar el nombre "Pedro Despues" y edad 41
      expect(res.body.datos.nombre).toBe("Pedro Despues");
      expect(res.body.datos.edad).toBe(41);
    });

    it("Escenario: Eliminar un usuario", async () => {
      // Dado que existe un usuario con nombre "Eliminar Me", email "eliminar.me@example.com" y edad 50
      const creado = await request(app).post("/api/usuarios").send({
        nombre: "Eliminar Me",
        email: "eliminar.me@example.com",
        edad: 50
      });
      const userId = creado.body.datos.id;

      // Cuando envío una solicitud DELETE a "/api/usuarios/{id}" con el ID del usuario
      const res = await request(app).delete(`/api/usuarios/${userId}`);

      // Entonces la respuesta debe tener el código de estado 200
      expect(res.status).toBe(200);

      // Y al consultar nuevamente por el ID se debe recibir el código de estado 404
      const consulta = await request(app).get(`/api/usuarios/${userId}`);
      expect(consulta.status).toBe(404);
    });
  });

  describe("Característica: Gestión de Productos (producto_crud.feature)", () => {
    it("Escenario: Registrar un nuevo producto exitosamente", async () => {
      // Dado que la base de datos está disponible (verificado por beforeEach)
      // Cuando envío una solicitud POST a "/api/productos"
      const res = await request(app).post("/api/productos").send({
        nombre: "Smartphone Galaxy S24",
        descripcion: "256GB 8GB RAM OLED",
        precio: 950.0,
        stock: 15
      });

      // Entonces la respuesta debe tener el código de estado 201
      expect(res.status).toBe(201);
      // Y el cuerpo de la respuesta debe contener el estado "ok"
      expect(res.body.estado).toBe("ok");
      // Y el producto debe tener un ID numérico asignado
      expect(res.body.datos).toHaveProperty("id");
      expect(res.body.datos.id).toBeGreaterThan(0);
    });

    it("Escenario: Validar rechazo de precio negativo al registrar producto", async () => {
      // Cuando envío una solicitud POST con precio negativo
      const res = await request(app).post("/api/productos").send({
        nombre: "Producto Invalido",
        descripcion: "Precio negativo",
        precio: -20.0,
        stock: 5
      });

      // Entonces la respuesta debe tener el código de estado 400
      expect(res.status).toBe(400);
      // Y el cuerpo de la respuesta debe contener el estado "error"
      expect(res.body.estado).toBe("error");
    });

    it("Escenario: Consultar un producto por su ID", async () => {
      // Dado que existe un producto
      const creado = await request(app).post("/api/productos").send({
        nombre: "Auriculares Bluetooth",
        descripcion: "Inalámbricos",
        precio: 49.99,
        stock: 20
      });
      const prodId = creado.body.datos.id;

      // Cuando realizo una petición GET por ID
      const res = await request(app).get(`/api/productos/${prodId}`);

      // Entonces la respuesta debe ser 200 y contener los datos del producto
      expect(res.status).toBe(200);
      expect(res.body.datos.nombre).toBe("Auriculares Bluetooth");
      expect(res.body.datos.precio).toBe(49.99);
    });

    it("Escenario: Actualizar precio y stock de un producto", async () => {
      // Dado que existe un producto
      const creado = await request(app).post("/api/productos").send({
        nombre: "Teclado Gamer",
        descripcion: "RGB Mecanico",
        precio: 70.0,
        stock: 10
      });
      const prodId = creado.body.datos.id;

      // Cuando envío una solicitud PUT
      const res = await request(app).put(`/api/productos/${prodId}`).send({
        precio: 65.0,
        stock: 25
      });

      // Entonces el producto debe reflejar los cambios
      expect(res.status).toBe(200);
      expect(res.body.datos.precio).toBe(65);
      expect(res.body.datos.stock).toBe(25);
    });

    it("Escenario: Eliminar un producto del inventario", async () => {
      // Dado que existe un producto
      const creado = await request(app).post("/api/productos").send({
        nombre: "Mouse Pad XL",
        descripcion: "Goma antideslizante",
        precio: 15.0,
        stock: 50
      });
      const prodId = creado.body.datos.id;

      // Cuando envío una solicitud DELETE
      const res = await request(app).delete(`/api/productos/${prodId}`);
      expect(res.status).toBe(200);

      // Y al consultar nuevamente por el ID del producto se debe recibir 404
      const consulta = await request(app).get(`/api/productos/${prodId}`);
      expect(consulta.status).toBe(404);
    });
  });
});
