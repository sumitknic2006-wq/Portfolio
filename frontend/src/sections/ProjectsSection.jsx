import React, { useState } from 'react';
import { FolderGit2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { projectsData } from '../data/projectsData.js';
import SectionHeading from '../components/common/SectionHeading.jsx';
import ProjectCard from '../components/cards/ProjectCard.jsx';

export default function ProjectsSection() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('All');

  const filterTabs = [
    { label: t('projects.filterAll'), value: 'All' },
    { label: t('projects.filterWeb'), value: 'Web Development' },
    { label: t('projects.filterAi'), value: 'AI/ML' },
    { label: t('projects.filterFintech'), value: 'FinTech' },
    { label: t('projects.filterDsa'), value: 'DSA' },
  ];

  const filteredProjects =
    activeFilter === 'All'
      ? projectsData
      : projectsData.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-20 border-t border-slate-900 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={FolderGit2}
          title={t('projects.heading')}
          subtitle={t('projects.subtitle')}
        />

        {/* Working Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-10" role="tablist" aria-label="Project Categories">
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
