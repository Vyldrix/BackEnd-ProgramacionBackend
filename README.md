> **Programación Backend**  
> Esta actividad es la creación de un backend completo para la materia de Programación Backend.

---

# Ejercicio N°1 - Programación Backend

Proyecto desarrollado en **Node.js** con **TypeScript**, aplicando la metodología **TDD (Test-Driven Development)** para el diseño e implementación de una API HTTP nativa.

---

## 📋 Descripción de la Actividad

El objetivo de la actividad consistió en la creación, prueba y verificación de los endpoints de la API siguiendo las fases del ciclo TDD:

1. **Fase 1: Diseño inicial de pruebas (TDD - Red to Green)**
   - Se configuró el entorno de testing utilizando **Vitest** y **Supertest**.
   - Siguiendo la filosofía TDD, se diseñó primero la suite de pruebas en `tests/testendpoints.test.ts` definiendo el comportamiento esperado para las rutas `GET /salud`, `GET /Hola` y `GET /Adios`, así como el manejo de rutas no encontradas (404).
   - Posteriormente, se escribió el código mínimo y necesario en `server.ts` para que cada uno de los tests pasara satisfactoriamente.

2. **Fase 2: Incorporación del método POST**
   - Se escribió un nuevo caso de prueba en el archivo de tests para la ruta `POST /NarcisoPerez`, esperando un código de estado `201 Created` y una respuesta JSON confirmando la creación (`"Narciso Perez Creado con exito"`).
   - Se implementó la lógica correspondiente en `server.ts` para cumplir con las especificaciones del test.

3. **Fase 3: Ejecución de Tests Automatizados**
   - Se ejecutaron los tests con Vitest, logrando una cobertura completa donde el 100% de las pruebas (5/5) pasaron con éxito:
     - `GET /salud` -> 200 OK + objeto de estado y fecha ISO.
     - `GET /Hola` -> 200 OK + mensaje de saludo.
     - `GET /Adios` -> 200 OK + mensaje de despedida.
     - `POST /NarcisoPerez` -> 201 Created + mensaje de confirmación.
     - `GET /ruta-inexistente` -> 404 Not Found.

4. **Fase 4: Verificación manual con Bruno**
   - Una vez validados todos los tests automatizados, se levantó el servidor en local y se probaron individualmente cada una de las peticiones mediante el cliente HTTP **Bruno**, utilizando la colección ubicada en el directorio `EjerciciosBackend/`.
   - Se comprobó en tiempo real la respuesta de cabeceras, códigos de estado y contenido JSON para cada ruta.

<img width="1114" height="306" alt="get hola" src="https://github.com/user-attachments/assets/8eea5485-844c-49fe-8237-d31ab7aae436" />
<img width="1115" height="310" alt="get adios" src="https://github.com/user-attachments/assets/be58e66d-262d-40f5-b819-06b619ad3b84" />
<img width="1114" height="318" alt="post goutsiso" src="https://github.com/user-attachments/assets/70ceac7b-4e84-4651-84a2-6bc7fcb0cb45" />

5. **Fase 5: Inspección de tráfico y verificación en Wireshark**
   - Se realizó una captura de paquetes sobre la interfaz loopback (`localhost` / `127.0.0.1` en el puerto `3000`) utilizando **Wireshark**.
   - Se inspeccionó el flujo de red a bajo nivel para cada acción y método (`GET`, `POST`), verificando la correcta transmisión del protocolo HTTP, las cabeceras (`Content-Type: application/json; charset=utf-8`), los payloads JSON y los códigos de estado (`200 OK`, `201 Created`, `404 Not Found`).

<img width="970" height="200" alt="writeshark" src="https://github.com/user-attachments/assets/40c51dcb-1c2a-4983-9523-41486b2bfb5d" />

---

## 🛠️ Tecnologías Utilizadas

- **Entorno de ejecución**: Node.js
- **Lenguaje**: TypeScript
- **Testing**: Vitest + Supertest
- **Cliente API**: Bruno (colecciones en `EjerciciosBackend/`)
- **Análisis de Red**: Wireshark (inspección de paquetes en la interfaz loopback / localhost)
- **Ejecución y tipado**: `tsx`, `typescript`

---

# 📌 Ejercicio N°2 - Reestructuración por Capas, SQLite, CRUD, Mocks y Gherkin

En esta segunda etapa, se evolucionó la aplicación implementando una **Arquitectura por Capas** estricta según el Punto 7, incorporando dos nuevas entidades de dominio, base de datos persistente en **SQLite**, pruebas unitarias con datos **Mock** y pruebas **BDD con Gherkin**.

---

## 🏛️ 1. Arquitectura por Capas (Punto 7)

