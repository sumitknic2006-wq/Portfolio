import React from 'react';
import { ArrowUp, Terminal } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { profileData } from '../../data/profileData.js';
import SocialLinks from '../common/SocialLinks.jsx';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: t('nav.home'), href: '#hero' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.skills'), href: '#skills' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.achievements'), href: '#achievements' },
    { name: t('nav.dsa'), href: '#dsa' },
    { name: t('nav.education'), href: '#education' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                {profileData.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {profileData.headline}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {t('footer.studentCred')}
            </p>
          </div>

          <SocialLinks />
        </div>

        {/* Quick Nav Links & Back to Top */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Footer Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>{t('footer.backToTop')}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-8 pt-4 text-center text-xs text-slate-500 font-mono">
          &copy; {currentYear} {profileData.name}. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
