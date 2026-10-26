import React, { useState, useMemo } from 'react';
import { Search, X, RotateCcw, Sparkles, Filter, Code2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { dsaProblems } from '../../data/dsaData.js';
import DsaProblemCard from '../../components/cards/DsaProblemCard.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';

export default function DsaExplorer() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const topicOptions = [
    { label: t('dsa.allTopics'), value: 'All' },
    { label: 'Arrays', value: 'Arrays' },
    { label: 'Strings', value: 'Strings' },
    { label: 'Two Pointers', value: 'Two Pointers' },
    { label: 'Sliding Window', value: 'Sliding Window' },
    { label: 'Recursion & Backtracking', value: 'Recursion & Backtracking' },
    { label: 'Hashing', value: 'Hashing' },
  ];

  const difficultyOptions = [
    { label: t('dsa.allDifficulties'), value: 'All' },
    { label: t('dsa.difficultyEasy'), value: 'Easy' },
    { label: t('dsa.difficultyMedium'), value: 'Medium' },
    { label: t('dsa.difficultyHard'), value: 'Hard' },
  ];

  // Combined topic + difficulty + keyword search
  const filteredProblems = useMemo(() => {
    return dsaProblems.filter((problem) => {
      // 1. Topic match
      const topicMatch =
        selectedTopic === 'All' ||
        problem.category.toLowerCase().includes(selectedTopic.toLowerCase()) ||
        (selectedTopic === 'Recursion & Backtracking' &&
          (problem.category.toLowerCase().includes('recursion') ||
            problem.category.toLowerCase().includes('backtracking')));

      // 2. Difficulty match
      const diffMatch =
        selectedDifficulty === 'All' ||
        problem.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      // 3. Keyword query match
      if (!searchQuery.trim()) {
        return topicMatch && diffMatch;
      }

      const q = searchQuery.toLowerCase().trim();
      const titleMatch = (problem.title || '').toLowerCase().includes(q);
      const numberMatch = (problem.problemNumber || '').toLowerCase().includes(q);
      const categoryMatch = (problem.category || '').toLowerCase().includes(q);
      const summaryMatch = (problem.summary || '').toLowerCase().includes(q);
      const approachMatch = (problem.approach || '').toLowerCase().includes(q);

      return topicMatch && diffMatch && (titleMatch || numberMatch || categoryMatch || summaryMatch || approachMatch);
    });
  }, [selectedTopic, selectedDifficulty, searchQuery]);

  const handleResetFilters = () => {
    setSelectedTopic('All');
    setSelectedDifficulty('All');
    setSearchQuery('');
  };

  const isFiltered = selectedTopic !== 'All' || selectedDifficulty !== 'All' || searchQuery.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Control Panel: Search & Filters */}
      <div className="glass-panel p-5 rounded-2xl glow-card border border-slate-800/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Keyword Search */}
          <div className="relative flex-1 max-w-lg">
            <label htmlFor="dsa-search-input" className="sr-only">
              {t('dsa.searchPlaceholder')}
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="dsa-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('dsa.searchPlaceholder')}
              className="w-full pl-10 pr-9 py-2 rounded-xl text-xs font-mono bg-slate-900/90 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear DSA search"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Difficulty Filter Dropdown / Pill row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Difficulty:</span>
            </span>
            {difficultyOptions.map((diff) => {
              const isActive = selectedDifficulty === diff.value;
              return (
                <button
                  key={diff.value}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {diff.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic Filter Pills */}
        <div className="pt-3 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="DSA Topics">
            {topicOptions.map((topic) => {
              const isActive = selectedTopic === topic.value;
              return (
                <button
                  key={topic.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedTopic(topic.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-blue-600/20 border border-blue-500/50 text-cyan-300 font-bold shadow-sm'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {topic.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Telemetry Counter & Clear Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {isFiltered
                ? t('dsa.showingFilteredCount', {
                    count: filteredProblems.length,
                    total: dsaProblems.length,
                  })
                : t('dsa.showingCount', { count: filteredProblems.length })}
            </span>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('dsa.clearFilters')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <EmptyState
            icon={Code2}
            title={t('dsa.emptyTitle')}
            message={
              searchQuery
                ? `No algorithmic problems match "${searchQuery}" for the selected topic and difficulty.`
                : t('dsa.emptyMessage')
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
                <span>{t('dsa.clearFilters')}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Problem Cards Grid */}
      {filteredProblems.length > 0 && (
        <motion.div
          id="dsa-grid"
          role="region"
          aria-live="polite"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProblems.map((problem) => (
              <motion.div
                key={problem.id}
                layout={!shouldReduceMotion}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <DsaProblemCard problem={problem} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
