import React from 'react';
import { Layers } from 'lucide-react';

export default function EmptyState({
  icon = Layers,
  title = 'No Records Available',
  message = 'There are currently no published entries to display in this category.',
  className = '',
}) {
  const IconComponent = icon;

  return (
    <div
      className={`glass-panel p-8 sm:p-12 rounded-2xl border border-slate-800/80 text-center flex flex-col items-center justify-center my-6 ${className}`}
    >
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 mb-3.5">
        <IconComponent className="w-6 h-6 text-cyan-400/80" />
      </div>

      <h4 className="text-base font-bold text-white mb-1.5">{title}</h4>

      <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
        {message}
      </p>
    </div>
  );
}
