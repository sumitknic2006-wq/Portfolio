import React from 'react';

export default function ProjectDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 animate-pulse">
      {/* Back button placeholder */}
      <div className="w-36 h-4 rounded bg-slate-800 mb-8" />

      {/* Hero card skeleton */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800/80 bg-slate-900/40 mb-10">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-24 h-6 rounded bg-slate-800" />
          <div className="w-28 h-6 rounded bg-slate-800" />
        </div>
        <div className="w-2/3 h-10 rounded-lg bg-slate-800 mb-3" />
        <div className="w-1/2 h-5 rounded bg-slate-800/80 mb-6" />
        <div className="space-y-2.5 max-w-2xl mb-8">
          <div className="w-full h-4 rounded bg-slate-800/60" />
          <div className="w-11/12 h-4 rounded bg-slate-800/60" />
          <div className="w-4/5 h-4 rounded bg-slate-800/60" />
        </div>
        <div className="flex gap-4 pt-6 border-t border-slate-800/80">
          <div className="w-36 h-10 rounded-xl bg-slate-800" />
          <div className="w-36 h-10 rounded-xl bg-slate-800" />
        </div>
      </div>

      {/* Architecture preview skeleton */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/40 mb-10">
        <div className="w-48 h-5 rounded bg-slate-800 mb-4" />
        <div className="w-full h-64 rounded-2xl bg-slate-800/70 mb-4" />
        <div className="w-3/4 h-4 rounded bg-slate-800/60" />
      </div>

      {/* Two-column grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 h-48" />
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 h-48" />
      </div>
    </div>
  );
}
