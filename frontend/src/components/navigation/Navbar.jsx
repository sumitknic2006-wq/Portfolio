import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Menu, X, ArrowUpRight, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import ThemeToggle from '../common/ThemeToggle.jsx';
import LanguageToggle from '../common/LanguageToggle.jsx';
import { useProfile } from '../../context/ProfileContext.jsx';

export default function Navbar() {
  const { t } = useLanguage();
  const { profile: profileData } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();

  const isHome = location.pathname === '/';

  const navItems = [
    { name: t('nav.home'), href: '#hero', id: 'hero' },
    { name: t('nav.about'), href: '#about', id: 'about' },
    { name: t('nav.skills'), href: '#skills', id: 'skills' },
    { name: t('nav.projects'), href: '#projects', id: 'projects' },
    { name: t('nav.achievements'), href: '#achievements', id: 'achievements' },
    { name: t('nav.dsa'), href: '#dsa', id: 'dsa' },
    { name: t('nav.education'), href: '#education', id: 'education' },
    { name: t('nav.contact'), href: '#contact', id: 'contact' },
  ];

  // Scroll spy to highlight active section on the homepage
  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'achievements', 'dsa', 'education', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = `/${href}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 group-hover:scale-105 transition-all">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              {profileData.name}
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] text-slate-400 font-mono">
              / SAGE Univ
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = isHome && activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 pb-1'
                    : 'text-slate-300 hover:text-cyan-300'
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Controls: Language, Theme, CTAs */}
        <div className="flex items-center gap-2.5">
          <LanguageToggle />
          <ThemeToggle />

          <Link
            to="/admin/login"
            title="Admin Portal"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition-colors"
          >
            <Shield className="w-4 h-4" />
          </Link>

          <a
            href={profileData.resumeUrl}
            download="Sumit_Kumar_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-sm"
          >
            {t('nav.resume')}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <a
            href="#contact"
            onClick={() => handleNavClick('#contact')}
            className="hidden md:inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-sm shadow-cyan-500/20"
          >
            {t('nav.contactMe')}
          </a>

          {/* Mobile hamburger button */}
          <div className="flex xl:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation drawer"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-5 space-y-2 backdrop-blur-lg">
          <div className="grid grid-cols-2 gap-1.5 pb-3 border-b border-slate-800/80">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={profileData.resumeUrl}
              download="Sumit_Kumar_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"
            >
              {t('nav.resume')} <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="#contact"
              onClick={() => handleNavClick('#contact')}
              className="w-full inline-flex items-center justify-center py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold"
            >
              {t('nav.contactMe')}
            </a>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
