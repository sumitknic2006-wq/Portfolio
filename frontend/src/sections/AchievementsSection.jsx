import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Trophy, Search, X, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.jsx';
import { achievementsService } from '../services/achievements.service.js';
import SectionHeading from '../components/common/SectionHeading.jsx';
import AchievementCard from '../components/cards/AchievementCard.jsx';
import SectionSkeleton from '../components/feedback/SectionSkeleton.jsx';
import ErrorState from '../components/feedback/ErrorState.jsx';
import EmptyState from '../components/feedback/EmptyState.jsx';

export default function AchievementsSection() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rawAchievements, setRawAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterTabs = [
    { label: t('achievements.filterAll'), value: 'All' },
    { label: t('achievements.filterHackathons'), value: 'Hackathons' },
    { label: t('achievements.filterCertifications'), value: 'Certifications' },
    { label: t('achievements.filterLearning'), value: 'Learning Achievements' },
  ];

  const fetchAchievements = useCallback(async (filterValue) => {
    try {
      setLoading(true);
      setError(null);
      const data = await achievementsService.getAchievements(filterValue);
      setRawAchievements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('[AchievementsSection] API query error:', err.message);
      setError(err.message || 'Unable to load achievements from portfolio database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements(activeFilter);
  }, [activeFilter, fetchAchievements]);

  // Combined category + search filtering
  const filteredAchievements = useMemo(() => {
    if (!searchQuery.trim()) {
      return rawAchievements;
    }
    const query = searchQuery.toLowerCase().trim();
    return rawAchievements.filter((item) => {
      const titleMatch = (item.title || '').toLowerCase().includes(query);
      const issuerMatch = (item.issuer || '').toLowerCase().includes(query);
      const badgeMatch = (item.badgeType || '').toLowerCase().includes(query);
      const descMatch = (item.description || '').toLowerCase().includes(query);
      const categoryMatch = (item.category || item.categoryTag || '').toLowerCase().includes(query);

      return titleMatch || issuerMatch || badgeMatch || descMatch || categoryMatch;
    });
  }, [rawAchievements, searchQuery]);

  const handleResetFilters = () => {
    setActiveFilter('All');
    setSearchQuery('');
  };

  const isFiltered = activeFilter !== 'All' || searchQuery.trim() !== '';

  return (
    <section id="achievements" className="py-20 border-t border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Trophy}
          title={t('achievements.heading')}
          subtitle={t('achievements.subtitle')}
        />

        {/* Category Filters and Search Control */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div
              className="flex flex-wrap items-center gap-2"
              role="tablist"
              aria-label="Achievement Category Filters"
            >
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    role="tab"
                    id={`achievement-tab-${tab.value.toLowerCase().replace(/\s+/g, '-')}`}
                    aria-selected={isActive}
                    aria-controls="achievements-grid"
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

            {/* Keyword Search */}
            <div className="relative w-full md:w-72">
              <label htmlFor="achievement-search-input" className="sr-only">
                {t('achievements.searchPlaceholder')}
              </label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="achievement-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('achievements.searchPlaceholder')}
                className="w-full pl-10 pr-9 py-2 rounded-xl text-xs font-mono bg-slate-900/90 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear achievement search"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Telemetry Count and Reset Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {isFiltered
                  ? t('achievements.showingFilteredCount', {
                      count: filteredAchievements.length,
                      total: rawAchievements.length,
                    })
                  : t('achievements.showingCount', { count: filteredAchievements.length })}
              </span>
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('achievements.clearFilters')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <SectionSkeleton
            cards={4}
            columns="grid-cols-1 md:grid-cols-2"
            cardHeight="h-72"
          />
        )}

        {/* Error State */}
        {error && !loading && (
          <ErrorState
            title="Achievements Unavailable"
            message={error}
            onRetry={() => fetchAchievements(activeFilter)}
          />
        )}

        {/* Empty State */}
        {!loading && !error && filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <EmptyState
              icon={Trophy}
              title={t('achievements.emptyTitle')}
              message={
                searchQuery
                  ? `No published achievements match "${searchQuery}" in category '${activeFilter}'.`
                  : t('achievements.emptyMessage')
              }
            />
            {isFiltered && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('achievements.clearFilters')}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Achievements Grid with Framer Motion */}
        {!loading && !error && filteredAchievements.length > 0 && (
          <motion.div
            id="achievements-grid"
            role="region"
            aria-live="polite"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  layout={!shouldReduceMotion}
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                >
                  <AchievementCard achievement={achievement} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
