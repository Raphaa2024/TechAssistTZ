import React, { useState, useRef, useEffect } from 'react';
import { TradeCategory, WardLocation } from '../types';
import { WARDS } from '../data/mockData';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Wrench, 
  Printer, 
  Laptop, 
  Wifi, 
  Smartphone, 
  FileCode,
  ShieldAlert
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface AiTroubleshooterChatProps {
  onEscalateToTicket: (data: {
    trade: TradeCategory;
    deviceType: string;
    description: string;
    aiSummary: string;
    attemptedFixes: string[];
  }) => void;
  onClose?: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  options?: string[];
  isStep?: boolean;
}

export const AiTroubleshooterChat: React.FC<AiTroubleshooterChatProps> = ({
  onEscalateToTicket,
}) => {
  const [selectedTrade, setSelectedTrade] = useState<TradeCategory>('Kompyuta & Laptop');
  const [deviceModel, setDeviceModel] = useState('HP ProBook / Dell Latitude');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [attemptedFixes, setAttemptedFixes] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text: 'Habari! Mimi ni TechAssist AI Msaidizi wako wa TEHAMA. Kabla ya kuagiza mtaalamu kuja eneo lako, hebu tuone kama tunaweza kutatua tatizo lako hapa hapa bure bila kupoteza muda au fedha. Je, kifaa chako kinakabiliwa na shida gani?',
      timestamp: 'Sasa hivi',
      options: [
        'Kompyuta inawaka skrini nyeusi au ya bluu (BSOD)',
        'Printa inakataa kutoa karatasi au inatoa Paper Jam',
        'Mtandao wa Wi-Fi / LAN unakataa kutoa intaneti',
        'Kompyuta ina virusi au inakuwa nzito sana',
        'Kifaa kimepoteza sauti au kamera haifunguki',
      ],
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    playSound('click');

    // Simulate smart AI IT technician troubleshooting flow
    setTimeout(() => {
      respondToUser(text.trim());
      setIsTyping(false);
    }, 900);
  };

  const respondToUser = (userQuery: string) => {
    const lower = userQuery.toLowerCase();

    // Check if user confirmed resolution
    if (lower.includes('imefanikiwa') || lower.includes('imetatuliwa') || lower.includes('asante imefanya kazi')) {
      setIsResolved(true);
      playSound('arrival');
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Hongera sana! 🎉 Tatizo lako limetatuliwa bila kuhitaji kumlipa wala kumsubiri mtaalamu wa TEHAMA. Umeokoa muda na fedha za mfumo wa kampuni/chuo chako! Kama utapata changamoto nyingine, nipo hapa.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return;
    }

    // Check if user clicked or typed that it failed ("Ikishindikana")
    if (lower.includes('bado haifanyi kazi') || lower.includes('haikusaidia') || lower.includes('ikishindikana') || lower.includes('bado inasumbua')) {
      setAttemptedFixes((prev) => [...prev, 'Kujaribu maelekezo ya awali ya AI bila mafanikio']);
      playSound('warning');
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Pole sana. Inaonekana tatizo hili linahitaji ukaguzi wa kina wa maunzi (Hardware) au usanidi wa kitaalamu wa mikono (Hands-on Technical Assistance).
          
Nimekuandalia MUHTASARI WA KITAALAMU (AI Troubleshooting Summary). Bonyeza kitufe hapa chini ili kufungua Tiketi ya Mfumo. Mfumo utakuletea wataalamu wa TEHAMA waliojisajili na waliopo karibu nawe mara moja!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: ['👉 Fungua Tiketi ya Mtaalamu Aliye Karibu Sasa'],
        },
      ]);
      return;
    }

    // Escalate to ticket directly
    if (userQuery.includes('Fungua Tiketi ya Mtaalamu')) {
      triggerEscalate();
      return;
    }

    // Interactive step-by-step guidance based on domain
    if (lower.includes('print') || lower.includes('karatasi') || lower.includes('jam') || selectedTrade === 'Printers & Photocopy') {
      setSelectedTrade('Printers & Photocopy');
      setAttemptedFixes((prev) => [...prev, 'Kusafisha Pickup Roller na kurestart Print Spooler']);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `🔍 [Uchunguzi wa Printa / Photocopy: ${deviceModel}]
Tuanze na hatua 2 za kwanza ambazo hutatua 80% ya matatizo haya:

1️⃣ HATUA YA KWANZA: Zima printa, chomoa waya wa umeme kwa sekunde 20. Fungua mfuniko wa nyuma/chini na kagua kama kuna kipande kidogo cha karatasi kilichoraruka kwenye roller za feed.
2️⃣ HATUA YA PILI (kwenye Kompyuta): Bonyeza Windows Key + R, andika "services.msc", tafuta huduma inayoitwa "Print Spooler", bonyeza Restart.

Je, baada ya kujaribu hili, printa imekubali kutoa karatasi?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: [
            '✅ Nimejaribu, Imefanikiwa! (Tatizo Limetatuliwa)',
            '❌ Hapana, Bado Haifanyi Kazi (Ikishindikana)',
          ],
        },
      ]);
    } else if (lower.includes('wi-fi') || lower.includes('mtandao') || lower.includes('internet') || lower.includes('lan') || selectedTrade === 'Networking & Wi-Fi') {
      setSelectedTrade('Networking & Wi-Fi');
      setAttemptedFixes((prev) => [...prev, 'Kurestart modem na kuweka upya IP stack (flushdns)']);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `🌐 [Uchunguzi wa Mtandao / Networking: ${deviceModel}]
Tufanye uchunguzi wa haraka wa mtandao:

1️⃣ Kwenye Kompyuta: Fungua Command Prompt (CMD), andika:
   \`ipconfig /flushdns\` kisha bonyeza Enter, halafu andika \`netsh winsock reset\`.
2️⃣ Kwenye Router: Zima swichi ya adapter ya umeme ya router/modem kwa sekunde 30 kisha uwashe tena ili ifanye usajili upya wa IP na mtoa huduma (ISP).

Je, mtandao umerejea kawaida?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: [
            '✅ Nimejaribu, Imefanikiwa! (Tatizo Limetatuliwa)',
            '❌ Hapana, Bado Haifanyi Kazi (Ikishindikana)',
          ],
        },
      ]);
    } else {
      // Laptop / PC default
      setSelectedTrade('Kompyuta & Laptop');
      setAttemptedFixes((prev) => [...prev, 'Hard Reset na ukaguzi wa RAM/Power']);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `💻 [Uchunguzi wa Kompyuta / Laptop: ${deviceModel}]
Hebu tujaribu "Power Cycle Hard Reset":

1️⃣ Chomoa chaja ya laptop na vifaa vyote vya USB (Flash disk, mouse, n.k.).
2️⃣ Bonyeza na ushikilie Kitufe cha Kuwasha (Power Button) mfululizo kwa sekunde 30 bila kuachia. Hii inatoa umeme tuli (residual power) kwenye motherboard.
3️⃣ Chomeka chaja pekee (bila vifaa vingine) kisha bonyeza kitufe cha kuwasha mara moja.

Je, kompyuta imewaka na kuonyesha picha kwenye skrini?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: [
            '✅ Nimejaribu, Imefanikiwa! (Tatizo Limetatuliwa)',
            '❌ Hapana, Bado Haifanyi Kazi (Ikishindikana)',
          ],
        },
      ]);
    }
  };

  const triggerEscalate = () => {
    const summary = `Mteja alichat na TechAssist AI kwa ajili ya kifaa cha ${deviceModel} (${selectedTrade}). Hatua zilizojaribiwa: ${attemptedFixes.join(', ') || 'Uchunguzi wa awali wa programu na umeme'}. Tatizo bado lipo na linahitaji mtaalamu wa TEHAMA kufika eneo husika kufanya matengenezo na kubadilisha vifaa au usanidi wa kina.`;

    onEscalateToTicket({
      trade: selectedTrade,
      deviceType: deviceModel,
      description: messages[messages.length - 2]?.text || 'Hitilafu ya TEHAMA iliyoshindikana kutatuliwa na AI.',
      aiSummary: summary,
      attemptedFixes,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col h-[650px] relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-purple-500/20">
            <Bot className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">TechAssist AI Diagnostics</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Msaada wa Awali wa Bure
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Uchunguzi wa kompyuta, printa, mitandao na programu kabla ya kuitisha mtaalamu.
            </p>
          </div>
        </div>

        {/* Device selector */}
        <div className="hidden sm:flex items-center gap-2">
          <input
            type="text"
            value={deviceModel}
            onChange={(e) => setDeviceModel(e.target.value)}
            placeholder="Jina la Kifaa (k.m. HP LaserJet / Dell PC)"
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 pl-1 py-1">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-end gap-2 max-w-[88%]">
                {isAi && (
                  <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 text-xs font-bold">
                    AI
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                    isAi
                      ? 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none whitespace-pre-line'
                      : 'bg-emerald-600 text-white rounded-br-none font-medium'
                  }`}
                >
                  {msg.text}
                </div>
              </div>

              {/* Action option chips attached to AI messages */}
              {isAi && msg.options && !isResolved && (
                <div className="flex flex-wrap gap-1.5 mt-2 ml-9">
                  {msg.options.map((opt, i) => {
                    const isEscalateOption = opt.includes('Fungua Tiketi');
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (isEscalateOption) {
                            triggerEscalate();
                          } else {
                            handleSend(opt);
                          }
                        }}
                        className={`text-[11px] px-3 py-1.5 rounded-xl font-semibold transition-all shadow-sm ${
                          isEscalateOption
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border border-amber-300 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-purple-400 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 w-fit">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>TechAssist AI inachakata uchunguzi wa kitaalamu...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Escalation Alert Bar when troubleshooting cannot resolve */}
      {attemptedFixes.length > 0 && !isResolved && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-3 my-2 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Ikishindikana: Mfumo unakupeleka kwa Mtaalamu wa TEHAMA aliye karibu.</span>
          </div>
          <button
            onClick={triggerEscalate}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 transition-colors"
          >
            <span>Tengeneza Tiketi & Ankara</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input Form */}
      <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex items-center gap-2 mt-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Eleza tatizo la kompyuta, printa, mtandao au programu hapa..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold transition-colors shadow-lg shadow-purple-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
