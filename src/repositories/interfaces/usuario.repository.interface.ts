import { Usuario } from "../../entities/usuario.entity.js";

export interface IUsuarioRepository {
  crear(usuario: Usuario): Usuario;
  obtenerTodos(): Usuario[];
  obtenerPorId(id: number): Usuario | null;
  obtenerPorEmail(email: string): Usuario | null;
  actualizar(id: number, datos: Partial<Omit<Usuario, "id" | "creadoEn">>): Usuario | null;
  eliminar(id: number): boolean;
}
