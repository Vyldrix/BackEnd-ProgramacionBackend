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

# Ejercicio N°2 - Reestructuración por Capas, SQLite, CRUD, Mocks y Gherkin

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

<img width="700" height="264" alt="npmtests" src="https://github.com/user-attachments/assets/176d9baf-c6e6-4a1f-b9df-ad253f3d0b29" />

---

### 2. Ejecución de Pruebas BDD con Gherkin (`npm run test:gherkin`)

<!-- Adjunta aquí la captura de la terminal corriendo npm run test:gherkin -->

<img width="701" height="400" alt="writeshar" src="https://github.com/user-attachments/assets/de32c056-4f08-4c07-baaa-7600c1af14ee" />

---

# Ejercicio N°3 - PostgreSQL, Prisma ORM, Checkout Transaccional (ACID) y OpenAPI / Swagger UI

En esta tercera etapa del proyecto, se evolucionó la arquitectura de persistencia reemplazando el almacenamiento local por el motor de base de datos relacional **PostgreSQL**, gestionado de forma orientada a objetos mediante **Prisma ORM**. Se modelaron las relaciones de negocio Uno a Muchos (1:N), se implementó un flujo de **Checkout Transaccional** con cumplimiento estricto de las propiedades **ACID** (con validación de stock y soporte de **Rollback** automático), se completó la capa del controlador con el endpoint `POST /api/pedidos`, y se documentó la API declarativamente bajo el estándar **OpenAPI 3.2.0** con interfaz interactiva **Swagger UI**.

---

## 🗄️ 1. Configuración de PostgreSQL y Gestión de Entorno

- **Variables de Entorno Seguras**: Gestión integral de credenciales en archivo `.env` (`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`), componiendo la cadena de conexión estándar para Prisma:
  ```env
  DATABASE_URL="postgresql://postgres:postre.sql@localhost:5432/ejercicio_backend?schema=public"
  ```
- **Plantilla para Nuevos Entornos**: Archivo `.env.example` actualizado con la estructura de variables requeridas para desplegar el proyecto.
- **Entorno Local con Docker**: Archivo `docker-compose.yml` para desplegar un contenedor PostgreSQL 16 listo para desarrollo con un único comando:
  ```bash
  docker compose up -d
  ```
- **Seguridad en Git**: Archivo `.gitignore` fortalecido para excluir credenciales `.env*`, copias de respaldo de editores (`*.bak`, `*~`), cachés de TypeScript (`*.tsbuildinfo`) y de Vitest (`.vitest/`).

---

## 📐 2. Modelado de Datos y Relaciones 1:N (Prisma ORM)

Se definieron los modelos en `prisma/schema.prisma` mapeados a tablas relacionales en PostgreSQL:

- **`Usuario`** (`usuarios`): Clave primaria `@id @default(autoincrement())`, `email` único, relación 1:N con `Pedido`.
- **`Producto`** (`productos`): Clave primaria, atributos de `precio` (`Float`) y `stock` (`Int`), relación 1:N con `DetallePedido`.
- **`Pedido`** (`pedidos`): Clave primaria, clave foránea `usuarioId` (`ON DELETE CASCADE`), total calculado, estado (`PENDIENTE` / `CONFIRMADO`), relación 1:N con `DetallePedido`.
- **`DetallePedido`** (`detalles_pedidos`): Clave primaria, claves foráneas `pedidoId` (`ON DELETE CASCADE`) y `productoId` (`ON DELETE RESTRICT`), atributos `cantidad`, `precioUnitario` y `subtotal`.

```mermaid
erDiagram
    USUARIO ||--o{ PEDIDO : "1 : N (realiza)"
    PEDIDO ||--|{ DETALLE_PEDIDO : "1 : N (contiene)"
    PRODUCTO ||--o{ DETALLE_PEDIDO : "1 : N (incluido en)"

    USUARIO {
        int id PK
        string nombre
        string email UK
        int edad
        datetime creadoEn
    }

    PRODUCTO {
        int id PK
        string nombre
        string descripcion
        float precio
        int stock
        datetime creadoEn
    }

    PEDIDO {
        int id PK
        int usuarioId FK
        float total
        string estado
        datetime creadoEn
    }

    DETALLE_PEDIDO {
        int id PK
        int pedidoId FK
        int productoId FK
        int cantidad
        float precioUnitario
        float subtotal
    }
```

