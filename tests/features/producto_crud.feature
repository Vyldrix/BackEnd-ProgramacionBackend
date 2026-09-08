# language: es
Característica: Gestión de Productos (CRUD y búsqueda por ID)
  Como gestor de inventario
  Quiero administrar los productos disponibles
  Para ofrecer un catálogo consistente a los clientes

  Escenario: Registrar un nuevo producto exitosamente
    Dado que la base de datos está disponible
    Cuando envío una solicitud POST a "/api/productos" con:
      | nombre      | Smartphone Galaxy S24 |
      | descripcion | 256GB 8GB RAM OLED    |
      | precio      | 950.00                |
      | stock       | 15                    |
    Entonces la respuesta debe tener el código de estado 201
    Y el cuerpo de la respuesta debe contener el estado "ok"
    Y el producto debe tener un ID numérico asignado

  Escenario: Validar rechazo de precio negativo al registrar producto
    Dado que la base de datos está disponible
    Cuando envío una solicitud POST a "/api/productos" con:
      | nombre      | Producto Invalido |
      | descripcion | Precio negativo   |
      | precio      | -20.00            |
      | stock       | 5                 |
    Entonces la respuesta debe tener el código de estado 400
    Y el cuerpo de la respuesta debe contener el estado "error"

  Escenario: Consultar un producto por su ID
    Dado que existe un producto con nombre "Auriculares Bluetooth", descripcion "Inalámbricos", precio 49.99 y stock 20
    Cuando realizo una petición GET a "/api/productos/{id}" con el ID del producto
    Entonces la respuesta debe tener el código de estado 200
    Y los datos del producto deben tener el nombre "Auriculares Bluetooth" y precio 49.99

  Escenario: Actualizar precio y stock de un producto
    Dado que existe un producto con nombre "Teclado Gamer", descripcion "RGB Mecanico", precio 70.00 y stock 10
    Cuando envío una solicitud PUT a "/api/productos/{id}" con:
      | precio | 65.00 |
      | stock  | 25    |
    Entonces la respuesta debe tener el código de estado 200
    Y los datos del producto deben reflejar el precio 65 y el stock 25

  Escenario: Eliminar un producto del inventario
    Dado que existe un producto con nombre "Mouse Pad XL", descripcion "Goma antideslizante", precio 15.00 y stock 50
    Cuando envío una solicitud DELETE a "/api/productos/{id}" con el ID del producto
    Entonces la respuesta debe tener el código de estado 200
    Y al consultar nuevamente por el ID del producto se debe recibir el código de estado 404
