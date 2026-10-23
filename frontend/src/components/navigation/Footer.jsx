import React from 'react';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-mono text-slate-400">
            &copy; {currentYear} Sumit Kumar. B.Tech Computer Science, SAGE University, Indore.
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Full-Stack Developer &bull; DSA in C++ &bull; Aspiring Software Engineer
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md hover:text-cyan-400 hover:bg-slate-900 transition-colors"
            aria-label="GitHub Profile"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md hover:text-cyan-400 hover:bg-slate-900 transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:contact@example.com"
            className="p-2 rounded-md hover:text-cyan-400 hover:bg-slate-900 transition-colors"
            aria-label="Email Contact"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
