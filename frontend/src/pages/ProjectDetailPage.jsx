import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import { ArrowLeft, ExternalLink, Github, Code, CheckCircle } from 'lucide-react';

export default function ProjectDetailPage() {
  const { slug } = useParams();

  // Reference catalog of planned projects for Sumit Kumar
  const projectsData = {
    'restify': {
      title: 'RESTIFY',
      category: 'Full-Stack Web App',
      overview: 'RESTIFY is an API workflow companion and testing tool designed to streamline request execution, parameter verification, and payload inspections during RESTful backend development.',
      stack: ['React', 'Node.js', 'Express', 'MongoDB'],
      features: [
        'Endpoint organization and test collection storage',
        'Header, body, and query parameter builders',
        'Response status, headers, and formatted JSON viewer',
      ],
      github: 'https://github.com',
      demo: '#',
    },
    'stocksaathi-ai': {
      title: 'StockSaathi AI',
      category: 'FinTech & AI Companion',
      overview: 'StockSaathi AI explores algorithmic market insights and portfolio surveillance views, presenting aggregated telemetry and indicators for retail investors.',
      stack: ['React', 'Node.js', 'Tailwind CSS', 'AI Prompt Engineering'],
      features: [
        'Personalized market watchlists and technical indicators',
        'Interactive AI chat companion for market concept explanations',
        'Clean responsive charts and dark navy layout',
      ],
      github: 'https://github.com',
      demo: '#',
    },
    'investor-management-app': {
      title: 'Investor Management App',
      category: 'FinTech / Management Platform',
      overview: 'Full-stack application for managing investor communications, tracking investment disbursements, and maintaining transparent portfolio audit logs.',
      stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose'],
      features: [
        'Investor directory with categorized commitment metrics',
        'Transaction logs and capital distribution trackers',
        'Secure RESTful endpoints with Mongoose schema validation',
      ],
      github: 'https://github.com',
      demo: '#',
    },
    'dsa-problem-solver': {
      title: 'DSA in C++ Practice Suite',
      category: 'Algorithms & Problem Solving',
      overview: 'Comprehensive repository of Data Structures and Algorithms solutions written in modern C++ with an emphasis on time/space asymptotic optimality and detailed code commentary.',
      stack: ['C++', 'STL', 'Algorithm Design', 'Optimization'],
      features: [
        'Modular implementations of data structures (Trees, Graphs, Stacks)',
        'Extensive test cases covering edge and boundary conditions',
        'Step-by-step dry-run logic and recurrence relations',
      ],
      github: 'https://github.com',
      demo: '#',
    },
  };

  const project = projectsData[slug] || {
    title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Project Not Found',
    category: 'Engineering Project',
    overview: 'Detailed specifications and architectural milestones will be published as this project completes validation.',
    stack: ['React', 'JavaScript', 'Node.js'],
    features: ['Modular architecture', 'Responsive interface', 'RESTful API integration'],
    github: 'https://github.com',
    demo: '#',
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio Home
        </Link>

        <div className="glass-panel p-8 sm:p-10 rounded-2xl glow-card">
          <span className="text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider">
            {project.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
            {project.title}
          </h1>

          <p className="text-slate-300 text-base leading-relaxed mb-8">
            {project.overview}
          </p>

          <div className="mb-8">
            <h2 className="text-sm font-semibold text-white mb-3">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-md text-xs font-mono bg-slate-900 border border-slate-800 text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-semibold text-white mb-3">Key Architectural Features</h2>
            <ul className="space-y-2">
              {project.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-slate-800">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-white hover:border-cyan-500/50 transition-colors"
            >
              <Github className="w-4 h-4" /> Source Code
            </a>
            <a
              href={project.demo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Launch Demo
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
