'use client';

import { Bell, Search, User } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="relative w-80">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar en el sistema..."
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          title="Notificaciones"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        <div className="flex items-center space-x-2 text-sm text-slate-700">
          <div className="bg-slate-100 p-1.5 rounded-full text-slate-600">
            <User className="h-4 w-4" />
          </div>
          <span className="font-medium">Panel Admin</span>
        </div>
      </div>
    </header>
  );
}
