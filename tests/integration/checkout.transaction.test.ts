import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../src/app.js";
import { prisma } from "../../src/config/prisma.js";
import { InsufficientStockError } from "../../src/services/errors/app.errors.js";
import { PedidoService } from "../../src/services/pedido.service.js";

describe("Flujo de Checkout Transaccional con prisma.$transaction (ACID)", () => {
  let pedidoService: PedidoService;
  let usuarioId: number;
  let prod1Id: number;
  let prod2Id: number;

  beforeAll(async () => {
    pedidoService = new PedidoService(prisma);

    // Limpieza de datos en orden referencial
    await prisma.detallePedido.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.producto.deleteMany();
    await prisma.usuario.deleteMany();

    // Crear usuario de prueba
    const u = await prisma.usuario.create({
      data: {
        nombre: "Comprador Frecuente",
        email: "comprador@checkout.test",
        edad: 28
      }
    });
    usuarioId = u.id;

    // Crear productos de prueba
    const p1 = await prisma.producto.create({
      data: {
        nombre: "Mouse Gamer",
        descripcion: "Mouse 16000 DPI",
        precio: 50.0,
        stock: 10
      }
    });
    prod1Id = p1.id;

    const p2 = await prisma.producto.create({
      data: {
        nombre: "Pad Mouse XL",
        descripcion: "Pad de tela 90x40cm",
        precio: 20.0,
        stock: 5
      }
    });
    prod2Id = p2.id;
  });

  afterAll(async () => {
    await prisma.detallePedido.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.producto.deleteMany();
    await prisma.usuario.deleteMany();
  });

  describe("Escenario Exitoso (COMMIT)", () => {
    it("debe procesar el checkout, descontar stock, crear pedido y detalles", async () => {
      const dto = {
        usuarioId,
        items: [
          { productoId: prod1Id, cantidad: 2 }, // 2 * 50 = 100
          { productoId: prod2Id, cantidad: 3 }  // 3 * 20 = 60
        ]
      };

      const resultado = await pedidoService.procesarCheckout(dto);

      // Verificación de la respuesta
      expect(resultado).toBeDefined();
      expect(resultado.pedidoId).toBeGreaterThan(0);
      expect(resultado.usuarioId).toBe(usuarioId);
      expect(resultado.total).toBe(160.0);
      expect(resultado.estado).toBe("CONFIRMADO");
      expect(resultado.detalles).toHaveLength(2);

      // Verificación en PostgreSQL (descuento del inventario)
      const p1Actualizado = await prisma.producto.findUnique({ where: { id: prod1Id } });
      const p2Actualizado = await prisma.producto.findUnique({ where: { id: prod2Id } });

      expect(p1Actualizado?.stock).toBe(8); // 10 - 2 = 8
      expect(p2Actualizado?.stock).toBe(2); // 5 - 3 = 2

      // Verificación de detalles persistidos en PostgreSQL
      const detallesEnBD = await prisma.detallePedido.findMany({
        where: { pedidoId: resultado.pedidoId }
      });
      expect(detallesEnBD).toHaveLength(2);
    });
  });

  describe("Escenario Crítico de Validación y ROLLBACK", () => {
    it("debe lanzar InsufficientStockError y revertir cambios si el stock queda en negativo", async () => {
      // Tomamos el stock antes del intento
      const p1Antes = await prisma.producto.findUnique({ where: { id: prod1Id } });
      const p2Antes = await prisma.producto.findUnique({ where: { id: prod2Id } });
      const pedidosAntes = await prisma.pedido.count();
      const detallesAntes = await prisma.detallePedido.count();

      expect(p1Antes?.stock).toBe(8);
      expect(p2Antes?.stock).toBe(2);

      // Solicitamos 1 de prod1 (que hay 8) pero 10 de prod2 (donde solo hay 2)
      const dtoInvalido = {
        usuarioId,
        items: [
          { productoId: prod1Id, cantidad: 1 },
          { productoId: prod2Id, cantidad: 10 } // Supera stock disponible
        ]
      };

      // Debe arrojar la excepción de negocio
      await expect(pedidoService.procesarCheckout(dtoInvalido)).rejects.toThrow(
        InsufficientStockError
      );

      // Verificación de propiedades ACID (ROLLBACK en PostgreSQL)
      // 1. El stock de prod1 NO debe haberse modificado a pesar de haber sido procesado primero
      const p1Despues = await prisma.producto.findUnique({ where: { id: prod1Id } });
      const p2Despues = await prisma.producto.findUnique({ where: { id: prod2Id } });

      expect(p1Despues?.stock).toBe(p1Antes?.stock);
      expect(p2Despues?.stock).toBe(p2Antes?.stock);

      // 2. NO deben existir nuevos pedidos ni detalles huérfanos
      const pedidosDespues = await prisma.pedido.count();
      const detallesDespues = await prisma.detallePedido.count();

      expect(pedidosDespues).toBe(pedidosAntes);
      expect(detallesDespues).toBe(detallesAntes);
    });
  });

  describe("Endpoint HTTP POST /api/pedidos/checkout", () => {
    it("debe retornar 201 y procesar el checkout vía HTTP", async () => {
      const res = await request(app)
        .post("/api/pedidos/checkout")
        .send({
          usuarioId,
          items: [{ productoId: prod1Id, cantidad: 1 }]
        });

      expect(res.status).toBe(201);
      expect(res.body.estado).toBe("ok");
      expect(res.body.mensaje).toBe("Pedido procesado y creado exitosamente");
      expect(res.body.datos).toHaveProperty("pedidoId");
      expect(res.body.datos.total).toBe(50.0);
    });
  });

  describe("Endpoint HTTP POST /api/pedidos", () => {
    it("debe procesar el pedido con usuarioId y productosComprados retornando 201 Created", async () => {
      const res = await request(app)
        .post("/api/pedidos")
        .send({
          usuarioId,
          productosComprados: [{ productoId: prod1Id, cantidad: 1 }]
        });

      expect(res.status).toBe(201);
      expect(res.body.estado).toBe("ok");
      expect(res.body.mensaje).toBe("Pedido procesado y creado exitosamente");
      expect(res.body.datos).toHaveProperty("pedidoId");
      expect(res.body.datos.total).toBe(50.0);
      expect(res.body.datos.estado).toBe("CONFIRMADO");
    });

    it("debe retornar 400 Bad Request si la información está incompleta (falta usuarioId)", async () => {
      const res = await request(app)
        .post("/api/pedidos")
        .send({
          productosComprados: [{ productoId: prod1Id, cantidad: 1 }]
        });

      expect(res.status).toBe(400);
      expect(res.body.estado).toBe("error");
      expect(res.body.mensaje).toContain("usuarioId");
    });

    it("debe retornar 400 Bad Request si la información está incompleta (falta productosComprados)", async () => {
      const res = await request(app)
        .post("/api/pedidos")
        .send({
          usuarioId,
          productosComprados: []
        });

      expect(res.status).toBe(400);
      expect(res.body.estado).toBe("error");
      expect(res.body.mensaje).toContain("productosComprados");
    });

    it("debe retornar 400 Bad Request en caso de falta de stock", async () => {
      const res = await request(app)
        .post("/api/pedidos")
        .send({
          usuarioId,
          productosComprados: [{ productoId: prod1Id, cantidad: 9999 }]
        });

      expect(res.status).toBe(400);
      expect(res.body.estado).toBe("error");
      expect(res.body.mensaje).toContain("Stock insuficiente");
    });
  });
});
