'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Producto, ProductoFormDTO } from '@/types';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  SlidersHorizontal, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  // Estado Modal Crear/Editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductoFormDTO>({
    nombre: '',
    descripcion: '',
    precioUnitario: 0,
    sku: '',
    stockInicial: 0,
  });

  // Estado Modal Ajuste de Stock
  const [modalStockAbierto, setModalStockAbierto] = useState(false);
  const [productoAjuste, setProductoAjuste] = useState<Producto | null>(null);
  const [nuevoStock, setNuevoStock] = useState<number>(0);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await api.getProductos();
      setProductos(data);
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: err.message || 'Error al cargar productos' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCrear = () => {
    setModoEdicion(false);
    setProductoSeleccionadoId(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precioUnitario: 0,
      sku: '',
      stockInicial: 10,
    });
    setModalAbierto(true);
  };

  const handleOpenEditar = (p: Producto) => {
    setModoEdicion(true);
    setProductoSeleccionadoId(p.id);
    setFormData({
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      precioUnitario: p.precioUnitario,
      sku: p.sku,
    });
    setModalAbierto(true);
  };

  const handleGuardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modoEdicion && productoSeleccionadoId) {
        await api.actualizarProducto(productoSeleccionadoId, formData);
        setMensaje({ tipo: 'ok', texto: 'Producto actualizado con éxito' });
      } else {
        await api.crearProducto(formData);
        setMensaje({ tipo: 'ok', texto: 'Producto creado y agregado al inventario' });
      }
      setModalAbierto(false);
      cargarProductos();
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  };

  const handleEliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await api.eliminarProducto(id);
      setMensaje({ tipo: 'ok', texto: 'Producto eliminado correctamente' });
      cargarProductos();
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  };

  const handleOpenAjusteStock = (p: Producto) => {
    setProductoAjuste(p);
    setNuevoStock(p.inventario?.cantidadActual || 0);
    setModalStockAbierto(true);
  };

  const handleGuardarAjusteStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoAjuste) return;
    try {
      await api.ajustarStock(productoAjuste.id, nuevoStock);
      setMensaje({ tipo: 'ok', texto: `Stock de "${productoAjuste.nombre}" actualizado a ${nuevoStock} unidades` });
      setModalStockAbierto(false);
      cargarProductos();
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.sku.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Inventario y Productos</h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra el catálogo de productos, precios y niveles de existencias.
          </p>
        </div>
        <button
          onClick={handleOpenCrear}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Alerta de feedback */}
      {mensaje && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between ${
            mensaje.tipo === 'ok' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center space-x-2 text-sm font-medium">
            {mensaje.tipo === 'ok' ? <Check className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-red-600" />}
            <span>{mensaje.texto}</span>
          </div>
          <button onClick={() => setMensaje(null)} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
          Total: <span className="text-slate-900 font-bold">{productosFiltrados.length}</span> productos
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            Cargando catálogo...
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-medium">No se encontraron productos</p>
            <p className="text-xs text-slate-400 mt-1">Prueba con otro término de búsqueda o crea uno nuevo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">SKU</th>
                  <th className="py-3 px-6">Producto</th>
                  <th className="py-3 px-6">Precio Unitario</th>
                  <th className="py-3 px-6 text-center">Stock Actual</th>
                  <th className="py-3 px-6 text-center">Estado</th>
                  <th className="py-3 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productosFiltrados.map((p) => {
                  const stock = p.inventario?.cantidadActual ?? 0;
                  const bajoStock = stock <= 10;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs font-medium text-slate-600">
                        {p.sku}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-slate-900">{p.nombre}</p>
                        {p.descripcion && (
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{p.descripcion}</p>
                        )}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        ${Number(p.precioUnitario).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-slate-800">
                        {stock} unid.
                      </td>
                      <td className="py-4 px-6 text-center">
                        {stock === 0 ? (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            Agotado
                          </span>
                        ) : bajoStock ? (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                            Bajo Stock
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            Disponible
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenAjusteStock(p)}
                            title="Ajustar Stock"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <SlidersHorizontal className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditar(p)}
                            title="Editar Producto"
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEliminar(p.id, p.nombre)}
                            title="Eliminar Producto"
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear / Editar Producto */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {modoEdicion ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarProducto} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Laptop Ultraligera 14 pulgadas"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Código SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    placeholder="PROD-001"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Precio Unitario ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.precioUnitario}
                    onChange={(e) => setFormData({ ...formData, precioUnitario: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {!modoEdicion && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Stock Inicial en Inventario
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockInicial}
                    onChange={(e) => setFormData({ ...formData, stockInicial: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Especificaciones o detalles adicionales..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  {modoEdicion ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajuste Rápido de Stock */}
      {modalStockAbierto && productoAjuste && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Ajustar Inventario</h3>
              <button
                onClick={() => setModalStockAbierto(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarAjusteStock} className="p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">{productoAjuste.nombre}</p>
                <p className="text-xs font-mono text-slate-400 mt-0.5">SKU: {productoAjuste.sku}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Nueva Cantidad en Existencias
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={nuevoStock}
                  onChange={(e) => setNuevoStock(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-lg font-bold text-center focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalStockAbierto(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Guardar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