### Migraciones Aplicadas en PostgreSQL
Se crearon y versionaron las migraciones SQL a través del CLI de Prisma:
```bash
npx prisma migrate dev --name init_modelos_relacionales
```

---

## 💉 3. Refactorización de Repositorios con Inyección de Dependencias

Se desacopló la capa de acceso a datos (`src/repositories/`), inyectando el cliente `PrismaClient` a través del constructor e interactuando con la base de datos mediante métodos orientados a objetos:

- **`UsuarioRepository`**: Implementa `create`, `findMany`, `findUnique`, `update` y `delete`.
- **`ProductoRepository`**: Implementa `create`, `findMany`, `findUnique`, `update` y `delete`.
- **`PedidoRepository`**: Implementa `create`, `findMany` (con carga eagerly de detalles), `findUnique` y `update`.
- **`DetallePedidoRepository`**: Implementa `create`, `findMany`, `findUnique` y `delete`.
- **Inyección Limpia**: Cada repositorio expone `constructor(private readonly prisma: PrismaClient = defaultPrisma)`.

---

## 💳 4. Flujo Transaccional de Checkout (Propiedades ACID)

En `src/services/pedido.service.ts` se implementó el método `procesarCheckout` encapsulado dentro de una transacción interactiva con `prisma.$transaction`:

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Cliente HTTP
    participant Service as PedidoService
    participant Tx as prisma.$transaction
    participant DB as PostgreSQL

    Cliente->>Service: POST /api/pedidos { usuarioId, productosComprados }
    Service->>Tx: Iniciar Transacción ACID

    Tx->>DB: Validar existencia de Usuario
    Tx->>DB: Crear Pedido inicial (estado: PENDIENTE, total: 0)

    loop Por cada producto comprado
        Tx->>DB: Consultar stock actual
        alt Stock insuficiente (stock - cantidad < 0)
            Tx-->>Service: Lanzar InsufficientStockError
            Note over Tx,DB: ROLLBACK Automático en PostgreSQL (sin cambios)
            Service-->>Cliente: 400 Bad Request ("Stock insuficiente...")
        else Stock suficiente
            Tx->>DB: Restar inventario (stock = stock - cantidad)
            Tx->>DB: Crear registro DetallePedido (subtotal = cantidad * precio)
        end
    end

    Tx->>DB: Actualizar Pedido (total final y estado CONFIRMADO)
    Note over Tx,DB: COMMIT de la Transacción
    Service-->>Cliente: 201 Created (pedidoId, total, CONFIRMADO, detalles)
```

- **Validación Crítica de Inventario**: Si el stock restante de cualquier producto es menor a cero, se dispara un `InsufficientStockError`, forzando el **ROLLBACK** total en PostgreSQL.
- **Atomicidad y Consistencia**: No se crean pedidos huérfanos ni se descuenta inventario parcial en caso de error.
- **Confirmación (COMMIT)**: Al validar todos los ítems satisfactoriamente, se actualiza el total, se confirma el pedido y se consolidan los cambios.

---

## 🌐 5. Controlador y Endpoints de Pedidos

Se implementó `PedidoController` y se expuso la ruta en el router de Express:

| Método | Endpoint | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/pedidos` | Procesa el checkout de compras de un usuario | `201 Created`, `400 Bad Request`, `422 Unprocessable` |
| `GET` | `/api/pedidos` | Lista todos los pedidos con sus detalles y productos | `200 OK` |
| `GET` | `/api/pedidos/:id` | Consulta un pedido por su ID | `200 OK`, `404 Not Found` |

### Ejemplo de Petición (`POST /api/pedidos`):
```json
{
  "usuarioId": 1,
  "productosComprados": [
    { "productoId": 1, "cantidad": 2 },
    { "productoId": 2, "cantidad": 1 }
  ]
}
```

