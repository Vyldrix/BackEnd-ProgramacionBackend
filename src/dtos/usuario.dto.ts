export interface CrearUsuarioDTO {
  nombre: string;
  email: string;
  edad: number;
}

export interface ActualizarUsuarioDTO {
  nombre?: string;
  email?: string;
  edad?: number;
}

export interface UsuarioResponseDTO {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  creadoEn: string;
}
