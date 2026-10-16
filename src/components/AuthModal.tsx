import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WARDS } from '../data/mockData'; 
import { 
  User, 
  Lock, 
  Phone, 
  Wrench, 
  Upload, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle,
  Mail,
  MapPin,
  Briefcase,
  Camera,
  Award,
  FolderOpen
} from 'lucide-react';

interface AuthModalProps {
  role: string | null;
  categoryName: string;
  onLoginComplete: () => void;
}

// Orodha ya ujuzi uliozoeleka kwa wataalamu wa TEHAMA
const PREDEFINED_SKILLS = [
  'Hardware Repair',
  'Software Installation',
  'Networking & LAN',
  'CCTV & Security',
  'Micro-soldering',
  'Printer Maintenance',
  'Data Recovery',
  'Server Administration',
  'Web/App Development',
  'Mobile Flashing/Repair',
  'Nyinginezo'
];

export const AuthModal: React.FC<AuthModalProps> = ({ role, categoryName, onLoginComplete }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const isFundi = role === 'FUNDI';

  // COMMON FORM STATE
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '', 
    password: '',
    location: WARDS[0].name, 
    tradeCategory: 'Kompyuta & Laptop',
    godGivenSkills: '', 
    workExperience: '', 
    pastProjects: '', 
    passportPhoto: null as File | null, 
    certificates: [] as File[],
  });

  // State maalum kwa ajili ya Ujuzi (Skills)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');

  const { setCurrentUserSession } = useApp();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, certificates: Array.from(e.target.files) });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, passportPhoto: e.target.files[0] });
    }
  };

  // Kazi ya kubadili uchaguzi wa ujuzi
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Unganisha ujuzi uliochaguliwa na ule ulioandikwa kwa mkono (kama Nyinginezo imechaguliwa)
    const finalSkillsList = selectedSkills.filter(s => s !== 'Nyinginezo');
    if (selectedSkills.includes('Nyinginezo') && customSkill.trim() !== '') {
      finalSkillsList.push(customSkill.trim());
    }
    const finalSkillsString = finalSkillsList.join(', ');
    
    // Hifadhi taarifa za mtumiaji kwenye session
    setCurrentUserSession({
      name: formData.name || (isRegistering ? (isFundi ? 'Mtaalamu Mpya' : 'Mteja Mpya') : 'Mtumiaji'),
      category: isFundi ? `Fundi: ${formData.tradeCategory}` : (categoryName || 'Mteja Binafsi'),
      phone: formData.phone || '+255 700 000 000',
      role: isFundi ? 'fundi' : (role === 'ADMIN' ? 'admin' : 'mteja'),
      wardName: formData.location 
    });

    onLoginComplete();
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-teal-900/10 animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
      
      {/* Header ya Fomu */}
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
          {isFundi ? '🛠️ Usajili wa Mtaalamu (Fani Zote)' : (categoryName ? `Kundi: ${categoryName}` : 'Portal ya Mtumiaji')}
        </span>
        <h3 className="text-xl font-black text-white">
          {isRegistering 
            ? (isFundi ? 'Jenga Wasifu (Profile) Wako' : 'Tengeneza Akaunti Mpya') 
            : 'Ingia Kwenye Akaunti Yako'}
        </h3>
        <p className="text-[11px] text-slate-400 mt-1">
          {isRegistering 
            ? (isFundi ? 'Weka picha, ujuzi na kazi zako ili kujenga uaminifu na kuvutia wateja zaidi.' : 'Jaza taarifa zako ili kupata huduma za usaidizi wa TEHAMA') 
            : 'Ingiza namba yako ya simu na nenosiri kuendelea'}
        </p>
      </div>

      {/* Switcher Tab (Ingia vs Jisajili) */}
      <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-6 text-xs font-bold">
        <button
          type="button"
          onClick={() => setIsRegistering(false)}
          className={`py-2.5 rounded-xl transition-all ${
            !isRegistering ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'
          }`}
        >
          🔑 Ingia (Login)
        </button>
        <button
          type="button"
          onClick={() => setIsRegistering(true)}
          className={`py-2.5 rounded-xl transition-all ${
            isRegistering ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'
          }`}
        >
          📝 Jisajili (Register)
        </button>
      </div>

      {/* FOMU KUU */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* Jina Kamili */}
        {isRegistering && (
          <div>
            <label className="block font-bold text-slate-300 mb-1">Majina Kamili</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder={isFundi ? "Mfano: Mhandisi Rashidi Ally" : "Mfano: John Doe"}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* PICHA YA PASIPOTI (KWA WATAALAMU TU) */}
        {isRegistering && isFundi && (
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-2 mt-2">
            <label className="block font-bold text-slate-300 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-pink-400" />
              <span>Picha ya Mtaalamu (Passport Size)</span>
            </label>
            <p className="text-[11px] text-slate-400">
              Picha yako halisi inaongeza uaminifu kwa mteja kwa asilimia 80%. Tafadhali pakia picha safi inayoonyesha uso wako.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-pink-500/20 file:text-pink-300 hover:file:bg-pink-500/30 cursor-pointer"
            />
            {formData.passportPhoto && (
              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                <CheckCircle className="w-3 h-3" />
                <span>Picha Imepakiwa Kikamilifu!</span>
              </p>
            )}
          </div>
        )}

        {/* Namba ya Simu (WhatsApp) na Email */}
        {isRegistering && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Simu (WhatsApp)</label>
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
            <div>
              <label className="block font-bold text-slate-300 mb-1">Email <span className="text-slate-500 font-normal">(Kama ipo)</span></label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="barua@pepe.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* KWA WALIOLOGIN (Sio Registering) */}
        {!isRegistering && (
          <div>
            <label className="block font-bold text-slate-300 mb-1">Namba ya Simu</label>
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
        )}

        {/* Fani & Location (Kwa Wataalamu Tu Wakati Wa Kujisajili) */}
        {isRegistering && isFundi && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Fani Yako (Kundi)</label>
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
                  <option value="CCTV & Vifaa vya Usalama">CCTV & Usalama</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Eneo Lako (Kituo cha Kazi)</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-teal-500 transition-colors"
                >
                  {WARDS.map((w) => (
                    <option key={w.name} value={w.name}>{w.name} ({w.district})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* UJUZI / SKILLS (Pills UI + Others Input) */}
        {isRegistering && isFundi && (
          <div>
            <label className="block font-bold text-slate-300 mb-2">Chagua Ujuzi Wako (Skills)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PREDEFINED_SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                    selectedSkills.includes(skill)
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            
            {/* Input ya Nyinginezo inatokea tu kama mtu kachagua "Nyinginezo" */}
            {selectedSkills.includes('Nyinginezo') && (
              <div className="relative mt-3 animate-in fade-in slide-in-from-top-1">
                <Award className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Taja ujuzi mwingine hapa (Mfano: Graphic Design, POS Systems...)"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            )}
          </div>
        )}

        {/* UZOEFU WA KAZI (Work Experience) */}
        {isRegistering && isFundi && (
          <div className="bg-blue-950/20 border border-blue-500/30 p-3.5 rounded-2xl space-y-2 mt-2">
            <label className="block font-bold text-blue-300 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Uzoefu wa Kazi (Work Experience)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Mfano: Miaka 3 kama IT Support kwenye shirika XYZ, Kusimamia server, n.k..."
              value={formData.workExperience}
              onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        )}

        {/* KAZI ZILIZOFANIKIWA (Successful Past Projects / Portfolio) */}
        {isRegistering && isFundi && (
          <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-2xl space-y-2 mt-2">
            <label className="block font-bold text-emerald-300 flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-emerald-400" />
              <span>Kazi Halisi Ulizofanikiwa (Past Projects / Portfolio)</span>
            </label>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Kutaja kazi za kweli ulizofanya kunamshawishi mteja kukuchagua haraka. Mfumo unaweza kuzihakiki.
            </p>
            <textarea
              rows={2}
              placeholder="Mfano: Nimefunga kamera 16 kwenye benki X; Nimeunda mfumo wa kulipa shule Y..."
              value={formData.pastProjects}
              onChange={(e) => setFormData({ ...formData, pastProjects: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
        )}

        {/* Ujuzi wa Kipaji (God-given Skills) */}
        {isRegistering && isFundi && (
          <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-2xl space-y-2 mt-2">
            <label className="block font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Kipaji / Ujuzi Usio na Cheti (God-given Talent)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Mfano: Nina uwezo mkubwa wa kufanya Micro-soldering ya Motherboard bila hata kwenda darasani..."
              value={formData.godGivenSkills}
              onChange={(e) => setFormData({ ...formData, godGivenSkills: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        )}

        {/* Kupakia Vyeti */}
        {isRegistering && isFundi && (
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-2">
            <label className="block font-bold text-slate-300 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-teal-400" />
              <span>Pakia Vyeti vya Masomo (Kama Vipo)</span>
            </label>
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
                <span>Vyeti {formData.certificates.length} vimechaguliwa!</span>
              </p>
            )}
          </div>
        )}

        {/* Nenosiri (Password) */}
        <div className="pt-2">
          <label className="block font-bold text-slate-300 mb-1">Nenosiri (Password)</label>
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
          className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-3 rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95"
        >
          <span>{isRegistering ? (isFundi ? 'Kamilisha Usajili wa Mtaalamu' : 'Kamilisha Usajili') : 'Ingia Kwenye Mfumo'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Taarifa ya Ulinzi */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col items-center justify-center gap-1 text-[10px] text-slate-500 text-center">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Wasifu wako unakaguliwa na TechAssistTZ kuthibitisha uhalali</span>
        </div>
      </div>

    </div>
  );
};