import React from 'react';
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
  FlaskConical, 
  Home, 
  Bot, 
  User, 
  Wrench, 
  ShieldCheck 
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

    setRole('mteja'); // Mpeleke mteja kwenye portal yake baada ya AI kumaliza
  };

  // Sehemu inayosimamia kuonyesha ukurasa sahihi kulingana na Role
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

      {/* SUB-BAR YA JUU: Kudhibiti Simulator ya Simu */}
      <div className="bg-slate-900/60 border-b border-slate-800/60 py-2 px-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-slate-200 font-semibold hidden sm:inline">TechAssistTZ Live:</span>
            <span className="truncate">Mfumo wa Usaidizi wa TEHAMA & Escrow Tanzania</span>
          </div>

          <button
            onClick={() => setIsMobilePreview(!isMobilePreview)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isMobilePreview 
                ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {isMobilePreview ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{isMobilePreview ? 'Rudi Kwenye Web' : 'Fungua Programu ya Simu'}</span>
          </button>
        </div>
      </div>

      {/* ENEO KUU LA MUONEKANO (MAIN CONTENT) */}
      <main className="flex-1 pb-16">
        {isMobilePreview ? (
          /* =========================================
             SIMULATOR YA SIMU YA MKONONI (MOBILE VIEW)
             ========================================= */
          <div className="py-8 flex flex-col items-center justify-center bg-slate-950 px-2 sm:px-4">
            <div className="w-full max-w-[400px] h-[820px] bg-slate-950 border-[6px] border-slate-700/90 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative ring-4 ring-slate-800/50 shadow-teal-900/20">
              
              {/* Notch / Dynamic Island */}
              <div className="pt-2 pb-1 bg-slate-950 flex flex-col items-center shrink-0 z-30">
                <div className="w-24 h-5 bg-slate-900 rounded-full flex items-center justify-between px-3 border border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-slate-950" />
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500/70" />
                </div>
              </div>

              {/* Status Bar */}
              <div className="px-6 py-1 text-[11px] font-bold text-slate-400 flex justify-between items-center bg-slate-950 shrink-0 select-none">
                <span className="font-mono">12:00</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>📶 5G</span>
                  <span>100% 🔋</span>
                </div>
              </div>

              {/* Ukurasa Unaoonekana Kwenye Simu */}
              <div className="flex-1 overflow-y-auto p-0 scroll-smooth bg-slate-900">
                {renderCurrentPage()}
              </div>

              {/* Bottom Navigation ya Simu (Menyu ya Chini) */}
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
          /* =========================================
             MUONEKANO WA KOMPYUTA (DESKTOP WEB VIEW)
             ========================================= */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderCurrentPage()}
          </div>
        )}
      </main>

      {/* KITUFE KINACHOELEA KWA AJILI YA MAJARIBIO (FLOATING BUTTON) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setRole('tests')}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-teal-400 font-bold text-xs shadow-2xl border border-teal-500/30 transition-all hover:scale-105"
        >
          <FlaskConical className="w-4 h-4" />
          <span className="hidden sm:inline">PIMA MFUMO (TESTS)</span>
        </button>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <span className="text-white font-bold text-sm">TechAssistTZ</span>
            <span className="hidden md:inline">•</span>
            <span>Usaidizi wa TEHAMA, AI Triage & Malipo ya Escrow</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3 text-slate-400 font-medium">
            <span className="bg-slate-800 px-2 py-1 rounded">🛡️ Escrow Secure</span>
            <span className="bg-slate-800 px-2 py-1 rounded">🤖 AI Diagnostics</span>
            <span className="bg-slate-800 px-2 py-1 rounded">📍 GPS Matching</span>
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