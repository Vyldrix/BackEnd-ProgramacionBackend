import { Usuario } from "../../entities/usuario.entity.js";
import { IUsuarioRepository } from "../interfaces/usuario.repository.interface.js";

export class UsuarioMockRepository implements IUsuarioRepository {
  private usuarios: Usuario[] = [];
  private currentId: number = 1;

  constructor(initialData: Usuario[] = []) {
    this.usuarios = initialData.map((u) => new Usuario({ ...u }));
    if (this.usuarios.length > 0) {
      this.currentId = Math.max(...this.usuarios.map((u) => u.id)) + 1;
    }
  }

  public crear(usuario: Usuario): Usuario {
    const nuevoUsuario = new Usuario({
      id: usuario.id && usuario.id > 0 ? usuario.id : this.currentId++,
      nombre: usuario.nombre,
      email: usuario.email,
      edad: usuario.edad,
      creadoEn: usuario.creadoEn
    });
    this.usuarios.push(nuevoUsuario);
    return nuevoUsuario;
  }

  public obtenerTodos(): Usuario[] {
    return [...this.usuarios];
  }

  public obtenerPorId(id: number): Usuario | null {
    const usuario = this.usuarios.find((u) => u.id === id);
    return usuario ? new Usuario({ ...usuario }) : null;
  }

  public obtenerPorEmail(email: string): Usuario | null {
    const usuario = this.usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return usuario ? new Usuario({ ...usuario }) : null;
  }

  public actualizar(
    id: number,
    datos: Partial<Omit<Usuario, "id" | "creadoEn">>
  ): Usuario | null {
    const index = this.usuarios.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const actual = this.usuarios[index];
    const actualizado = new Usuario({
      id: actual.id,
      nombre: datos.nombre ?? actual.nombre,
      email: datos.email ?? actual.email,
      edad: datos.edad ?? actual.edad,
      creadoEn: actual.creadoEn
    });

    this.usuarios[index] = actualizado;
    return actualizado;
  }

  public eliminar(id: number): boolean {
    const index = this.usuarios.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.usuarios.splice(index, 1);
    return true;
  }

  public reset(): void {
    this.usuarios = [];
    this.currentId = 1;
  }
}
