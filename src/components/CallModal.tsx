import React, { useState, useEffect } from 'react';
import { ServiceTicket } from '../types';
import { useApp } from '../context/AppContext';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, UserCheck } from 'lucide-react';
import { playSound } from '../utils/audio';

interface CallModalProps {
  ticket: ServiceTicket;
  isOpen: boolean;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ ticket, isOpen, onClose }) => {
  const { role } = useApp();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setCallStatus('connecting');
      return;
    }

    playSound('dispatch');
    const timer1 = setTimeout(() => {
      setCallStatus('connected');
    }, 1500);

    return () => clearTimeout(timer1);
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen) return null;

  const targetName = role === 'fundi' ? ticket.customerName : ticket.technicianName;
  const targetPhone = role === 'fundi' ? ticket.customerPhone : ticket.technicianPhone;
  const targetRole = role === 'fundi' ? 'Mteja' : `Fundi wa ${ticket.trade}`;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    playSound('warning');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Decorative background glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Contact Profile Icon */}
        <div className="relative my-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-slate-600 flex items-center justify-center shadow-xl">
            <span className="text-3xl">👤</span>
          </div>
          {callStatus === 'connected' && (
            <div className="absolute -inset-1.5 rounded-full border border-emerald-400/40 animate-ping pointer-events-none" />
          )}
        </div>

        <h3 className="text-lg font-bold text-white mb-1">{targetName}</h3>
        <p className="text-xs text-amber-400 font-semibold mb-1">{targetRole}</p>
        <p className="text-xs text-slate-400 tracking-wider mb-4">{targetPhone}</p>

        {/* Call Status and Timer */}
        <div className="mb-8">
          {callStatus === 'connecting' ? (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Inapiga simu ya moja kwa moja...</span>
            </div>
          ) : callStatus === 'connected' ? (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{formatSeconds(callDuration)}</span>
              </div>
              <span className="text-[10px] text-slate-500">Mawasiliano yapo salama</span>
            </div>
          ) : (
            <span className="text-xs text-red-400 font-semibold">Simu Imekatika</span>
          )}
        </div>

        {/* Waveform Animation when connected */}
        {callStatus === 'connected' && (
          <div className="flex items-center justify-center gap-1 mb-8 h-8">
            {[40, 75, 55, 90, 60, 80, 45, 95, 30].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="w-1 bg-emerald-500 rounded-full animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-6 mt-auto">
          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full transition-colors ${
              isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/40 transition-transform active:scale-95"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {/* Speaker */}
          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-3.5 rounded-full transition-colors ${
              isSpeaker ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
};
