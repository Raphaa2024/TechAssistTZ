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
  UserX,
  ScrollText,
  Receipt,
  Download,
  History
} from 'lucide-react';

type AdminTab = 'DASHBOARD' | 'KYC_VERIFICATION' | 'DISPUTES' | 'RECORDS';

export const AdminPortal: React.FC = () => {
  const { tickets, technicians, setRole } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  const [searchQuery, setSearchQuery] = useState('');

  // MAHESABU YA KIFEDHA YA SAFEPAY, VAT (18%) NA MAPATO YA KAMPUNI (15%)
  const financialStats = useMemo(() => {
    let safePayHeld = 0;
    let platformRevenue = 0;
    let vatCollected = 0;
    let totalPayouts = 0;

    tickets.forEach(ticket => {
      if (['PAID_WAITING_DISPATCH', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'].includes(ticket.status)) {
        safePayHeld += ticket.totalAmount;
      }
      
      if (ticket.status === 'COMPLETED') {
        const vat = ticket.totalAmount - (ticket.totalAmount / 1.18);
        const subtotal = ticket.totalAmount - vat;
        const platformFee = subtotal * 0.15;
        const techPayout = subtotal * 0.85;

        vatCollected += vat;
        platformRevenue += platformFee;
        totalPayouts += techPayout;
      }
    });

    return { safePayHeld, platformRevenue, vatCollected, totalPayouts };
  }, [tickets]);

  const unverifiedTechs = technicians.filter(t => !t.isExpelled && t.rating === 0);
  const completedTickets = tickets.filter(t => t.status === 'COMPLETED');

  const handleVerifyTech = (techId: string) => {
    alert(`Mtaalamu amehakikiwa na kupewa Tiki ya Kijani kikamilifu!`);
  };

  const handleRejectTech = (techId: string) => {
    alert(`Mtaalamu amekataliwa. Mfumo utamtumia SMS ya kurekebisha taarifa zake.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Jopo la Usimamizi & SafePay</h1>
            <p className="text-xs text-slate-400 mt-1">
              Dhibiti wataalamu (KYC), mzunguko wa fedha, na usalama wa TechAssistTZ.
            </p>
          </div>
        </div>

        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold shadow-inner w-full md:w-auto overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'DASHBOARD' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" /> SafePay
          </button>
          <button
            onClick={() => setActiveTab('RECORDS')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'RECORDS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ScrollText className="w-4 h-4" /> Kumbukumbu
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

      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="w-16 h-16 text-blue-400" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Fedha Kwenye SafePay</p>
              <h3 className="text-2xl font-black text-white font-mono">TZS {financialStats.safePayHeld.toLocaleString()}</h3>
              <p className="text-[10px] text-blue-400 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Zinasubiri kazi zikamilike
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign className="w-16 h-16 text-emerald-400" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mapato ya Mfumo (15%)</p>
              <h3 className="text-2xl font-black text-emerald-400 font-mono">TZS {financialStats.platformRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
              <p className="text-[10px] text-emerald-500 mt-2">Makato halisi ya TechAssistTZ</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Landmark className="w-16 h-16 text-amber-400" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kodi Inayosubiriwa TRA (18%)</p>
              <h3 className="text-2xl font-black text-amber-400 font-mono">TZS {financialStats.vatCollected.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
              <p className="text-[10px] text-amber-500 mt-2">VAT iliyokusanywa (Payable)</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="w-16 h-16 text-purple-400" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Malipo ya Wataalamu (85%)</p>
              <h3 className="text-2xl font-black text-white font-mono">TZS {financialStats.totalPayouts.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
              <p className="text-[10px] text-purple-400 mt-2">Pesa zilizolipwa kwa mafundi</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" /> Miamala ya Hivi Karibuni ya SafePay
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 whitespace-nowrap">
                <thead className="bg-slate-950/50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3 rounded-tl-xl">Token</th>
                    <th className="p-3">Mteja & Fundi</th>
                    <th className="p-3">Kiasi Kamili (VAT Incl.)</th>
                    <th className="p-3">Hali ya Pesa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tickets.slice(0, 6).map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-amber-400">{t.tokenNumber}</td>
                      <td className="p-3">
                        <div className="font-bold text-white">{t.customerName}</div>
                        <div className="text-[10px] text-slate-500">Fundi: {t.technicianName}</div>
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
                          {t.status === 'COMPLETED' ? 'Imeachiwa kwa Fundi' : t.status === 'PENDING_PAYMENT' ? 'Bado Kulipwa' : 'Inalindwa (SafePay)'}
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

      {activeTab === 'RECORDS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-400" /> Ankara za Wateja (Receipts)
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                Kumbukumbu za risiti zote za wateja waliolipia huduma kupitia mfumo. Risiti hizi zinajumuisha 18% VAT kwa ajili ya mamlaka (TRA).
              </p>

              {completedTickets.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-800">
                  Hakuna ankara zilizokamilika kwa sasa.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3 rounded-tl-xl">Ankara No.</th>
                        <th className="p-3">Mteja</th>
                        <th className="p-3">Jumla (TZS)</th>
                        <th className="p-3 rounded-tr-xl">Pakua</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {completedTickets.map(t => (
                        <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-3 font-mono text-emerald-400">{t.invoice?.invoiceNumber || `INV-${t.tokenNumber}`}</td>
                          <td className="p-3 font-bold text-white">{t.customerName}</td>
                          <td className="p-3 font-mono">{t.totalAmount.toLocaleString()}</td>
                          <td className="p-3">
                            <button className="p-1.5 bg-slate-800 hover:bg-emerald-600 rounded-lg text-slate-300 hover:text-white transition-colors" title="Pakua Ankara (PDF)">
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-400" /> Malipo ya Wataalamu (Payouts)
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                Kumbukumbu za pesa zilizotumwa kwa wataalamu baada ya kazi kukamilika na mteja kuridhika (Hiki ni kiasi cha 85% baada ya makato).
              </p>

              {completedTickets.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-800">
                  Hakuna malipo yaliyofanyika kwa wataalamu bado.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3 rounded-tl-xl">Token</th>
                        <th className="p-3">Mtaalamu</th>
                        <th className="p-3">Pesa Iliyotumwa</th>
                        <th className="p-3 rounded-tr-xl">Hali</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {completedTickets.map(t => {
                        const vat = t.totalAmount - (t.totalAmount / 1.18);
                        const subtotal = t.totalAmount - vat;
                        const payout = subtotal * 0.85;

                        return (
                          <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-3 font-mono text-slate-400">{t.tokenNumber}</td>
                            <td className="p-3 font-bold text-white">{t.technicianName}</td>
                            <td className="p-3 font-mono text-purple-400 font-bold">TZS {payout.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                            <td className="p-3">
                              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full w-max border border-emerald-500/20">
                                <CheckCircle className="w-3 h-3" /> Imelipwa
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'KYC_VERIFICATION' && (
        <div className="space-y-6">
          <div className="bg-blue-950/20 border border-blue-500/30 p-4 rounded-2xl flex items-start gap-3 text-blue-200 text-xs leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <p>
              Hapa kuna orodha ya wataalamu wapya waliojisajili. Tafadhali kagua Picha zao za Pasipoti, Vyeti, na Uzoefu wao wa Kazi.
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
                  {/* ... KYC Details zilizopo ... */}
                  <div className="p-5 border-b border-slate-800 flex gap-4 bg-slate-950/40">
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0 overflow-hidden relative group cursor-pointer">
                      <span className="text-3xl">👨‍🔧</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{tech.name}</h3>
                      <p className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded inline-block mt-1 border border-amber-500/20">
                        {tech.trade}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1.5 font-mono">{tech.phone}</p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
                    <button onClick={() => handleRejectTech(tech.id)} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-300 font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-700 hover:border-red-500/50">
                      <XCircle className="w-4 h-4" /> Katalia
                    </button>
                    <button onClick={() => handleVerifyTech(tech.id)} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Thibitisha
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'DISPUTES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-xl max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🎉</div>
          <h3 className="text-lg font-black text-white mb-2">Hakuna Migogoro (Zero Disputes)</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Hongera! Mfumo unafanya kazi kwa ufanisi. Pesa zote za SafePay zimelipwa kwa usalama bila malalamiko yoyote.
          </p>
        </div>
      )}
    </div>
  );
};