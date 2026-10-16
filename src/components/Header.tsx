import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  User, 
  ShieldAlert, 
  PhoneCall,
  LogOut
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    tickets, 
    currentUserSession,
    logoutUser
  } = useApp();

  // Njia ya siri ya Superadmin (Triple click kwenye logo)
  const [clickCount, setClickCount] = useState(0);

  const handleSecretSuperadminClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 3) {
      setRole('tests'); // Fungua chumba cha Superadmin & Vipimo vya mfumo
      setClickCount(0); // Weka upya kaunta
    }
  };

  // Uelekezo salama wa kitufe cha Mteja
  const handleCustomerNavigation = () => {
    if (currentUserSession && currentUserSession.role === 'mteja') {
      setRole('mteja');
    } else {
      setRole('landing'); // Mpeleke kwenye Landing Page ili achague kategoria na kuingia kwanza
    }
  };

  // Uelekezo salama wa kitufe cha Mtaalamu (Fundi)
  const handleFundiNavigation = () => {
    if (currentUserSession && currentUserSession.role === 'fundi') {
      setRole('fundi');
    } else {
      setRole('landing'); // Mpeleke kwenye Landing Page ili achague kundi la Watoa Huduma na kuingia
    }
  };

  const activeTicketsCount = tickets.filter(
    (t) => t.status === 'PAID_WAITING_DISPATCH' || t.status === 'EN_ROUTE' || t.status === 'ARRIVED' || t.status === 'IN_PROGRESS'
  ).length;

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 text-white sticky top-0 z-50 shadow-2xl backdrop-blur-md">
      {/* 
        MABADILIKO YA ALIGNMENT: 
        - Kwenye simu (flex-col, justify-between)
        - Kwenye PC/Website (md:flex-row, md:justify-center, md:gap-12) ili vitu vyote vikae katikati!
      */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between md:justify-center gap-3 md:gap-12">
        
        {/* LOGO YA SPANA NA JINA */}
        <div 
          onClick={handleSecretSuperadminClick}
          title="TechAssistTZ"
          className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
        >
          <div className="bg-gradient-to-tr from-amber-500 via-teal-500 to-emerald-400 p-2 rounded-xl shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-all duration-300 border border-teal-400/30">
            <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 font-black" />
          </div>
          <span className="text-lg sm:text-2xl font-black text-white tracking-tight group-hover:text-teal-400 transition-colors leading-none">
            Tech<span className="text-amber-400">Assist</span><span className="text-teal-400">TZ</span>
          </span>
        </div>

        {/* ENEO LA MENYU NA USER PROFILE */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-6 w-full md:w-auto">
          
          {/* MENYU (NAVIGATION BUTTONS) */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 bg-slate-950/80 p-1 sm:p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
            <button
              onClick={() => setRole('landing')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                role === 'landing'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>🏠</span>
              <span className="hidden sm:inline">Mwanzo</span>
            </button>

            <button
              onClick={() => setRole('ai_chat')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                role === 'ai_chat'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400 font-bold scale-[1.02]'
                  : 'text-purple-300 hover:text-white hover:bg-slate-800/60 bg-purple-950/30 border border-purple-500/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>🤖 AI Uchunguzi</span>
            </button>

            {/* KITUFE CHA MTEJA (Active na Kinaelekeza kwenye Login/Kategoria) */}
            <button
              onClick={handleCustomerNavigation}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                role === 'mteja'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/40 font-bold scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mteja</span>
            </button>

            {/* KITUFE CHA MTAALAMU (Active na Kinaelekeza kwenye Login/Kategoria) */}
            <button
              onClick={handleFundiNavigation}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                role === 'fundi'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Mtaalamu</span>
            </button>

            {/* Kitufe cha Admin & Escrow (Kinaonekana TU kama admin amelogin) */}
            {currentUserSession && currentUserSession.role === 'admin' && (
              <button
                onClick={() => setRole('admin')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  role === 'admin'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40 font-bold scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin & Escrow</span>
                {activeTicketsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-400 text-slate-950 font-bold">
                    {activeTicketsCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* TAARIFA ZA USER SESSION AU KITUFE CHA MSAADA */}
          <div className="shrink-0 flex justify-center">
            {currentUserSession ? (
              <div className="flex items-center gap-2 bg-slate-800/90 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-xs font-black shrink-0">
                  {currentUserSession.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-white max-w-[100px] truncate leading-tight">
                    {currentUserSession.name}
                  </div>
                  <div className="text-[9px] text-amber-400 font-medium truncate max-w-[100px]">
                    {currentUserSession.category}
                  </div>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setRole('landing');
                  }}
                  className="p-1 sm:px-2 sm:py-0.5 text-[10px] font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors flex items-center gap-1"
                  title="Toka kwenye akaunti"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Toka</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setRole('ai_chat')}
                className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-teal-500/10 hover:shadow-teal-500/25 transition-all duration-200 active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="inline">Pata Msaada</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};