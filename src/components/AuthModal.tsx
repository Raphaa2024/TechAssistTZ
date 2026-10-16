import React, { useState } from 'react';

interface AuthModalProps {
  role: string;
  categoryName?: string;
  onLoginComplete: () => void;
}

export function AuthModal({ role, categoryName, onLoginComplete }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);

  // 1. Kutambua jina la kundi linaloandikishwa
  const roleDisplayName = categoryName || (role === 'FUNDI' ? 'Mtaalamu' : role === 'ADMIN' ? 'Admin' : 'Mteja');
  
  // 2. Kutambua kama huyu ni mteja wa Taasisi badala ya Mtu Binafsi
  const isInstitution = role?.startsWith('CUSTOMER_') && role !== 'CUSTOMER_BINAFSI';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginComplete();
  };

  return (
    <div className="mt-8 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-md mx-auto shadow-2xl animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/10 text-teal-400 mb-4 border border-teal-500/20">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {isRegister ? `Jisajili: ${roleDisplayName}` : `Ingia: ${roleDisplayName}`}
        </h3>
        <p className="text-sm text-slate-400 mt-2">
          Weka taarifa zako hapa chini kuendelea
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* SEHEMU YA USAJILI */}
        {isRegister && (
          <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Jina Kamili la Mhusika / Mwombaji
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" 
                placeholder="K.m. Dkt. Emmanuel Mushi" 
                required 
              />
            </div>

            {/* Inatokea TU ikiwa ni Taasisi, Shule, Kanisa/Msikiti au Kampuni */}
            {isInstitution && (
              <div className="bg-teal-500/5 p-4 rounded-xl border border-teal-500/20">
                <label className="block text-xs font-bold text-teal-400 mb-1.5 uppercase tracking-wider">
                  Jina la {roleDisplayName}
                </label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-teal-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" 
                  placeholder={`Andika jina kamili la ${roleDisplayName}`} 
                  required 
                />
                <p className="text-[10px] text-slate-400 mt-2">
                  * Taarifa hii inatusaidia kuweka viwango sahihi vya ada na gharama za huduma kulingana na kundi la mteja.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* SEHEMU YA KUINGIA NA KUSAJILI */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            Namba ya Simu au Barua Pepe
          </label>
          <input 
            type="text" 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" 
            placeholder="07XX XXX XXX au baruapepe@domain.com" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            Nenosiri (Password)
          </label>
          <input 
            type="password" 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all mt-6 text-sm shadow-lg shadow-teal-900/30 active:scale-[0.98]"
        >
          {isRegister ? 'Kamilisha Usajili' : 'Ingia kwenye Mfumo'}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
        <button 
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors"
        >
          {isRegister ? 'Tayari unayo akaunti? Ingia hapa' : 'Hauna akaunti? Jisajili hapa'}
        </button>
      </div>
    </div>
  );
}

export default AuthModal;