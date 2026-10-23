import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { achievementsData } from '../data/achievementsData.js';
import SectionHeading from '../components/common/SectionHeading.jsx';
import AchievementCard from '../components/cards/AchievementCard.jsx';

export default function AchievementsSection() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('All');

  const filterTabs = [
    { label: t('achievements.filterAll'), value: 'All' },
    { label: t('achievements.filterHackathons'), value: 'Hackathons' },
    { label: t('achievements.filterCertifications'), value: 'Certifications' },
    { label: t('achievements.filterLearning'), value: 'Learning Achievements' },
  ];

  const filteredAchievements =
    activeFilter === 'All'
      ? achievementsData
      : achievementsData.filter((a) => a.category === activeFilter);

  return (
    <section id="achievements" className="py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Trophy}
          title={t('achievements.heading')}
          subtitle={t('achievements.subtitle')}
        />

        {/* Working Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10" role="tablist" aria-label="Achievement Categories">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 border border-cyan-500/50 text-cyan-300 font-bold shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </section>
  );
}
