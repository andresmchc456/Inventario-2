import {
  Cliente,
  DashboardResumen,
  Inventario,
  Producto,
  ProductoFormDTO,
  Venta,
  VentaRequest,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Error en la petición: ${res.status} ${res.statusText}`);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

export const api = {
  // Dashboard
  getDashboardResumen: () => fetchJSON<DashboardResumen>('/dashboard/resumen'),

  // Productos
  getProductos: () => fetchJSON<Producto[]>('/productos'),
  getProductoById: (id: number) => fetchJSON<Producto>(`/productos/${id}`),
  crearProducto: (data: ProductoFormDTO) =>
    fetchJSON<Producto>('/productos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  actualizarProducto: (id: number, data: ProductoFormDTO) =>
    fetchJSON<Producto>(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  eliminarProducto: (id: number) =>
    fetchJSON<void>(`/productos/${id}`, {
      method: 'DELETE',
    }),

  // Inventario
  getInventarios: () => fetchJSON<Inventario[]>('/inventarios'),
  ajustarStock: (productoId: number, nuevaCantidad: number) =>
    fetchJSON<Inventario>(`/inventarios/producto/${productoId}/ajustar`, {
      method: 'PUT',
      body: JSON.stringify({ nuevaCantidad }),
    }),
  getBajoStock: (umbral: number = 10) =>
    fetchJSON<Inventario[]>(`/inventarios/bajo-stock?umbral=${umbral}`),

  // Clientes
  getClientes: () => fetchJSON<Cliente[]>('/clientes'),
  crearCliente: (cliente: Omit<Cliente, 'id'>) =>
    fetchJSON<Cliente>('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente),
    }),

  // Ventas
  getVentas: () => fetchJSON<Venta[]>('/ventas'),
  getVentaById: (id: number) => fetchJSON<Venta>(`/ventas/${id}`),
  registrarVenta: (data: VentaRequest) =>
    fetchJSON<Venta>('/ventas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
