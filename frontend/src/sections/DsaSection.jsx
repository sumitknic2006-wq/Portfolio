import React from 'react';
import { Terminal, Code2, Github, ExternalLink, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { profileData } from '../data/profileData.js';
import { dsaProblems } from '../data/dsaData.js';
import SectionHeading from '../components/common/SectionHeading.jsx';
import DsaProblemCard from '../components/cards/DsaProblemCard.jsx';

export default function DsaSection() {
  const { t } = useLanguage();

  const topicTags = [
    'Two Pointers',
    'Sliding Window',
    'Binary Search Trees',
    'Recursion & Backtracking',
    'Monotonic Stacks',
    'Strings & Hashing',
  ];

  return (
    <section id="dsa" className="py-20 border-t border-slate-900 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Terminal}
          title={t('dsa.heading')}
          subtitle={t('dsa.subtitle')}
        />

        {/* Coding Profile Link Hub */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl glow-card border border-slate-800/80 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('dsa.profilesHeading')}</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Algorithmic Problem Solving in C++
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {t('dsa.profilesText')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={profileData.socials.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all shadow-sm"
            >
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>LeetCode Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={profileData.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-all shadow-sm"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Solutions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Topic Badges */}
        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
            Core Algorithmic Focus Patterns:
          </p>
          <div className="flex flex-wrap gap-2">
            {topicTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-900/90 border border-slate-800 text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Selected Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dsaProblems.map((problem) => (
            <DsaProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      </div>
    </section>
  );
}
