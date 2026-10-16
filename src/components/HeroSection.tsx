import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="text-center py-12 px-4 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold mb-6 border border-teal-500/20">
        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
        Mfumo Rasmi wa TEHAMA Tanzania
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
        Msaada wa Haraka wa <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Vifaa vya TEHAMA</span>
      </h1>
      
      <p className="text-slate-400 text-sm md:text-base mb-8 leading-relaxed">
        Mfumo wa kitaalamu unaounganisha Taasisi, Mashule, Makanisa, Misikiti, na Raia na wataalamu waliothibitishwa kwa kutumia teknolojia ya AI na usalama wa Escrow.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-300">
        <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-500"/> Uchunguzi wa AI Papo Hapo</div>
        <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-500"/> Mafundi Walioidhinishwa</div>
        <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-500"/> Malipo Salama (Escrow)</div>
      </div>
    </div>
  );
}