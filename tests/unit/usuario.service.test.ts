import { beforeEach, describe, expect, it } from "vitest";
import { Usuario } from "../../src/entities/usuario.entity.js";
import { UsuarioMockRepository } from "../../src/repositories/mock/usuario.mock.repository.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError
} from "../../src/services/errors/app.errors.js";
import { UsuarioService } from "../../src/services/usuario.service.js";

describe("UsuarioService (Pruebas Unitarias con Mock Repository)", () => {
  let mockRepo: UsuarioMockRepository;
  let service: UsuarioService;

  beforeEach(() => {
    mockRepo = new UsuarioMockRepository([
      new Usuario({
        id: 1,
        nombre: "Juan Pérez",
        email: "juan.perez@example.com",
        edad: 30,
        creadoEn: "2026-01-01T10:00:00.000Z"
      }),
      new Usuario({
        id: 2,
        nombre: "María Gómez",
        email: "maria.gomez@example.com",
        edad: 25,
        creadoEn: "2026-01-02T10:00:00.000Z"
      })
    ]);
    service = new UsuarioService(mockRepo);
  });

  describe("crearUsuario", () => {
    it("debe crear un usuario exitosamente con datos válidos", async () => {
      const dto = {
        nombre: "Carlos López",
        email: "carlos.lopez@example.com",
        edad: 28
      };

      const creado = await service.crearUsuario(dto);

      expect(creado).toHaveProperty("id");
      expect(creado.id).toBeGreaterThanOrEqual(1);
      expect(creado.nombre).toBe("Carlos López");
      expect(creado.email).toBe("carlos.lopez@example.com");
      expect(creado.edad).toBe(28);
      expect(creado).toHaveProperty("creadoEn");
    });

    it("debe lanzar ConflictError si el email ya existe", async () => {
      const dto = {
        nombre: "Juan Duplicado",
        email: "juan.perez@example.com",
        edad: 40
      };

      await expect(service.crearUsuario(dto)).rejects.toThrow(ConflictError);
      await expect(service.crearUsuario(dto)).rejects.toThrow(/ya se encuentra registrado/);
    });

    it("debe lanzar BadRequestError si el nombre está vacío", async () => {
      const dto = {
        nombre: "   ",
        email: "nuevo@example.com",
        edad: 20
      };

      await expect(service.crearUsuario(dto)).rejects.toThrow(BadRequestError);
      await expect(service.crearUsuario(dto)).rejects.toThrow(/nombre/);
    });

    it("debe lanzar BadRequestError si el formato de email es inválido", async () => {
      const dto = {
        nombre: "Ana",
        email: "email-invalido",
        edad: 22
      };

      await expect(service.crearUsuario(dto)).rejects.toThrow(BadRequestError);
      await expect(service.crearUsuario(dto)).rejects.toThrow(/email/);
    });

    it("debe lanzar BadRequestError si la edad es negativa", async () => {
      const dto = {
        nombre: "Pedro",
        email: "pedro@example.com",
        edad: -5
      };

      await expect(service.crearUsuario(dto)).rejects.toThrow(BadRequestError);
      await expect(service.crearUsuario(dto)).rejects.toThrow(/edad/);
    });
  });

  describe("obtenerTodos", () => {
    it("debe retornar la lista completa de usuarios", async () => {
      const lista = await service.obtenerTodos();

      expect(lista).toHaveLength(2);
      expect(lista[0].nombre).toBe("Juan Pérez");
      expect(lista[1].nombre).toBe("María Gómez");
    });

    it("debe retornar una lista vacía si no hay usuarios", async () => {
      mockRepo.reset();
      const lista = await service.obtenerTodos();

      expect(lista).toEqual([]);
    });
  });

  describe("obtenerPorId", () => {
    it("debe retornar el usuario correspondiente al ID indicado", async () => {
      const usuario = await service.obtenerPorId(1);

      expect(usuario).toBeDefined();
      expect(usuario.id).toBe(1);
      expect(usuario.nombre).toBe("Juan Pérez");
    });

    it("debe lanzar NotFoundError si el ID no existe", async () => {
      await expect(service.obtenerPorId(999)).rejects.toThrow(NotFoundError);
      await expect(service.obtenerPorId(999)).rejects.toThrow(/no encontrado/);
    });

    it("debe lanzar BadRequestError si el ID no es un número válido", async () => {
      await expect(service.obtenerPorId(-1)).rejects.toThrow(BadRequestError);
      await expect(service.obtenerPorId(NaN)).rejects.toThrow(BadRequestError);
    });
  });

  describe("actualizarUsuario", () => {
    it("debe actualizar los campos provistos exitosamente", async () => {
      const actual = await service.actualizarUsuario(1, {
        nombre: "Juan Carlos Pérez",
        edad: 31
      });

      expect(actual.nombre).toBe("Juan Carlos Pérez");
      expect(actual.edad).toBe(31);
      expect(actual.email).toBe("juan.perez@example.com");
    });

    it("debe lanzar NotFoundError si el usuario a actualizar no existe", async () => {
      await expect(
        service.actualizarUsuario(999, { nombre: "Inexistente" })
      ).rejects.toThrow(NotFoundError);
    });

    it("debe lanzar ConflictError si se intenta usar un email de otro usuario", async () => {
      await expect(
        service.actualizarUsuario(1, { email: "maria.gomez@example.com" })
      ).rejects.toThrow(ConflictError);
    });

    it("debe lanzar BadRequestError si el nombre actualizado está vacío", async () => {
      await expect(
        service.actualizarUsuario(1, { nombre: "  " })
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("eliminarUsuario", () => {
    it("debe eliminar el usuario correctamente si existe", async () => {
      const resultado = await service.eliminarUsuario(1);

      expect(resultado).toBe(true);
      await expect(service.obtenerPorId(1)).rejects.toThrow(NotFoundError);
      const todos = await service.obtenerTodos();
      expect(todos).toHaveLength(1);
    });

    it("debe lanzar NotFoundError si el usuario a eliminar no existe", async () => {
      await expect(service.eliminarUsuario(999)).rejects.toThrow(NotFoundError);
    });

    it("debe lanzar BadRequestError si el ID es inválido", async () => {
      await expect(service.eliminarUsuario(0)).rejects.toThrow(BadRequestError);
    });
  });
});
