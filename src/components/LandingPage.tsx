import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';
import { 
  Building2, 
  BookOpen, 
  Users, 
  Briefcase, 
  Wrench, 
  ShieldCheck, 
  Landmark,
  HeartHandshake
} from 'lucide-react';

export function LandingPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const { setRole } = useApp();

  const handleLoginComplete = () => {
    if (selectedRole === 'FUNDI') setRole('fundi');
    else if (selectedRole === 'ADMIN') setRole('admin');
    else setRole('mteja'); // Kategoria zote zingine ni Wateja
  };

  const handleSelect = (roleId: string, name: string) => {
    setSelectedRole(roleId);
    setSelectedCategoryName(name);
  };

  // Orodha ya Wateja (Taasisi na Raia)
  const customerCategories = [
    { id: 'CUSTOMER_CHUO', name: 'Vyuo & Taasisi', icon: <Landmark className="w-6 h-6" />, desc: 'Vyuo vikuu, VETA, na Taasisi' },
    { id: 'CUSTOMER_SHULE', name: 'Mashule', icon: <BookOpen className="w-6 h-6" />, desc: 'Shule za Msingi na Sekondari' },
    { id: 'CUSTOMER_DINI', name: 'Makanisa & Misikiti', icon: <HeartHandshake className="w-6 h-6" />, desc: 'Nyumba za Ibada na Taasisi za Dini' },
    { id: 'CUSTOMER_KAMPUNI', name: 'Makampuni', icon: <Briefcase className="w-6 h-6" />, desc: 'Ofisi, Maduka na Biashara' },
    { id: 'CUSTOMER_BINAFSI', name: 'Watu Binafsi', icon: <Users className="w-6 h-6" />, desc: 'Msaada wa majumbani na raia' },
  ];

  // Orodha ya Wataalamu na Admin
  const staffCategories = [
    { id: 'FUNDI', name: 'Mtaalamu (Fundi)', icon: <Wrench className="w-6 h-6" />, desc: 'Wahandisi na Mafundi wa TEHAMA' },
    { id: 'ADMIN', name: 'Msimamizi (Admin)', icon: <ShieldCheck className="w-6 h-6" />, desc: 'Usimamizi wa Mfumo na Escrow' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-in fade-in duration-500">
      
      {/* SEHEMU YA LOGO NA MAANDISHI (HERO SECTION) */}
      <div className="text-center mb-12 max-w-3xl flex flex-col items-center">
        
        {/* ICON YA SPANA JUU KATIKATI YA JINA */}
        <div className="bg-gradient-to-tr from-amber-500 via-teal-500 to-emerald-400 p-3.5 md:p-4 rounded-3xl shadow-2xl shadow-teal-500/20 mb-4 border border-teal-400/30 hover:scale-105 transition-transform duration-300">
          <Wrench className="w-8 h-8 md:w-10 md:h-10 text-slate-950 font-black" />
        </div>

        {/* LOGO YA MAANDISHI (Yenye rangi na 3D/Glitch effect) */}
        <div className="flex justify-center mb-4">
          <div className="text-5xl md:text-7xl font-black tracking-tighter select-none">
            <span 
              className="text-white" 
              style={{ textShadow: '-2px 0px 0px rgba(0,255,255,0.7), 2px 0px 0px rgba(255,0,0,0.7)' }}
            >
              Tech
            </span>
            <span 
              className="text-[#FFC107]" 
              style={{ textShadow: '-2px 0px 0px rgba(0,255,255,0.7), 2px 0px 0px rgba(255,0,0,0.7)' }}
            >
              Assist
            </span>
            <span 
              className="text-white"
              style={{ textShadow: '-2px 0px 0px rgba(0,255,255,0.7), 2px 0px 0px rgba(255,0,0,0.7)' }}
            >
              TZ
            </span>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-slate-200 mb-4 tracking-tight">
          Mfumo wa Usaidizi wa Haraka wa TEHAMA
        </h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Mfumo wa kitaalamu unaounganisha Taasisi, Mashule, Nyumba za Ibada na Raia na wataalamu waliothibitishwa kwa kutumia teknolojia ya AI na usalama wa Escrow.
        </p>
      </div>
      
      {/* SEHEMU YA KUCHAGUA KATEGORIA */}
      <div className="w-full max-w-5xl">
        {!selectedRole ? (
          <div className="space-y-10">
            
            {/* Kundi la 1: Wateja */}
            <div className="bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl shadow-teal-900/5">
              <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2 flex items-center gap-2">
                <span className="bg-teal-500/20 text-teal-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Natafuta Msaada wa TEHAMA (Wateja)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {customerCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelect(cat.id, cat.name)}
                    className="flex flex-col items-center text-center p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-teal-500 hover:bg-teal-500/5 transition-all group hover:-translate-y-1"
                  >
                    <div className="text-slate-400 group-hover:text-teal-400 transition-colors mb-3">
                      {cat.icon}
                    </div>
                    <h3 className="text-sm font-bold text-slate-200 mb-1">{cat.name}</h3>
                    <p className="text-[10px] text-slate-500">{cat.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Kundi la 2: Wataalamu na Wasimamizi */}
            <div className="bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl shadow-amber-900/5">
              <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2 flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Watoa Huduma na Usimamizi
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                {staffCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelect(cat.id, cat.name)}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-amber-500 hover:bg-amber-500/5 transition-all group hover:-translate-y-1"
                  >
                    <div className="p-3 rounded-xl bg-slate-800 text-slate-400 group-hover:text-amber-400 transition-colors">
                      {cat.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-slate-200">{cat.name}</h3>
                      <p className="text-[11px] text-slate-500">{cat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* SEHEMU YA FOMU BAADA YA KUCHAGUA */
          <div className="flex flex-col items-center w-full mt-4">
            <button 
              onClick={() => setSelectedRole(null)}
              className="mb-6 text-slate-400 hover:text-teal-400 text-sm flex items-center gap-2 font-medium transition-colors bg-slate-900/80 px-5 py-2.5 rounded-full border border-slate-800 shadow-sm hover:bg-slate-800"
            >
              <span>←</span> Rudi kuchagua kundi lingine
            </button>
            
            <div className="w-full">
              {/* Tunapitisha jina la kategoria kwenye AuthModal ili fomu ijue nani anasajiliwa */}
              <AuthModal 
                role={selectedRole} 
                categoryName={selectedCategoryName}
                onLoginComplete={handleLoginComplete} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}