import React from 'react';
import { Wrench } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <div className="bg-teal-500 p-2 rounded-lg">
          <Wrench className="w-5 h-5 text-slate-900" />
        </div>
        <span className="text-xl font-black text-white tracking-tight">TechAssistTZ</span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button className="hover:text-teal-400 transition-colors">Mwanzo</button>
        <button className="hover:text-teal-400 transition-colors">Kuhusu Sisi</button>
        <button className="hover:text-teal-400 transition-colors">Msaada</button>
      </div>
    </nav>
  );
}