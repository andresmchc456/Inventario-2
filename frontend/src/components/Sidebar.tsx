'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Boxes, ShieldAlert } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Productos e Inventario',
      href: '/productos',
      icon: Package,
    },
    {
      name: 'Ventas y Facturación',
      href: '/ventas',
      icon: ShoppingCart,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-xl">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Boxes className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">StockMaster</h1>
          <p className="text-xs text-slate-400">Inventario & Ventas</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/60 p-3 rounded-lg flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-semibold">
            AD
          </div>
          <div className="text-xs">
            <p className="font-medium text-white">Administrador</p>
            <p className="text-slate-400">admin@sistema.local</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
