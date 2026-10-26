import React, { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  Calendar,
  MapPin,
  BookOpen,
  CheckCircle2,
  Cloud,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { educationService } from '../services/education.service.js';
import SectionHeading from '../components/common/SectionHeading.jsx';
import SectionSkeleton from '../components/feedback/SectionSkeleton.jsx';
import ErrorState from '../components/feedback/ErrorState.jsx';

export default function EducationSection() {
  const { t } = useLanguage();
  const [eduData, setEduData] = useState({ education: [], experience: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEducation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await educationService.getEducation();
      setEduData({
        education: Array.isArray(data?.education) ? data.education : [],
        experience: Array.isArray(data?.experience) ? data.experience : [],
      });
    } catch (err) {
      console.warn('[EducationSection] API query error:', err.message);
      setError(err.message || 'Unable to load education and experience records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const defaultCoursework = [
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

        {loading && (
          <SectionSkeleton
            cards={2}
            columns="grid-cols-1"
            cardHeight="h-72"
          />
        )}

        {error && !loading && (
          <ErrorState
            title="Education & Experience Unavailable"
            message={error}
            onRetry={fetchEducation}
          />
        )}

        {!loading && !error && (
          <div className="max-w-4xl">
            <div className="relative pl-6 sm:pl-8 border-l-2 border-cyan-500/40 space-y-10">
              {/* 1. Experience Nodes */}
              {eduData.experience.map((exp) => (
                <div key={exp.id || exp.role} className="relative">
                  {/* Pulsing node dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-cyan-400 border-4 border-slate-950 shadow-md shadow-cyan-400/50" />

                  <div className="glass-panel p-6 sm:p-8 rounded-2xl glow-card border border-slate-800/80">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          <Cloud className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white tracking-tight">
                            {exp.role}
                          </h3>
                          <p className="text-xs font-mono text-cyan-400 mt-0.5">
                            {exp.organization}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          {exp.duration}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-5 pl-0.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{exp.location}</span>
                    </div>

                    {/* Highlights */}
                    {Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                      <div className="space-y-3 mb-6">
                        {exp.highlights.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">{point}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skill Pills */}
                    {Array.isArray(exp.skills) && exp.skills.length > 0 && (
                      <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
                        {exp.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900 border border-slate-800 text-cyan-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* 2. Education Nodes */}
              {eduData.education.map((edu) => {
                const coursework =
                  Array.isArray(edu.coreCoursework) && edu.coreCoursework.length > 0
                    ? edu.coreCoursework
                    : defaultCoursework;

                return (
                  <div key={edu.id || edu.degree} className="relative">
                    {/* Node dot */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-950 shadow-md shadow-blue-500/50" />

                    <div className="glass-panel p-6 sm:p-8 rounded-2xl glow-card border border-slate-800/80">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">
                              {edu.degree || t('education.degreeTitle')}
                            </h3>
                            <p className="text-xs font-mono text-slate-400 mt-0.5">
                              {edu.university || t('education.universityName')}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/10 border border-blue-500/30 text-blue-300">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          {edu.duration} {edu.currentYear ? `(${edu.currentYear})` : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-5 font-mono pl-0.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{edu.location}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                        Undergraduate engineering curriculum emphasizing core computer science fundamentals, algorithm efficiency in C++, and practical full-stack software development. Active in developer workshops and technical hackathon sprints.
                      </p>

                      <div className="pt-4 border-t border-slate-800/80">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          {t('education.courseworkTitle')}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {coursework.map((course) => (
                            <div
                              key={course}
                              className="flex items-center gap-2 text-xs text-slate-300 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span>{course}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
