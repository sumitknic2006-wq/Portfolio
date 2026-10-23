import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function LanguageToggle() {
  const { toggleLanguage, isHindi } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label="Toggle language between English and Hindi"
      className="language-toggle-btn inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono font-medium text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      title="Switch Language (English / हिंदी)"
    >
      <Languages className="w-3.5 h-3.5 text-cyan-400" />
      <span className="font-semibold">{isHindi ? 'हिंदी' : 'EN'}</span>
    </button>
  );
}
