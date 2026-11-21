export interface Admin {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface Inventario {
  id: number;
  cantidadActual: number;
  fechaUltimaActualizacion: string;
  producto?: Producto;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precioUnitario: number;
  sku: string;
  inventario?: Inventario;
}

export interface ProductoFormDTO {
  nombre: string;
  descripcion: string;
  precioUnitario: number;
  sku: string;
  stockInicial?: number;
}

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface DetalleVenta {
  id: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Factura {
  id: number;
  numeroFactura: string;
  fechaEmision: string;
}

export interface Venta {
  id: number;
  cliente: Cliente;
  fechaVenta: string;
  total: number;
  detalles: DetalleVenta[];
  factura?: Factura;
}

export interface VentaItemRequest {
  productoId: number;
  cantidad: number;
}

export interface VentaRequest {
  clienteId: number;
  items: VentaItemRequest[];
}

export interface DashboardResumen {
  totalVentasIngresos: number;
  cantidadVentas: number;
  totalProductos: number;
  productosBajoStock: number;
  listaBajoStock: Inventario[];
  ultimasVentas: Venta[];
}
