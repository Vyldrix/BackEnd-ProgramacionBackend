# language: es
Característica: Gestión de Usuarios (CRUD y búsqueda por ID)
  Como administrador de la API
  Quiero gestionar los usuarios del sistema
  Para mantener actualizado el registro de clientes

  Escenario: Crear un usuario nuevo exitosamente
    Dado que el sistema no tiene un usuario con el email "martin.dev@example.com"
    Cuando envío una solicitud POST a "/api/usuarios" con:
      | nombre  | Martin Gomez            |
      | email   | martin.dev@example.com  |
      | edad    | 29                      |
    Entonces la respuesta debe tener el código de estado 201
    Y el cuerpo de la respuesta debe contener el estado "ok"
    Y el usuario debe tener un ID asignado

  Escenario: Intentar registrar un usuario con email duplicado
    Dado que existe un usuario registrado con el email "martin.dev@example.com"
    Cuando envío una solicitud POST a "/api/usuarios" con:
      | nombre  | Martin Clon             |
      | email   | martin.dev@example.com  |
      | edad    | 35                      |
    Entonces la respuesta debe tener el código de estado 409
    Y el cuerpo de la respuesta debe contener el estado "error"

  Escenario: Consultar un usuario por su ID
    Dado que existe un usuario con nombre "Laura Paez", email "laura.paez@example.com" y edad 22
    Cuando realizo una petición GET a "/api/usuarios/{id}" con el ID del usuario
    Entonces la respuesta debe tener el código de estado 200
    Y los datos del usuario deben tener el email "laura.paez@example.com"

  Escenario: Actualizar un usuario existente
    Dado que existe un usuario con nombre "Pedro Antes", email "pedro.antes@example.com" y edad 40
    Cuando envío una solicitud PUT a "/api/usuarios/{id}" con:
      | nombre | Pedro Despues |
      | edad   | 41            |
    Entonces la respuesta debe tener el código de estado 200
    Y los datos del usuario deben reflejar el nombre "Pedro Despues" y edad 41

  Escenario: Eliminar un usuario
    Dado que existe un usuario con nombre "Eliminar Me", email "eliminar.me@example.com" y edad 50
    Cuando envío una solicitud DELETE a "/api/usuarios/{id}" con el ID del usuario
    Entonces la respuesta debe tener el código de estado 200
    Y al consultar nuevamente por el ID se debe recibir el código de estado 404
