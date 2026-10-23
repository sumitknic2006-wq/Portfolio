import React from 'react';
import { GraduationCap, Calendar, MapPin, BookOpen, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { profileData } from '../data/profileData.js';
import SectionHeading from '../components/common/SectionHeading.jsx';

export default function EducationSection() {
  const { t } = useLanguage();

  const courseworkList = [
    'Data Structures & Algorithms in C++',
    'Object-Oriented Programming (OOP)',
    'Database Management Systems (DBMS)',
    'Operating Systems & Fundamentals',
    'Web Application Architectures (MERN)',
  ];

  return (
    <section id="education" className="py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={GraduationCap}
          title={t('education.heading')}
          subtitle={t('education.subtitle')}
        />

        <div className="max-w-4xl">
          <div className="relative pl-6 sm:pl-8 border-l-2 border-cyan-500/40 space-y-8">
            {/* Degree Node */}
            <div className="relative">
              {/* Day09 style node dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-cyan-400 border-4 border-slate-950 shadow-md shadow-cyan-400/50" />

              <div className="glass-panel p-6 sm:p-8 rounded-2xl glow-card border border-slate-800/80">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {t('education.degreeTitle')}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {profileData.duration} ({profileData.currentYear})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-300 mb-4 font-mono">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{t('education.universityName')}</span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Undergraduate engineering curriculum emphasizing core computer science fundamentals, algorithm efficiency, and practical full-stack software development. Active in developer workshops and technical hackathon sprints.
                </p>

                <div className="pt-4 border-t border-slate-800/80">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {t('education.courseworkTitle')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {courseworkList.map((course) => (
                      <div
                        key={course}
                        className="flex items-center gap-2 text-xs text-slate-300 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
