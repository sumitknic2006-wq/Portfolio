import React from 'react';
import { Award, Cloud, Trophy, BookOpen, ExternalLink, Calendar, Building2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

const badgeIcons = {
  Certifications: Cloud,
  Hackathons: Trophy,
  'Learning Achievements': BookOpen,
};

export default function AchievementCard({ achievement }) {
  const { t } = useLanguage();
  const Icon = badgeIcons[achievement.category] || Award;

  return (
    <article className="glass-panel p-6 sm:p-7 rounded-2xl glow-card border border-slate-800/80 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-900 border border-slate-800 text-cyan-300">
            {achievement.categoryTag}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
          {achievement.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 mb-4 font-mono">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            {achievement.issuer}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            {achievement.date}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          {achievement.description}
        </p>

        {achievement.details && (
          <ul className="space-y-1.5 mb-6 text-xs text-slate-400 pl-4 list-disc">
            {achievement.details.map((detail, idx) => (
              <li key={idx} className="leading-relaxed">
                {detail}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-mono text-cyan-400/90 font-medium">
          {achievement.badgeType}
        </span>

        {achievement.credentialUrl ? (
          <a
            href={achievement.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>{t('achievements.verifyCredential')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-[11px] font-mono text-slate-500 italic">
            {t('achievements.credentialPending')}
          </span>
        )}
      </div>
    </article>
  );
}
