import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TradeCategory, 
  Technician, 
  WardLocation, 
  ServiceTicket 
} from '../types';
import { WARDS, calculateDistance } from '../data/mockData';
import { LiveMapTracker } from './LiveMapTracker';
import { FarDistanceWarningModal } from './FarDistanceWarningModal';
import { PaymentModal } from './PaymentModal';
import { ChatModal } from './ChatModal';
import { CallModal } from './CallModal';
import { InvoiceModal } from './InvoiceModal';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  Star, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  PlusCircle, 
  CreditCard,
  Check,
  Zap,
  ArrowRight,
  Info,
  FileText,
  Printer,
  User,
  ArrowLeft
} from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const { 
    technicians, 
    tickets, 
    activeTicket, 
    selectedTicketId, 
    setSelectedTicketId, 
    createNewTicket,
    completeJob,
    setRole,
    currentUserSession
  } = useApp();

  // CHUJA TIKETI ZA MTEJA HUYU PEKEE (Data Privacy)
  const myTickets = tickets.filter((t) => {
    if (!currentUserSession) return false;
    return (
      t.customerPhone === currentUserSession.phone ||
      t.customerName === currentUserSession.name ||
      t.customerName === currentUserSession.orgName
    );
  });

  // Active view: 'tracking' | 'book_new'
  const [viewMode, setViewMode] = useState<'tracking' | 'book_new'>('tracking');

  // Booking Form State
  const [selectedTrade, setSelectedTrade] = useState<TradeCategory>('Kompyuta & Laptop');
  const [deviceModel, setDeviceModel] = useState('HP ProBook / Dell Latitude');
  const [customerWard, setCustomerWard] = useState<WardLocation>(() => {
    if (currentUserSession?.wardName) {
      const found = WARDS.find((w) => w.name.toLowerCase().includes(currentUserSession.wardName.toLowerCase()));
      if (found) return found;
    }
    return WARDS[0];
  });
  const [addressDetail, setAddressDetail] = useState('Mtaa wa Ada Estate, Nyumba Na. 14');
  const [problemDescription, setProblemDescription] = useState('Kompyuta inawaka taa lakini inatoa skrini nyeusi (No Display) na kuwaka feni kwa nguvu.');
  const [customerName, setCustomerName] = useState(() => currentUserSession?.orgName || currentUserSession?.name || 'Mteja');
  const [customerPhone, setCustomerPhone] = useState(() => currentUserSession?.phone || '+255 700 000 000');

  // Far Distance Warning Modal state
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [pendingTechnician, setPendingTechnician] = useState<Technician | null>(null);
  const [pendingDistanceCalc, setPendingDistanceCalc] = useState<{
    km: number;
    isFar: boolean;
    transitMinutes: number;
    transportFee: number;
  }>({ km: 0, isFar: false, transitMinutes: 0, transportFee: 0 });
  const [closerTechnician, setCloserTechnician] = useState<Technician | null>(null);
  const [closerDistanceKm, setCloserDistanceKm] = useState(0);

  // Modals
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('Mtaalamu amefika kwa wakati na kutatua tatizo la kompyuta kwa ustadi mkubwa.');

  const trades: { name: TradeCategory; icon: string; desc: string }[] = [
    { name: 'Kompyuta & Laptop', icon: '💻', desc: 'Hardware, Windows/Mac, Motherboard, Screen, Virus' },
    { name: 'Printers & Photocopy', icon: '🖨️', desc: 'Paper Jam, Canon, HP, Ricoh, Spooler, Toner' },
    { name: 'Networking & Wi-Fi', icon: '🌐', desc: 'MikroTik, Cisco, Routers, LAN Cable Cat6, Fiber' },
    { name: 'Software & Programming', icon: '💻', desc: 'Bugs, Database, Web/App Fixes, APIs, SSL' },
    { name: 'Simu & Tablets', icon: '📱', desc: 'Screen, Battery, Flashing, App Troubleshoot' },
    { name: 'CCTV & Vifaa vya Usalama', icon: '📹', desc: 'NVR/DVR, Biometric Time Attendance, Cameras' },
  ];

  // Filter available technicians for selected trade
  const availableTechsForTrade = technicians.filter(
    (t) => t.trade === selectedTrade && !t.isExpelled
  );

  // Handle clicking a technician in booking flow
  const handleSelectTechnician = (tech: Technician) => {
    const calc = calculateDistance(tech.currentLocation, customerWard);

    if (calc.isFar) {
      const closer = availableTechsForTrade.reduce<Technician | null>((acc, curr) => {
        if (curr.id === tech.id) return acc;
        const curDist = calculateDistance(curr.currentLocation, customerWard).km;
        if (!acc) return curDist < calc.km ? curr : null;
        const accDist = calculateDistance(acc.currentLocation, customerWard).km;
        return curDist < accDist ? curr : acc;
      }, null);

      const closerDist = closer ? calculateDistance(closer.currentLocation, customerWard).km : 0;

      setPendingTechnician(tech);
      setPendingDistanceCalc(calc);
      setCloserTechnician(closer);
      setCloserDistanceKm(closerDist);
      setWarningModalOpen(true);
    } else {
      finalizeBooking(tech);
    }
  };

  const finalizeBooking = (tech: Technician) => {
    setWarningModalOpen(false);
    const newTicket = createNewTicket({
      customerName,
      customerPhone,
      customerLocation: customerWard,
      customerAddressDetail: addressDetail,
      technicianId: tech.id,
      trade: selectedTrade,
      serviceDescription: problemDescription,
    });
    setSelectedTicketId(newTicket.id);
    setViewMode('tracking');
    setPaymentModalOpen(true);
  };

  const currentDisplayTicket = myTickets.find(t => t.id === selectedTicketId) || myTickets[0] || activeTicket || null;

  // Ikiwa mtumiaji hajazisajili au kuingia, mwelekeze kujisajili
  if (!currentUserSession) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-in fade-in duration-300">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">Hujaingia Kwenye Akaunti Yako</h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
            Ili kupata huduma za ufundi wa TEHAMA, kuomba fundi au kuangalia tiketi zako zilizopo, tafadhali chagua kategoria yako na uingie kwenye mfumo.
          </p>
          <button
            onClick={() => setRole('landing')}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 mx-auto active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Rudi Chagua Kategoria Yako</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
            👤
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Hujambo, {customerName}</span>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                {currentUserSession.category || customerWard.name}
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Weka ombi la fundi, fuatilia safari kwa wakati halisi, na lipa kwa usalama kupitia Escrow.
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('tracking')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'tracking'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Tiketi Zangu ({myTickets.length})</span>
          </button>

          <button
            onClick={() => setViewMode('book_new')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'book_new'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Omba Fundi Mpya</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'tracking' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Tickets Selector & Details */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Active Tickets List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Tiketi Zako za Huduma
              </h3>

              {myTickets.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  Bado hujatengeneza ombi lolote la ufundi.
                  <button 
                    onClick={() => setViewMode('book_new')}
                    className="block mx-auto mt-2 text-teal-400 font-bold hover:underline"
                  >
                    + Tengeneza Ombi la Kwanza Sasa
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {myTickets.map((t) => {
                    const isSelected = currentDisplayTicket?.id === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTicketId(t.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{t.trade}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800">
                              {t.tokenNumber}
                            </span>
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            t.status === 'EN_ROUTE'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : t.status === 'ARRIVED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : t.status === 'PAID_WAITING_DISPATCH'
                              ? 'bg-blue-500/20 text-blue-300'
                              : t.status === 'COMPLETED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {t.status === 'PENDING_PAYMENT' && 'Inasubiri Malipo'}
                            {t.status === 'PAID_WAITING_DISPATCH' && 'Imelipwa (Kuanza Safari)'}
                            {t.status === 'EN_ROUTE' && 'Fundi Yuko Njiani'}
                            {t.status === 'ARRIVED' && 'Amewasili Mlangoni'}
                            {t.status === 'IN_PROGRESS' && 'Kazi Inaendelea'}
                            {t.status === 'COMPLETED' && 'Imekamilika'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-1 mb-2">
                          {t.serviceDescription}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                          <span>Fundi: <strong className="text-white">{t.technicianName}</strong></span>
                          <span className="font-mono text-emerald-400 font-bold">
                            TZS {t.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Current Selected Ticket Card */}
            {currentDisplayTicket && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                
                {/* Reassignment Alert Banner */}
                {currentDisplayTicket.isReassignedToken && (
                  <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Token Imehamishiwa kwa Fundi Mpya!</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Fundi wa awali (<strong>{currentDisplayTicket.previousTechnicianName}</strong>) alipata hitilafu ya usafiri/dharura. Mfumo umempa token namba <strong>{currentDisplayTicket.tokenNumber}</strong> fundi <strong>{currentDisplayTicket.technicianName}</strong> bila malipo ya ziada.
                    </p>
                  </div>
                )}

                {/* Status Stage Stepper */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Hatua ya Huduma
                  </h4>
                  <div className="grid grid-cols-4 gap-1 text-center">
                    {[
                      { key: '1', title: 'Malipo', active: currentDisplayTicket.paymentStatus === 'HELD_BY_COMPANY_ESCROW' || currentDisplayTicket.status === 'COMPLETED' },
                      { key: '2', title: 'Safari', active: currentDisplayTicket.status === 'EN_ROUTE' || currentDisplayTicket.status === 'ARRIVED' || currentDisplayTicket.status === 'IN_PROGRESS' || currentDisplayTicket.status === 'COMPLETED' },
                      { key: '3', title: 'Ujio', active: currentDisplayTicket.status === 'ARRIVED' || currentDisplayTicket.status === 'IN_PROGRESS' || currentDisplayTicket.status === 'COMPLETED' },
                      { key: '4', title: 'Kazi', active: currentDisplayTicket.status === 'COMPLETED' },
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          step.active ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/40' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {step.active ? '✓' : i + 1}
                        </div>
                        <span className={`text-[10px] mt-1 ${step.active ? 'text-white font-semibold' : 'text-slate-500'}`}>
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technician Profile Card */}
                <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl overflow-hidden">
                      🛠️
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{currentDisplayTicket.technicianName}</h4>
                      <p className="text-xs text-amber-400 font-medium">Fundi wa {currentDisplayTicket.trade}</p>
                      <span className="text-[11px] text-slate-400 font-mono">{currentDisplayTicket.technicianPhone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCallModalOpen(true)}
                      className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
                      title="Piga Simu Moja kwa Moja"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setChatModalOpen(true)}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-md transition-colors relative"
                      title="Fungua Mazungumzo (Chat)"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {currentDisplayTicket.messages.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Payment Action */}
                {(currentDisplayTicket.status === 'PENDING_PAYMENT' || currentDisplayTicket.status === 'INVOICE_SENT') && (
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Ankara ya Matengenezo (Escrow)</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        TZS {currentDisplayTicket.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Fedha zinalipwa kwenye akaunti ya kampuni (Escrow) na zinakatwa 15% kwa uendeshaji; mtaalamu analipwa 85% baada ya wewe kuridhika.
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInvoiceModalOpen(true)}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Angalia Ankara Rasmi</span>
                      </button>

                      <button
                        onClick={() => setPaymentModalOpen(true)}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Lipa Escrow</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* In Progress & Job Confirmation */}
                {currentDisplayTicket.status === 'IN_PROGRESS' && (
                  <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-3.5 text-xs text-blue-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-blue-300">
                      <Wrench className="w-4 h-4" />
                      <span>Kazi Inaendelea Kufanywa Sasa</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Fundi anafanyia kazi tatizo. Kazi ikishakamilika bonyeza kitufe hapa chini ili kutoa tathmini na kumwachia malipo.
                    </p>
                    <button
                      onClick={() => completeJob(currentDisplayTicket.id, reviewRating, reviewComment)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span>✓</span>
                      <span>Thibitisha Kazi Imekamilika & Toa Malipo Escrow</span>
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Right Column: Live Map & Detailed Communication */}
          <div className="lg:col-span-7 space-y-4">
            {currentDisplayTicket ? (
              <>
                <LiveMapTracker ticket={currentDisplayTicket} />

                {/* Quick Communication Box */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>Ujumbe wa Moja kwa Moja na {currentDisplayTicket.technicianName}</span>
                    </h3>
                    <button
                      onClick={() => setChatModalOpen(true)}
                      className="text-xs text-emerald-400 hover:underline font-semibold"
                    >
                      Fungua Chat Kubwa
                    </button>
                  </div>

                  <div className="space-y-2 bg-slate-950 rounded-xl p-3 border border-slate-800">
                    {currentDisplayTicket.messages.slice(-2).map((m) => (
                      <div key={m.id} className="text-xs">
                        <span className="font-bold text-slate-300">{m.senderName}: </span>
                        <span className="text-slate-400">{m.text}</span>
                        <span className="text-[10px] text-slate-600 ml-2">({m.timestamp})</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setChatModalOpen(true)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tuma Ujumbe wa Haraka</span>
                    </button>

                    <button
                      onClick={() => setCallModalOpen(true)}
                      className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Piga Simu</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                Hakuna tiketi iliyochaguliwa. Bonyeza "Omba Fundi Mpya" hapo juu.
              </div>
            )}
          </div>

        </div>
      ) : (
        /* BOOKING NEW SERVICE VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Tengeneza Ombi Jipya la Fundi</h2>
            <p className="text-xs text-slate-400">
              Chagua aina ya huduma, thibitisha eneo lako, na mfumo utapendekeza mafundi kulingana na umbali na muda wa kufika.
            </p>
          </div>

          {/* Trade Category Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              1. Chagua Aina ya Ufundi:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {trades.map((t) => {
                const isSelected = selectedTrade === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => setSelectedTrade(t.name)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{t.icon}</span>
                    <span className="text-xs font-bold block text-white">{t.name}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location and Address Detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                2. Eneo Lako (Mtaa / Kata):
              </label>
              <select
                value={customerWard.name}
                onChange={(e) => {
                  const found = WARDS.find((w) => w.name === e.target.value) || WARDS[0];
                  setCustomerWard(found);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {WARDS.map((w) => (
                  <option key={w.name} value={w.name}>
                    {w.name} ({w.district})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Maelekezo Maalumu ya Nyumba / Geti:
              </label>
              <input
                type="text"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder="Mfano: Mtaa wa Mbuyuni, Nyumba ya tatu baada ya duka..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              3. Eleza Tatizo Linalohitaji Ufundi:
            </label>
            <textarea
              rows={2}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Eleza kile kilichoharibika au hitilafu..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Available Technicians List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 block">
                4. Chagua Fundi (Muda wa Safari & Umbali Unapigwa Mahesabu Moja kwa Moja):
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableTechsForTrade.length === 0 ? (
                <div className="col-span-full py-8 text-center text-slate-500 text-xs">
                  Hakuna fundi wa {selectedTrade} aliyepatikana kwa sasa.
                </div>
              ) : (
                availableTechsForTrade.map((tech) => {
                  const calc = calculateDistance(tech.currentLocation, customerWard);

                  return (
                    <div
                      key={tech.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        calc.isFar
                          ? 'bg-slate-950/70 border-amber-500/30 hover:border-amber-500/60'
                          : 'bg-slate-950 border-slate-800 hover:border-emerald-500/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="text-sm font-bold text-white">{tech.name}</h4>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              <span>Kituo: {tech.currentLocation.name}</span>
                            </p>
                          </div>

                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            calc.isFar
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {calc.isFar ? 'Mbali' : 'Karibu'}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 mb-3 line-clamp-2">
                          {tech.specialization}
                        </p>

                        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 mb-3 text-[11px]">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Umbali Halisi</span>
                            <strong className="text-white font-mono">{calc.km} km</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Muda wa Safari</span>
                            <strong className="text-amber-400 font-mono">~Dk {calc.transitMinutes}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Jumla (Huduma + Nauli)</span>
                          <span className="text-xs font-bold text-emerald-400 font-mono">
                            TZS {(tech.baseFee + calc.transportFee).toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => handleSelectTechnician(tech)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
                            calc.isFar
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          <span>Chagua</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Far Distance Warning Modal Component */}
      <FarDistanceWarningModal
        isOpen={warningModalOpen}
        technician={pendingTechnician}
        customerLocation={customerWard}
        distanceKm={pendingDistanceCalc.km}
        transitMinutes={pendingDistanceCalc.transitMinutes}
        transportFee={pendingDistanceCalc.transportFee}
        closerTechnician={closerTechnician}
        closerDistanceKm={closerDistanceKm}
        onConfirmChoice={() => pendingTechnician && finalizeBooking(pendingTechnician)}
        onChooseCloser={(closer) => finalizeBooking(closer)}
        onCancel={() => setWarningModalOpen(false)}
      />

      {/* Escrow Payment Modal */}
      {currentDisplayTicket && (
        <PaymentModal
          ticket={currentDisplayTicket}
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
        />
      )}

      {/* Direct Chat Modal */}
      {currentDisplayTicket && (
        <ChatModal
          ticket={currentDisplayTicket}
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
        />
      )}

      {/* Direct Call Modal */}
      {currentDisplayTicket && (
        <CallModal
          ticket={currentDisplayTicket}
          isOpen={callModalOpen}
          onClose={() => setCallModalOpen(false)}
        />
      )}

      {/* Invoice Modal for Customer */}
      {currentDisplayTicket && (
        <InvoiceModal
          ticket={currentDisplayTicket}
          isOpen={invoiceModalOpen}
          onClose={() => setInvoiceModalOpen(false)}
          isSpecialistView={false}
        />
      )}

    </div>
  );
};