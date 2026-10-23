import React from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, ExternalLink, Github, ArrowUpRight } from 'lucide-react';

export default function ProjectsSection() {
  const projects = [
    {
      slug: 'restify',
      title: 'RESTIFY',
      category: 'Full-Stack Web App',
      description: 'API testing and productivity application for RESTful web service endpoints, designed for agile development and testing workflows.',
      tags: ['React', 'Node.js', 'Express', 'MongoDB'],
      github: 'https://github.com',
      demo: '#',
    },
    {
      slug: 'stocksaathi-ai',
      title: 'StockSaathi AI',
      category: 'FinTech & AI Exploration',
      description: 'AI-assisted financial analytics and market insight companion providing personalized market indicators and portfolio monitoring views.',
      tags: ['React', 'Tailwind CSS', 'Node.js', 'AI Integration'],
      github: 'https://github.com',
      demo: '#',
    },
    {
      slug: 'investor-management-app',
      title: 'Investor Management App',
      category: 'Management System',
      description: 'Full-stack platform designed to track investor relations, capital allocation records, portfolios, and reporting data.',
      tags: ['React', 'Express', 'Mongoose', 'REST API'],
      github: 'https://github.com',
      demo: '#',
    },
    {
      slug: 'dsa-problem-solver',
      title: 'DSA in C++ Practice Suite',
      category: 'Algorithms & Problem Solving',
      description: 'A curated repository of Data Structures and Algorithms solutions implemented in C++ with detailed step-by-step logic, dry-runs, and complexity analysis.',
      tags: ['C++', 'Data Structures', 'Algorithms', 'Optimization'],
      github: 'https://github.com',
      demo: '#',
    },
  ];

  return (
    <section id="projects" className="py-20 border-t border-slate-900 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Featured Projects
          </h2>
        </div>
        <p className="text-slate-400 max-w-2xl mb-12">
          Featured engineering projects, web applications, and problem-solving initiatives.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj) => (
            <div key={proj.slug} className="p-6 rounded-xl glass-panel glow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider">
                    {proj.category}
                  </span>
                  <Link
                    to={`/projects/${proj.slug}`}
                    className="text-xs font-medium text-slate-400 hover:text-cyan-300 inline-flex items-center gap-1 transition-colors"
                  >
                    Details <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{proj.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {proj.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-900">
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    <Github className="w-4 h-4" /> Code Repository
                  </a>
                  <a
                    href={proj.demo}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors ml-auto"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
