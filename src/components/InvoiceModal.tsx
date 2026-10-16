import React, { useState } from 'react';
import { ServiceTicket, InvoiceItem } from '../types';
import { useApp } from '../context/AppContext';
import { FileText, Plus, Trash2, Check, DollarSign, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/audio';

interface InvoiceModalProps {
  ticket: ServiceTicket;
  isOpen: boolean;
  onClose: () => void;
  isSpecialistView?: boolean; // True if technician is drafting, False if customer is reviewing
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  ticket,
  isOpen,
  onClose,
  isSpecialistView = true,
}) => {
  const { payCompanyEscrow, updateTicketInvoice } = useApp();

  const [items, setItems] = useState<InvoiceItem[]>(
    ticket.invoice?.items || [
      { id: '1', description: `Ufundi na Matengenezo ya ${ticket.deviceType || ticket.trade}`, quantity: 1, unitPrice: ticket.serviceFee || 35000, total: ticket.serviceFee || 35000 },
      { id: '2', description: `Gharama ya Usafiri wa Mtaalamu (${ticket.distanceKm} km)`, quantity: 1, unitPrice: ticket.distanceTransportFee || 4500, total: ticket.distanceTransportFee || 4500 },
    ]
  );

  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState<number>(15000);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const totalAmount = subtotal;
  const platformCommissionPercent = 15; // 15% system running fee
  const platformCommissionAmount = Math.round((totalAmount * platformCommissionPercent) / 100);
  const technicianPayoutAmount = totalAmount - platformCommissionAmount;

  const addItem = () => {
    if (!newItemDesc.trim()) return;
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: newItemDesc.trim(),
      quantity: 1,
      unitPrice: Number(newItemPrice) || 0,
      total: Number(newItemPrice) || 0,
    };
    setItems((prev) => [...prev, newItem]);
    setNewItemDesc('');
    setNewItemPrice(15000);
    playSound('click');
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    playSound('click');
  };

  const handleSendInvoice = () => {
    updateTicketInvoice(ticket.id, {
      items,
      subtotal,
      transportFee: ticket.distanceTransportFee,
      totalAmount,
      platformCommissionPercent,
      platformCommissionAmount,
      technicianPayoutAmount,
    });
    playSound('payment');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Ankara Rasmi ya Huduma (Invoice)</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800">
                  {ticket.tokenNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mteja: <strong className="text-white">{ticket.customerName}</strong> • {ticket.customerAddressDetail || ticket.customerLocation.name}
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

        {/* AI Troubleshooting Reference for Specialist */}
        {ticket.aiTroubleshootingSummary && (
          <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-3 mb-4 text-xs text-purple-200 space-y-1">
            <span className="font-bold text-purple-300 block uppercase tracking-wider text-[10px]">
              🤖 Muhtasari wa AI Troubleshooting:
            </span>
            <p className="text-[11px] leading-relaxed text-slate-300">
              {ticket.aiTroubleshootingSummary}
            </p>
          </div>
        )}

        {/* Itemized Table */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-bold text-slate-300 block">
            Mchanganuo wa Gharama za Matengenezo & Vifaa:
          </label>

          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-xs">
            <div className="grid grid-cols-12 gap-2 bg-slate-900 p-2.5 font-bold text-slate-400 text-[10px] uppercase">
              <div className="col-span-8">Maelezo ya Kazi / Kifaa</div>
              <div className="col-span-3 text-right">Kiasi (TZS)</div>
              <div className="col-span-1 text-center"></div>
            </div>

            <div className="divide-y divide-slate-800/80 max-h-40 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 p-2.5 items-center">
                  <div className="col-span-8 text-white font-medium text-[11px]">
                    {item.description}
                  </div>
                  <div className="col-span-3 text-right font-mono font-bold text-slate-300 text-[11px]">
                    {item.total.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-center">
                    {isSpecialistView && items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add item row if in specialist drafting view */}
        {isSpecialistView && (
          <div className="flex items-center gap-2 mb-4 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <input
              type="text"
              value={newItemDesc}
              onChange={(e) => setNewItemDesc(e.target.value)}
              placeholder="Ongeza bidhaa/kipuri (k.m. RAM 8GB, Pickup Roller)..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <input
              type="number"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(Number(e.target.value))}
              step={1000}
              className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
            />
            <button
              onClick={addItem}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1 border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Weka</span>
            </button>
          </div>
        )}

        {/* Financial Breakdown (With 15% Platform Commission Requirement) */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2 mb-5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Jumla ya Ankara (Mteja Anacholipa):</span>
            <span className="font-mono font-bold text-white text-sm">
              TZS {totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="border-t border-slate-800/80 pt-2 grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Uendeshaji wa Mfumo (15%):</span>
              <span className="font-mono font-bold text-blue-400">
                TZS {platformCommissionAmount.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Malipo Halisi ya Fundi (85%):</span>
              <span className="font-mono font-bold text-emerald-400">
                TZS {technicianPayoutAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 pt-1">
            * Pesa inalipwa kwa kampuni kwanza (Escrow) na fundi halipwi hadi mteja athibitishe kazi imekamilika kwa kuridhika.
          </p>
        </div>

        {/* Action Button */}
        {isSpecialistView ? (
          <button
            onClick={handleSendInvoice}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Tuma Ankara kwa Mteja (TZS {totalAmount.toLocaleString()})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              onClose();
              payCompanyEscrow(ticket.id, 'M-Pesa');
            }}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Thibitisha na Weka Fedha Kwenye Escrow (Deposit)</span>
          </button>
        )}

      </div>
    </div>
  );
};
