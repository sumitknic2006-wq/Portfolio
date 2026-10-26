import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ExternalLink,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Upload,
  ArrowLeft,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Award,
  Terminal,
  FileCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { dsaService } from '../services/dsa.service.js';
import ImportModal from '../components/dsa/ImportModal.jsx';

export default function CodeforcesDashboardPage() {
  const navigate = useNavigate();

  // Profile and problems state
  const [profile, setProfile] = useState(null);
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0, curatedCount: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalProblems: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [provenance, setProvenance] = useState('');
  const [sort, setSort] = useState('rating');
  const [order, setOrder] = useState('asc');

  // Import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Fetch Codeforces dashboard data
  const fetchData = useCallback(
    async (targetPage = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await dsaService.getCodeforces({
          page: targetPage,
          limit: 10,
          difficulty,
          category,
          search,
          provenance,
          sort,
          order,
        });

        if (res?.data) {
          setProfile(res.data.profile);
          setProblems(res.data.problems || []);
          if (res.data.stats) {
            setStats(res.data.stats);
          }
          if (res.meta) {
            setPagination(res.meta);
          }
        }
      } catch (err) {
        console.warn('[CodeforcesDashboard] Fetch error:', err.message);
        setError(err.message || 'Failed to load Codeforces problems.');
      } finally {
        setLoading(false);
      }
    },
    [difficulty, category, search, provenance, sort, order]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  // Handle manual sync action
  const handleManualSync = async (fullResync = false) => {
    try {
      setSyncing(true);
      setSyncMessage(null);
      const res = await dsaService.syncPlatform('codeforces', fullResync);
      if (res?.data) {
        setSyncMessage({
          type: 'success',
          text: res.message || 'Successfully synchronized Codeforces profile.',
        });
        await fetchData(pagination.page);
      }
    } catch (err) {
      setSyncMessage({
        type: 'error',
        text: err?.response?.data?.message || err.message || 'Failed to sync Codeforces profile.',
      });
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const getRatingBadge = (rating) => {
    if (!rating || rating === 'Unrated' || rating === 0 || rating === '0') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-800 text-slate-400 border border-slate-700">
          Unrated
        </span>
      );
    }
    const num = parseInt(rating, 10);
    if (num < 1200) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {num} (Newbie)
        </span>
      );
    }
    if (num < 1400) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          {num} (Pupil)
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
        {num} (Specialist)
      </span>
    );
  };

  const getProvenanceBadge = (prov) => {
    switch (prov) {
      case 'live_sync':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 inline-flex items-center gap-1">
            <CheckCircle className="w-2.5 h-2.5" />
            Live Verified
          </span>
        );
      case 'curated_example':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-500/10 text-purple-300 border border-purple-500/25">
            Curated Reference
          </span>
        );
      case 'manual_import':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
            Imported Record
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#070d17] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-300">
      {/* Top Breadcrumb & Navbar */}
      <header className="sticky top-0 z-40 bg-[#091120]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Back to Portfolio"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              Portfolio
            </Link>
            <span>/</span>
            <span className="text-blue-400 font-semibold">Codeforces Tracker</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleManualSync(false)}
            disabled={syncing}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-blue-300 hover:text-white hover:border-blue-500/40 disabled:opacity-50 transition-colors inline-flex items-center gap-1.5 font-mono shadow-sm"
            title="Incremental sync: checks for new submissions since last check"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          <button
            onClick={() => handleManualSync(true)}
            disabled={syncing}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 hover:text-white hover:border-cyan-500/40 disabled:opacity-50 transition-colors inline-flex items-center gap-1.5 font-mono shadow-sm"
            title="Full Resync: paginates through entire submission history from page 1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Full Resync</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors inline-flex items-center gap-1.5 font-mono"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import Solution</span>
          </button>

          <a
            href={profile?.profileUrl || 'https://codeforces.com/profile/sumitknic567'}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 hover:bg-blue-500/20 transition-colors inline-flex items-center gap-1.5 font-mono"
          >
            <span>Official Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Sync Message / Alert */}
        {syncMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs font-mono flex items-center justify-between border ${
              syncMessage.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {syncMessage.text}
            </span>
            <button onClick={() => setSyncMessage(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Profile Header & Stats */}
        <section className="glass-panel p-6 sm:p-8 rounded-2xl glow-card border border-blue-500/30 bg-gradient-to-b from-blue-500/5 to-transparent relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/10">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-bold text-white tracking-tight">Codeforces Tracker</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Official API v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Connected Handle:{' '}
                  <a
                    href={profile?.profileUrl || 'https://codeforces.com/profile/sumitknic567'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 font-semibold hover:underline"
                  >
                    @{profile?.handle || 'sumitknic567'}
                  </a>
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Last synced: {profile?.lastSyncedAt ? new Date(profile.lastSyncedAt).toLocaleTimeString() : 'Recently'}{' '}
                  • Source: codeforces.com/api
                </p>
              </div>
            </div>

            {/* Rating & Contest Breakdown */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center min-w-[90px]">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Rating</p>
                <p className="text-xl font-bold text-white font-mono mt-0.5">
                  {profile?.rating && profile.rating > 0 ? profile.rating : 'Unrated'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center min-w-[85px]">
                <p className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">Rank</p>
                <p className="text-xs font-bold text-blue-300 font-mono mt-2 truncate">
                  {profile?.rank || 'Unrated'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center min-w-[85px]">
                <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Max Rating</p>
                <p className="text-xl font-bold text-cyan-300 font-mono mt-0.5">
                  {profile?.maxRating && profile.maxRating > 0 ? profile.maxRating : '—'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center min-w-[85px]">
                <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Profile AC</p>
                <p className="text-2xl font-bold text-emerald-400 font-mono mt-0.5">
                  {profile?.solvedCount !== undefined ? profile.solvedCount : 0}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-500/30 text-center min-w-[95px]">
                <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Verified DB</p>
                <p className="text-2xl font-bold text-cyan-300 font-mono mt-0.5">
                  {stats.total || profile?.storedCount || 0}
                </p>
              </div>

              <button
                onClick={() => fetchData(pagination.page)}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-slate-700 transition-colors"
                title="Refresh Table View"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Informational Transparency Note */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-white">Full Sequential Pagination &amp; Live Tracking:</span> Tracking official Codeforces handle <span className="text-blue-300 font-semibold">@sumitknic567</span> via the official <code className="text-cyan-400 bg-slate-800/80 px-1 py-0.5 rounded">user.status</code> API. All submission pages are sequentially scanned and deduplicated by <code className="text-cyan-400 bg-slate-800/80 px-1 py-0.5 rounded">contestId + problem.index</code>. New submissions are automatically picked up during scheduled syncs. Curated reference solutions are clearly distinguished so that live account totals remain 100% authentic.
          </div>
        </div>

        {/* Filter and Search Bar */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by problem name, index, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          {/* Filters & Sorters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Provenance Filter */}
            <select
              value={provenance}
              onChange={(e) => setProvenance(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-400"
            >
              <option value="">All Sources</option>
              <option value="live_sync">Live Account Submissions</option>
              <option value="curated_example">Curated Reference Examples</option>
              <option value="manual_import">Manual Imports</option>
            </select>

            {/* Difficulty / Rating Filter */}
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-400"
            >
              <option value="">All Ratings</option>
              <option value="800">800 Rating</option>
              <option value="1000">1000 Rating</option>
              <option value="1200">1200 Rating</option>
              <option value="1400">1400+ Rating</option>
            </select>

            {/* Category / Topic Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-400"
            >
              <option value="">All Categories</option>
              <option value="implementation">Implementation</option>
              <option value="math">Math</option>
              <option value="brute force">Brute Force</option>
              <option value="greedy">Greedy</option>
              <option value="strings">Strings</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-400"
            >
              <option value="rating">Sort: Rating</option>
              <option value="problemId">Sort: Problem ID</option>
              <option value="title">Sort: Title</option>
              <option value="submissionDate">Sort: Solved Date</option>
            </select>
          </div>
        </section>

        {/* Problems Table / List */}
        <section className="glass-panel rounded-2xl border border-slate-800/90 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
              <p className="text-xs font-mono">Loading Codeforces problem tracker...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-rose-400 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8" />
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={() => fetchData(pagination.page)}
                className="mt-2 text-xs text-blue-400 underline font-mono"
              >
                Retry
              </button>
            </div>
          ) : problems.length === 0 ? (
            <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
              <FileCode className="w-10 h-10 text-slate-600 stroke-1" />
              <p className="text-sm font-medium text-slate-400">No problems match your query</p>
              <p className="text-xs max-w-sm text-slate-500 font-mono">
                {search || difficulty || category || provenance
                  ? 'Try clearing the search query or active filter settings.'
                  : 'No solved records found. Accepted submissions on Codeforces will appear here automatically on sync.'}
              </p>
              {(search || difficulty || category || provenance) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setDifficulty('');
                    setCategory('');
                    setProvenance('');
                  }}
                  className="mt-2 text-xs text-blue-400 hover:underline font-mono"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/60 font-mono text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4 w-20">Index</th>
                    <th className="py-3.5 px-4">Title &amp; Tags</th>
                    <th className="py-3.5 px-4 w-32">Rating / Diff</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Type / Provenance</th>
                    <th className="py-3.5 px-4 hidden lg:table-cell">Solved Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {problems.map((problem) => (
                    <tr
                      key={problem._id || problem.slug}
                      onClick={() => navigate(`/dsa/codeforces/problems/${problem.slug}`)}
                      className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                    >
                      {/* Problem Index */}
                      <td className="py-4 px-4 font-mono font-bold text-blue-400/90 group-hover:text-blue-300">
                        {problem.problemId || '–'}
                      </td>

                      {/* Title & Tags */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {problem.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                            {problem.category || 'Implementation'}
                          </span>
                          {problem.tags?.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-500 hidden sm:inline"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-4">{getRatingBadge(problem.rating || problem.difficulty)}</td>

                      {/* Provenance Badge */}
                      <td className="py-4 px-4 hidden md:table-cell">
                        {getProvenanceBadge(problem.provenance)}
                      </td>

                      {/* Solved Date */}
                      <td className="py-4 px-4 font-mono text-slate-400 hidden lg:table-cell">
                        {problem.submissionDate
                          ? new Date(problem.submissionDate).toLocaleDateString()
                          : 'Recorded'}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-4 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/dsa/codeforces/problems/${problem.slug}`}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-blue-300 hover:text-white hover:border-blue-500/40 transition-colors font-mono"
                          >
                            View Detail
                          </Link>
                          <a
                            href={problem.problemUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                            title="Open Problem on Codeforces"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/40">
              <span>
                Page {pagination.page} of {pagination.totalPages} ({pagination.totalProblems} items listed)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchData(pagination.page - 1)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchData(pagination.page + 1)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Import Modal */}
      <ImportModal
        platform="codeforces"
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => fetchData(1)}
      />
    </div>
  );
}
