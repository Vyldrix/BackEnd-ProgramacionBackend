import {
  ActualizarUsuarioDTO,
  CrearUsuarioDTO,
  UsuarioResponseDTO
} from "../dtos/usuario.dto.js";
import { Usuario } from "../entities/usuario.entity.js";
import { IUsuarioRepository } from "../repositories/interfaces/usuario.repository.interface.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError
} from "./errors/app.errors.js";

export class UsuarioService {
  constructor(private readonly usuarioRepo: IUsuarioRepository) {}

  public crearUsuario(dto: CrearUsuarioDTO): UsuarioResponseDTO {
    this.validarDatosUsuario(dto);

    const emailExistente = this.usuarioRepo.obtenerPorEmail(dto.email);
    if (emailExistente) {
      throw new ConflictError(`El email '${dto.email}' ya se encuentra registrado`);
    }

    const nuevoUsuario = new Usuario({
      nombre: dto.nombre.trim(),
      email: dto.email.trim().toLowerCase(),
      edad: dto.edad
    });

    const creado = this.usuarioRepo.crear(nuevoUsuario);
    return this.mapToResponse(creado);
  }

  public obtenerTodos(): UsuarioResponseDTO[] {
    const usuarios = this.usuarioRepo.obtenerTodos();
    return usuarios.map((u) => this.mapToResponse(u));
  }

  public obtenerPorId(id: number): UsuarioResponseDTO {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError("El ID de usuario debe ser un número entero positivo válido");
    }

    const usuario = this.usuarioRepo.obtenerPorId(id);
    if (!usuario) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }

    return this.mapToResponse(usuario);
  }

  public actualizarUsuario(
    id: number,
    dto: ActualizarUsuarioDTO
  ): UsuarioResponseDTO {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError("El ID de usuario debe ser un número entero positivo válido");
    }

    const existente = this.usuarioRepo.obtenerPorId(id);
    if (!existente) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }

    if (dto.nombre !== undefined && dto.nombre.trim().length === 0) {
      throw new BadRequestError("El nombre no puede estar vacío");
    }

    if (dto.edad !== undefined && (typeof dto.edad !== "number" || dto.edad < 0)) {
      throw new BadRequestError("La edad debe ser un número mayor o igual a 0");
    }

    if (dto.email !== undefined) {
      const emailFormateado = dto.email.trim().toLowerCase();
      this.validarEmail(emailFormateado);

      const otroConMismoEmail = this.usuarioRepo.obtenerPorEmail(emailFormateado);
      if (otroConMismoEmail && otroConMismoEmail.id !== id) {
        throw new ConflictError(`El email '${dto.email}' ya pertenece a otro usuario`);
      }
    }

    const actualizado = this.usuarioRepo.actualizar(id, {
      nombre: dto.nombre !== undefined ? dto.nombre.trim() : undefined,
      email: dto.email !== undefined ? dto.email.trim().toLowerCase() : undefined,
      edad: dto.edad
    });

    if (!actualizado) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }

    return this.mapToResponse(actualizado);
  }

  public eliminarUsuario(id: number): boolean {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError("El ID de usuario debe ser un número entero positivo válido");
    }

    const existente = this.usuarioRepo.obtenerPorId(id);
    if (!existente) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }

    return this.usuarioRepo.eliminar(id);
  }

  private validarDatosUsuario(dto: CrearUsuarioDTO): void {
    if (!dto.nombre || dto.nombre.trim().length === 0) {
      throw new BadRequestError("El nombre es un campo obligatorio");
    }
    if (!dto.email || dto.email.trim().length === 0) {
      throw new BadRequestError("El email es un campo obligatorio");
    }
    this.validarEmail(dto.email);

    if (dto.edad === undefined || typeof dto.edad !== "number" || dto.edad < 0) {
      throw new BadRequestError("La edad debe ser un número mayor o igual a 0");
    }
  }

  private validarEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new BadRequestError(`El formato de email '${email}' no es válido`);
    }
  }

  private mapToResponse(usuario: Usuario): UsuarioResponseDTO {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      edad: usuario.edad,
      creadoEn: usuario.creadoEn
    };
  }
}
