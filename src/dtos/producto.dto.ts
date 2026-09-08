export interface CrearProductoDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export interface ActualizarProductoDTO {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
}

export interface ProductoResponseDTO {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  creadoEn: string;
}
