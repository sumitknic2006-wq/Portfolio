import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t('common.themeLight') : t('common.themeDark')}
      className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      title={isDark ? t('common.themeLight') : t('common.themeDark')}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-cyan-600 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
