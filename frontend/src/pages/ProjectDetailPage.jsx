import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertCircle,
  Layers,
  Cpu,
  ShieldCheck,
  Clock,
  Compass,
  FileCode,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout.jsx';
import { projectsData } from '../data/projectsData.js';

export default function ProjectDetailPage() {
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Find matching project from dataset
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
          <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-400 mb-6">
            <Compass className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Project Not Found</h1>
          <p className="text-sm text-slate-400 max-w-md mb-8">
            The requested project identifier <span className="font-mono text-cyan-300">"{slug}"</span> does not exist in the verified portfolio repository.
          </p>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects Showcase
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Breadcrumb Back Button */}
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Projects</span>
        </Link>

        {/* Header Hero Card */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl glow-card border border-slate-800/80 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-slate-900 border border-slate-800 text-cyan-300">
              {project.categoryTag}
            </span>

            {project.isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{project.statusBadge}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium bg-amber-950/80 border border-amber-800/60 text-amber-300">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{project.statusBadge}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-cyan-300 font-mono mb-6">
            {project.subtitle}
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mb-8">
            {project.description}
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
                <span>Launch Live Application</span>
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
                <span>Backend Health Probe</span>
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
                <span>Source Repository</span>
              </a>
            )}
          </div>
        </div>

        {/* Visual Architecture Preview */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl glow-card border border-slate-800/80 mb-10">
          <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold mb-4">
            <Layers className="w-4 h-4" />
            <span>Architecture &amp; System Flow</span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 mb-6">
            <img
              src={project.thumbnail}
              alt={`${project.title} Architecture Blueprint`}
              className="w-full h-auto object-cover max-h-[480px]"
            />
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {project.architecture}
          </p>
        </div>

        {/* Grid Sections: Problem, Solution, Features, Contribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Problem Statement */}
          <div className="glass-panel p-6 sm:p-7 rounded-2xl glow-card border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Problem Addressed
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.problem}
            </p>
          </div>

          {/* Solution Approach */}
          <div className="glass-panel p-6 sm:p-7 rounded-2xl glow-card border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Engineered Solution
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.solution}
            </p>
          </div>

          {/* Key Implemented Features */}
          <div className="glass-panel p-6 sm:p-7 rounded-2xl glow-card border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Implemented Features
            </h2>
            <ul className="space-y-2.5">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Personal Engineering Contribution */}
          <div className="glass-panel p-6 sm:p-7 rounded-2xl glow-card border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Personal Contribution
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {project.contribution}
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <p className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                Engineering Challenge Overcome:
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {project.challenges}
              </p>
            </div>
          </div>
        </div>

        {/* Technology Stack Tags */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl glow-card border border-slate-800/80 mb-12">
          <h2 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Complete Technology Stack
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-900 border border-slate-800 text-cyan-300 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Navigation Back */}
        <div className="text-center pt-4">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-cyan-500/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio Showcase</span>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
