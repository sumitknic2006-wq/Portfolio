import React from 'react';
import { ArrowRight, Download, Github, Linkedin, Terminal, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            2nd Year B.Tech CSE &bull; SAGE University, Indore
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">Sumit Kumar</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8">
            Aspiring Software Engineer focused on <span className="text-cyan-300 font-medium">Full-Stack Development</span> (React, Node.js, Express, MongoDB) and <span className="text-cyan-300 font-medium">Data Structures &amp; Algorithms in C++</span>. Exploring AI/ML and modern cloud computing.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25"
            >
              Explore Projects
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold glass-panel text-slate-200 hover:text-white hover:border-cyan-500/50 transition-all"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
