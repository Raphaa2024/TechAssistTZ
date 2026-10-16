import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  User, 
  ShieldAlert, 
  RotateCcw, 
  FlaskConical,
  FolderTree
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
    <header className="bg-slate-900/95 border-b border-slate-800 text-white sticky top-0 z-50 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2.5 gap-3">
          
          {/* Logo & Brand Info (Spana Juu Katikati ya Jina) */}
          <div className="flex items-center justify-between">
            <div 
              onClick={() => setRole('landing')}
              className="flex flex-col items-center justify-center cursor-pointer group py-1 select-none"
            >
              <div className="bg-gradient-to-tr from-amber-500 via-teal-500 to-emerald-400 p-2.5 rounded-2xl shadow-lg shadow-teal-500/20 group-hover:scale-110 group-hover:shadow-teal-500/40 transition-all duration-300 mb-1 border border-teal-400/30">
                <Wrench className="w-6 h-6 text-slate-950 font-black" />
              </div>
              <span className="text-xl md:text-2xl font-black text-white tracking-tight group-hover:text-teal-400 transition-colors leading-none">
                Tech<span className="text-amber-400">Assist</span><span className="text-teal-400">TZ</span>
              </span>
            </div>

            {/* Mobile Reset Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={resetDemoData}
                title="Weka upya mfumo"
                className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Role Navigation Bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
            <button
              onClick={() => setRole('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                role === 'landing'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>🏠</span>
              <span>Mwanzo</span>
            </button>

            <button
              onClick={() => setRole('ai_chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                role === 'ai_chat'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400 font-bold scale-[1.02]'
                  : 'text-purple-300 hover:text-white hover:bg-slate-800/60 bg-purple-950/30 border border-purple-500/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>🤖 AI Uchunguzi</span>
            </button>

            <button
              onClick={() => setRole('mteja')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                role === 'mteja'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/40 font-bold scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mteja</span>
            </button>

            <button
              onClick={() => setRole('fundi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                role === 'fundi'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Mtaalamu</span>
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40 font-bold scale-[1.02]'
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 relative ${
                role === 'tests'
                  ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/40 font-black ring-2 ring-emerald-200 scale-[1.02]'
                  : 'text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/50 shadow-sm'
              }`}
              title="Fungua Dashibodi ya Majaribio"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>🧪 PIMA MFUMO</span>
            </button>

            <button
              onClick={() => setRole('architecture')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                role === 'architecture'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400/40 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="C:\wamp64\www\TechAssistTZ"
            >
              <FolderTree className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>

          {/* User Session / Fundi Selector / Actions */}
          <div className="flex items-center justify-end gap-3">
            {role === 'fundi' && (
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-400 hidden sm:inline">Akaunti:</span>
                <select
                  value={activeFundiId}
                  onChange={(e) => setActiveFundiId(e.target.value)}
                  className="bg-slate-900 text-white text-xs font-semibold rounded-lg px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} ({tech.trade}) {tech.isExpelled ? '⛔ [AMEONDOLEWA]' : tech.consecutiveMissedCalls > 0 ? `⚠️ [${tech.consecutiveMissedCalls}/3]` : '✅'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentUserSession && (
              <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-xs font-black">
                  {currentUserSession.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white max-w-[120px] truncate leading-tight">
                    {currentUserSession.name}
                  </div>
                  <div className="text-[10px] text-amber-400 font-semibold truncate max-w-[120px]">
                    {currentUserSession.category}
                  </div>
                </div>
                <button
                  onClick={logoutUser}
                  className="px-2 py-1 text-[11px] font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                  title="Toka kwenye akaunti"
                >
                  Toka
                </button>
              </div>
            )}

            <button
              onClick={resetDemoData}
              title="Rejesha mfumo katika hali ya awali ya majaribio"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 active:scale-95"
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