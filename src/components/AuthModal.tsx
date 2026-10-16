import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Lock, 
  Phone, 
  Wrench, 
  Upload, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle 
} from 'lucide-react';

interface AuthModalProps {
  role: string | null;
  categoryName: string;
  onLoginComplete: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ role, categoryName, onLoginComplete }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const isFundi = role === 'FUNDI';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    tradeCategory: 'Kompyuta & Laptop',
    godGivenSkills: '', // Ujuzi wa kipaji aliopewa na Mwenyezi Mungu
    certificates: [] as File[],
  });

  const { setCurrentUserSession } = useApp();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, certificates: Array.from(e.target.files) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hifadhi taarifa za mtumiaji aliyeingia au kujisajili
    setCurrentUserSession({
      name: formData.name || (isRegistering ? (isFundi ? 'Mtaalamu Mpya' : 'Mteja Mpya') : 'Mtumiaji'),
      category: isFundi ? `Fundi: ${formData.tradeCategory}` : (categoryName || 'Mteja Binafsi'),
      phone: formData.phone || '+255 700 000 000',
      role: isFundi ? 'fundi' : (role === 'ADMIN' ? 'admin' : 'mteja')
    });

    onLoginComplete();
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-teal-900/10 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header ya Fomu */}
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
          {isFundi ? '🛠️ Usajili wa Mtaalamu (Fundi TEHAMA)' : (categoryName ? `Kundi: ${categoryName}` : 'Portal ya Mtumiaji')}
        </span>
        <h3 className="text-xl font-black text-white">
          {isRegistering 
            ? (isFundi ? 'Sajili Kipaji & Utaalamu Wako' : 'Tengeneza Akaunti Mpya') 
            : 'Ingia Kwenye Akaunti Yako'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {isRegistering 
            ? (isFundi ? 'Onyesha vyeti na vipaji vyako ili uanze kupata kazi na kipato' : 'Jaza taarifa zako ili kupata huduma za usaidizi wa TEHAMA') 
            : 'Ingiza namba yako ya simu na nenosiri kuendelea'}
        </p>
      </div>

      {/* Switcher Tab (Ingia vs Jisajili) */}
      <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-6 text-xs font-bold">
        <button
          type="button"
          onClick={() => setIsRegistering(false)}
          className={`py-2.5 rounded-xl transition-all ${
            !isRegistering 
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🔑 Ingia (Login)
        </button>
        <button
          type="button"
          onClick={() => setIsRegistering(true)}
          className={`py-2.5 rounded-xl transition-all ${
            isRegistering 
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📝 Jisajili (Register)
        </button>
      </div>

      {/* FOMU KUU */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* Jina Kamili / Taasisi */}
        {isRegistering && (
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              {isFundi ? 'Jina Kamili la Mtaalamu' : 'Jina Kamili / Jina la Taasisi'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder={isFundi ? "Mfano: Mhandisi Rashidi Ally" : "Mfano: Chuo cha VETA / John Doe"}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Namba ya Simu */}
        <div>
          <label className="block font-bold text-slate-300 mb-1">
            Namba ya Simu
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="tel"
              required
              placeholder="+255 7XX XXX XXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </div>

        {/* Aina ya Ufundi / Trade (Kwa Fundi Wanaojisajili Tu) */}
        {isRegistering && isFundi && (
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Utaalamu Wako Mkuu
            </label>
            <div className="relative">
              <Wrench className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <select
                value={formData.tradeCategory}
                onChange={(e) => setFormData({ ...formData, tradeCategory: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-teal-500 transition-colors"
              >
                <option value="Kompyuta & Laptop">Kompyuta & Laptop</option>
                <option value="Printers & Photocopy">Printers & Photocopy</option>
                <option value="Networking & Wi-Fi">Networking & Wi-Fi</option>
                <option value="Software & Programming">Software & Programming</option>
                <option value="Simu & Tablets">Simu & Tablets</option>
                <option value="CCTV & Vifaa vya Usalama">CCTV & Vifaa vya Usalama</option>
              </select>
            </div>
          </div>
        )}

        {/* SEHEMU YA UJUZI WA KIPAJI ALIOPEWA NA MWENYEZI MUNGU */}
        {isRegistering && isFundi && (
          <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-2xl space-y-2">
            <label className="block font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ujuzi wa Kipaji / Maalumu (God-given Skills)</span>
            </label>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Eleza ujuzi au kipaji chako maalum ulichojaliwa ambacho kinaweza kukupatia kipato (hata kama huna cheti rasmi cha darasani).
            </p>
            <textarea
              rows={2}
              placeholder="Mfano: Nina uwezo mkubwa wa kufanya Micro-soldering ya Motherboard, Kufufua Hard Disk zilizokufa, au Kurekebisha Printers za viwandani..."
              value={formData.godGivenSkills}
              onChange={(e) => setFormData({ ...formData, godGivenSkills: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        )}

        {/* SEHEMU YA KU-UPLOAD VYETI VYA CHUO / VETA / CERTIFICATES */}
        {isRegistering && isFundi && (
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-2">
            <label className="block font-bold text-slate-300 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-teal-400" />
              <span>Pakia Vyeti vya Masomo / Pro-Certificates (Hiari)</span>
            </label>
            <p className="text-[11px] text-slate-400">
              Pakia picha au PDF za Vyeti vya VETA, Vyuo Vikuu, Cisco, au Kozi za TEHAMA ili kuongeza uaminifu wako.
            </p>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-500/20 file:text-teal-300 hover:file:bg-teal-500/30 cursor-pointer"
            />
            {formData.certificates.length > 0 && (
              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                <CheckCircle className="w-3 h-3" />
                <span>Vyeti {formData.certificates.length} vimechaguliwa na viko tayari!</span>
              </p>
            )}
          </div>
        )}

        {/* Nenosiri (Password) */}
        <div>
          <label className="block font-bold text-slate-300 mb-1">
            Nenosiri (Password)
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </div>

        {/* Kitufe cha Submit */}
        <button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-3 rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2 mt-2 active:scale-95"
        >
          <span>{isRegistering ? (isFundi ? 'Kamilisha Usajili wa Fundi' : 'Kamilisha Usajili') : 'Ingia Sasa'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Taarifa ya Ulinzi wa Data */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
        <span>Taarifa zote zinalindwa kwa usalama na Mfumo wa Escrow</span>
      </div>

    </div>
  );
};