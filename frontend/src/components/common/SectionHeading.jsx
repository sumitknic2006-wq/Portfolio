import React from 'react';

/**
 * Reusable Section Heading matching Day09 and modern cyan-blue design language
 */
export default function SectionHeading({ icon: Icon, title, subtitle, align = 'left' }) {
  const isCenter = align === 'center';

  return (
    <div className={`mb-12 ${isCenter ? 'text-center flex flex-col items-center' : ''}`}>
      {Icon && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-3">
          <Icon className="w-3.5 h-3.5" />
          <span>{title}</span>
        </div>
      )}
      
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900">
        {title}
      </h2>

      {/* Signature Day09 Accent Bar */}
      <div className={`heading-line ${isCenter ? 'mx-auto' : ''}`} />

      {subtitle && (
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
