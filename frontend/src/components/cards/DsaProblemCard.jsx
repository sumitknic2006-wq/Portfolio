import React, { useState } from 'react';
import { Terminal, Copy, Check, ChevronDown, ChevronUp, Clock, HardDrive } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function DsaProblemCard({ problem }) {
  const { t } = useLanguage();
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const difficultyColors = {
    Easy: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
    Medium: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
    Hard: 'bg-rose-950/60 text-rose-400 border-rose-800/60',
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(problem.cppCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="glass-panel p-6 rounded-2xl glow-card border border-slate-800/80 flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-medium border ${
                difficultyColors[problem.difficulty] || difficultyColors.Medium
              }`}
            >
              {problem.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 text-cyan-300">
              {problem.category}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {problem.platform}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
          {problem.title}
        </h3>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {problem.summary}
        </p>

        {/* Approach Breakdown */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/70 mb-4 space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            {t('dsa.approachLabel')}
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {problem.approach}
          </p>
        </div>

        {/* Dry Run Preview */}
        {problem.dryRun && (
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/50 mb-4 font-mono text-[11px] text-slate-300 leading-relaxed">
            <span className="text-amber-400 font-bold block mb-1">Dry Run Trace:</span>
            {problem.dryRun}
          </div>
        )}

        {/* Complexity Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-2 mb-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-slate-400">Time:</span>
            <span className="text-cyan-300 font-bold">{problem.timeComplexity}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] text-slate-400">Space:</span>
            <span className="text-blue-300 font-bold">{problem.spaceComplexity}</span>
          </div>
        </div>
      </div>

      <div>
        {/* Toggle C++ Code Preview */}
        <button
          type="button"
          onClick={() => setShowCode(!showCode)}
          className="w-full inline-flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-medium text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            {showCode ? 'Hide C++ Solution' : t('dsa.viewCode')}
          </span>
          {showCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCode && (
          <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <span>Solution.cpp</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 text-[10px] text-slate-300 hover:text-cyan-300 transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-3 text-[11px] font-mono text-cyan-200 overflow-x-auto leading-relaxed">
              <code>{problem.cppCode}</code>
            </pre>
          </div>
        )}
      </div>
    </article>
  );
}
