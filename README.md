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

## 🚀 Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar los tests (Vitest)
Para ejecutar la suite de pruebas una sola vez:
```bash
npm test
```

Para ejecutar en modo observador (watch):
```bash
npm run test:watch
```

### 3. Iniciar el servidor en desarrollo
```bash
npm run dev
```
El servidor quedará disponible en `http://localhost:3000`.

---

## 📁 Estructura del Proyecto

```text
.
├── EjerciciosBackend/         # Colección de peticiones para Bruno
│   ├── Adios.yml
│   ├── Hola.yml
│   ├── NarcisoPerez.yml
│   └── opencollection.yml
├── tests/                     # Suite de pruebas automatizadas
│   └── testendpoints.test.ts  # Tests de endpoints con Vitest y Supertest
├── package.json               # Scripts y dependencias del proyecto
├── server.ts                  # Servidor HTTP y lógica de endpoints
├── tsconfig.json              # Configuración del compilador TypeScript
└── README.md                  # Documentación de la actividad
```
