import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AiTroubleshooterChat } from './components/AiTroubleshooterChat';
import { CustomerPortal } from './components/CustomerPortal';
import { FundiPortal } from './components/FundiPortal';
import { AdminPortal } from './components/AdminPortal';
import { TechAssistExplorer } from './components/TechAssistExplorer';
import { SystemTestsRunner } from './components/SystemTestsRunner';
import { WARDS } from './data/mockData';
import { 
  Monitor, 
  Smartphone, 
  Home, 
  Bot, 
  User, 
  Wrench, 
  ShieldCheck,
  LogOut
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    role, 
    setRole, 
    technicians, 
    isMobilePreview, 
    setIsMobilePreview,
    createNewTicket
  } = useApp();

  // ==========================================
  // AUTO-LOGOUT YA SUPERADMIN BAADA YA DAKIKA 1
  // ==========================================
  useEffect(() => {
    // Kama hayupo kwenye chumba cha Superadmin, usifanye chochote
    if (role !== 'tests' && role !== 'architecture') return;

    let timeoutId: NodeJS.Timeout;

    // Kazi ya kumtoa nje na kumrudisha Mwanzo
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setRole('landing'); // Mtoe nje baada ya sekunde 60 za ukimya
      }, 60000); // 60000ms = Dakika 1
    };

    // Anzisha timer mara tu anapoingia
    resetTimer();

    // Endapo atatikisa mouse, kusscroll, au kutype, timer inaanza upya!
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    // Safisha timer akitoka kwa hiari
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [role, setRole]);

  // Kitendo cha AI kuhamisha taarifa kwenda kwenye Tiketi ya Mteja
  const handleAiEscalation = (data: {
    trade: any;
    deviceType: string;
    description: string;
    aiSummary: string;
    attemptedFixes: string[];
  }) => {
    const matchTech = technicians.find((t) => t.trade === data.trade && !t.isExpelled) || technicians[0];
    const customerLocation = WARDS[0];

    createNewTicket({
      customerName: 'Mteja Kutoka AI',
      customerPhone: '+255 700 000 000',
      customerOrgType: 'Binafsi',
      customerOrgName: 'Huduma za Haraka',
      customerLocation,
      customerAddressDetail: 'Taarifa za AI Triage',
      technicianId: matchTech.id,
      trade: data.trade,
      deviceType: data.deviceType,
      serviceDescription: data.description,
      aiTroubleshootingSummary: data.aiSummary,
    });

    setRole('mteja'); 
  };

  const renderCurrentPage = () => {
    switch (role) {
      case 'landing': return <LandingPage />;
      case 'ai_chat': return <AiTroubleshooterChat onEscalateToTicket={handleAiEscalation} />;
      case 'mteja': return <CustomerPortal />;
      case 'fundi': return <FundiPortal />;
      case 'admin': return <AdminPortal />;
      case 'architecture': return <TechAssistExplorer />;
      case 'tests': return <SystemTestsRunner />;
      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      <Header />

      {/* SUB-BAR YA SUPERADMIN YENYE KITUFE CHA LOGOUT */}
      {(role === 'tests' || role === 'architecture') && (
        <div className="bg-slate-900/90 border-b border-red-500/30 py-2 px-4 sticky top-0 z-40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-red-400 font-black hidden sm:inline">SUPERADMIN MODE:</span>
              <span className="truncate text-slate-400 text-[10px]">(Auto-Logout ndani ya Dk 1)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobilePreview(!isMobilePreview)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                  isMobilePreview 
                    ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {isMobilePreview ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isMobilePreview ? 'Rudi Kwenye Web' : 'Fungua Programu ya Simu'}</span>
              </button>

              {/* KITUFE CHA SUPERADMIN LOGOUT */}
              <button
                onClick={() => setRole('landing')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Funga Mfumo</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ENEO KUU LA MUONEKANO (MAIN CONTENT) */}
      <main className="flex-1 pb-16">
        {isMobilePreview ? (
          <div className="py-8 flex flex-col items-center justify-center bg-slate-950 px-2 sm:px-4">
            <div className="w-full max-w-[400px] h-[820px] bg-slate-950 border-[6px] border-slate-700/90 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative ring-4 ring-slate-800/50 shadow-teal-900/20">
              
              <div className="pt-2 pb-1 bg-slate-950 flex flex-col items-center shrink-0 z-30">
                <div className="w-24 h-5 bg-slate-900 rounded-full flex items-center justify-between px-3 border border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-slate-950" />
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500/70" />
                </div>
              </div>

              <div className="px-6 py-1 text-[11px] font-bold text-slate-400 flex justify-between items-center bg-slate-950 shrink-0 select-none">
                <span className="font-mono">12:00</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>📶 5G</span>
                  <span>100% 🔋</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-0 scroll-smooth bg-slate-900">
                {renderCurrentPage()}
              </div>

              <div className="bg-slate-950 border-t border-slate-800 py-3 px-4 flex items-center justify-between shrink-0 z-30 pb-6">
                {[
                  { id: 'landing', icon: <Home className="w-5 h-5" />, label: 'Mwanzo' },
                  { id: 'mteja', icon: <User className="w-5 h-5" />, label: 'Mteja' },
                  { id: 'ai_chat', icon: <Bot className="w-5 h-5" />, label: 'AI Chat' },
                  { id: 'fundi', icon: <Wrench className="w-5 h-5" />, label: 'Fundi' },
                  { id: 'admin', icon: <ShieldCheck className="w-5 h-5" />, label: 'Admin' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRole(item.id as any)}
                    className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-2 rounded-xl transition-colors ${
                      role === item.id ? 'text-teal-400 bg-teal-500/10' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderCurrentPage()}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-8 pb-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-center">
            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-slate-500 text-[11px] font-medium mb-1">👥 Waliotembelea Mfumo</span>
              <span className="text-base sm:text-lg font-extrabold text-teal-400 font-mono tracking-wider">12,480+</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-500 text-[11px] font-medium">Waliopo Mtandaoni</span>
              </div>
              <span className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono tracking-wider">142 Live</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-slate-500 text-[11px] font-medium mb-1">🔧 Wataalamu</span>
              <span className="text-base sm:text-lg font-extrabold text-amber-400 font-mono tracking-wider">{technicians.length} Wajuzi</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-slate-500 text-[11px] font-medium mb-1">🛡️ Mfumo wa Escrow</span>
              <span className="text-xs font-bold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">Salama 100%</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60 text-center md:text-left">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-white font-extrabold text-sm tracking-tight">Tech<span className="text-amber-400">Assist</span><span className="text-teal-400">TZ</span></span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 text-xs">Usaidizi wa TEHAMA & Escrow Tanzania</span>
              </div>
              <p className="text-[11px] text-slate-500">Mfumo wa Kitaalamu unaounganisha Wateja na Wataalamu wa TEHAMA nchi nzima.</p>
            </div>
            <div className="text-[11px] text-slate-500 flex flex-col items-center md:items-end">
              <span>© {new Date().getFullYear()} TechAssistTZ. Haki zote zimehifadhiwa.</span>
              <span className="text-[10px] text-slate-600 mt-0.5">Haki Miliki na Muundo na TechAssistTZ Team</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}