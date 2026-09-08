export interface IUsuario {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  creadoEn: string;
}

export class Usuario implements IUsuario {
  public id: number;
  public nombre: string;
  public email: string;
  public edad: number;
  public creadoEn: string;

  constructor(datos: {
    id?: number;
    nombre: string;
    email: string;
    edad: number;
    creadoEn?: string;
  }) {
    this.id = datos.id ?? 0;
    this.nombre = datos.nombre;
    this.email = datos.email;
    this.edad = datos.edad;
    this.creadoEn = datos.creadoEn ?? new Date().toISOString();
  }
}