El backend divide sus responsabilidades en componentes desacoplados:

| Componente     | Responsabilidad                                                                       | Ubicación en el Código |
| :------------- | :------------------------------------------------------------------------------------ | :--------------------- |
| **Router**     | Relacionar métodos y rutas HTTP con sus controladores correspondientes.               | `src/routes/`          |
| **Controller** | Traducir peticiones HTTP a llamadas de aplicación y construir respuestas tipadas.     | `src/controllers/`     |
| **Service**    | Aplicar reglas de negocio, validaciones y coordinar operaciones.                      | `src/services/`        |
| **Repository** | Abstraer el acceso a la fuente de datos (consultas SQLite e interfaces desacopladas). | `src/repositories/`    |
| **Entity**     | Representar los conceptos centrales del dominio de la aplicación.                     | `src/entities/`        |
| **DTO**        | Definir las estructuras y contratos de datos de entrada y salida.                     | `src/dtos/`            |
| **Middleware** | Ejecutar comportamientos transversales (manejo centralizado de errores, logs, 404).   | `src/middlewares/`     |

---

## 📦 2. Nuevas Entidades del Dominio y Endpoints CRUD

Se incorporaron dos entidades completas con soporte de operaciones CRUD y búsqueda por ID:

### A. Entidad `Usuario` (`src/entities/usuario.entity.ts`)

- **Campos**: `id` (autoincremental), `nombre`, `email` (único), `edad`, `creadoEn`.
- **Endpoints**:
  - `POST /api/usuarios`: Crear usuario (valida formato y unicidad de email).
  - `GET /api/usuarios`: Listar todos los usuarios.
  - `GET /api/usuarios/:id`: **Búsqueda por ID**.
  - `PUT /api/usuarios/:id`: Actualizar datos de un usuario.
  - `DELETE /api/usuarios/:id`: Eliminar usuario.

### B. Entidad `Producto` (`src/entities/producto.entity.ts`)

- **Campos**: `id` (autoincremental), `nombre`, `descripcion`, `precio` (>= 0), `stock` (>= 0), `creadoEn`.
- **Endpoints**:
  - `POST /api/productos`: Crear producto en catálogo.
  - `GET /api/productos`: Listar productos disponibles.
  - `GET /api/productos/:id`: **Búsqueda por ID**.
  - `PUT /api/productos/:id`: Actualizar precio, stock o datos del producto.
  - `DELETE /api/productos/:id`: Eliminar producto.

---

## 🗄️ 3. Motor de Base de Datos (SQLite)

- Persistencia gestionada mediante el motor nativo **SQLite** de Node.js (`node:sqlite` con `DatabaseSync`).
- Inicialización automática de esquemas en `src/config/database.ts` al arrancar el servidor.
- Configurado en archivo local `.env` (`DATABASE_PATH=database.sqlite`).

---

## 🧪 4. Pruebas Automatizadas y BDD con Gherkin

La suite de pruebas contiene **68 tests** automatizados con cobertura completa:

1. **Pruebas Unitarias con Mocks (`tests/unit/`)**:
   - `usuario.service.test.ts`: Pruebas de lógica de negocio usando `UsuarioMockRepository`.
   - `producto.service.test.ts`: Pruebas de validaciones usando `ProductoMockRepository`.
2. **Pruebas de Integración con SQLite (`tests/integration/`)**:
   - `usuario.api.test.ts`: Validación de endpoints HTTP reales contra SQLite.
   - `producto.api.test.ts`: Validación de endpoints HTTP reales contra SQLite.
   - `testendpoints.test.ts`: Mantenimiento de compatibilidad con las rutas del Ejercicio N°1.
3. **Pruebas BDD con Gherkin (`tests/features/`)**:
   - `usuario_crud.feature`: Especificaciones en sintaxis Gherkin en español (_Dado_, _Cuando_, _Entonces_, _Y_).
   - `producto_crud.feature`: Escenarios BDD para el catálogo de productos.
   - `gherkin.test.ts`: Ejecutor automatizado de los pasos BDD.

---

## 📊 Comandos de Ejecución y Testing

| Comando                    | Descripción                                                      |
| :------------------------- | :--------------------------------------------------------------- |
| `npm test`                 | Ejecuta la **suite completa** de pruebas (68 tests).             |
| `npm run test:gherkin`     | Ejecuta únicamente las pruebas **BDD con Gherkin**.              |
| `npm run test:unit`        | Ejecuta las pruebas unitarias con repositorios **Mock**.         |
| `npm run test:integration` | Ejecuta las pruebas de integración con base de datos **SQLite**. |
| `npm run test:watch`       | Ejecuta las pruebas en modo observador en tiempo real.           |
| `npm run dev`              | Inicia el servidor en modo desarrollo (`http://localhost:3000`). |

