import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Lock, Phone, Building, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  role: string | null;
  categoryName: string;
  onLoginComplete: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ role, categoryName, onLoginComplete }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    orgType: categoryName || 'Binafsi',
  });

  const { setCurrentUserSession } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hifadhi taarifa za mtumiaji aliyeingia au kujisajili
    setCurrentUserSession({
      name: formData.name || (isRegistering ? 'Mteja Mpya' : 'Mteja Mzoefu'),
      category: categoryName || 'Mteja Binafsi',
      phone: formData.phone || '+255 700 000 000',
      role: role || 'mteja'
    });

    onLoginComplete();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-teal-900/10 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header ya Fomu */}
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
          {categoryName ? `Kundi: ${categoryName}` : 'Portal ya Mteja'}
        </span>
        <h3 className="text-xl font-black text-white">
          {isRegistering ? 'Tengeneza Akaunti Mpya' : 'Ingia Kwenye Akaunti Yako'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {isRegistering 
            ? 'Jaza taarifa zako ili kupata huduma za usaidizi wa TEHAMA' 
            : 'Ingiza namba yako ya simu na nenosiri kuendelea'}
        </p>
      </div>

      {/* Switcher Tab (Ingia vs Jisajili) */}
      <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-6 text-xs font-bold">
        <button
          type="button"
          onClick={() => setIsRegistering(false)}
          className={`py-2.5 rounded-xl transition-all ${
            !isRegistering 
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🔑 Ingia (Login)
        </button>
        <button
          type="button"
          onClick={() => setIsRegistering(true)}
          className={`py-2.5 rounded-xl transition-all ${
            isRegistering 
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📝 Jisajili (Register)
        </button>
      </div>

      {/* FOMU KUU */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* Jina kamili au la Taasisi (Kwa wanaojisajili tu) */}
        {isRegistering && (
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Jina Kamili / Jina la Taasisi
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Mfano: Chuo cha VETA / John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Namba ya Simu */}
        <div>
          <label className="block font-bold text-slate-300 mb-1">
            Namba ya Simu
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="tel"
              required
              placeholder="+255 7XX XXX XXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </div>

        {/* Nenosiri (Password) */}
        <div>
          <label className="block font-bold text-slate-300 mb-1">
            Nenosiri (Password)
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </div>

        {/* Kitufe cha Submit */}
        <button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-3 rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2 mt-2"
        >
          <span>{isRegistering ? 'Kamilisha Usajili' : 'Ingia Sasa'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Taarifa ya Ulinzi wa Data */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
        <span>Taarifa zote zinalindwa kwa usalama wa Mfumo wa Escrow</span>
      </div>

    </div>
  );
};