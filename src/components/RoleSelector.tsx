import React from 'react';
import { User, Wrench, ShieldCheck } from 'lucide-react';

interface RoleSelectorProps {
  selected: string | null;
  onSelect: (role: string) => void;
}

export function RoleSelector({ selected, onSelect }: RoleSelectorProps) {
  const roles = [
    {
      id: 'CUSTOMER',
      title: 'Mteja',
      desc: 'Natafuta Msaada wa TEHAMA',
      icon: <User className="w-7 h-7" />,
      colorType: 'teal'
    },
    {
      id: 'FUNDI',
      title: 'Mtaalamu',
      desc: 'Mimi ni Fundi / Mhandisi',
      icon: <Wrench className="w-7 h-7" />,
      colorType: 'amber'
    },
    {
      id: 'ADMIN',
      title: 'Msimamizi',
      desc: 'Usimamizi na Escrow',
      icon: <ShieldCheck className="w-7 h-7" />,
      colorType: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {roles.map((r) => {
        const isSelected = selected === r.id;
        
        // Rangi kulingana na kundi
        const activeClass = 
          r.colorType === 'teal' ? 'border-teal-500 bg-teal-500/10 text-teal-400' :
          r.colorType === 'amber' ? 'border-amber-500 bg-amber-500/10 text-amber-400' :
          'border-purple-500 bg-purple-500/10 text-purple-400';

        return (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className={`flex flex-col items-center p-5 rounded-2xl border-2 transition-all duration-300 ${
              isSelected ? activeClass : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className={`mb-3 ${isSelected ? '' : 'opacity-70'}`}>
              {r.icon}
            </div>
            <h3 className={`text-base font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
              {r.title}
            </h3>
            <p className="text-xs text-center opacity-80">{r.desc}</p>
          </button>
        );
      })}
    </div>
  );
}