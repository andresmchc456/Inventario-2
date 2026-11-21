'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { DashboardResumen } from '@/types';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const resumen = await api.getDashboardResumen();
      setData(resumen);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con la API del backend');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 font-medium">Cargando métricas del sistema...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-2xl mx-auto my-12">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-800">No se pudo cargar el Dashboard</h3>
        <p className="text-sm text-red-600 mt-1">{error}</p>
        <button
          onClick={cargarDatos}
          className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Ingresos Totales por Ventas',
      value: `$${Number(data?.totalVentasIngresos || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      subtext: 'Acumulado histórico',
    },
    {
      title: 'Total de Ventas Realizadas',
      value: data?.cantidadVentas || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      subtext: 'Transacciones completadas',
    },
    {
      title: 'Productos en Catálogo',
      value: data?.totalProductos || 0,
      icon: Package,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      subtext: 'Artículos registrados',
    },
    {
      title: 'Alertas de Stock Bajo',
      value: data?.productosBajoStock || 0,
      icon: AlertTriangle,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      subtext: 'Menor o igual a 10 unidades',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard General</h1>
          <p className="text-sm text-slate-500 mt-1">
            Resumen en tiempo real del inventario, ventas y estado de suministros.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/ventas"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Registrar Venta</span>
          </Link>
          <Link
            href="/productos"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            <Package className="h-4 w-4" />
            <span>Gestionar Stock</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{card.title}</span>
                <div className={`p-2.5 rounded-lg text-white ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-slate-900">{card.value}</span>
                <p className="text-xs text-slate-500 mt-1">{card.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Column Layout: Alertas de Stock Bajo & Últimas Ventas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alertas de Stock Bajo */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">Productos con Bajo Stock</h2>
            </div>
            <Link
              href="/productos"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Ver todos</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            {(!data?.listaBajoStock || data.listaBajoStock.length === 0) ? (
              <div className="text-center py-10">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">Inventario en niveles óptimos</p>
                <p className="text-xs text-slate-400 mt-0.5">Ningún producto está por debajo de 10 unidades</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 font-medium border-b border-slate-100">
                    <th className="pb-3">Producto / SKU</th>
                    <th className="pb-3 text-center">Stock Actual</th>
                    <th className="pb-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.listaBajoStock.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80">
                      <td className="py-3">
                        <p className="font-semibold text-slate-800">{inv.producto?.nombre}</p>
                        <p className="text-xs text-slate-400">SKU: {inv.producto?.sku}</p>
                      </td>
                      <td className="py-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          {inv.cantidadActual} unid.
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href="/productos"
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          Reponer
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Últimas Ventas */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Últimas Ventas Registradas</h2>
            </div>
            <Link
              href="/ventas"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Ver todas</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4">
            {(!data?.ultimasVentas || data.ultimasVentas.length === 0) ? (
              <div className="text-center py-10 text-slate-400">
                <Clock className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No hay ventas registradas aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.ultimasVentas.map((venta) => (
                  <div
                    key={venta.id}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {venta.cliente?.nombre || 'Cliente General'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {venta.factura ? `Factura: ${venta.factura.numeroFactura}` : `Venta #${venta.id}`} • {new Date(venta.fechaVenta).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-sm">
                        ${Number(venta.total).toFixed(2)}
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
                        Completada
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
