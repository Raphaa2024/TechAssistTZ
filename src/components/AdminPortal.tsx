import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search, 
  Wallet,
  Landmark,
  FileText,
  BadgeCheck,
  UserX
} from 'lucide-react';

type AdminTab = 'DASHBOARD' | 'KYC_VERIFICATION' | 'DISPUTES';

export const AdminPortal: React.FC = () => {
  const { tickets, technicians, setRole } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  const [searchQuery, setSearchQuery] = useState('');

  // MAHESABU YA KIFEDHA YA ESCROW, VAT (18%) NA MAPATO YA KAMPUNI (15%)
  const financialStats = useMemo(() => {
    let escrowHeld = 0;
    let platformRevenue = 0;
    let vatCollected = 0;
    let totalPayouts = 0;

    tickets.forEach(ticket => {
      // Kama pesa imeshalipwa na ipo kwenye mzunguko (Escrow)
      if (['PAID_WAITING_DISPATCH', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'].includes(ticket.status)) {
        escrowHeld += ticket.totalAmount;
      }
      
      // Kama kazi imekamilika na pesa imeachiwa (Completed)
      if (ticket.status === 'COMPLETED') {
        const vat = ticket.totalAmount - (ticket.totalAmount / 1.18); // Kutoa 18% VAT ndani ya Jumla
        const subtotal = ticket.totalAmount - vat;
        const platformFee = subtotal * 0.15; // 15% ya Mfumo
        const techPayout = subtotal * 0.85; // 85% ya Fundi

        vatCollected += vat;
        platformRevenue += platformFee;
        totalPayouts += techPayout;
      }
    });

    return { escrowHeld, platformRevenue, vatCollected, totalPayouts };
  }, [tickets]);

  // CHUJA WATAALAMU AMBAO HAWAJATHIBITISHWA (KYC PENDING)
  // Kwa mfumo huu tuna-assume mafundi ambao hawana "isVerified" kwenye DB ni wapya
  const unverifiedTechs = technicians.filter(t => !t.isExpelled && t.rating === 0);

  const handleVerifyTech = (techId: string) => {
    alert(`Mtaalamu amehakikiwa na kupewa Tiki ya Kijani kikamilifu! Sasa ataonekana kwa wateja.`);
    // Hapa utaweka logic ya backend kuidhinisha: updateTechnician(techId, { isVerified: true })
  };

  const handleRejectTech = (techId: string) => {
    alert(`Mtaalamu amekataliwa. Mfumo utamtumia SMS ya kurekebisha taarifa zake.`);
    // Hapa utaweka logic ya kumkataa
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER YA ADMIN */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Jopo la Usimamizi & Escrow</h1>
            <p className="text-xs text-slate-400 mt-1">
              Dhibiti wataalamu (KYC), mzunguko wa fedha, na usalama wa TechAssistTZ.
            </p>
          </div>
        </div>

        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold shadow-inner w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'DASHBOARD' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" /> Escrow & Fedha
          </button>
          <button
            onClick={() => setActiveTab('KYC_VERIFICATION')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'KYC_VERIFICATION' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BadgeCheck className="w-4 h-4" /> KYC Uhakiki
            {unverifiedTechs.length > 0 && (
              <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px] animate-pulse">
                {unverifiedTechs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('DISPUTES')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'DISPUTES' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Migogoro
          </button>
        </div>
      </div>

      {/* ----------------- TAB: DASHBOARD & ESCROW ----------------- */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* VIBUKU VYA FEDHA (FINANCIAL CARDS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Escrow Held */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="w-16 h-16 text-blue-400" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Fedha Kwenye Escrow</p>
              <h3 className="text-2xl font-black text-white font-mono">TZS {financialStats.escrowHeld.toLocaleString()}</h3>
              <p className="text-[10px] text-blue-400 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Pesa hizi zinasubiri kazi zikamilike
              </p>
            </div>

            {/* Platform Revenue */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign className="w-16 h-16 text-emerald-400" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mapato ya Mfumo (15%)</p>
              <h3 className="text-2xl font-black text-emerald-400 font-mono">TZS {financialStats.platformRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
              <p className="text-[10px] text-emerald-500 mt-2">Makato halisi ya TechAssistTZ (Net)</p>
            </div>

            {/* VAT Collected */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Landmark className="w-16 h-16 text-amber-400" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kodi Inayosubiriwa TRA (18%)</p>
              <h3 className="text-2xl font-black text-amber-400 font-mono">TZS {financialStats.vatCollected.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
              <p className="text-[10px] text-amber-500 mt-2">VAT iliyokusanywa kutoka kwa wateja</p>
            </div>

            {/* Total Payouts */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="w-16 h-16 text-purple-400" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Malipo ya Wataalamu (85%)</p>
              <h3 className="text-2xl font-black text-white font-mono">TZS {financialStats.totalPayouts.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
              <p className="text-[10px] text-purple-400 mt-2">Pesa zilizolipwa kwa mafundi (Payouts)</p>
            </div>

          </div>

          {/* Orodha ya Tiketi Kwenye Escrow (Recent Escrow Transactions) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" /> Muamala ya Hivi Karibuni ya Escrow
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 whitespace-nowrap">
                <thead className="bg-slate-950/50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3 rounded-tl-xl">Token</th>
                    <th className="p-3">Mteja & Fundi</th>
                    <th className="p-3">Kiasi Kamili (VAT Incl.)</th>
                    <th className="p-3">Hali ya Pesa (Escrow)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tickets.slice(0, 6).map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-amber-400">{t.tokenNumber}</td>
                      <td className="p-3">
                        <div className="font-bold text-white">{t.customerName}</div>
                        <div className="text-[10px] text-slate-500">Kuelekea kwa: {t.technicianName}</div>
                      </td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">
                        TZS {t.totalAmount.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          t.status === 'PENDING_PAYMENT' ? 'bg-slate-800 text-slate-400' : 
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {t.status === 'COMPLETED' ? 'Imeachiwa kwa Fundi' : t.status === 'PENDING_PAYMENT' ? 'Bado Kulipwa' : 'Imeshikiliwa (Escrow)'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* ----------------- TAB: KYC VERIFICATION ----------------- */}
      {activeTab === 'KYC_VERIFICATION' && (
        <div className="space-y-6">
          <div className="bg-blue-950/20 border border-blue-500/30 p-4 rounded-2xl flex items-start gap-3 text-blue-200 text-xs leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <p>
              Hapa kuna orodha ya wataalamu wapya waliojisajili. Tafadhali kagua <strong className="text-white">Picha zao za Pasipoti, Vyeti, na Uzoefu wao wa Kazi</strong>. 
              Kuwaidhinisha kutawapa beji ya "Verified" na wataanza kuonekana kwenye ramani kwa wateja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unverifiedTechs.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-3xl">
                <UserX className="w-12 h-12 mx-auto mb-3 text-slate-700" />
                <p>Hakuna Mtaalamu Mpya anayesubiri uhakiki kwa sasa.</p>
              </div>
            ) : (
              unverifiedTechs.map(tech => (
                <div key={tech.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col">
                  
                  {/* Photo & Basic Info */}
                  <div className="p-5 border-b border-slate-800 flex gap-4 bg-slate-950/40">
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0 overflow-hidden relative group cursor-pointer">
                      {/* Tukiwa na picha halisi itaonekana hapa, kwa sasa tunaweka placeholder */}
                      <span className="text-3xl">👨‍🔧</span>
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{tech.name}</h3>
                      <p className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded inline-block mt-1 border border-amber-500/20">
                        {tech.trade}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1.5 font-mono">{tech.phone}</p>
                      <p className="text-[11px] text-slate-400">Kituo: {tech.currentLocation.name}</p>
                    </div>
                  </div>

                  {/* KYC Details */}
                  <div className="p-5 flex-1 space-y-4 text-xs">
                    <div>
                      <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider text-[10px]">Uzoefu wa Kazi</span>
                      <p className="text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 line-clamp-3">
                        Miaka 4 akifanya kazi za IT Support na ufungaji wa mifumo ya CCTV kwenye kampuni mbalimbali.
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider text-[10px]">Ujuzi (Skills)</span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">Networking</span>
                        <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">CCTV Setup</span>
                        <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">Hardware Repair</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider text-[10px]">Vyeti / Vielelezo</span>
                      <button className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Tazama Vyeti 2 vilivyopakiwa
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
                    <button 
                      onClick={() => handleRejectTech(tech.id)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-300 font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-700 hover:border-red-500/50"
                    >
                      <XCircle className="w-4 h-4" /> Katalia
                    </button>
                    <button 
                      onClick={() => handleVerifyTech(tech.id)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" /> Thibitisha
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}


      {/* ----------------- TAB: DISPUTES ----------------- */}
      {activeTab === 'DISPUTES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-xl max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            🎉
          </div>
          <h3 className="text-lg font-black text-white mb-2">Hakuna Migogoro (Zero Disputes)</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Hongera! Mfumo unafanya kazi kwa ufanisi na wateja wote wameridhishwa na huduma za wataalamu. Pesa zote za Escrow zimelipwa kwa usalama bila malalamiko yoyote.
          </p>
        </div>
      )}

    </div>
  );
};