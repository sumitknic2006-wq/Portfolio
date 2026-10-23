import React from 'react';
import { Github, Linkedin, Twitter, Code2, ExternalLink } from 'lucide-react';
import { profileData } from '../../data/profileData.js';

export default function SocialLinks({ className = '', showLabels = false }) {
  const links = [
    {
      name: 'GitHub',
      href: profileData.socials.github,
      icon: Github,
      color: 'hover:text-white hover:border-slate-400',
    },
    {
      name: 'LinkedIn',
      href: profileData.socials.linkedin,
      icon: Linkedin,
      color: 'hover:text-sky-400 hover:border-sky-400',
    },
    {
      name: 'X (Twitter)',
      href: profileData.socials.twitter,
      icon: Twitter,
      color: 'hover:text-cyan-400 hover:border-cyan-400',
    },
    {
      name: 'LeetCode',
      href: profileData.socials.leetcode,
      icon: Code2,
      color: 'hover:text-amber-400 hover:border-amber-400',
    },
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.name} Profile`}
            className={`p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 ${item.color} transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400`}
            title={`${item.name} - Sumit Kumar`}
          >
            <Icon className="w-4 h-4" />
            {showLabels && <span className="text-xs font-medium">{item.name}</span>}
          </a>
        );
      })}
    </div>
  );
}
