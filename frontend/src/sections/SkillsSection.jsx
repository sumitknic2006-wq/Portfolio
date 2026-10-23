import React from 'react';
import { Cpu, Layout, Server, Database, Wrench } from 'lucide-react';

export default function SkillsSection() {
  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: Layout,
      skills: ['React', 'JavaScript (ES6+)', 'HTML5 & CSS3', 'Tailwind CSS', 'Vite', 'Responsive Design'],
    },
    {
      title: 'Backend & APIs',
      icon: Server,
      skills: ['Node.js', 'Express.js', 'RESTful API Architecture', 'JWT & Middleware', 'API Security Basics'],
    },
    {
      title: 'Databases & Storage',
      icon: Database,
      skills: ['MongoDB', 'Mongoose ODM', 'MongoDB Atlas', 'Schema Design'],
    },
    {
      title: 'Programming & Core CS',
      icon: Cpu,
      skills: ['C++', 'Data Structures', 'Algorithms', 'OOP Concepts', 'Git & GitHub'],
    },
  ];

  return (
    <section id="skills" className="py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Wrench className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Technical Skills
          </h2>
        </div>
        <p className="text-slate-400 max-w-2xl mb-12">
          Categorized technical skills, tools, and foundations practiced in projects and coursework.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.title} className="p-6 rounded-xl glass-panel glow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-md bg-slate-900 border border-slate-800 text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{cat.title}</h3>
                </div>
                <ul className="space-y-2">
                  {cat.skills.map((skill) => (
                    <li key={skill} className="flex items-center text-xs text-slate-300 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
