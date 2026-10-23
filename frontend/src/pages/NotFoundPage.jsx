import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-400 mb-6">
          <Compass className="w-12 h-12 animate-spin-slow" />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2 font-mono">404</h1>
        <p className="text-xl font-medium text-slate-300 mb-4">Page Not Found</p>
        <p className="text-sm text-slate-400 max-w-md mb-8">
          The requested route does not exist or has been relocated within the portfolio navigation hierarchy.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    </MainLayout>
  );
}