### Respuestas Tipadas:
- **`201 Created`**: Devuelve el pedido confirmado, total y desglose de productos.
- **`400 Bad Request`**: Si la información está incompleta (falta `usuarioId` o `productosComprados`) o si no hay stock disponible.

---

## 📖 6. Documentación con OpenAPI 3.2.0 y Swagger UI

Se generó el contrato declarativo de la API bajo la especificación **OpenAPI 3.2.0** (`src/docs/openapi.json` y `openapi.yaml`) y se integró **Swagger UI** como middleware en Express:

- **Swagger UI Interactivo**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Redirección Amigable**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **Especificación en JSON**: [http://localhost:3000/api/docs.json](http://localhost:3000/api/docs.json)

Permite visualizar la documentación interactiva y realizar pruebas manuales directamente desde el navegador web mediante la funcionalidad **"Try it out"**.

---

## 🧪 7. Pruebas Automatizadas (85 Tests)

La suite de pruebas se amplió a **85 tests** pasando al 100%:

1. **Pruebas de Transacciones ACID (`tests/integration/checkout.transaction.test.ts`)**:
   - Escenario exitoso con confirmación y persistencia de pedido y detalles.
   - Escenario crítico con reversión total (**ROLLBACK**) ante stock insuficiente.
   - Verificación de respuestas HTTP `201 Created` y `400 Bad Request`.
2. **Pruebas de Repositorios Prisma (`tests/integration/prisma.repositories.test.ts`)**:
   - Operaciones CRUD completas contra PostgreSQL usando métodos orientados a objetos.
3. **Pruebas de Documentación Swagger (`tests/integration/swagger.docs.test.ts`)**:
   - Validación de disponibilidad de Swagger UI y del esquema OpenAPI.
4. **Pruebas Heredadas de Ejercicios Anteriores**:
   - 32 pruebas unitarias de servicios con Mocks.
   - 21 pruebas de integración SQLite.
   - 10 escenarios BDD con sintaxis Gherkin.
   - 5 pruebas de endpoints base (Ejercicio 1).

---

## 📊 Comandos de Ejecución y Testing (Actualizado)

| Comando | Descripción |
| :--- | :--- |
| `npm test` | Ejecuta la **suite completa** de pruebas (85 tests). |
| `npm run prisma:generate` | Genera el cliente tipado de Prisma ORM. |
| `npm run prisma:migrate` | Aplica migraciones pendientes a la base de datos PostgreSQL. |
| `npm run prisma:push` | Sincroniza el esquema de Prisma directamente con la base de datos. |
| `npm run prisma:studio` | Abre la interfaz gráfica interactiva de Prisma Studio. |
| `npm run test:unit` | Ejecuta las pruebas unitarias con repositorios Mock. |
| `npm run test:integration` | Ejecuta las pruebas de integración contra PostgreSQL y SQLite. |
| `npm run test:gherkin` | Ejecuta las pruebas BDD con Gherkin. |
| `npm run dev` | Inicia el servidor en modo desarrollo (`http://localhost:3000`). |

---

## 📁 Estructura del Proyecto (Ejercicio N°3)

```text
.
├── docker-compose.yml                 # Orquestación de contenedor PostgreSQL 16
├── openapi.yaml                       # Especificación OpenAPI 3.2.0 en formato YAML
├── prisma/
│   ├── migrations/                    # Historial de migraciones relacionales SQL
│   └── schema.prisma                  # Definición de modelos, tipos y relaciones 1:N
├── src/
│   ├── app.ts                         # Configuración central de Express, middlewares y Swagger UI
│   ├── config/
│   │   ├── database.ts                # Conexión SQLite (heredada)
│   │   └── prisma.ts                  # Singleton de PrismaClient y conexión a PostgreSQL
│   ├── controllers/                   # Controladores HTTP
│   │   ├── legacy.controller.ts
│   │   ├── pedido.controller.ts       # Procesamiento de checkout y consulta de pedidos
│   │   ├── producto.controller.ts
│   │   └── usuario.controller.ts
│   ├── docs/
│   │   └── openapi.json               # Contrato declarativo OpenAPI 3.2.0 para Swagger
│   ├── dtos/                          # Objetos de Transferencia de Datos
│   │   ├── pedido.dto.ts
│   │   ├── producto.dto.ts
│   │   └── usuario.dto.ts
│   ├── entities/                      # Entidades del Dominio
│   │   ├── detalle-pedido.entity.ts
│   │   ├── pedido.entity.ts
│   │   ├── producto.entity.ts
│   │   └── usuario.entity.ts
│   ├── middlewares/                   # Comportamientos transversales
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   └── notfound.middleware.ts
│   ├── repositories/                  # Capa de persistencia
│   │   ├── detalle-pedido.repository.ts
│   │   ├── index.ts                   # Exportación centralizada de repositorios
│   │   ├── pedido.repository.ts
│   │   ├── producto.repository.ts
│   │   ├── usuario.repository.ts
│   │   ├── interfaces/
│   │   │   ├── detalle-pedido.repository.interface.ts
│   │   │   ├── pedido.repository.interface.ts
│   │   │   ├── producto.repository.interface.ts
│   │   │   └── usuario.repository.interface.ts
│   │   ├── mock/                      # Repositorios en memoria para pruebas unitarias
│   │   ├── prisma/                    # Implementaciones especializadas de Prisma
│   │   └── sqlite/                    # Persistencia en SQLite
│   ├── routes/                        # Enrutadores Express
│   │   ├── index.ts
│   │   ├── legacy.router.ts
│   │   ├── pedido.router.ts
│   │   ├── producto.router.ts
│   │   └── usuario.router.ts
│   └── services/                      # Reglas de negocio y transacciones
│       ├── errors/
│       │   └── app.errors.ts          # Errores de dominio (NotFound, InsufficientStock, etc.)
│       ├── pedido.service.ts          # Checkout transaccional con prisma.$transaction (ACID)
│       ├── producto.service.ts
│       └── usuario.service.ts
├── tests/
│   ├── features/                      # Pruebas BDD Gherkin
│   ├── integration/                   # Pruebas de integración
│   │   ├── checkout.transaction.test.ts # Pruebas de transacción ACID, commit y rollback
│   │   ├── prisma.repositories.test.ts  # CRUD de repositorios con cliente Prisma
│   │   ├── producto.api.test.ts
│   │   ├── swagger.docs.test.ts       # Verificación de Swagger UI y OpenAPI
│   │   └── usuario.api.test.ts
│   ├── unit/                          # Pruebas unitarias con Mocks
│   └── testendpoints.test.ts          # Pruebas de rutas base
├── .env.example                       # Plantilla de variables de entorno (PostgreSQL + Prisma)
├── .gitignore                         # Exclusiones de Git actualizadas
├── package.json                       # Scripts y dependencias
├── server.ts                          # Entrada principal y conexión a PostgreSQL
├── tsconfig.json                      # Configuración TypeScript
├── vitest.config.ts                   # Configuración del ejecutor Vitest
└── README.md                          # Documentación del proyecto
```

---

## 📸 Capturas de Pruebas (Ejercicio N°3)

> Espacio reservado para adjuntar las capturas de pantalla de la ejecución de pruebas y verificación en Swagger UI para el Ejercicio N°3.

### 1. Ejecución de la Suite Completa de Pruebas (`npm test`) - 85 Tests Pasados

<!-- Adjunta aquí la captura de la terminal corriendo npm test -->

_(Adjuntar captura aquí)_

---

### 2. Documentación Interactiva en Swagger UI (`http://localhost:3000/api/docs`)

<!-- Adjunta aquí la captura de pantalla de Swagger UI en el navegador -->

_(Adjuntar captura aquí)_

---

### 3. Prueba del Endpoint POST /api/pedidos en Swagger UI

<!-- Adjunta aquí la captura probando POST /api/pedidos en Swagger UI -->

_(Adjuntar captura aquí)_
