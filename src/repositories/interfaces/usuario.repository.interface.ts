import { Usuario } from "../../entities/usuario.entity.js";

export interface IUsuarioRepository {
  crear(usuario: Usuario): Promise<Usuario>;
  obtenerTodos(): Promise<Usuario[]>;
  obtenerPorId(id: number): Promise<Usuario | null>;
  obtenerPorEmail(email: string): Promise<Usuario | null>;
  actualizar(
    id: number,
    datos: Partial<Omit<Usuario, "id" | "creadoEn">>
  ): Promise<Usuario | null>;
  eliminar(id: number): Promise<boolean>;
}