---

## 📁 Estructura del Proyecto (Ejercicio N°2)

```text
.
├── EjerciciosBackend/                 # Colección de peticiones para Bruno
│   ├── opencollection.yml
│   ├── Salud.yml
│   ├── Hola.yml
│   ├── Adios.yml
│   ├── NarcisoPerez.yml
│   ├── Usuarios/                      # Peticiones Bruno para Usuarios
│   │   ├── CrearUsuario.yml
│   │   ├── ObtenerUsuarios.yml
│   │   ├── ObtenerUsuarioPorId.yml
│   │   ├── ActualizarUsuario.yml
│   │   └── EliminarUsuario.yml
│   └── Productos/                     # Peticiones Bruno para Productos
│       ├── CrearProducto.yml
│       ├── ObtenerProductos.yml
│       ├── ObtenerProductoPorId.yml
│       ├── ActualizarProducto.yml
│       └── EliminarProducto.yml
├── src/
│   ├── app.ts                         # Configuración central de Express y ensamble de capas
│   ├── config/
│   │   └── database.ts                # Conexión y creación de tablas en SQLite
│   ├── controllers/                   # Controladores HTTP
│   │   ├── legacy.controller.ts
│   │   ├── producto.controller.ts
│   │   └── usuario.controller.ts
│   ├── dtos/                          # Objetos de Transferencia de Datos
│   │   ├── producto.dto.ts
│   │   └── usuario.dto.ts
│   ├── entities/                      # Entidades del Dominio
│   │   ├── producto.entity.ts
│   │   └── usuario.entity.ts
│   ├── middlewares/                   # Comportamientos transversales
│   │   ├── error.middleware.ts        # Manejo global y centralizado de errores
│   │   ├── logger.middleware.ts       # Registro de peticiones
│   │   └── notfound.middleware.ts     # Manejador 404
│   ├── repositories/                  # Capa de acceso a datos
│   │   ├── interfaces/
│   │   │   ├── producto.repository.interface.ts
│   │   │   └── usuario.repository.interface.ts
│   │   ├── mock/                      # Repositorios Mock para tests unitarios
│   │   │   ├── producto.mock.repository.ts
│   │   │   └── usuario.mock.repository.ts
│   │   └── sqlite/                    # Implementación de persistencia en SQLite
│   │       ├── producto.sqlite.repository.ts
│   │       └── usuario.sqlite.repository.ts
│   ├── routes/                        # Enrutadores HTTP
│   │   ├── index.ts
│   │   ├── legacy.router.ts
│   │   ├── producto.router.ts
│   │   └── usuario.router.ts
│   └── services/                      # Lógica de negocio
│       ├── errors/                    # Errores de dominio (NotFound, BadRequest, Conflict)
│       │   └── app.errors.ts
│       ├── producto.service.ts
│       └── usuario.service.ts
├── tests/
│   ├── features/                      # Especificaciones BDD Gherkin (.feature y runner)
│   │   ├── gherkin.test.ts
│   │   ├── producto_crud.feature
│   │   └── usuario_crud.feature
│   ├── integration/                   # Tests de integración contra SQLite
│   │   ├── producto.api.test.ts
│   │   └── usuario.api.test.ts
│   ├── unit/                          # Tests unitarios con datos Mock
│   │   ├── producto.service.test.ts
│   │   └── usuario.service.test.ts
│   └── testendpoints.test.ts          # Tests de rutas de la Actividad 1
├── .env.example                       # Plantilla de variables de entorno
├── .gitignore                         # Exclusiones de Git (SQLite, node_modules, .env, logs)
├── package.json                       # Scripts y dependencias
├── server.ts                          # Punto de entrada y arranque del servidor HTTP
├── tsconfig.json                      # Configuración de compilación TypeScript
├── vitest.config.ts                   # Configuración del ejecutor de pruebas Vitest
└── README.md                          # Documentación del proyecto
```

---

## 📸 Capturas de Pruebas (Ejercicio N°2)

> Espacio reservado para adjuntar las capturas de pantalla de la ejecución de pruebas y verificación en clientes HTTP para el Ejercicio N°2.

### 1. Ejecución de la Suite Completa de Pruebas (`npm test`)

<!-- Adjunta aquí la captura de la terminal corriendo npm test -->

_(Adjuntar captura aquí)_

---

### 2. Ejecución de Pruebas BDD con Gherkin (`npm run test:gherkin`)

<!-- Adjunta aquí la captura de la terminal corriendo npm run test:gherkin -->

_(Adjuntar captura aquí)_

---
