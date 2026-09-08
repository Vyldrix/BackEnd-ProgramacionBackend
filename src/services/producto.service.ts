import {
  ActualizarProductoDTO,
  CrearProductoDTO,
  ProductoResponseDTO
} from "../dtos/producto.dto.js";
import { Producto } from "../entities/producto.entity.js";
import { IProductoRepository } from "../repositories/interfaces/producto.repository.interface.js";
import {
  BadRequestError,
  NotFoundError
} from "./errors/app.errors.js";

export class ProductoService {
  constructor(private readonly productoRepo: IProductoRepository) {}

  public crearProducto(dto: CrearProductoDTO): ProductoResponseDTO {
    this.validarDatosProducto(dto);

    const nuevoProducto = new Producto({
      nombre: dto.nombre.trim(),
      descripcion: dto.descripcion.trim(),
      precio: dto.precio,
      stock: dto.stock
    });

    const creado = this.productoRepo.crear(nuevoProducto);
    return this.mapToResponse(creado);
  }

  public obtenerTodos(): ProductoResponseDTO[] {
    const productos = this.productoRepo.obtenerTodos();
    return productos.map((p) => this.mapToResponse(p));
  }

  public obtenerPorId(id: number): ProductoResponseDTO {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError("El ID de producto debe ser un número entero positivo válido");
    }

    const producto = this.productoRepo.obtenerPorId(id);
    if (!producto) {
      throw new NotFoundError(`Producto con ID ${id} no encontrado`);
    }

    return this.mapToResponse(producto);
  }

  public actualizarProducto(
    id: number,
    dto: ActualizarProductoDTO
  ): ProductoResponseDTO {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError("El ID de producto debe ser un número entero positivo válido");
    }

    const existente = this.productoRepo.obtenerPorId(id);
    if (!existente) {
      throw new NotFoundError(`Producto con ID ${id} no encontrado`);
    }

    if (dto.nombre !== undefined && dto.nombre.trim().length === 0) {
      throw new BadRequestError("El nombre del producto no puede estar vacío");
    }

    if (dto.descripcion !== undefined && dto.descripcion.trim().length === 0) {
      throw new BadRequestError("La descripción del producto no puede estar vacía");
    }

    if (dto.precio !== undefined && (typeof dto.precio !== "number" || dto.precio < 0)) {
      throw new BadRequestError("El precio debe ser un número mayor o igual a 0");
    }

    if (
      dto.stock !== undefined &&
      (typeof dto.stock !== "number" || dto.stock < 0 || !Number.isInteger(dto.stock))
    ) {
      throw new BadRequestError("El stock debe ser un número entero mayor o igual a 0");
    }

    const actualizado = this.productoRepo.actualizar(id, {
      nombre: dto.nombre !== undefined ? dto.nombre.trim() : undefined,
      descripcion: dto.descripcion !== undefined ? dto.descripcion.trim() : undefined,
      precio: dto.precio,
      stock: dto.stock
    });

    if (!actualizado) {
      throw new NotFoundError(`Producto con ID ${id} no encontrado`);
    }

    return this.mapToResponse(actualizado);
  }

  public eliminarProducto(id: number): boolean {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError("El ID de producto debe ser un número entero positivo válido");
    }

    const existente = this.productoRepo.obtenerPorId(id);
    if (!existente) {
      throw new NotFoundError(`Producto con ID ${id} no encontrado`);
    }

    return this.productoRepo.eliminar(id);
  }

  private validarDatosProducto(dto: CrearProductoDTO): void {
    if (!dto.nombre || dto.nombre.trim().length === 0) {
      throw new BadRequestError("El nombre del producto es un campo obligatorio");
    }
    if (!dto.descripcion || dto.descripcion.trim().length === 0) {
      throw new BadRequestError("La descripción del producto es un campo obligatorio");
    }
    if (dto.precio === undefined || typeof dto.precio !== "number" || dto.precio < 0) {
      throw new BadRequestError("El precio debe ser un número mayor o igual a 0");
    }
    if (
      dto.stock === undefined ||
      typeof dto.stock !== "number" ||
      dto.stock < 0 ||
      !Number.isInteger(dto.stock)
    ) {
      throw new BadRequestError("El stock debe ser un número entero mayor o igual a 0");
    }
  }

  private mapToResponse(producto: Producto): ProductoResponseDTO {
    return {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      creadoEn: producto.creadoEn
    };
  }
}
