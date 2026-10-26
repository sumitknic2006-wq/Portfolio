import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  HardDrive,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function DsaProblemCard({ problem }) {
  const { t } = useLanguage();
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dryRunMode, setDryRunMode] = useState('static'); // 'static' | 'interactive'
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const difficultyColors = {
    Easy: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
    Medium: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
    Hard: 'bg-rose-950/60 text-rose-400 border-rose-800/60',
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(problem.cppCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
  };

  const steps = Array.isArray(problem.dryRunSteps) && problem.dryRunSteps.length > 0 ? problem.dryRunSteps : null;
  const currentStep = steps ? steps[currentStepIndex] : null;

  const handleNextStep = () => {
    if (steps && currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (steps && currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleResetTrace = () => {
    setCurrentStepIndex(0);
  };

  return (
    <article className="glass-panel p-6 rounded-2xl glow-card border border-slate-800/80 flex flex-col justify-between transition-all">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-medium border ${
                difficultyColors[problem.difficulty] || difficultyColors.Medium
              }`}
            >
              {problem.difficulty === 'Easy'
                ? t('dsa.difficultyEasy')
                : problem.difficulty === 'Medium'
                ? t('dsa.difficultyMedium')
                : t('dsa.difficultyHard')}
            </span>

            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 text-cyan-300">
              {problem.category}
            </span>

            {problem.problemNumber && (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-950/50 border border-blue-800/50 text-blue-300">
                {problem.problemNumber}
              </span>
            )}
          </div>

          {problem.problemUrl ? (
            <a
              href={problem.problemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              title={t('dsa.originalProblem')}
            >
              <span>{problem.platform}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-[11px] font-mono text-slate-400">{problem.platform}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
          {problem.title}
        </h3>

        {/* Problem Summary */}
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {problem.summary}
        </p>

        {/* Approach Breakdown */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/70 mb-4 space-y-1.5">
          <p className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('dsa.approachLabel')}</span>
          </p>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {problem.approach}
          </p>
        </div>

        {/* Dry Run Section: Static Explanation vs Interactive Trace */}
        {problem.dryRun && (
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4">
            <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-800/60">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-amber-400">
                <Layers className="w-3.5 h-3.5" />
                <span>{dryRunMode === 'interactive' ? t('dsa.interactiveTraceLabel') : t('dsa.dryRunLabel')}</span>
              </div>

              {steps && (
                <div className="inline-flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setDryRunMode('static')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      dryRunMode === 'static'
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t('dsa.modeStatic')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDryRunMode('interactive')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      dryRunMode === 'interactive'
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t('dsa.modeInteractive')}
                  </button>
                </div>
              )}
            </div>

            {/* Static View */}
            {dryRunMode === 'static' && (
              <div className="font-mono text-[11px] text-slate-300 leading-relaxed">
                {problem.dryRun}
              </div>
            )}

            {/* Interactive Step-by-Step View */}
            {dryRunMode === 'interactive' && currentStep && (
              <div className="space-y-3 font-mono text-[11px]">
                {/* Step indicator and progress controls */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-cyan-300">
                    {t('dsa.stepIndicator', {
                      current: currentStep.step,
                      total: steps.length,
                    })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={currentStepIndex === 0}
                      aria-label={t('dsa.stepPrev')}
                      className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={currentStepIndex === steps.length - 1}
                      aria-label={t('dsa.stepNext')}
                      className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleResetTrace}
                      aria-label={t('dsa.stepReset')}
                      className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors ml-1"
                      title={t('dsa.stepReset')}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Step description */}
                <p className="text-slate-200 leading-relaxed font-sans text-xs">
                  {currentStep.description}
                </p>

                {/* Variables state pills */}
                {currentStep.variables && (
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/80">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                      {t('dsa.stepVariables')}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(currentStep.variables).map(([key, val]) => (
                        <span
                          key={key}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-cyan-300"
                        >
                          <span className="text-slate-400">{key}:</span> {String(val)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step decision / highlight */}
                {currentStep.highlight && (
                  <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/50 text-[11px] text-amber-300 leading-snug">
                    <span className="font-bold">{t('dsa.stepDecision')}:</span> {currentStep.highlight}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Complexity Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-1 mb-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-slate-400">{t('dsa.timeComplexity')}:</span>
            <span className="text-cyan-300 font-bold">{problem.timeComplexity}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] text-slate-400">{t('dsa.spaceComplexity')}:</span>
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
            {showCode ? t('dsa.hideCode') : t('dsa.viewCode')}
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
                title={t('dsa.copyCode')}
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? t('dsa.codeCopied') : t('dsa.copyCode')}</span>
              </button>
            </div>
            <pre className="p-3 text-[11px] font-mono text-cyan-200 overflow-x-auto leading-relaxed max-h-72">
              <code>{problem.cppCode}</code>
            </pre>
          </div>
        )}
      </div>
    </article>
  );
}
