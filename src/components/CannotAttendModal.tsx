import React, { useState } from 'react';
import { ServiceTicket, Technician } from '../types';
import { useApp } from '../context/AppContext';
import { AlertOctagon, ShieldAlert, Bike, CloudRain, Clock, AlertTriangle, X } from 'lucide-react';

interface CannotAttendModalProps {
  ticket: ServiceTicket;
  fundi: Technician;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: { reassigned: boolean; newTechnicianName?: string; technicianExpelled: boolean; strikes: number }) => void;
}

export const CannotAttendModal: React.FC<CannotAttendModalProps> = ({
  ticket,
  fundi,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { fundiReportCannotAttend } = useApp();
  const [selectedReason, setSelectedReason] = useState('Hitilafu ya Usafiri (Pikipiki/Gari imezimika au kupata pancha)');
  const [extraDetails, setExtraDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentStrikes = fundi.consecutiveMissedCalls || 0;
  const nextStrike = currentStrikes + 1;
  const willBeExpelled = nextStrike >= 3;

  const reasons = [
    {
      id: 'transport',
      title: 'Hitilafu ya Usafiri (Pikipiki/Gari)',
      desc: 'Pikipiki imezimika, hitilafu ya injini au kupata pancha njiani.',
      icon: Bike,
    },
    {
      id: 'traffic',
      title: 'Foleni Kubwa Isiyotembea',
      desc: 'Foleni iliyosimama kutokana na ajali barabarani.',
      icon: Clock,
    },
    {
      id: 'weather',
      title: 'Mvua Kubwa / Mafuriko',
      desc: 'Barabara haipitiki kutokana na maji kujaa au hali ya hewa.',
      icon: CloudRain,
    },
    {
      id: 'emergency',
      title: 'Dharura ya Kiafya / Binafsi',
      desc: 'Sababu ya ghafla isiyozuilika inayozuia kuendelea na safari.',
      icon: AlertOctagon,
    },
  ];

  const handleSubmit = () => {
    setIsSubmitting(true);
    const fullReason = extraDetails ? `${selectedReason} - Maelezo: ${extraDetails}` : selectedReason;

    setTimeout(() => {
      const result = fundiReportCannotAttend(ticket.id, fullReason);
      setIsSubmitting(false);
      onSuccess(result);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-red-500/40 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Toa Taarifa ya Kutoweza Kufika</h3>
              <p className="text-xs text-slate-400">
                Tiketi: <strong className="text-amber-400">{ticket.tokenNumber}</strong> ({ticket.trade})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Strike Rule Banner: EXPLICIT REQUIREMENT DISPLAY */}
        <div className={`p-3.5 rounded-xl border mb-4 ${
          willBeExpelled
            ? 'bg-red-950/60 border-red-600 text-red-200'
            : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Sera ya Miito 3 Mfululizo</span>
            </span>
            <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
              willBeExpelled ? 'bg-red-600 text-white' : 'bg-amber-500 text-slate-950'
            }`}>
              Hali ya Maonyo: {nextStrike}/3
            </span>
          </div>

          {willBeExpelled ? (
            <p className="text-xs text-red-300 font-semibold leading-relaxed">
              ⛔ TAHADHARI KALI: Umeshakosa miito 2 iliyopita. Ukithibitisha kutofika kwa wito huu (wa 3 mfululizo), <strong>AKAUNTI YAKO ITAONDOLEWA KWENYE MFUMO MARA MOJA!</strong>
            </p>
          ) : (
            <p className="text-xs text-slate-300 leading-relaxed">
              Kutoa taarifa ya kutofika kutakuongezea onyo <strong>({nextStrike}/3)</strong>. Ukifikisha miito mitatu mfululizo bila kuhudhuria utaondolewa kwenye mfumo mara moja. Token yako ya kazi itapewa fundi mwingine aliye karibu.
            </p>
          )}

          {/* Strike Indicators */}
          <div className="flex items-center gap-2 mt-2.5">
            {[1, 2, 3].map((step) => {
              const active = step <= nextStrike;
              const isThird = step === 3;
              return (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    active
                      ? isThird
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                      : 'bg-slate-800'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Reason Selector */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-bold text-slate-300 block">
            Chagua Sababu Iliyozuia Safari Yako:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {reasons.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedReason === r.title;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReason(r.title)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-amber-400 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold">{r.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Extra Notes */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Maelezo ya Ziada (Hiari):
          </label>
          <input
            type="text"
            value={extraDetails}
            onChange={(e) => setExtraDetails(e.target.value)}
            placeholder="Mfano: Pikipiki imeharibika tairi maeneo ya Mwenge..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Submission Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-lg ${
              willBeExpelled
                ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
                : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
            }`}
          >
            {isSubmitting ? (
              <span>Inawasilisha taarifa...</span>
            ) : willBeExpelled ? (
              <span>Thibitisha (Akaunti Itaondolewa)</span>
            ) : (
              <span>Wasilisha & Toa Token kwa Fundi Mwingine</span>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="py-2.5 px-4 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            Rudi Nyuma
          </button>
        </div>

      </div>
    </div>
  );
};
