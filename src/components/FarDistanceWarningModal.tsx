import React from 'react';
import { Technician, WardLocation } from '../types';
import { AlertTriangle, Clock, MapPin, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';

interface FarDistanceWarningModalProps {
  isOpen: boolean;
  technician: Technician | null;
  customerLocation: WardLocation;
  distanceKm: number;
  transitMinutes: number;
  transportFee: number;
  closerTechnician: Technician | null;
  closerDistanceKm: number;
  onConfirmChoice: () => void;
  onChooseCloser: (closerTech: Technician) => void;
  onCancel: () => void;
}

export const FarDistanceWarningModal: React.FC<FarDistanceWarningModalProps> = ({
  isOpen,
  technician,
  customerLocation,
  distanceKm,
  transitMinutes,
  transportFee,
  closerTechnician,
  closerDistanceKm,
  onConfirmChoice,
  onChooseCloser,
  onCancel,
}) => {
  if (!isOpen || !technician) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Amber warning glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Tahadhari ya Umbali Mrefu</h3>
            <p className="text-xs text-amber-400 font-semibold">
              Fundi uliyemchagua yupo mbali na eneo lako
            </p>
          </div>
        </div>

        {/* Dynamic Explanation Required by User */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3 mb-5">
          <p className="text-xs text-slate-300 leading-relaxed">
            Mfumo umegundua kuwa <strong>{technician.name}</strong> yupo kituo cha{' '}
            <strong className="text-white">{technician.currentLocation.name}</strong>, umbali wa{' '}
            <strong className="text-amber-400">{distanceKm} km</strong> kutoka unapoishi (
            <strong className="text-white">{customerLocation.name}</strong>).
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-amber-400" />
                Muda wa Safari
              </span>
              <span className="text-xs font-bold text-white">Takribani Dk {transitMinutes}</span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                Gharama ya Usafiri
              </span>
              <span className="text-xs font-bold text-emerald-400">TZS {transportFee.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Recommended Closer Fundi if available */}
        {closerTechnician && (
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                Pendekezo la Haraka (Karibu zaidi):
              </span>
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                km {closerDistanceKm} pekee
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              <strong>{closerTechnician.name}</strong> yupo {closerTechnician.currentLocation.name} na anaweza kukufikia ndani ya dakika 10-15.
            </p>
            <button
              onClick={() => onChooseCloser(closerTechnician)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Chagua {closerTechnician.name.split(' ')[0]} (Aliye Karibu)</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onConfirmChoice}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Nathibitisha, Endelea na {technician.name.split(' ')[0]} (Fundi wa Mbali)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onCancel}
            className="w-full py-2 px-4 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors"
          >
            Ghairi / Rudi Nyuma
          </button>
        </div>

      </div>
    </div>
  );
};
