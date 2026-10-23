import React from 'react';
import { User, BookOpen, Compass, Target, MapPin, GraduationCap, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { profileData } from '../data/profileData.js';
import SectionHeading from '../components/common/SectionHeading.jsx';

export default function AboutSection() {
  const { t } = useLanguage();

  const infoBadges = [
    { label: t('about.collegeLabel'), value: profileData.university, icon: GraduationCap },
    { label: t('about.locationLabel'), value: profileData.location, icon: MapPin },
    { label: t('about.statusLabel'), value: profileData.currentYear, icon: Sparkles },
  ];

  return (
    <section id="about" className="py-20 border-t border-slate-900 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={User}
          title={t('about.heading')}
          subtitle={t('about.subtitle')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Bio Card */}
          <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-2xl glow-card border border-slate-800/80 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2 font-mono uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>{t('about.bioTitle')}</span>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {t('about.bioText')}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2 font-mono uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>{t('about.journeyTitle')}</span>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {t('about.journeyText')}
              </p>
            </div>
          </div>

          {/* Quick Info & Highlights */}
          <div className="space-y-4">
            {infoBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className="glass-panel p-5 rounded-2xl glow-card border border-slate-800/80 flex items-start gap-3.5"
                >
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      {badge.label}
                    </p>
                    <p className="text-sm font-semibold text-white mt-0.5">
                      {badge.value}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Core learning pillars */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
              <p className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 mb-3 font-semibold">
                Core Engineering Pillars
              </p>
              <div className="flex flex-wrap gap-2">
                {['C++ DSA', 'React 19', 'Node.js', 'Express', 'MongoDB', 'AI/ML Foundations'].map((pillar) => (
                  <span
                    key={pillar}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    {pillar}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
