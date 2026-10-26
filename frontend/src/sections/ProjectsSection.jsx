import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FolderGit2, Search, X, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.jsx';
import { projectsService } from '../services/projects.service.js';
import SectionHeading from '../components/common/SectionHeading.jsx';
import ProjectCard from '../components/cards/ProjectCard.jsx';
import SectionSkeleton from '../components/feedback/SectionSkeleton.jsx';
import ErrorState from '../components/feedback/ErrorState.jsx';
import EmptyState from '../components/feedback/EmptyState.jsx';

export default function ProjectsSection() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rawProjects, setRawProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterTabs = [
    { label: t('projects.filterAll'), value: 'All' },
    { label: t('projects.filterWeb'), value: 'Web Development' },
    { label: t('projects.filterAi'), value: 'AI/ML' },
    { label: t('projects.filterFintech'), value: 'FinTech' },
    { label: t('projects.filterDsa'), value: 'DSA' },
  ];

  // Fetch projects from backend API
  const fetchProjects = useCallback(async (category) => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsService.getProjects(category);
      setRawProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('[ProjectsSection] API query error:', err.message);
      setError(err.message || 'Unable to load projects from portfolio database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects(activeFilter);
  }, [activeFilter, fetchProjects]);

  // Combine category data with client-side keyword search across title, description, summary, and technologies
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return rawProjects;
    }
    const query = searchQuery.toLowerCase().trim();
    return rawProjects.filter((project) => {
      const titleMatch = (project.title || '').toLowerCase().includes(query);
      const subtitleMatch = (project.subtitle || '').toLowerCase().includes(query);
      const summaryMatch = (project.summary || '').toLowerCase().includes(query);
      const descriptionMatch = (project.description || '').toLowerCase().includes(query);
      const categoryMatch = (project.category || project.categoryTag || '').toLowerCase().includes(query);
      const techMatch = Array.isArray(project.technologies)
        ? project.technologies.some((tech) => tech.toLowerCase().includes(query))
        : false;

      return titleMatch || subtitleMatch || summaryMatch || descriptionMatch || categoryMatch || techMatch;
    });
  }, [rawProjects, searchQuery]);

  const handleResetFilters = () => {
    setActiveFilter('All');
    setSearchQuery('');
  };

  const isFiltered = activeFilter !== 'All' || searchQuery.trim() !== '';

  return (
    <section id="projects" className="py-20 border-t border-slate-900 bg-slate-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={FolderGit2}
          title={t('projects.heading')}
          subtitle={t('projects.subtitle')}
        />

        {/* Filter and Search Controls Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div
              className="flex flex-wrap items-center gap-2"
              role="tablist"
              aria-label="Project Category Filters"
            >
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    role="tab"
                    id={`project-tab-${tab.value.toLowerCase().replace(/\s+/g, '-')}`}
                    aria-selected={isActive}
                    aria-controls="projects-grid"
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

            {/* Live Search Input */}
            <div className="relative w-full md:w-80">
              <label htmlFor="project-search-input" className="sr-only">
                {t('projects.searchLabel')}
              </label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="project-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('projects.searchPlaceholder')}
                className="w-full pl-10 pr-9 py-2 rounded-xl text-xs font-mono bg-slate-900/90 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={t('projects.clearSearch')}
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
                  ? t('projects.showingFilteredCount', {
                      count: filteredProjects.length,
                      total: rawProjects.length,
                    })
                  : t('projects.showingCount', { count: filteredProjects.length })}
              </span>
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('projects.clearFilters')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <SectionSkeleton
            cards={4}
            columns="grid-cols-1 md:grid-cols-2"
            cardHeight="h-80"
          />
        )}

        {/* Error State */}
        {error && !loading && (
          <ErrorState
            title="Projects Showcase Unavailable"
            message={error}
            onRetry={() => fetchProjects(activeFilter)}
          />
        )}

        {/* Empty State */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <EmptyState
              icon={FolderGit2}
              title={t('projects.emptyTitle')}
              message={
                searchQuery
                  ? `No published projects match "${searchQuery}" in category '${activeFilter}'.`
                  : t('projects.emptyMessage')
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
                  <span>{t('projects.clearFilters')}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Projects Grid with Framer Motion */}
        {!loading && !error && filteredProjects.length > 0 && (
          <motion.div
            id="projects-grid"
            role="region"
            aria-live="polite"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.slug}
                  layout={!shouldReduceMotion}
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
