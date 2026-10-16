import React, { useState } from 'react';
import { ServiceTicket } from '../types';
import { useApp } from '../context/AppContext';
import { X, Send, Bot, User, Wrench, Sparkles } from 'lucide-react';

interface ChatModalProps {
  ticket: ServiceTicket;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ ticket, isOpen, onClose }) => {
  const { role, sendMessage } = useApp();
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const sender = role === 'fundi' ? 'technician' : 'customer';
    sendMessage(ticket.id, sender, text.trim());
    setInputText('');
  };

  const quickReplies = role === 'fundi' ? [
    'Nipo njiani na pikipiki, nafika baada ya dakika chache.',
    'Kuna foleni kidogo barabarani lakini ninaendelea.',
    'Nimefika getini kwako, tafadhali fungua.',
    'Nimepata namba ya nyumba, asante.',
  ] : [
    'Habari, umefika wapi sasa hivi?',
    'Geti letu lina rangi ya samawati (blue).',
    'Tafadhali ukifika piga honi au gonga geti dogo.',
    'Nipo nyumbani nakusubiri.',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg h-[600px] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Chat Header */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
              {role === 'fundi' ? <User className="w-5 h-5 text-emerald-400" /> : <Wrench className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {role === 'fundi' ? ticket.customerName : ticket.technicianName}
              </h3>
              <p className="text-[11px] text-slate-400">
                {role === 'fundi' ? `Mteja (${ticket.customerLocation.name})` : `Fundi ${ticket.trade} - ${ticket.technicianPhone}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/60">
          {ticket.messages.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              Hakuna ujumbe bado. Anzisha mazungumzo na {role === 'fundi' ? 'mteja' : 'fundi'}.
            </div>
          ) : (
            ticket.messages.map((msg) => {
              const isMe = 
                (role === 'fundi' && msg.sender === 'technician') ||
                (role === 'mteja' && msg.sender === 'customer');
              const isSys = msg.sender === 'system';

              if (isSys) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="max-w-[85%] bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-center shadow">
                      <p className="text-[11px] text-amber-400 font-medium">{msg.text}</p>
                      <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-md ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-none'
                  }`}>
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="text-[10px] font-bold text-slate-300">
                        {msg.senderName}
                      </span>
                      <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Reply Chips */}
        <div className="px-3 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qr)}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-700 shrink-0"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={role === 'fundi' ? 'Andika ujumbe kwa mteja...' : 'Andika ujumbe kwa fundi...'}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
