import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function ProjectCard({ project }) {
  const { t } = useLanguage();

  return (
    <article className="glass-panel rounded-2xl overflow-hidden glow-card flex flex-col justify-between border border-slate-800/80 group">
      {/* Thumbnail / Architecture SVG */}
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden border-b border-slate-800/80">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-950/80 border border-slate-800 text-cyan-300 backdrop-blur-md">
            {project.categoryTag}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {project.isVerified ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 backdrop-blur-md">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              {t('projects.verified')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-amber-950/80 border border-amber-800/60 text-amber-300 backdrop-blur-md">
              <Clock className="w-3 h-3 text-amber-400" />
              {t('projects.inProgress')}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
            {project.title}
          </h3>
          <p className="text-xs font-mono text-cyan-400/90 mb-3">
            {project.subtitle}
          </p>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            {project.summary}
          </p>
        </div>

        <div>
          {/* Tech Pills */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <Link
              to={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {t('projects.viewDetails')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  aria-label={`${project.title} GitHub Repository`}
                  title={t('projects.githubRepo')}
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.liveDemo && project.liveDemo !== '#' && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all"
                  aria-label={`${project.title} Live Demo`}
                >
                  <span>{t('projects.liveDemo')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
