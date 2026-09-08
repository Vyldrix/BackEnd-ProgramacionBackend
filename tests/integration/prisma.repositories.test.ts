import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../../src/config/prisma.js";
import { Usuario } from "../../src/entities/usuario.entity.js";
import { Producto } from "../../src/entities/producto.entity.js";
import { Pedido } from "../../src/entities/pedido.entity.js";
import { DetallePedido } from "../../src/entities/detalle-pedido.entity.js";
import { UsuarioRepository } from "../../src/repositories/usuario.repository.js";
import { ProductoRepository } from "../../src/repositories/producto.repository.js";
import { PedidoRepository } from "../../src/repositories/pedido.repository.js";
import { DetallePedidoRepository } from "../../src/repositories/detalle-pedido.repository.js";

describe("Prisma Repositories - Operaciones CRUD con Cliente Prisma Inyectado", () => {
  let usuarioRepo: UsuarioRepository;
  let productoRepo: ProductoRepository;
  let pedidoRepo: PedidoRepository;
  let detalleRepo: DetallePedidoRepository;

  beforeAll(async () => {
    // Inyección explícita del cliente Prisma
    usuarioRepo = new UsuarioRepository(prisma);
    productoRepo = new ProductoRepository(prisma);
    pedidoRepo = new PedidoRepository(prisma);
    detalleRepo = new DetallePedidoRepository(prisma);

    // Limpieza de datos en orden para respetar claves foráneas
    await prisma.detallePedido.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.producto.deleteMany();
  });

  afterAll(async () => {
    await prisma.detallePedido.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.producto.deleteMany();
  });

  describe("UsuarioRepository con Prisma", () => {
    let usuarioCreado: Usuario;

    it("debe crear un usuario usando prisma.usuario.create", async () => {
      const nuevo = new Usuario({
        nombre: "Mariano Rajoy",
        email: "mariano.rajoy@example.com",
        edad: 68
      });

      usuarioCreado = await usuarioRepo.crear(nuevo);

      expect(usuarioCreado.id).toBeGreaterThan(0);
      expect(usuarioCreado.nombre).toBe("Mariano Rajoy");
      expect(usuarioCreado.email).toBe("mariano.rajoy@example.com");
      expect(usuarioCreado.edad).toBe(68);
    });

    it("debe obtener todos los usuarios usando prisma.usuario.findMany", async () => {
      const usuarios = await usuarioRepo.obtenerTodos();

      expect(usuarios.length).toBeGreaterThanOrEqual(1);
      expect(usuarios.some((u) => u.email === "mariano.rajoy@example.com")).toBe(true);
    });

    it("debe buscar por ID usando prisma.usuario.findUnique", async () => {
      const usuario = await usuarioRepo.obtenerPorId(usuarioCreado.id);

      expect(usuario).not.toBeNull();
      expect(usuario?.id).toBe(usuarioCreado.id);
    });

    it("debe actualizar un usuario usando prisma.usuario.update", async () => {
      const actualizado = await usuarioRepo.actualizar(usuarioCreado.id, {
        edad: 69
      });

      expect(actualizado?.edad).toBe(69);
    });
  });

  describe("ProductoRepository con Prisma", () => {
    let productoCreado: Producto;

    it("debe crear un producto usando prisma.producto.create", async () => {
      const nuevo = new Producto({
        nombre: "Monitor 4K OLED",
        descripcion: "Monitor 27 pulgadas HDR",
        precio: 599.99,
        stock: 8
      });

      productoCreado = await productoRepo.crear(nuevo);

      expect(productoCreado.id).toBeGreaterThan(0);
      expect(productoCreado.nombre).toBe("Monitor 4K OLED");
      expect(productoCreado.precio).toBe(599.99);
      expect(productoCreado.stock).toBe(8);
    });

    it("debe obtener todos los productos usando prisma.producto.findMany", async () => {
      const productos = await productoRepo.obtenerTodos();

      expect(productos.length).toBeGreaterThanOrEqual(1);
      expect(productos.some((p) => p.nombre === "Monitor 4K OLED")).toBe(true);
    });
  });

  describe("PedidoRepository y DetallePedidoRepository con Prisma y Relaciones", () => {
    it("debe crear un pedido asociado al usuario y registrar sus detalles", async () => {
      const usuarios = await usuarioRepo.obtenerTodos();
      const productos = await productoRepo.obtenerTodos();

      const usuarioId = usuarios[0].id;
      const productoId = productos[0].id;

      // Crear Pedido
      const pedido = await pedidoRepo.crear(
        new Pedido({
          usuarioId,
          total: 1199.98,
          estado: "CONFIRMADO"
        })
      );

      expect(pedido.id).toBeGreaterThan(0);
      expect(pedido.usuarioId).toBe(usuarioId);

      // Crear Detalle
      const detalle = await detalleRepo.crear(
        new DetallePedido({
          pedidoId: pedido.id,
          productoId,
          cantidad: 2,
          precioUnitario: 599.99,
          subtotal: 1199.98
        })
      );

      expect(detalle.id).toBeGreaterThan(0);
      expect(detalle.pedidoId).toBe(pedido.id);
      expect(detalle.productoId).toBe(productoId);

      // Consultar pedido con detalles incluidos
      const pedidoConsultado = await pedidoRepo.obtenerPorId(pedido.id);
      expect(pedidoConsultado).not.toBeNull();
      expect(pedidoConsultado?.detalles).toHaveLength(1);
      expect(pedidoConsultado?.detalles?.[0].cantidad).toBe(2);
    });
  });
});
