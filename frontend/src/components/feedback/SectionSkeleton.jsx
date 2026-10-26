import React from 'react';

export default function SectionSkeleton({
  cards = 4,
  columns = 'grid-cols-1 md:grid-cols-2',
  cardHeight = 'h-64',
}) {
  return (
    <div className={`grid ${columns} gap-6 sm:gap-8 my-6`}>
      {Array.from({ length: cards }).map((_, idx) => (
        <div
          key={idx}
          className={`glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800/80 bg-slate-900/40 animate-pulse flex flex-col justify-between ${cardHeight}`}
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="w-24 h-5 rounded-md bg-slate-800/90" />
              <div className="w-16 h-5 rounded-md bg-slate-800/80" />
            </div>
            <div className="w-3/4 h-7 rounded-lg bg-slate-800 mb-2.5" />
            <div className="w-1/2 h-4 rounded bg-slate-800/70 mb-4" />
            <div className="space-y-2">
              <div className="w-full h-3 rounded bg-slate-800/60" />
              <div className="w-5/6 h-3 rounded bg-slate-800/60" />
              <div className="w-4/6 h-3 rounded bg-slate-800/60" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <div className="w-14 h-5 rounded bg-slate-800/80" />
              <div className="w-14 h-5 rounded bg-slate-800/80" />
            </div>
            <div className="w-20 h-7 rounded-lg bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
