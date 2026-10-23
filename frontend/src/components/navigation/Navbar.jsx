import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Menu, X, Sparkles, Terminal } from 'lucide-react';

/**
 * Responsive Navigation Header
 * Planned sections: About, Skills, Projects, DSA, Achievements, Contact
 */
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'DSA & C++', href: '#dsa' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              Sumit Kumar
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-mono">
              / SAGE University
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
            >
              {item.name}
            </a>
          ))}
          <a
            href="/files/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-sm shadow-cyan-500/10"
          >
            Resume
          </a>
        </nav>

        {/* Mobile menu toggle button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900"
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
