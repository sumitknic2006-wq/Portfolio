import React from 'react';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';

export default function EducationSection() {
  return (
    <section id="education" className="py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Education
          </h2>
        </div>
        <p className="text-slate-400 max-w-2xl mb-12">
          Formal academic training and degree coursework.
        </p>

        <div className="max-w-3xl">
          <div className="relative pl-6 border-l-2 border-cyan-500/40 space-y-6">
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-cyan-400 border-4 border-slate-950" />
              
              <div className="p-6 rounded-xl glass-panel glow-card">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white">
                    Bachelor of Technology (B.Tech) &bull; Computer Science &amp; Engineering
                  </h3>
                  <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded border border-cyan-800/50 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> 2nd Year (Ongoing)
                  </span>
                </div>

                <div className="text-sm font-medium text-slate-300 flex items-center gap-1.5 mb-4">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  SAGE University, Indore, Madhya Pradesh
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Undergraduate degree coursework in core Computer Science fundamentals: Object-Oriented Programming, Data Structures &amp; Algorithms, Database Management Systems (DBMS), Operating Systems, and Web Application Architectures.
                </p>

                <div className="flex flex-wrap gap-2">
                  {['Data Structures & Algorithms', 'Database Systems', 'Object Oriented Programming', 'Operating Systems', 'Web Tech'].map((course) => (
                    <span
                      key={course}
                      className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
