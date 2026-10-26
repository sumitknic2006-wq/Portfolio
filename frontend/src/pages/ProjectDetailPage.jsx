import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  CheckCircle2,
  Layers,
  Cpu,
  ShieldCheck,
  Clock,
  Compass,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { projectsService } from '../services/projects.service.js';
import ProjectDetailSkeleton from '../components/feedback/ProjectDetailSkeleton.jsx';
import ErrorState from '../components/feedback/ErrorState.jsx';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsService.getProjectBySlug(slug);
      setProject(data || null);
    } catch (err) {
      console.warn('[ProjectDetailPage] Failed to fetch project:', err.message);
      // If 404, set project to null so not-found screen renders
      if (err.status === 404 || err.code === 'PROJECT_NOT_FOUND') {
        setProject(null);
      } else {
        setError(err.message || 'Unable to load project architecture details.');
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // 1. Loading Skeleton
  if (loading) {
    return (
      <MainLayout>
        <ProjectDetailSkeleton />
      </MainLayout>
    );
  }

  // 2. Server/Network Error Screen
  if (error) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-20">
          <ErrorState
            title={t('projectDetail.errorTitle')}
            message={error}
            onRetry={fetchProject}
          />
          <div className="text-center mt-6">
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300"
            >
              <ArrowLeft className="w-4 h-4" /> {t('projectDetail.backToProjects')}
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 3. Project Not Found (404)
  if (!project) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
          <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-400 mb-6">
            <Compass className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">
            {t('projectDetail.notFoundTitle')}
          </h1>
          <p className="text-sm text-slate-300 max-w-md mb-8">
            {t('projectDetail.notFoundMessage')}{' '}
            <span className="font-mono text-cyan-300">"{slug}"</span>.
          </p>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> {t('projectDetail.backToProjects')}
          </Link>
        </div>
      </MainLayout>
    );
  }

  const features = Array.isArray(project.features) ? project.features : [];
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Breadcrumb Back Button */}
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t('projectDetail.backToProjects')}</span>
        </Link>

        {/* Header Hero Card */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl glow-card border border-slate-800/80 mb-10 transition-all">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-slate-900 border border-slate-800 text-cyan-300">
              {project.categoryTag || project.category || 'Portfolio Project'}
            </span>

            {project.isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{project.statusBadge || t('projectDetail.statusVerified')}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium bg-amber-950/80 border border-amber-800/60 text-amber-300">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{project.statusBadge || t('projectDetail.statusDev')}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
            {project.title}
          </h1>

          {project.subtitle && (
            <p className="text-base sm:text-lg text-cyan-300 font-mono mb-6">
              {project.subtitle}
            </p>
          )}

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mb-8">
            {project.description || project.summary}
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-800/80">
            {project.liveDemo && project.liveDemo !== '#' && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20"
              >
                <span>{t('projectDetail.launchLive')}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.backendUrl && (
              <a
                href={project.backendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-slate-900 border border-slate-800 text-cyan-300 hover:border-cyan-400 transition-colors"
              >
                <span>{t('projectDetail.backendHealth')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-all"
              >
                <Github className="w-4 h-4" />
                <span>{t('projectDetail.sourceCode')}</span>
              </a>
            )}
          </div>
        </div>

        {/* Visual Architecture Preview */}
        {(project.thumbnail || project.architecture) && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl glow-card border border-slate-800/80 mb-10 transition-all">
            <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold mb-4">
              <Layers className="w-4 h-4" />
              <span>{t('projectDetail.architectureHeading')}</span>
            </div>

            {project.thumbnail && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 mb-6">
                <img
                  src={project.thumbnail}
                  alt={`${project.title} Architecture Blueprint`}
                  className="w-full h-auto object-cover max-h-[480px]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {project.architecture && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {project.architecture}
              </p>
            )}
          </div>
        )}

        {/* Grid Sections: Problem, Solution, Features, Contribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Problem Statement */}
          {project.problem && (
            <div className="glass-panel p-6 sm:p-7 rounded-2xl glow-card border border-slate-800/80 transition-all">
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                {t('projectDetail.problemHeading')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.problem}
              </p>
            </div>
          )}

          {/* Solution Approach */}
          {project.solution && (
            <div className="glass-panel p-6 sm:p-7 rounded-2xl glow-card border border-slate-800/80 transition-all">
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {t('projectDetail.solutionHeading')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.solution}
              </p>
            </div>
          )}

          {/* Key Implemented Features */}
          {features.length > 0 && (
            <div className="glass-panel p-6 sm:p-7 rounded-2xl glow-card border border-slate-800/80 transition-all">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                {t('projectDetail.featuresHeading')}
              </h2>
              <ul className="space-y-2.5">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Personal Engineering Contribution */}
          {(project.contribution || project.challenges) && (
            <div className="glass-panel p-6 sm:p-7 rounded-2xl glow-card border border-slate-800/80 transition-all">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                {t('projectDetail.contributionHeading')}
              </h2>
              {project.contribution && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {project.contribution}
                </p>
              )}
              {project.challenges && (
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                    {t('projectDetail.challengesLabel')}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {project.challenges}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Technology Stack Tags */}
        {technologies.length > 0 && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl glow-card border border-slate-800/80 mb-12 transition-all">
            <h2 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              {t('projectDetail.techStackHeading')}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-900 border border-slate-800 text-cyan-300 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation Back */}
        <div className="text-center pt-4">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-cyan-500/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('projectDetail.returnShowcase')}</span>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
