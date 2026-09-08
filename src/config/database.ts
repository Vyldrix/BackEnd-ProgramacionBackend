import { DatabaseSync } from "node:sqlite";

let dbInstance: DatabaseSync | null = null;

export function getDatabase(dbPath?: string): DatabaseSync {
  if (!dbInstance || dbPath) {
    const databaseLocation = dbPath ?? (process.env.DATABASE_PATH ?? "database.sqlite");
    const db = new DatabaseSync(databaseLocation);
    initDatabaseSchema(db);
    if (!dbPath) {
      dbInstance = db;
    }
    return db;
  }
  return dbInstance;
}

export function initDatabaseSchema(db: DatabaseSync): void {
  // Crear tabla usuarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      edad INTEGER NOT NULL,
      creadoEn TEXT NOT NULL
    );
  `);

  // Crear tabla productos
  db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      precio REAL NOT NULL,
      stock INTEGER NOT NULL,
      creadoEn TEXT NOT NULL
    );
  `);
}

export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
