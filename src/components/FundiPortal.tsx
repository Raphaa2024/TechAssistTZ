import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceTicket } from '../types';
import { LiveMapTracker } from './LiveMapTracker';
import { CannotAttendModal } from './CannotAttendModal';
import { ChatModal } from './ChatModal';
import { CallModal } from './CallModal';
import { InvoiceModal } from './InvoiceModal';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  ShieldAlert, 
  ShieldCheck, 
  DollarSign, 
  FastForward, 
  Check, 
  RotateCcw,
  Bike,
  FileText,
  Bot,
  Wallet
} from 'lucide-react';

export const FundiPortal: React.FC = () => {
  const { 
    activeFundiId, 
    technicians, 
    tickets, 
    startJourney, 
    advanceJourneyProgress, 
    markArrived, 
    startJobWork, 
    completeJob, 
    resetTechnicianStrikes 
  } = useApp();

  const currentFundi = technicians.find((t) => t.id === activeFundiId) || technicians[0];
  const fundiTickets = tickets.filter((t) => t.technicianId === currentFundi.id);
  const activeJob = fundiTickets.find((t) => 
    t.status === 'PAID_WAITING_DISPATCH' || 
    t.status === 'EN_ROUTE' || 
    t.status === 'ARRIVED' || 
    t.status === 'IN_PROGRESS'
  ) || fundiTickets[0] || null;

  // Hesabu Mapato ya Fundi
  const completedJobsList = fundiTickets.filter((t) => t.status === 'COMPLETED');
  const totalEarnings = completedJobsList.reduce((sum, ticket) => {
    const payout = ticket.invoice?.technicianPayoutAmount || Math.round(ticket.totalAmount * 0.85);
    return sum + payout;
  }, 0);

  // Modals
  const [cannotAttendOpen, setCannotAttendOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [reportResultAlert, setReportResultAlert] = useState<string | null>(null);

  const strikes = currentFundi.consecutiveMissedCalls || 0;
  const isExpelled = currentFundi.isExpelled || strikes >= 3;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Expelled Screen Lockout if 3 consecutive missed calls */}
      {isExpelled ? (
        <div className="bg-red-950/80 border-2 border-red-600 rounded-3xl p-8 text-center shadow-2xl space-y-4 max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center text-red-400 mx-auto text-3xl">
            ⛔
          </div>
          <h2 className="text-2xl font-black text-white">
            AMEONDOLEWA KWENYE MFUMO MARA MOJA!
          </h2>
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-red-500/40 text-xs text-red-200 leading-relaxed text-left space-y-2">
            <p>
              <strong>Fundi: {currentFundi.name}</strong>
            </p>
            <p>
              Mfumo umekufungia akaunti yako mara moja kwa mujibu wa kanuni ya nidhamu: <strong>Kushindwa kufika kwenye miito mitatu (3) mfululizo bila kuhudumia wateja.</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Tarehe ya Kuondolewa: {currentFundi.expelledDate ? new Date(currentFundi.expelledDate).toLocaleString() : 'Hivi Sasa'}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => resetTechnicianStrikes(currentFundi.id)}
              className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors border border-slate-700 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Ondoa Adhabu / Jaribu Upya (Demo Reset)</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Fundi Profile & Strike Meter Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-3xl shadow-lg">
                  🛠️
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
                  ✓
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{currentFundi.name}</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {currentFundi.trade}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kituo: <strong className="text-white">{currentFundi.currentLocation.name}</strong> | <span className="font-mono">{currentFundi.phone}</span>
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span>Kazi Zilizokamilika: <strong className="text-emerald-400">{currentFundi.completedJobs}</strong></span>
                  <span>•</span>
                  <span>Tathmini: <strong className="text-amber-400">⭐ {currentFundi.rating}</strong></span>
                </div>
              </div>
            </div>

            {/* CRITICAL 3-STRIKE DISCIPLINE DISPLAY */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 min-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kipimo cha Miito (Strikes)</span>
                </span>
                <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                  strikes === 0
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : strikes === 1
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}>
                  {strikes}/3 Miito
                </span>
              </div>

              {/* 3 Step Visual Blocks */}
              <div className="flex items-center gap-1.5 mb-2">
                {[1, 2, 3].map((step) => {
                  const active = step <= strikes;
                  const isLast = step === 3;
                  return (
                    <div
                      key={step}
                      className={`flex-1 h-2.5 rounded-full transition-all ${
                        active
                          ? isLast
                            ? 'bg-red-500 shadow-md shadow-red-500/50'
                            : 'bg-amber-500 shadow-md shadow-amber-500/50'
                          : 'bg-slate-800'
                      }`}
                    />
                  );
                })}
              </div>

              <p className="text-[10px] text-slate-400">
                {strikes === 0 && '✅ Rekodi safi. Hujakosa wito wowote mfululizo.'}
                {strikes === 1 && '⚠️ Onyo la kwanza: Wito 1 ulikosa kufika.'}
                {strikes === 2 && '🚨 TAHADHARI: Ukikosa wito mmoja tena mfululizo, utaondolewa kwenye mfumo mara moja!'}
              </p>
            </div>

          </div>

          {/* MKOBA WA PAYOUT WA FUNDI (TECHNICIAN EARNINGS WALLET) */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                <Wallet className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Akaunti ya Malipo (Payout Wallet)</p>
                <h3 className="text-2xl font-black text-white mt-0.5">
                  TZS {totalEarnings.toLocaleString()}
                </h3>
              </div>
            </div>

            {activeJob?.status === 'COMPLETED' ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-emerald-400 text-xs font-bold animate-pulse">
                <span>✓</span> Fedha za Kazi hii Zimeachiwa Kutoka Escrow!
              </div>
            ) : activeJob?.paymentStatus === 'HELD_BY_COMPANY_ESCROW' ? (
              <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-amber-400 text-xs font-bold">
                <span>🔒</span> Zipo Chini ya Escrow (Zitaachiwa Ukimaliza Kazi)
              </div>
            ) : null}
          </div>

          {/* Alert notification if a reassignment took place */}
          {reportResultAlert && (
            <div className="bg-amber-950/60 border border-amber-500/60 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{reportResultAlert}</span>
              </div>
              <button
                onClick={() => setReportResultAlert(null)}
                className="text-amber-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Active Job Working Area */}
          {activeJob ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Job Action Card */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* 1. Payment Received Notice & Transit Time Allowed */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Token ya Kazi</span>
                      <span className="text-sm font-bold text-amber-400 font-mono">{activeJob.tokenNumber}</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      TZS {activeJob.totalAmount.toLocaleString()} (Escrow)
                    </span>
                  </div>

                  {/* Customer Info Card */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{activeJob.customerName}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{activeJob.customerLocation.name} ({activeJob.distanceKm} km kutoka kwako)</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCallOpen(true)}
                          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                          title="Piga Simu ya Mteja"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setChatOpen(true)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow"
                          title="Fungua Ujumbe (Chat)"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                      "{activeJob.serviceDescription}"
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Eneo halisi: {activeJob.customerAddressDetail}
                    </p>
                  </div>

                  {/* AI Troubleshooting Summary */}
                  {activeJob.aiTroubleshootingSummary && (
                    <div className="bg-purple-950/40 border border-purple-500/40 rounded-2xl p-3.5 space-y-1.5 text-xs text-purple-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5 text-purple-300">
                          <Bot className="w-4 h-4 text-purple-400" />
                          <span>Uchunguzi wa AI Kabla ya Kufika:</span>
                        </span>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                          Ilishindikana Mtandaoni
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {activeJob.aiTroubleshootingSummary}
                      </p>
                    </div>
                  )}

                  {/* Invoice / Ankara Generation Action */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Ankara ya Huduma</span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {activeJob.invoice ? activeJob.invoice.invoiceNumber : 'Bado Haijatengenezwa'}
                      </span>
                    </div>

                    <button
                      onClick={() => setInvoiceOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{activeJob.invoice ? 'Hariri / Tazama Ankara' : 'Tengeneza Ankara'}</span>
                    </button>
                  </div>

                  {/* TRANSIT TIME ALLOWANCE & STATUS ACTIONS */}
                  {activeJob.status === 'PAID_WAITING_DISPATCH' && (
                    <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>PESA IMESHALIPWA KWA KAMPUNI!</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Kampuni imethibitisha malipo ya <strong>TZS {activeJob.totalAmount.toLocaleString()}</strong>. Unatakiwa kuanza safari kuelekea kwa mteja sasa hivi.
                      </p>

                      <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>Muda Uliopewa Kumfikia:</span>
                        </span>
                        <strong className="text-amber-400 font-mono text-sm">
                          Dk {activeJob.travelTimeAllowedMinutes} (kulingana na {activeJob.distanceKm} km)
                        </strong>
                      </div>

                      <button
                        onClick={() => startJourney(activeJob.id)}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>NIMEANZA SAFARI SASA</span>
                      </button>
                    </div>
                  )}

                  {activeJob.status === 'EN_ROUTE' && (
                    <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-2">
                          <Bike className="w-4 h-4 text-amber-400 animate-bounce" />
                          <span>UPO NJIANI KUELEKEA KWA MTEJA</span>
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                          {activeJob.routeProgress}%
                        </span>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Muda Unaokadiriwa:</span>
                        <strong className="text-white font-mono">Dk {activeJob.etaMinutesRemaining ?? activeJob.estimatedTransitMinutes} zimesalia</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => advanceJourneyProgress(activeJob.id, 25)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
                        >
                          <FastForward className="w-3.5 h-3.5 text-amber-400" />
                          <span>Songa Mbele (+25%)</span>
                        </button>
                        <button
                          onClick={() => markArrived(activeJob.id)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow"
                        >
                          Nimefika Mlangoni
                        </button>
                      </div>
                    </div>
                  )}

                  {activeJob.status === 'ARRIVED' && (
                    <div className="bg-blue-950/40 border border-blue-500/40 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-blue-300 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        <span>UMEWASILI KWA MTEJA</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Umefika eneo la mteja. Tafadhali thibitisha kuanza ukaguzi na kufanya kazi ya ufundi.
                      </p>
                      <button
                        onClick={() => startJobWork(activeJob.id)}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>ANZA KUFANYA KAZI (UCHUNGUZI & UTENGENEZAJI)</span>
                      </button>
                    </div>
                  )}

                  {activeJob.status === 'IN_PROGRESS' && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-white text-xs font-bold">
                        <Wrench className="w-4 h-4 text-amber-400 animate-spin" />
                        <span>KAZI INAENDELEA KUFANYIKA</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Baada ya kukamilisha matengenezo, mteja atathibitisha na pesa ya TZS {activeJob.totalAmount.toLocaleString()} itaachiwa kutoka Escrow kwenda kwenye akaunti yako.
                      </p>
                      <button
                        onClick={() => completeJob(activeJob.id)}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors"
                      >
                        Kazi Imekamilika
                      </button>
                    </div>
                  )}

                  {/* EMERGENCY CANNOT ATTEND BUTTON */}
                  {(activeJob.status === 'PAID_WAITING_DISPATCH' || activeJob.status === 'EN_ROUTE') && (
                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={() => setCannotAttendOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-950/80 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        <span>Toa Taarifa ya Kutoweza Kufika (Hitilafu ya Usafiri)</span>
                      </button>
                      <span className="text-[10px] text-slate-500 block text-center mt-1">
                        Token itapewa fundi mwingine aliye karibu ili mteja asisubiri.
                      </span>
                    </div>
                  )}

                </div>

              </div>

              {/* Right Column: Live Map & Direct Communication */}
              <div className="lg:col-span-7 space-y-4">
                <LiveMapTracker ticket={activeJob} />

                {/* Communication Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      <span>Mawasiliano na Mteja ({activeJob.customerName})</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCallOpen(true)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Piga Simu</span>
                      </button>
                      <button
                        onClick={() => setChatOpen(true)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
                      >
                        Fungua Chat
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
                    {activeJob.messages.length > 0 ? (
                      <p>
                        Ujumbe wa mwisho: <strong className="text-white">{activeJob.messages[activeJob.messages.length - 1].senderName}:</strong> {activeJob.messages[activeJob.messages.length - 1].text}
                      </p>
                    ) : (
                      <p>Hakuna ujumbe bado.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl mx-auto mb-3">
                📭
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Hakuna Tiketi Inayoendelea Sasa</h3>
              <p className="text-xs text-slate-400">
                Upo tayari kupokea miito mipya ya huduma za {currentFundi.trade}. Unaweza kubadili kwenda "Upande wa Mteja" ili kujaribu kutoa ombi jipya.
              </p>
            </div>
          )}

          {/* Cannot Attend Modal */}
          {activeJob && (
            <CannotAttendModal
              ticket={activeJob}
              fundi={currentFundi}
              isOpen={cannotAttendOpen}
              onClose={() => setCannotAttendOpen(false)}
              onSuccess={(res) => {
                setCannotAttendOpen(false);
                if (res.technicianExpelled) {
                  setReportResultAlert(`Umefikisha miito 3 mfululizo na umeondolewa kwenye mfumo mara moja.`);
                } else {
                  setReportResultAlert(`Taarifa imewasilishwa! Token ${activeJob.tokenNumber} imepewa fundi mpya: ${res.newTechnicianName}. Umepokea onyo (${res.strikes}/3).`);
                }
              }}
            />
          )}

          {/* Invoice Modal for Fundi */}
          {activeJob && (
            <InvoiceModal
              ticket={activeJob}
              isOpen={invoiceOpen}
              onClose={() => setInvoiceOpen(false)}
              isSpecialistView={true}
            />
          )}

          {/* Chat Modal */}
          {activeJob && (
            <ChatModal
              ticket={activeJob}
              isOpen={chatOpen}
              onClose={() => setChatOpen(false)}
            />
          )}

          {/* Call Modal */}
          {activeJob && (
            <CallModal
              ticket={activeJob}
              isOpen={callOpen}
              onClose={() => setCallOpen(false)}
            />
          )}
        </>
      )}

    </div>
  );
};