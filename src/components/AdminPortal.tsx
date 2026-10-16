import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  DollarSign, 
  Wrench, 
  Users, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    technicians, 
    tickets, 
    reinstateTechnician, 
    resetTechnicianStrikes 
  } = useApp();

  const totalEscrow = tickets
    .filter((t) => t.paymentStatus === 'HELD_BY_COMPANY_ESCROW')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const totalCompletedPaid = tickets
    .filter((t) => t.paymentStatus === 'RELEASED_TO_FUNDI')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const expelledTechs = technicians.filter((t) => t.isExpelled || t.consecutiveMissedCalls >= 3);
  const warnedTechs = technicians.filter((t) => !t.isExpelled && t.consecutiveMissedCalls > 0);
  const reassignedTickets = tickets.filter((t) => t.isReassignedToken);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Admin Dashboard Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-500/30">
              Usimamizi wa Kampuni & Malipo ya Escrow
            </span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">
            Dawati Kuu la Dispatch & Nidhamu ya Mafundi
          </h1>
          <p className="text-xs text-slate-400">
            Ufuatiliaji wa fedha zilizoshikiliwa na kampuni, usambazaji wa tiketi, na utekelezaji wa kanuni ya miito mitatu.
          </p>
        </div>

        {/* Financial Highlights */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Pesa Iko Kwenye Escrow</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              TZS {totalEscrow.toLocaleString()}
            </span>
          </div>
          <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Zilizolipwa kwa Mafundi</span>
            <span className="text-sm font-bold text-blue-400 font-mono">
              TZS {totalCompletedPaid.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Discipline & Expelled Techs Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Expelled & Warned Technicians (Compliance Desk) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold text-white">
                  Dawati la Nidhamu: Kanuni ya Miito 3 Mfululizo
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                Walioondolewa: <strong className="text-red-400">{expelledTechs.length}</strong>
              </span>
            </div>

            {/* Expelled Technicians Notice */}
            {expelledTechs.length === 0 ? (
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Hakuna fundi aliyeondolewa kwenye mfumo kwa sasa. Wote wapo kwenye kiwango kinachotakiwa.</span>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">
                  Mafundi Walioondolewa Mara Moja (3/3 Miito):
                </span>
                {expelledTechs.map((tech) => (
                  <div
                    key={tech.id}
                    className="bg-red-950/40 border border-red-600/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{tech.name}</span>
                        <span className="text-[10px] bg-red-600 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                          3/3 AMEONDOLEWA
                        </span>
                      </div>
                      <p className="text-[11px] text-red-200 mt-1">
                        {tech.expelledReason || 'Ameshindwa kuhudhuria miito mitatu mfululizo.'}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Simu: {tech.phone} • Kituo: {tech.currentLocation.name}
                      </span>
                    </div>

                    <button
                      onClick={() => reinstateTechnician(tech.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 text-xs font-bold transition-colors whitespace-nowrap shadow"
                      title="Rejesha fundi baada ya kupitia rufaa yake ya dharura"
                    >
                      Rejesha Kwenye Mfumo
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Warned Technicians List */}
            {warnedTechs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Mafundi Wenye Maonyo (Karibu na Kikomo cha 3):
                </span>
                {warnedTechs.map((tech) => (
                  <div
                    key={tech.id}
                    className="bg-slate-950 rounded-xl p-3 border border-amber-500/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{tech.name} ({tech.trade})</span>
                      <p className="text-[10px] text-slate-400">
                        Ameshakosa miito {tech.consecutiveMissedCalls}/3. Wito mwingine utakaoachwa utamwondoa!
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono text-[10px]">
                        {tech.consecutiveMissedCalls}/3 Maonyo
                      </span>
                      <button
                        onClick={() => resetTechnicianStrikes(tech.id)}
                        className="text-[10px] text-slate-400 hover:text-white underline"
                      >
                        Futa Maonyo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Reassignment Audit Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Kumbukumbu ya Uhamishaji wa Token (Reassignment Log)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Kila fundi anapotoa taarifa ya kutofika kutokana na usafiri au dharura, mfumo huhamisha token moja kwa moja:
            </p>

            {reassignedTickets.length === 0 ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-500 text-center">
                Hakuna token iliyohamishwa bado. (Kujaribu, ingia upande wa fundi na ubonyeze 'Toa Taarifa ya Kutoweza Kufika').
              </div>
            ) : (
              <div className="space-y-2">
                {reassignedTickets.map((t) => (
                  <div key={t.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-400">{t.tokenNumber}</span>
                      <span className="text-[10px] text-slate-400">{t.trade}</span>
                    </div>
                    <p className="text-slate-300">
                      Ilihamishwa kutoka: <strong className="text-red-300">{t.previousTechnicianName}</strong> ➔ Kwenda kwa:{' '}
                      <strong className="text-emerald-300">{t.technicianName}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500 italic">
                      Sababu: "{t.cancellationReason}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: All City Tickets Overview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Tiketi Zote Zinazoendelea Jijini</h3>
              </div>
              <span className="text-xs font-mono text-slate-400 font-bold">
                Jumla: {tickets.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono bg-slate-900 text-amber-400 px-2 py-0.5 rounded border border-slate-800">
                        {t.tokenNumber}
                      </span>
                      <span className="text-xs font-bold text-white">{t.trade}</span>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-400">
                      TZS {t.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Mteja</span>
                      <strong className="text-white">{t.customerName}</strong>
                      <span className="block text-[10px] text-slate-400">{t.customerLocation.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Fundi Aliyekabidhiwa</span>
                      <strong className="text-white">{t.technicianName}</strong>
                      <span className="block text-[10px] text-amber-400">{t.distanceKm} km (~dk {t.estimatedTransitMinutes})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">
                      Hali: <strong className="text-white">{t.status}</strong>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.paymentStatus === 'HELD_BY_COMPANY_ESCROW'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : t.paymentStatus === 'RELEASED_TO_FUNDI'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {t.paymentStatus === 'HELD_BY_COMPANY_ESCROW' ? 'Pesa ipo Escrow' : t.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
