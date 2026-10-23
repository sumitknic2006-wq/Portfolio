import React from 'react';
import { Terminal, Award, CheckCircle2, ExternalLink } from 'lucide-react';

export default function DsaSection() {
  const dsaHighlights = [
    {
      topic: 'Arrays, Strings & Two Pointers',
      language: 'C++',
      approach: 'Two-pointer partitioning, sliding window technique, and in-place transformations for O(1) space efficiency.',
    },
    {
      topic: 'Linked Lists & Stacks/Queues',
      language: 'C++',
      approach: 'Pointer manipulation, cycle detection (Floyd\'s algorithm), monotonic stacks for next-greater-element variations.',
    },
    {
      topic: 'Trees, Recursion & Backtracking',
      language: 'C++',
      approach: 'Depth-first and breadth-first search traversals, binary search tree invariant verification, state-space tree recursion.',
    },
  ];

  return (
    <section id="dsa" className="py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            DSA &amp; Coding Profiles
          </h2>
        </div>
        <p className="text-slate-400 max-w-2xl mb-12">
          Structured problem solving in C++ emphasizing clean logic, edge cases, and optimal time &amp; space complexity.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {dsaHighlights.map((item) => (
            <div key={item.topic} className="p-6 rounded-xl glass-panel glow-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-800/40">
                  {item.language}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">{item.topic}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.approach}
              </p>
            </div>
          ))}
        </div>

        {/* Coding Profiles Links */}
        <div className="p-6 rounded-xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-white">Competitive Programming &amp; Coding Hubs</h4>
            <p className="text-xs text-slate-400">Visit verified online profile hubs to view algorithmic practice and contributions.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://leetcode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-cyan-500/40 transition-colors inline-flex items-center gap-1.5"
            >
              LeetCode Profile <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-cyan-500/40 transition-colors inline-flex items-center gap-1.5"
            >
              GitHub Profile <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
