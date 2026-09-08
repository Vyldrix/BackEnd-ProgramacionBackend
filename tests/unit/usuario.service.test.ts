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
    it("debe crear un usuario exitosamente con datos válidos", () => {
      const dto = {
        nombre: "Carlos López",
        email: "carlos.lopez@example.com",
        edad: 28
      };

      const creado = service.crearUsuario(dto);

      expect(creado).toHaveProperty("id");
      expect(creado.id).toBeGreaterThanOrEqual(1);
      expect(creado.nombre).toBe("Carlos López");
      expect(creado.email).toBe("carlos.lopez@example.com");
      expect(creado.edad).toBe(28);
      expect(creado).toHaveProperty("creadoEn");
    });

    it("debe lanzar ConflictError si el email ya existe", () => {
      const dto = {
        nombre: "Juan Duplicado",
        email: "juan.perez@example.com",
        edad: 40
      };

      expect(() => service.crearUsuario(dto)).toThrow(ConflictError);
      expect(() => service.crearUsuario(dto)).toThrow(/ya se encuentra registrado/);
    });

    it("debe lanzar BadRequestError si el nombre está vacío", () => {
      const dto = {
        nombre: "   ",
        email: "nuevo@example.com",
        edad: 20
      };

      expect(() => service.crearUsuario(dto)).toThrow(BadRequestError);
      expect(() => service.crearUsuario(dto)).toThrow(/nombre/);
    });

    it("debe lanzar BadRequestError si el formato de email es inválido", () => {
      const dto = {
        nombre: "Ana",
        email: "email-invalido",
        edad: 22
      };

      expect(() => service.crearUsuario(dto)).toThrow(BadRequestError);
      expect(() => service.crearUsuario(dto)).toThrow(/email/);
    });

    it("debe lanzar BadRequestError si la edad es negativa", () => {
      const dto = {
        nombre: "Pedro",
        email: "pedro@example.com",
        edad: -5
      };

      expect(() => service.crearUsuario(dto)).toThrow(BadRequestError);
      expect(() => service.crearUsuario(dto)).toThrow(/edad/);
    });
  });

  describe("obtenerTodos", () => {
    it("debe retornar la lista completa de usuarios", () => {
      const lista = service.obtenerTodos();

      expect(lista).toHaveLength(2);
      expect(lista[0].nombre).toBe("Juan Pérez");
      expect(lista[1].nombre).toBe("María Gómez");
    });

    it("debe retornar una lista vacía si no hay usuarios", () => {
      mockRepo.reset();
      const lista = service.obtenerTodos();

      expect(lista).toEqual([]);
    });
  });

  describe("obtenerPorId", () => {
    it("debe retornar el usuario correspondiente al ID indicado", () => {
      const usuario = service.obtenerPorId(1);

      expect(usuario).toBeDefined();
      expect(usuario.id).toBe(1);
      expect(usuario.nombre).toBe("Juan Pérez");
    });

    it("debe lanzar NotFoundError si el ID no existe", () => {
      expect(() => service.obtenerPorId(999)).toThrow(NotFoundError);
      expect(() => service.obtenerPorId(999)).toThrow(/no encontrado/);
    });

    it("debe lanzar BadRequestError si el ID no es un número válido", () => {
      expect(() => service.obtenerPorId(-1)).toThrow(BadRequestError);
      expect(() => service.obtenerPorId(NaN)).toThrow(BadRequestError);
    });
  });

  describe("actualizarUsuario", () => {
    it("debe actualizar los campos provistos exitosamente", () => {
      const actual = service.actualizarUsuario(1, {
        nombre: "Juan Carlos Pérez",
        edad: 31
      });

      expect(actual.nombre).toBe("Juan Carlos Pérez");
      expect(actual.edad).toBe(31);
      expect(actual.email).toBe("juan.perez@example.com");
    });

    it("debe lanzar NotFoundError si el usuario a actualizar no existe", () => {
      expect(() =>
        service.actualizarUsuario(999, { nombre: "Inexistente" })
      ).toThrow(NotFoundError);
    });

    it("debe lanzar ConflictError si se intenta usar un email de otro usuario", () => {
      expect(() =>
        service.actualizarUsuario(1, { email: "maria.gomez@example.com" })
      ).toThrow(ConflictError);
    });

    it("debe lanzar BadRequestError si el nombre actualizado está vacío", () => {
      expect(() =>
        service.actualizarUsuario(1, { nombre: "  " })
      ).toThrow(BadRequestError);
    });
  });

  describe("eliminarUsuario", () => {
    it("debe eliminar el usuario correctamente si existe", () => {
      const resultado = service.eliminarUsuario(1);

      expect(resultado).toBe(true);
      expect(() => service.obtenerPorId(1)).toThrow(NotFoundError);
      expect(service.obtenerTodos()).toHaveLength(1);
    });

    it("debe lanzar NotFoundError si el usuario a eliminar no existe", () => {
      expect(() => service.eliminarUsuario(999)).toThrow(NotFoundError);
    });

    it("debe lanzar BadRequestError si el ID es inválido", () => {
      expect(() => service.eliminarUsuario(0)).toThrow(BadRequestError);
    });
  });
});
