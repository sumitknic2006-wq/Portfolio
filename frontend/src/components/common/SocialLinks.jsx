import React from 'react';
import { Github, Linkedin, Twitter, Code2 } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext.jsx';

export default function SocialLinks({ className = '', showLabels = false }) {
  const { profile: profileData } = useProfile();
  const socials = profileData?.socials || {};

  const links = [
    {
      name: 'GitHub',
      href: socials.github || 'https://github.com/sumitknic2006-wq',
      icon: Github,
      color: 'hover:text-white hover:border-slate-400 hover:bg-slate-800/80',
    },
    {
      name: 'LinkedIn',
      href: socials.linkedin || 'https://www.linkedin.com/in/sumit-kumar-45a154387/',
      icon: Linkedin,
      color: 'hover:text-sky-400 hover:border-sky-400 hover:bg-slate-800/80',
    },
    {
      name: 'X (Twitter)',
      href: socials.twitter || 'https://x.com/Sumitkumar95862',
      icon: Twitter,
      color: 'hover:text-cyan-400 hover:border-cyan-400 hover:bg-slate-800/80',
    },
    {
      name: 'LeetCode',
      href: socials.leetcode || 'https://leetcode.com/u/25001122/',
      icon: Code2,
      color: 'hover:text-amber-400 hover:border-amber-400 hover:bg-slate-800/80',
    },
  ];

  if (showLabels) {
    return (
      <div className={`grid grid-cols-2 gap-2.5 w-full ${className}`}>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.name} Profile`}
              className={`social-link-btn p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 ${item.color} transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400`}
              title={`${item.name} - Sumit Kumar`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-semibold truncate">{item.name}</span>
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {links.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.name} Profile`}
            className={`social-link-btn p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 ${item.color} transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400`}
            title={`${item.name} - Sumit Kumar`}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}
