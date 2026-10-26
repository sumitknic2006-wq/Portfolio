import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Github,
  Award,
  Terminal,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { dsaService } from '../../services/dsa.service.js';

export default function CodingProfileHub() {
  const { t } = useLanguage();
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    dsaService
      .getPlatformsOverview()
      .then((res) => {
        if (isMounted && res?.data) {
          setPlatformStats(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('[CodingProfileHub] Platform overview note:', err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const leetcode = platformStats?.leetcode || {
    username: '25001122',
    profileUrl: 'https://leetcode.com/u/25001122/',
    totalSolved: 186,
    easySolved: 128,
    mediumSolved: 56,
    hardSolved: 2,
    dashboardUrl: '/dsa/leetcode',
  };

  const codeforces = platformStats?.codeforces || {
    handle: 'sumitknic567',
    profileUrl: 'https://codeforces.com/profile/sumitknic567',
    rating: 0,
    rank: 'Unrated',
    solvedCount: 0,
    dashboardUrl: '/dsa/codeforces',
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl glow-card border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Competitive Programming &amp; Algorithmic Trackers</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Platform-Wise Problem Trackers &amp; Verifications
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Live profiles and dedicated dashboards for LeetCode and Codeforces with documented C++ optimal solutions, complexity proofs, and step-by-step dry-run traces.
          </p>
        </div>
      </div>

      {/* Main Platform Cards Grid: LeetCode & Codeforces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. LeetCode Card */}
        <div className="glass-panel p-6 rounded-2xl glow-card border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent flex flex-col justify-between transition-all hover:border-amber-500/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">LeetCode</h4>
                  <p className="text-xs font-mono text-amber-400">@{leetcode.username}</p>
                </div>
              </div>

              <div className="px-2.5 py-1 rounded-lg text-center bg-amber-500/10 border border-amber-500/30 shrink-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono text-amber-300 font-semibold leading-tight">Tracker</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold leading-tight flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Curated C++ optimal pattern solutions across Two Pointers, Sliding Window, Backtracking, and Hashing.
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 text-center font-mono">
              <div>
                <p className="text-[10px] text-slate-400">Solved</p>
                <p className="text-base font-bold text-white">{leetcode.totalSolved || 7}</p>
              </div>
              <div>
                <p className="text-[10px] text-emerald-400">Easy / Med</p>
                <p className="text-base font-bold text-emerald-400">
                  {leetcode.easySolved || 1} / {leetcode.mediumSolved || 5}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-rose-400">Hard</p>
                <p className="text-base font-bold text-rose-400">{leetcode.hardSolved || 1}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-2">
            <Link
              to="/dsa/leetcode"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-md shadow-amber-500/20 group"
            >
              <span>Open LeetCode Tracker</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={leetcode.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-amber-300 transition-colors"
            >
              <span>View LeetCode Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 2. Codeforces Card */}
        <div className="glass-panel p-6 rounded-2xl glow-card border border-blue-500/30 bg-gradient-to-b from-blue-500/5 to-transparent flex flex-col justify-between transition-all hover:border-blue-500/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Codeforces</h4>
                  <p className="text-xs font-mono text-blue-400">@{codeforces.handle}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Competitive programming contest track, rating analytics, and verified Div. 2 / Div. 3 solved problem solutions.
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 text-center font-mono">
              <div>
                <p className="text-[10px] text-slate-400">Rating</p>
                <p className="text-xs font-bold text-white">{codeforces.rating > 0 ? codeforces.rating : 'Unrated'}</p>
              </div>
              <div>
                <p className="text-[10px] text-blue-400">Rank</p>
                <p className="text-xs font-bold text-blue-300 mt-0.5">{codeforces.rank || 'Unrated'}</p>
              </div>
              <div>
                <p className="text-[10px] text-emerald-400">Practice AC</p>
                <p className="text-xs font-bold text-emerald-400">{codeforces.solvedCount !== undefined ? codeforces.solvedCount : 0}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-2">
            <Link
              to="/dsa/codeforces"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 transition-all shadow-md shadow-blue-500/20 group"
            >
              <span>Open Codeforces Tracker</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={codeforces.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-blue-300 transition-colors"
            >
              <span>View Codeforces Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 3. GitHub Card */}
        <div className="glass-panel p-6 rounded-2xl glow-card border border-slate-800/80 bg-gradient-to-b from-slate-800/10 to-transparent flex flex-col justify-between transition-all md:col-span-2 lg:col-span-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <Github className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">GitHub</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold whitespace-nowrap shrink-0">
                      Open Source
                    </span>
                  </div>
                  <p className="text-xs font-mono text-cyan-400">@sumitknic2006-wq</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Version-controlled C++ algorithmic practice suite and full-stack software development projects.
            </p>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-1.5 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Terminal className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">sumit-portfolio • restify • dsa-in-cpp</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Layers className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Primary: C++, JavaScript, React</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <a
              href="https://github.com/sumitknic2006-wq"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 transition-all shadow-md shadow-blue-500/20 group"
            >
              <span>Explore GitHub Repositories</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
