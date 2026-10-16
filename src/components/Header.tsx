import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  User, 
  ShieldAlert, 
  PhoneCall,
  LogOut,
  Lock
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    tickets, 
    currentUserSession,
    logoutUser
  } = useApp();

  // State za Superadmin Login
  const [clickCount, setClickCount] = useState(0);
  const [showSuperAdminLogin, setShowSuperAdminLogin] = useState(false);
  const [superAdminPass, setSuperAdminPass] = useState('');
  const [superAdminError, setSuperAdminError] = useState('');

  // Kitendo cha kubonyeza mara 3
  const handleSecretSuperadminClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 3) {
      setShowSuperAdminLogin(true); // Fungua fomu badala ya kumpeleka moja kwa moja
      setClickCount(0); // Weka upya kaunta
    }
  };

  // Kitendo cha kuwasilisha nenosiri la Superadmin
  const handleSuperAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // NENOSIRI LA SIRI LA SUPERADMIN (Unaweza kubadili hapa)
    if (superAdminPass === 'superadmin123') {
      setRole('tests'); // Fungua chumba cha Superadmin
      setShowSuperAdminLogin(false);
      setSuperAdminPass('');
      setSuperAdminError('');
    } else {
      setSuperAdminError('Nenosiri si sahihi! Hauruhusiwi kuingia hapa.');
    }
  };

  // Uelekezo salama wa kitufe cha Mteja
  const handleCustomerNavigation = () => {
    if (currentUserSession && currentUserSession.role === 'mteja') {
      setRole('mteja');
    } else {
      setRole('landing');
    }
  };

  // Uelekezo salama wa kitufe cha Mtaalamu (Fundi)
  const handleFundiNavigation = () => {
    if (currentUserSession && currentUserSession.role === 'fundi') {
      setRole('fundi');
    } else {
      setRole('landing');
    }
  };

  const activeTicketsCount = tickets.filter(
    (t) => t.status === 'PAID_WAITING_DISPATCH' || t.status === 'EN_ROUTE' || t.status === 'ARRIVED' || t.status === 'IN_PROGRESS'
  ).length;

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 text-white sticky top-0 z-50 shadow-2xl backdrop-blur-md">
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

            {(role === 'admin' || (currentUserSession && currentUserSession.role === 'admin')) && (
              <button
                onClick={() => setRole('admin')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  role === 'admin'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40 font-bold scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Admin & SafePay</span>
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

      {/* FOMU YA LOGIN YA SUPERADMIN INAYOTOKEA UKIBONYEZA MARA 3 */}
      {showSuperAdminLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl max-w-xs w-full animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-teal-400 font-black text-sm flex items-center gap-2 uppercase tracking-wider">
                <ShieldAlert className="w-5 h-5" />
                <span>Superadmin</span>
              </h3>
              <button 
                onClick={() => {
                  setShowSuperAdminLogin(false);
                  setSuperAdminError('');
                }} 
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSuperAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">Nenosiri la Siri</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input 
                    type="password" 
                    autoFocus
                    required
                    value={superAdminPass}
                    onChange={(e) => setSuperAdminPass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                    placeholder="Weka nenosiri..."
                  />
                </div>
                {superAdminError && (
                  <p className="text-red-400 text-[10px] mt-1.5 font-bold bg-red-950/30 p-1.5 rounded">{superAdminError}</p>
                )}
              </div>
              <button 
                type="submit" 
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-teal-500/20"
              >
                Fungua Mfumo
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};