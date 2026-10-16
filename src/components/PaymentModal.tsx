import React, { useState } from 'react';
import { ServiceTicket, PaymentProvider } from '../types';
import { useApp } from '../context/AppContext';
import { ShieldCheck, CheckCircle2, Lock, Smartphone, CreditCard, X, ArrowRight } from 'lucide-react';

interface PaymentModalProps {
  ticket: ServiceTicket;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ ticket, isOpen, onClose }) => {
  const { payCompanyEscrow } = useApp();
  const [provider, setProvider] = useState<PaymentProvider>('M-Pesa');
  const [phoneNumber, setPhoneNumber] = useState('+255 715 009 231');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const paymentOptions: { id: PaymentProvider; name: string; color: string; prefix: string }[] = [
    { id: 'M-Pesa', name: 'Vodacom M-Pesa', color: 'from-red-600 to-red-700', prefix: '074/075/076' },
    { id: 'Tigo Pesa', name: 'Tigo Pesa (Mix)', color: 'from-blue-600 to-blue-700', prefix: '065/067/071' },
    { id: 'Airtel Money', name: 'Airtel Money', color: 'from-rose-600 to-rose-700', prefix: '068/069/078' },
    { id: 'HaloPesa', name: 'Halotel HaloPesa', color: 'from-orange-500 to-orange-600', prefix: '061/062' },
    { id: 'Benki / Kadi', name: 'Visa / MasterCard / NMB / CRDB', color: 'from-slate-700 to-slate-800', prefix: 'Kadi ya Benki' },
  ];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      payCompanyEscrow(ticket.id, provider);
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Glow */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Lipa kwa Akaunti ya Kampuni</h3>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Malipo ya Escrow Yaliyolindwa</span>
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

        {/* Amount Card */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-4 text-center">
          <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
            Jumla ya Malipo ya Kampuni
          </span>
          <div className="text-2xl font-black text-white mt-1">
            TZS {ticket.totalAmount.toLocaleString()}
          </div>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            <span>Ufundi: TZS {ticket.serviceFee.toLocaleString()}</span>
            <span>•</span>
            <span>Nauli ya Umbali ({ticket.distanceKm}km): TZS {ticket.distanceTransportFee.toLocaleString()}</span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 mb-4 text-xs text-emerald-200 leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            Pesa inalipwa kwa kampuni yetu kwanza. <strong>Fundi halipwi</strong> mpaka akufikie, afanye kazi na wewe uthibitishe kuridhika. Pesa ikipokelewa, fundi anapewa amri ya kuanza safari mara moja!
          </p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-bold text-slate-300 block">
            Chagua Njia ya Malipo:
          </label>
          <div className="space-y-1.5">
            {paymentOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setProvider(opt.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  provider === opt.id
                    ? 'bg-slate-800 border-emerald-400 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    provider === opt.id ? 'border-emerald-400' : 'border-slate-600'
                  }`}>
                    {provider === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{opt.name}</span>
                    <span className="text-[10px] text-slate-500">{opt.prefix}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">Haraka</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phone Input */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Namba ya Simu ya Malipo:
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 font-mono"
          />
        </div>

        {/* CTA Button */}
        <button
          onClick={handlePay}
          disabled={isProcessing || isSuccess}
          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Inathibitisha malipo na benki/mtandao...
            </span>
          ) : isSuccess ? (
            <span className="flex items-center gap-2 text-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              Malipo Yamethibitishwa na Kampuni!
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Thibitisha Malipo ya TZS {ticket.totalAmount.toLocaleString()}</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </button>

      </div>
    </div>
  );
};
