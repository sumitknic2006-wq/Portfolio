import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Code2,
  Clock,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Edit3,
  Save,
  AlertCircle,
  FileCode,
  Tag,
  Cpu,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout.jsx';
import dsaService from '../services/dsa.service.js';

export default function DsaProblemDetailPage() {
  const { platform = 'leetcode', slug } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dry run step state
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Copy code feedback
  const [copied, setCopied] = useState(false);

  // Edit notes & source code state
  const [isEditing, setIsEditing] = useState(false);
  const [editApproach, setEditApproach] = useState('');
  const [editSourceCode, setEditSourceCode] = useState('');
  const [editTimeComp, setEditTimeComp] = useState('');
  const [editSpaceComp, setEditSpaceComp] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const fetchProblem = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dsaService.getProblemDetail(platform, slug);
      if (res?.data) {
        setProblem(res.data);
        setEditApproach(res.data.approach || '');
        setEditSourceCode(res.data.sourceCode || '');
        setEditTimeComp(res.data.timeComplexity || '');
        setEditSpaceComp(res.data.spaceComplexity || '');
      } else {
        setError('Problem details could not be found.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load problem.');
    } finally {
      setLoading(false);
    }
  }, [platform, slug]);

  useEffect(() => {
    fetchProblem();
  }, [fetchProblem]);

  const handleCopyCode = async () => {
    if (!problem?.sourceCode) return;
    try {
      await navigator.clipboard.writeText(problem.sourceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      setSaveMessage(null);
      const res = await dsaService.updateProblem(platform, slug, {
        approach: editApproach,
        sourceCode: editSourceCode,
        timeComplexity: editTimeComp,
        spaceComplexity: editSpaceComp,
      });

      if (res?.data) {
        setProblem((prev) => ({
          ...prev,
          approach: editApproach,
          sourceCode: editSourceCode,
          timeComplexity: editTimeComp,
          spaceComplexity: editSpaceComp,
        }));
        setSaveMessage({ type: 'success', text: 'Solution and notes saved to MongoDB successfully!' });
        setIsEditing(false);
      }
    } catch (err) {
      setSaveMessage({
        type: 'error',
        text: err?.response?.data?.message || 'Failed to update problem notes.',
      });
    } finally {
      setSavingNotes(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  const platformMeta =
    platform.toLowerCase() === 'codeforces'
      ? {
          name: 'Codeforces',
          backPath: '/dsa/codeforces',
          badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        }
      : {
          name: 'LeetCode',
          backPath: '/dsa/leetcode',
          badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };

  const getDifficultyBadge = (diff, rating) => {
    if (rating) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          Rating: {rating}
        </span>
      );
    }
    const d = (diff || '').toLowerCase();
    if (d === 'easy') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Easy
        </span>
      );
    }
    if (d === 'hard') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Hard
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        Medium
      </span>
    );
  };

  const getProvenanceBadge = (prov) => {
    switch (prov) {
      case 'live_sync':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Live Verified Submission
          </span>
        );
      case 'curated_example':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Reference Example
          </span>
        );
      case 'manual_import':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Imported Record
          </span>
        );
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Breadcrumbs & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <nav className="flex items-center space-x-2 text-sm text-slate-400">
              <Link to="/" className="hover:text-cyan-400 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/#coding-profiles" className="hover:text-cyan-400 transition-colors">
                DSA Profiles
              </Link>
              <span>/</span>
              <Link to={platformMeta.backPath} className="hover:text-cyan-400 transition-colors capitalize">
                {platformMeta.name}
              </Link>
              <span>/</span>
              <span className="text-slate-200 truncate max-w-xs">{problem?.title || slug}</span>
            </nav>

            <Link
              to={platformMeta.backPath}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to {platformMeta.name} Tracker
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-6 animate-pulse">
              <div className="h-28 bg-slate-900/60 rounded-2xl border border-slate-800/60 p-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-96 bg-slate-900/40 rounded-2xl border border-slate-800/40"></div>
                <div className="h-96 bg-slate-900/40 rounded-2xl border border-slate-800/40"></div>
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-4">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <h2 className="text-xl font-bold text-white">Problem Record Not Found</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">{error}</p>
              <Link
                to={platformMeta.backPath}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Problem Tracker
              </Link>
            </div>
          )}

          {/* Main Content */}
          {!loading && problem && (
            <>
              {/* Reference Example Notice Banner */}
              {problem.provenance === 'curated_example' && (
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/25 text-xs font-mono text-purple-200 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-semibold text-white">Curated Reference Solution:</span> This problem is an educational reference implementation with an interactive execution trace. It is maintained for algorithmic study and is kept separate from live verified account totals.
                  </div>
                </div>
              )}

              {/* Header Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl -z-10" />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${platformMeta.badgeClass}`}
                      >
                        {platformMeta.name}
                      </span>
                      {getProvenanceBadge(problem.provenance)}
                      {getDifficultyBadge(problem.difficulty, problem.rating)}
                      {problem.problemId && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          #{problem.problemId}
                        </span>
                      )}
                      {problem.category && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-cyan-300 border border-cyan-800/40">
                          {problem.category}
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {problem.status || 'Solved'}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {problem.title}
                    </h1>

                    {problem.summary && (
                      <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                        {problem.summary}
                      </p>
                    )}

                    {/* Tags */}
                    {problem.tags && problem.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
                        {problem.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-xs bg-slate-800/60 text-slate-400 border border-slate-700/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Official Link */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                    {problem.problemUrl && (
                      <a
                        href={problem.problemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Official Problem Statement
                      </a>
                    )}
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                      {isEditing ? 'Cancel Edit' : problem.sourceCode ? 'Edit Solution & Notes' : 'Add Solution Code'}
                    </button>
                  </div>
                </div>

                {/* Performance Metrics Bar if available */}
                {(problem.runtime || problem.memory || problem.language || problem.submissionDate) && (
                  <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap gap-6 text-xs text-slate-400">
                    {problem.language && (
                      <div>
                        Language:{' '}
                        <span className="font-semibold text-slate-200">
                          {problem.language}
                        </span>
                      </div>
                    )}
                    {problem.submissionDate && (
                      <div>
                        Accepted Date:{' '}
                        <span className="font-semibold text-slate-200">
                          {new Date(problem.submissionDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {problem.runtime && (
                      <div>
                        Runtime:{' '}
                        <span className="font-semibold text-emerald-400">
                          {problem.runtime}
                        </span>
                      </div>
                    )}
                    {problem.memory && (
                      <div>
                        Memory:{' '}
                        <span className="font-semibold text-cyan-400">
                          {problem.memory}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Edit Notes & Code Form */}
              {isEditing && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-cyan-400" />
                      Edit Solution Code, Approach &amp; Complexities
                    </h3>
                    <span className="text-xs text-slate-400">Saves directly to MongoDB</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        C++ Solution Source Code
                      </label>
                      <textarea
                        rows={8}
                        value={editSourceCode}
                        onChange={(e) => setEditSourceCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-200 text-xs focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
                        placeholder="#include <iostream>&#10;&#10;class Solution {&#10;public:&#10;    // Paste your C++ solution here&#10;};"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Approach &amp; Intuition Explanation
                      </label>
                      <textarea
                        rows={3}
                        value={editApproach}
                        onChange={(e) => setEditApproach(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
                        placeholder="Explain the intuition, pointer movements, boundary edge cases..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Time Complexity (e.g. O(N), O(log N))
                        </label>
                        <input
                          type="text"
                          value={editTimeComp}
                          onChange={(e) => setEditTimeComp(e.target.value)}
                          placeholder="O(N)"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Space Complexity (e.g. O(1), O(N))
                        </label>
                        <input
                          type="text"
                          value={editSpaceComp}
                          onChange={(e) => setEditSpaceComp(e.target.value)}
                          placeholder="O(1)"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={handleSaveNotes}
                        disabled={savingNotes}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-50 transition-all"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {savingNotes ? 'Saving...' : 'Save Changes to MongoDB'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Message */}
              {saveMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    saveMessage.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {saveMessage.type === 'success' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {saveMessage.text}
                </div>
              )}

              {/* Two Column Grid: Code & Solution Approach */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Solution Code Viewer (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      Accepted Source Code
                    </h2>
                    {problem.sourceCode && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {problem.language || 'C++'}
                        </span>
                        <button
                          onClick={handleCopyCode}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                          title="Copy source code"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {problem.sourceCode ? (
                    <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl relative">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">
                          solution.{problem.language === 'Python' ? 'py' : 'cpp'}
                        </span>
                      </div>
                      <pre className="p-4 overflow-x-auto text-xs font-mono text-cyan-100/90 leading-relaxed max-h-[540px]">
                        <code>{problem.sourceCode}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
                      <div className="p-3 w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 mx-auto flex items-center justify-center">
                        <Code2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">Solution Code Not Yet Attached</h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                          This problem was verified from your live account activity. Platform public APIs do not provide private source code without authentication. You can attach your C++ solution code and approach notes below.
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-3 pt-1">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Attach My Solution Code
                        </button>
                        {problem.problemUrl && (
                          <a
                            href={problem.problemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                          >
                            <span>Open on {platformMeta.name}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Approach, Complexity, and Interactive Trace (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Big-O Complexity Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        Time Complexity
                      </div>
                      <div className="text-lg font-mono font-bold text-cyan-300">
                        {problem.timeComplexity || 'Not Set'}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        Space Complexity
                      </div>
                      <div className="text-lg font-mono font-bold text-cyan-300">
                        {problem.spaceComplexity || 'Not Set'}
                      </div>
                    </div>
                  </div>

                  {/* Intuition / Approach Card */}
                  <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      Approach &amp; Algorithmic Strategy
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {problem.approach ||
                        'Approach description has not been recorded yet. Click "Edit Solution Notes" to add your algorithmic intuition, edge case analysis, or complexity notes.'}
                    </p>
                  </div>

                  {/* Interactive Dry Run Stepper */}
                  {problem.dryRunSteps && problem.dryRunSteps.length > 0 ? (
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Step-by-Step Execution Trace
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          Step {activeStepIndex + 1} of {problem.dryRunSteps.length}
                        </span>
                      </div>

                      {/* Current Step Content */}
                      {(() => {
                        const current = problem.dryRunSteps[activeStepIndex];
                        if (!current) return null;
                        return (
                          <div className="space-y-3">
                            <p className="text-xs text-slate-200 leading-relaxed font-medium">
                              {current.description}
                            </p>

                            {/* Variable Snapshot */}
                            {current.variables && (
                              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                                  State Snapshot
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                                  {Object.entries(current.variables).map(([k, v]) => (
                                    <div
                                      key={k}
                                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 truncate"
                                    >
                                      <span className="text-slate-400">{k}:</span>{' '}
                                      <span className="text-cyan-300 font-bold">
                                        {String(v)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Highlight / Decision */}
                            {current.highlight && (
                              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-mono">
                                💡 {current.highlight}
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Step Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <button
                          onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                          disabled={activeStepIndex === 0}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Previous
                        </button>

                        {/* Progress Indicators */}
                        <div className="flex items-center space-x-1.5">
                          {problem.dryRunSteps.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveStepIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === activeStepIndex
                                  ? 'bg-cyan-400 w-4'
                                  : 'bg-slate-700 hover:bg-slate-600'
                              }`}
                              title={`Jump to step ${idx + 1}`}
                            />
                          ))}
                        </div>

                        <button
                          onClick={() =>
                            setActiveStepIndex((prev) =>
                              Math.min(problem.dryRunSteps.length - 1, prev + 1)
                            )
                          }
                          disabled={activeStepIndex === problem.dryRunSteps.length - 1}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Next
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : problem.dryRun ? (
                    <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Dry Run &amp; Verification
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono">
                        {problem.dryRun}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
