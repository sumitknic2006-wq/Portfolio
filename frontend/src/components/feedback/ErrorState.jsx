import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Unable to Load Content',
  message = 'A temporary network or server error occurred while retrieving this section.',
  onRetry = null,
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`glass-panel p-6 sm:p-8 rounded-2xl border border-rose-900/60 bg-rose-950/20 text-center flex flex-col items-center justify-center my-6 ${className}`}
    >
      <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3.5">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h4 className="text-base font-bold text-white mb-1.5">{title}</h4>

      <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-4 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 hover:border-rose-400 transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
