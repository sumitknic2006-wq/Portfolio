import React from 'react';
import { ArrowRight, Download, Mail, Github, Linkedin, Code2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { profileData } from '../data/profileData.js';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative py-16 sm:py-24 lg:py-28 overflow-hidden">
      {/* Background ambient glow matching reference specifications */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          {/* Hero text */}
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {t('hero.badge')}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              {t('hero.greeting')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                {profileData.name}
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-semibold text-cyan-300/90 mb-4 font-mono">
              {profileData.headline}
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              {t('hero.intro')}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95"
              >
                <span>{t('hero.viewProjects')}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={profileData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold glass-panel text-cyan-300 hover:text-white hover:border-cyan-400 transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{t('hero.downloadResume')}</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-all"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>{t('hero.contactMe')}</span>
              </a>
            </div>

            {/* Quick social hubs */}
            <div className="flex items-center justify-center lg:justify-start gap-4 text-xs font-mono text-slate-400">
              <a
                href={profileData.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <span className="text-slate-700">&bull;</span>
              <a
                href={profileData.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <span className="text-slate-700">&bull;</span>
              <a
                href={profileData.socials.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
              >
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>LeetCode</span>
              </a>
            </div>
          </div>

          {/* Hero Avatar Card */}
          <div className="relative group shrink-0">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl p-2 bg-gradient-to-br from-cyan-500/20 via-slate-900 to-blue-600/20 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 glow-card">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = profileData.avatarFallback;
                  }}
                />
              </div>
            </div>

            {/* Floating verification badge */}
            <div className="absolute -bottom-4 -left-4 glass-panel px-4 py-2.5 rounded-xl border border-cyan-500/30 shadow-lg flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Status</p>
                <p className="text-xs font-bold text-white">Full-Stack &amp; C++ DSA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
