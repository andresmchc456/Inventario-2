'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Cliente, Producto, Venta } from '@/types';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Printer, 
  UserPlus 
} from 'lucide-react';

interface ItemVentaSeleccionado {
  productoId: number;
  nombre: string;
  sku: string;
  precioUnitario: number;
  cantidad: number;
  stockDisponible: number;
}

export default function VentasPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventasRecientes, setVentasRecientes] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);

  // Formulario Venta
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [items, setItems] = useState<ItemVentaSeleccionado[]>([]);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState<number | ''>('');
  const [cantidadInput, setCantidadInput] = useState<number>(1);

  // Modales y Feedback
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [facturaModal, setFacturaModal] = useState<Venta | null>(null);

  // Modal Nuevo Cliente
  const [modalClienteAbierto, setModalClienteAbierto] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [listaClientes, listaProductos, listaVentas] = await Promise.all([
        api.getClientes(),
        api.getProductos(),
        api.getVentas(),
      ]);
      setClientes(listaClientes);
      setProductos(listaProductos);
      setVentasRecientes(listaVentas);
      if (listaClientes.length > 0 && clienteId === '') {
        setClienteId(listaClientes[0].id);
      }
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: err.message || 'Error cargando datos para ventas' });
    } finally {
      setLoading(false);
    }
  };

  const agregarProductoAVenta = () => {
    if (!productoSeleccionadoId) return;

    const prod = productos.find((p) => p.id === Number(productoSeleccionadoId));
    if (!prod) return;

    const stockActual = prod.inventario?.cantidadActual || 0;

    const existeIndex = items.findIndex((i) => i.productoId === prod.id);
    const cantidadFinal = existeIndex >= 0 ? items[existeIndex].cantidad + cantidadInput : cantidadInput;

    if (cantidadFinal > stockActual) {
      alert(`No hay stock suficiente para "${prod.nombre}". Stock disponible: ${stockActual}`);
      return;
    }

    if (existeIndex >= 0) {
      const actualizados = [...items];
      actualizados[existeIndex].cantidad = cantidadFinal;
      setItems(actualizados);
    } else {
      setItems([
        ...items,
        {
          productoId: prod.id,
          nombre: prod.nombre,
          sku: prod.sku,
          precioUnitario: prod.precioUnitario,
          cantidad: cantidadInput,
          stockDisponible: stockActual,
        },
      ]);
    }

    setProductoSeleccionadoId('');
    setCantidadInput(1);
  };

  const eliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalCalculado = items.reduce(
    (sum, item) => sum + item.precioUnitario * item.cantidad,
    0
  );

  const handleCrearVenta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) {
      setMensaje({ tipo: 'error', texto: 'Por favor selecciona un cliente' });
      return;
    }

    if (items.length === 0) {
      setMensaje({ tipo: 'error', texto: 'Agrega al menos un producto a la venta' });
      return;
    }

    try {
      setProcesando(true);
      const ventaCreada = await api.registrarVenta({
        clienteId: Number(clienteId),
        items: items.map((i) => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
        })),
      });

      setMensaje({ tipo: 'ok', texto: '¡Venta registrada y Factura generada con éxito!' });
      setItems([]);
      setFacturaModal(ventaCreada);
      await cargarDatos();
    } catch (err: any) {
      setMensaje({ tipo: 'error', texto: err.message });
    } finally {
      setProcesando(false);
    }
  };

  const handleGuardarNuevoCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cli = await api.crearCliente(nuevoCliente);
      setClientes([...clientes, cli]);
      setClienteId(cli.id);
      setModalClienteAbierto(false);
      setNuevoCliente({ nombre: '', email: '', telefono: '', direccion: '' });
      setMensaje({ tipo: 'ok', texto: `Cliente ${cli.nombre} registrado con éxito` });
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registro de Ventas y Facturación</h1>
        <p className="text-sm text-slate-500 mt-1">
          Emite nuevas ventas, descuenta automáticamente el inventario y genera facturas correlativas.
        </p>
      </div>

      {/* Alerta de notificación */}
      {mensaje && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between ${
            mensaje.tipo === 'ok' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center space-x-2 text-sm font-medium">
            {mensaje.tipo === 'ok' ? <CheckCircle className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-red-600" />}
            <span>{mensaje.texto}</span>
          </div>
          <button onClick={() => setMensaje(null)} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario Principal de Venta (2 columnas) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <span>Nueva Orden de Venta</span>
              </h2>
              <button
                type="button"
                onClick={() => setModalClienteAbierto(true)}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                <UserPlus className="h-4 w-4" />
                <span>+ Nuevo Cliente</span>
              </button>
            </div>

            {/* Selector de Cliente */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Cliente Receptor *
              </label>
              <select
                value={clienteId}
                onChange={(e) => setClienteId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">-- Selecciona un Cliente --</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Producto */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
              <p className="text-xs font-bold text-slate-600 uppercase mb-3">Añadir Productos a la Venta</p>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-7">
                  <label className="block text-xs text-slate-500 mb-1">Producto</label>
                  <select
                    value={productoSeleccionadoId}
                    onChange={(e) => setProductoSeleccionadoId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">-- Seleccionar Producto --</option>
                    {productos.map((p) => {
                      const stock = p.inventario?.cantidadActual || 0;
                      return (
                        <option key={p.id} value={p.id} disabled={stock <= 0}>
                          {p.nombre} - ${Number(p.precioUnitario).toFixed(2)} (Stock: {stock})
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs text-slate-500 mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={cantidadInput}
                    onChange={(e) => setCantidadInput(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={agregarProductoAVenta}
                    disabled={!productoSeleccionadoId}
                    className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla de Items de la Venta */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Producto</th>
                    <th className="py-2.5 px-4 text-center">Cant.</th>
                    <th className="py-2.5 px-4 text-right">Precio Unit.</th>
                    <th className="py-2.5 px-4 text-right">Subtotal</th>
                    <th className="py-2.5 px-4 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                        No hay productos añadidos a esta orden.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-800">{item.nombre}</p>
                          <p className="text-xs font-mono text-slate-400">SKU: {item.sku}</p>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">{item.cantidad}</td>
                        <td className="py-3 px-4 text-right font-medium">
                          ${item.precioUnitario.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          ${(item.precioUnitario * item.cantidad).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => eliminarItem(idx)}
                            className="text-slate-400 hover:text-red-500 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Total y Botón de Emisión */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-semibold text-slate-500">Monto Total a Facturar:</span>
                <p className="text-3xl font-extrabold text-slate-900">
                  ${totalCalculado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCrearVenta}
                disabled={procesando || items.length === 0 || !clienteId}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition flex items-center justify-center space-x-2"
              >
                <FileText className="h-5 w-5" />
                <span>{procesando ? 'Procesando...' : 'Completar Venta y Emitir Factura'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Historial de Ventas Recientes (1 columna) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 mb-4">
              Historial de Facturas
            </h3>
            {loading ? (
              <p className="text-xs text-slate-400">Cargando...</p>
            ) : ventasRecientes.length === 0 ? (
              <p className="text-xs text-slate-400">Sin ventas registradas.</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {ventasRecientes.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setFacturaModal(v)}
                    className="p-3 border border-slate-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600">
                        {v.factura?.numeroFactura || `Venta #${v.id}`}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        ${Number(v.total).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 mt-1">{v.cliente?.nombre}</p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(v.fechaVenta).toLocaleString('es-ES')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Visualizador / Impresión de Factura */}
      {facturaModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-blue-400 uppercase">Factura Oficial</span>
                <h3 className="text-xl font-bold font-mono">
                  {facturaModal.factura?.numeroFactura || `FAC-${facturaModal.id}`}
                </h3>
              </div>
              <button
                onClick={() => setFacturaModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-100 pb-4">
                <div>
                  <p className="text-slate-400">EMITIDO POR:</p>
                  <p className="font-bold text-slate-900 mt-0.5">StockMaster Corp.</p>
                  <p className="text-slate-500">RUC: 20485963211</p>
                  <p className="text-slate-500">Lima, Perú</p>
                </div>
                <div>
                  <p className="text-slate-400">FACTURADO A:</p>
                  <p className="font-bold text-slate-900 mt-0.5">{facturaModal.cliente?.nombre}</p>
                  <p className="text-slate-500">{facturaModal.cliente?.email}</p>
                  <p className="text-slate-500">{facturaModal.cliente?.direccion}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2">Item</th>
                      <th className="py-2 text-center">Cant.</th>
                      <th className="py-2 text-right">P. Unit</th>
                      <th className="py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {facturaModal.detalles?.map((det) => (
                      <tr key={det.id}>
                        <td className="py-2.5">
                          <p className="font-medium text-slate-800">{det.producto?.nombre}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{det.producto?.sku}</p>
                        </td>
                        <td className="py-2.5 text-center font-bold">{det.cantidad}</td>
                        <td className="py-2.5 text-right">${Number(det.precioUnitario).toFixed(2)}</td>
                        <td className="py-2.5 text-right font-bold text-slate-900">${Number(det.subtotal).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">TOTAL PAGADO</span>
                <span className="text-2xl font-black text-slate-900">
                  ${Number(facturaModal.total).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimir</span>
              </button>
              <button
                type="button"
                onClick={() => setFacturaModal(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Cliente Rápido */}
      {modalClienteAbierto && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Registrar Nuevo Cliente</h3>
              <button
                onClick={() => setModalClienteAbierto(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarNuevoCliente} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={nuevoCliente.nombre}
                  onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                  placeholder="Ej: Inversiones Globales S.A."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={nuevoCliente.email}
                  onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                  placeholder="contacto@inversiones.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Teléfono</label>
                <input
                  type="text"
                  value={nuevoCliente.telefono}
                  onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                  placeholder="+51 987654321"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Dirección</label>
                <input
                  type="text"
                  value={nuevoCliente.direccion}
                  onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                  placeholder="Av. Los Laureles 321"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalClienteAbierto(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
