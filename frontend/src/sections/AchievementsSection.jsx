import React from 'react';
import { Trophy, Cloud, Code, Sparkles } from 'lucide-react';

export default function AchievementsSection() {
  const achievements = [
    {
      title: 'Google Cloud Arcade Program',
      badge: 'Cloud Facilitator Badges',
      description: 'Completed hands-on labs and skill badges in Google Cloud computing fundamentals, cloud storage, and IAM resource management.',
      icon: Cloud,
    },
    {
      title: 'Hackathon Participation',
      badge: 'Team Collaborator',
      description: 'Participated in university-level and open hackathons, collaborating on rapid prototyping and end-to-end full-stack solution design.',
      icon: Trophy,
    },
  ];

  return (
    <section id="achievements" className="py-20 border-t border-slate-900 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Trophy className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Achievements &amp; Activities
          </h2>
        </div>
        <p className="text-slate-400 max-w-2xl mb-12">
          Milestones, hackathons, and certifications completed during academic tenure.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {achievements.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="p-6 rounded-xl glass-panel glow-card flex items-start gap-4">
                <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-medium text-cyan-300">
                    {item.badge}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
