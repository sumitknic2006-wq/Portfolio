import React from 'react';
import { Cpu, Layout, Server, Database, Wrench, BookOpen } from 'lucide-react';

const iconMap = {
  programming: Cpu,
  frontend: Layout,
  backend: Server,
  database: Database,
  tools: Wrench,
  coreConcepts: BookOpen,
};

export default function SkillCard({ category }) {
  const Icon = iconMap[category.categoryKey] || Cpu;

  return (
    <div className="glass-panel p-6 rounded-2xl glow-card flex flex-col justify-between border border-slate-800/80">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {category.category}
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              {category.skills.length} skills listed
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          {category.description}
        </p>

        <ul className="space-y-3">
          {category.skills.map((skill) => (
            <li
              key={skill.name}
              className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-start justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    {skill.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 pl-3.5">
                  {skill.focus}
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 shrink-0">
                {skill.level}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
