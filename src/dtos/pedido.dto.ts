export interface ProductoCompradoDTO {
  productoId: number;
  cantidad: number;
}

export interface CheckoutItemDTO {
  productoId: number;
  cantidad: number;
}

export interface CrearPedidoDTO {
  usuarioId: number;
  productosComprados: ProductoCompradoDTO[];
}

export interface CheckoutDTO {
  usuarioId: number;
  items?: CheckoutItemDTO[];
  productosComprados?: ProductoCompradoDTO[];
}

export interface DetalleCheckoutResponseDTO {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CheckoutResponseDTO {
  pedidoId: number;
  usuarioId: number;
  total: number;
  estado: string;
  detalles: DetalleCheckoutResponseDTO[];
  creadoEn: string;
}
