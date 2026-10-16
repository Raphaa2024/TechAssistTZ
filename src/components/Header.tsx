import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  User, 
  ShieldAlert, 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  PhoneCall
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    activeFundiId, 
    setActiveFundiId, 
    technicians, 
    tickets, 
    resetDemoData,
    currentUserSession,
    logoutUser
  } = useApp();

  const currentFundi = technicians.find((t) => t.id === activeFundiId) || technicians[0];
  const activeTicketsCount = tickets.filter(
    (t) => t.status === 'PAID_WAITING_DISPATCH' || t.status === 'EN_ROUTE' || t.status === 'ARRIVED' || t.status === 'IN_PROGRESS'
  ).length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black">
                <Wrench className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-white">Tech<span className="text-amber-400">Assist</span>TZ</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    WAMP & Expo
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  C:\wamp64\www\TechAssistTZ • REST API & Escrow
                </p>
              </div>
            </div>

            {/* Mobile Reset & Badge */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={resetDemoData}
                title="Weka upya mfumo"
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Role Navigation Bar */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setRole('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'landing'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>🏠</span>
              <span>Mwanzo & Usajili</span>
            </button>

            <button
              onClick={() => setRole('ai_chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'ai_chat'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400 font-bold'
                  : 'text-purple-300 hover:text-white hover:bg-slate-800/60 bg-purple-950/30 border border-purple-500/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>🤖 AI Uchunguzi</span>
            </button>

            <button
              onClick={() => setRole('mteja')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'mteja'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mteja</span>
            </button>

            <button
              onClick={() => setRole('fundi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'fundi'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Mtaalamu TEHAMA</span>
              {currentFundi.isExpelled ? (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              ) : currentFundi.consecutiveMissedCalls > 0 ? (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-950 text-red-300 font-bold border border-red-700">
                  {currentFundi.consecutiveMissedCalls}/3
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'admin'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin & Escrow</span>
              {activeTicketsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-400 text-slate-950 font-bold">
                  {activeTicketsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setRole('tests')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                role === 'tests'
                  ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/40 font-black ring-2 ring-emerald-200'
                  : 'text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/50 shadow-sm'
              }`}
              title="Fungua Dashibodi ya Majaribio (backend/src/tests/run_tests.js)"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>🧪 PIMA MFUMO (TESTS)</span>
            </button>

            <button
              onClick={() => setRole('architecture')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'architecture'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="C:\wamp64\www\TechAssistTZ"
            >
              <span>📂</span>
              <span className="hidden xl:inline">C:\wamp64</span>
            </button>
          </div>

          {/* Fundi Selector & Status (Visible when role is 'fundi') */}
          <div className="flex items-center gap-3">
            {role === 'fundi' ? (
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-400">Login kama:</span>
                <select
                  value={activeFundiId}
                  onChange={(e) => setActiveFundiId(e.target.value)}
                  className="bg-slate-900 text-white text-xs font-semibold rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} ({tech.trade}) {tech.isExpelled ? '⛔ [AMEONDOLEWA]' : tech.consecutiveMissedCalls > 0 ? `⚠️ [${tech.consecutiveMissedCalls}/3]` : '✅'}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {currentUserSession ? (
              <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-xs font-black">
                  {currentUserSession.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white max-w-[140px] truncate">
                    {currentUserSession.name}
                  </div>
                  <div className="text-[10px] text-amber-400 font-semibold truncate max-w-[140px]">
                    {currentUserSession.category}
                  </div>
                </div>
                <button
                  onClick={logoutUser}
                  className="px-2 py-1 text-[11px] font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded transition-colors"
                  title="Toka kwenye akaunti"
                >
                  Toka
                </button>
              </div>
            ) : null}

            <button
              onClick={resetDemoData}
              title="Rejesha mfumo katika hali ya awali ya majaribio"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Weka Upya</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
