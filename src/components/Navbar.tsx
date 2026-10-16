import React, { useState } from 'react';
import { Wrench, Menu, X, PhoneCall } from 'lucide-react';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo & Brand Name (Spana Ipo Juu Katikati ya Jina) */}
        <div className="flex flex-col items-center justify-center cursor-pointer group py-1">
          <div className="bg-gradient-to-tr from-teal-500 to-emerald-400 p-2.5 rounded-xl shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform duration-200 mb-1">
            <Wrench className="w-6 h-6 text-slate-950 font-black" />
          </div>
          <span className="text-xl md:text-2xl font-black text-white tracking-tight group-hover:text-teal-400 transition-colors leading-none">
            TechAssist<span className="text-teal-400">TZ</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-base font-medium text-slate-300">
          <button className="hover:text-teal-400 transition-colors duration-200">Mwanzo</button>
          <button className="hover:text-teal-400 transition-colors duration-200">Kuhusu Sisi</button>
          <button className="hover:text-teal-400 transition-colors duration-200">Huduma Zetu</button>
          <button className="hover:text-teal-400 transition-colors duration-200">Msaada</button>
        </div>

        {/* Action Button (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <button className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-teal-500/10 hover:shadow-teal-500/25 transition-all duration-200 active:scale-95">
            <PhoneCall className="w-4 h-4" />
            <span>Pata Msaada</span>
          </button>
        </div>

        {/* Mobile Menu Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 pb-4 border-t border-slate-800 space-y-3 px-2">
          <button className="block w-full text-left px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-teal-400 font-medium transition-colors">
            Mwanzo
          </button>
          <button className="block w-full text-left px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-teal-400 font-medium transition-colors">
            Kuhusu Sisi
          </button>
          <button className="block w-full text-left px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-teal-400 font-medium transition-colors">
            Huduma Zetu
          </button>
          <button className="block w-full text-left px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-teal-400 font-medium transition-colors">
            Msaada
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm px-4 py-3 rounded-xl transition-all mt-2">
            <PhoneCall className="w-4 h-4" />
            <span>Pata Msaada</span>
          </button>
        </div>
      )}
    </nav>
  );
}