import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, AlertCircle, CheckCircle, X } from 'lucide-react';
import { ServiceTicket, Technician } from '../types';

interface FundiCollabModalProps {
  ticket: ServiceTicket;
  isOpen: boolean;
  onClose: () => void;
}

export const FundiCollabModal: React.FC<FundiCollabModalProps> = ({ ticket, isOpen, onClose }) => {
  const { technicians } = useApp();
  const [selectedTechId, setSelectedTechId] = useState<string>('');

  if (!isOpen) return null;

  // Chuja mafundi wengine walio na ujuzi sawa (Ondoa fundi mkuu wa sasa)
  const availableColleagues = technicians.filter(
    (t) => t.id !== ticket.technicianId && t.trade === ticket.trade && !t.isExpelled
  );

  // Mahesabu ya Kugawana Mapato
  const escrowFee = ticket.totalAmount * 0.15; // 15% ya mfumo
  const fundiNetPay = ticket.totalAmount - escrowFee; // 85% inayobaki kwa fundi
  const consultationFee = fundiNetPay * 0.10; // 10% ya net inakwenda kwa Mshauri
  const mainFundiFinalPay = fundiNetPay - consultationFee; // Fundi mkuu anabakiwa na hili

  const handleRequestCollab = () => {
    if (!selectedTechId) return;
    
    alert(`Ombi la msaada limetumwa kikamilifu! TZS ${consultationFee.toLocaleString()} itakatwa kutoka kwenye malipo yako na kuwekwa kwa fundi msaidizi ikiwa tatizo litatatuliwa.`);
    // Hapa utaweka logic ya ku-update ticket (mfano: updateTicket(ticket.id, { helperId: selectedTechId, consultationFee }))
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl max-w-md w-full animate-in zoom-in-95">
        
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
          <h3 className="text-amber-400 font-black text-sm flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>Omba Msaada kwa Mtaalamu (Collab)</span>
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-2xl mb-4">
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Ikiwa umekwama, unaweza kuomba msaada kwa mtaalamu mwingine. Utamlipa <strong className="text-amber-400">10% ya mapato yako (baada ya makato ya mfumo)</strong> kama ada ya ushauri/msaada.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Mapato yako ghafi (Net):</span>
              <span>TZS {fundiNetPay.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-400 border-b border-slate-800 pb-1.5">
              <span>Ada ya Mshauri (10%):</span>
              <span>- TZS {consultationFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold pt-1">
              <span>Utakachobakiwa nacho:</span>
              <span>TZS {mainFundiFinalPay.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Chagua Mtaalamu wa Kukusaidia:</label>
            <select
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:border-amber-500 focus:outline-none"
            >
              <option value="">-- Chagua Fundi --</option>
              {availableColleagues.map(tech => (
                <option key={tech.id} value={tech.id}>{tech.name} ({tech.specialization})</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleRequestCollab}
          disabled={!selectedTechId}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-3 rounded-xl text-xs transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Thibitisha & Tuma Ombi</span>
        </button>

      </div>
    </div>
  );
};