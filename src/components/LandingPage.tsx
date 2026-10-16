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
    else setRole('mteja');
  };

  const handleSelect = (roleId: string, name: string) => {
    setSelectedRole(roleId);
    setSelectedCategoryName(name);
  };

  const customerCategories = [
    { id: 'CUSTOMER_CHUO', name: 'Vyuo & Taasisi', icon: <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />, desc: 'Vyuo vikuu, VETA, na Taasisi' },
    { id: 'CUSTOMER_SHULE', name: 'Mashule', icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />, desc: 'Shule za Msingi na Sekondari' },
    { id: 'CUSTOMER_DINI', name: 'Makanisa & Misikiti', icon: <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />, desc: 'Nyumba za Ibada na Dini' },
    { id: 'CUSTOMER_KAMPUNI', name: 'Makampuni', icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />, desc: 'Ofisi, Maduka na Biashara' },
    { id: 'CUSTOMER_BINAFSI', name: 'Watu Binafsi', icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />, desc: 'Msaada wa majumbani na raia' },
  ];

  const staffCategories = [
    { id: 'FUNDI', name: 'Mtaalamu (Fundi)', icon: <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />, desc: 'Wahandisi na Mafundi wa TEHAMA' },
    { id: 'ADMIN', name: 'Msimamizi (Admin)', icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />, desc: 'Usimamizi wa Mfumo na SafePay' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-10 px-3 sm:px-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      {/* HERO SECTION - Single Clean Title */}
      <div className="text-center mb-8 sm:mb-12 max-w-3xl flex flex-col items-center w-full">
        <div className="flex justify-center mb-4 w-full">
          <div className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight select-none leading-none">
            <span 
              className="text-white" 
              style={{ textShadow: '-1.5px 0px 0px rgba(0,255,255,0.7), 1.5px 0px 0px rgba(255,0,0,0.7)' }}
            >
              Tech
            </span>
            <span 
              className="text-[#FFC107]" 
              style={{ textShadow: '-1.5px 0px 0px rgba(0,255,255,0.7), 1.5px 0px 0px rgba(255,0,0,0.7)' }}
            >
              Assist
            </span>
            <span 
              className="text-white"
              style={{ textShadow: '-1.5px 0px 0px rgba(0,255,255,0.7), 1.5px 0px 0px rgba(255,0,0,0.7)' }}
            >
              TZ
            </span>
          </div>
        </div>

        <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-200 mb-2 sm:mb-4 tracking-tight px-2">
          Mfumo wa Usaidizi wa Haraka wa TEHAMA
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto px-2">
          Mfumo wa kitaalamu unaounganisha Taasisi, Mashule, Nyumba za Ibada na Raia na wataalamu waliothibitishwa kwa kutumia teknolojia ya AI na usalama wa SafePay.
        </p>
      </div>
      
      {/* SEHEMU YA KUCHAGUA KATEGORIA */}
      <div className="w-full max-w-5xl">
        {!selectedRole ? (
          <div className="space-y-6 sm:space-y-10">
            
            {/* Kundi la 1: Wateja */}
            <div className="bg-slate-900/40 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl shadow-teal-900/5">
              <h2 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 border-b border-slate-800 pb-2.5 flex items-center gap-2">
                <span className="bg-teal-500/20 text-teal-400 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">1</span>
                <span>Natafuta Msaada wa TEHAMA (Wateja)</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
                {customerCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelect(cat.id, cat.name)}
                    className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-teal-500 hover:bg-teal-500/5 transition-all group active:scale-95 hover:-translate-y-1"
                  >
                    <div className="text-slate-400 group-hover:text-teal-400 transition-colors mb-2">
                      {cat.icon}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-200 mb-1 leading-tight">{cat.name}</h3>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 line-clamp-2">{cat.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Kundi la 2: Wataalamu na Wasimamizi */}
            <div className="bg-slate-900/40 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl shadow-amber-900/5">
              <h2 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 border-b border-slate-800 pb-2.5 flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-400 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">2</span>
                <span>Watoa Huduma na Usimamizi</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl">
                {staffCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelect(cat.id, cat.name)}
                    className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-amber-500 hover:bg-amber-500/5 transition-all group active:scale-95 hover:-translate-y-1"
                  >
                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-800 text-slate-400 group-hover:text-amber-400 transition-colors shrink-0">
                      {cat.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-200">{cat.name}</h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-500">{cat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center w-full mt-2">
            <button 
              onClick={() => setSelectedRole(null)}
              className="mb-4 sm:mb-6 text-slate-400 hover:text-teal-400 text-xs sm:text-sm flex items-center gap-2 font-medium transition-colors bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800 shadow-sm hover:bg-slate-800"
            >
              <span>←</span> Rudi kuchagua kundi lingine
            </button>
            
            <div className="w-full">
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