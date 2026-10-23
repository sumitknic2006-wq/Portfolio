import React from 'react';
import { User, BookOpen, Compass, Target } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 border-t border-slate-900 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            About Me
          </h2>
        </div>
        <p className="text-slate-400 max-w-2xl mb-12">
          Background, academic journey, and technical aspirations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl glass-panel glow-card space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-medium text-sm">
              <BookOpen className="w-4 h-4" />
              <span>Academic Background</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Currently in my second year pursuing a Bachelor of Technology (B.Tech) in Computer Science &amp; Engineering at SAGE University, Indore. Focused on building strong fundamentals in computer science, software engineering principles, and core algorithmic problem-solving.
            </p>
          </div>

          <div className="p-6 rounded-xl glass-panel glow-card space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-medium text-sm">
              <Target className="w-4 h-4" />
              <span>Career Objective &amp; Interests</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Aspiring Software Engineer passionate about full-stack engineering across modern JavaScript ecosystems (MERN). Actively solving algorithmic challenges using C++, while expanding technical breadth into AI/ML and applied data systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
