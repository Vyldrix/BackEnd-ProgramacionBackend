import { beforeEach, describe, expect, it } from "vitest";
import { Producto } from "../../src/entities/producto.entity.js";
import { ProductoMockRepository } from "../../src/repositories/mock/producto.mock.repository.js";
import {
  BadRequestError,
  NotFoundError
} from "../../src/services/errors/app.errors.js";
import { ProductoService } from "../../src/services/producto.service.js";

describe("ProductoService (Pruebas Unitarias con Mock Repository)", () => {
  let mockRepo: ProductoMockRepository;
  let service: ProductoService;

  beforeEach(() => {
    mockRepo = new ProductoMockRepository([
      new Producto({
        id: 1,
        nombre: "Notebook Lenovo",
        descripcion: "Laptop 16GB RAM SSD 512GB",
        precio: 850.5,
        stock: 10,
        creadoEn: "2026-01-01T10:00:00.000Z"
      }),
      new Producto({
        id: 2,
        nombre: "Mouse Inalámbrico",
        descripcion: "Mouse ergonómico Bluetooth",
        precio: 25.0,
        stock: 50,
        creadoEn: "2026-01-02T10:00:00.000Z"
      })
    ]);
    service = new ProductoService(mockRepo);
  });

  describe("crearProducto", () => {
    it("debe crear un producto exitosamente con datos válidos", async () => {
      const dto = {
        nombre: "Teclado Mecánico",
        descripcion: "Switch Blue RGB",
        precio: 60.0,
        stock: 15
      };

      const creado = await service.crearProducto(dto);

      expect(creado).toHaveProperty("id");
      expect(creado.id).toBeGreaterThanOrEqual(1);
      expect(creado.nombre).toBe("Teclado Mecánico");
      expect(creado.descripcion).toBe("Switch Blue RGB");
      expect(creado.precio).toBe(60.0);
      expect(creado.stock).toBe(15);
      expect(creado).toHaveProperty("creadoEn");
    });

    it("debe lanzar BadRequestError si el nombre está vacío", async () => {
      const dto = {
        nombre: "",
        descripcion: "Descripción",
        precio: 10,
        stock: 5
      };

      await expect(service.crearProducto(dto)).rejects.toThrow(BadRequestError);
      await expect(service.crearProducto(dto)).rejects.toThrow(/nombre/);
    });

    it("debe lanzar BadRequestError si la descripción está vacía", async () => {
      const dto = {
        nombre: "Monitor",
        descripcion: "   ",
        precio: 150,
        stock: 5
      };

      await expect(service.crearProducto(dto)).rejects.toThrow(BadRequestError);
      await expect(service.crearProducto(dto)).rejects.toThrow(/descripción/);
    });

    it("debe lanzar BadRequestError si el precio es negativo", async () => {
      const dto = {
        nombre: "Auriculares",
        descripcion: "Cancelación de ruido",
        precio: -10,
        stock: 5
      };

      await expect(service.crearProducto(dto)).rejects.toThrow(BadRequestError);
      await expect(service.crearProducto(dto)).rejects.toThrow(/precio/);
    });

    it("debe lanzar BadRequestError si el stock es negativo o decimal", async () => {
      const dto = {
        nombre: "Cable USB",
        descripcion: "USB-C a USB-C",
        precio: 5,
        stock: 2.5
      };

      await expect(service.crearProducto(dto)).rejects.toThrow(BadRequestError);
      await expect(service.crearProducto(dto)).rejects.toThrow(/stock/);
    });
  });

  describe("obtenerTodos", () => {
    it("debe retornar todos los productos", async () => {
      const lista = await service.obtenerTodos();

      expect(lista).toHaveLength(2);
      expect(lista[0].nombre).toBe("Notebook Lenovo");
      expect(lista[1].nombre).toBe("Mouse Inalámbrico");
    });

    it("debe retornar lista vacía si no hay productos", async () => {
      mockRepo.reset();
      const lista = await service.obtenerTodos();

      expect(lista).toEqual([]);
    });
  });

  describe("obtenerPorId", () => {
    it("debe retornar el producto cuando existe el ID", async () => {
      const producto = await service.obtenerPorId(1);

      expect(producto).toBeDefined();
      expect(producto.id).toBe(1);
      expect(producto.nombre).toBe("Notebook Lenovo");
    });

    it("debe lanzar NotFoundError cuando el ID no existe", async () => {
      await expect(service.obtenerPorId(888)).rejects.toThrow(NotFoundError);
      await expect(service.obtenerPorId(888)).rejects.toThrow(/no encontrado/);
    });

    it("debe lanzar BadRequestError si el ID es inválido", async () => {
      await expect(service.obtenerPorId(0)).rejects.toThrow(BadRequestError);
      await expect(service.obtenerPorId(-3)).rejects.toThrow(BadRequestError);
    });
  });

  describe("actualizarProducto", () => {
    it("debe actualizar los datos correctamente", async () => {
      const actualizado = await service.actualizarProducto(1, {
        precio: 800.0,
        stock: 12
      });

      expect(actualizado.precio).toBe(800.0);
      expect(actualizado.stock).toBe(12);
      expect(actualizado.nombre).toBe("Notebook Lenovo");
    });

    it("debe lanzar NotFoundError si el producto no existe", async () => {
      await expect(
        service.actualizarProducto(999, { nombre: "Inexistente" })
      ).rejects.toThrow(NotFoundError);
    });

    it("debe lanzar BadRequestError si el precio actualizado es negativo", async () => {
      await expect(
        service.actualizarProducto(1, { precio: -20 })
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("eliminarProducto", () => {
    it("debe eliminar el producto correctamente", async () => {
      const resultado = await service.eliminarProducto(1);

      expect(resultado).toBe(true);
      await expect(service.obtenerPorId(1)).rejects.toThrow(NotFoundError);
      const todos = await service.obtenerTodos();
      expect(todos).toHaveLength(1);
    });

    it("debe lanzar NotFoundError al intentar eliminar producto inexistente", async () => {
      await expect(service.eliminarProducto(999)).rejects.toThrow(NotFoundError);
    });
  });
});
