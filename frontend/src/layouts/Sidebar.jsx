import React, { useState } from 'react';
import { Mail, Phone, MapPin, GraduationCap, Copy, Check, Download, ExternalLink } from 'lucide-react';
import { useProfile } from '../context/ProfileContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import SocialLinks from '../components/common/SocialLinks.jsx';

export default function Sidebar() {
  const { t } = useLanguage();
  const { profile: profileData } = useProfile();
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 self-stretch">
      <div className="glass-panel p-5 sm:p-6 rounded-2xl sticky top-20 space-y-4 sm:space-y-5 glow-card max-h-[calc(100vh-5.5rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Profile Avatar & Status */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-cyan-500/40 p-1 bg-slate-900 shadow-lg shadow-cyan-500/10">
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = profileData.avatarFallback;
                }}
              />
            </div>
            <span
              className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950"
              title="Active & Available"
            />
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {profileData.name}
          </h2>
          
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 border border-cyan-500/25 text-cyan-300">
            {profileData.headline.split('|')[0].trim()}
          </div>
          
          <p className="text-xs text-slate-400 mt-2 font-mono">
            {profileData.university}
          </p>
        </div>

        <div className="border-t border-slate-800/80 pt-5 space-y-3.5 text-xs">
          {/* Email item with copy */}
          <div className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Email</p>
                <a
                  href={`mailto:${profileData.email}`}
                  className="text-slate-200 hover:text-cyan-300 transition-colors truncate block"
                >
                  {profileData.email}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(profileData.email, 'email')}
              aria-label="Copy email"
              className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors shrink-0"
              title="Copy Email"
            >
              {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Phone item with copy */}
          <div className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Phone</p>
                <a
                  href={`tel:${profileData.phone.replace(/\s+/g, '')}`}
                  className="text-slate-200 hover:text-cyan-300 transition-colors truncate block"
                >
                  {profileData.phone}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(profileData.phone, 'phone')}
              aria-label="Copy phone number"
              className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors shrink-0"
              title="Copy Phone"
            >
              {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Location</p>
              <p className="text-slate-200">{profileData.location}</p>
            </div>
          </div>

          {/* Education */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Education</p>
              <p className="text-slate-200">{profileData.degree}</p>
              <p className="text-[11px] text-cyan-400/90 font-mono">{profileData.duration}</p>
            </div>
          </div>
        </div>

        {/* Social Link Hub */}
        <div className="border-t border-slate-800/80 pt-5">
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-2.5 text-center">
            Connect On Web
          </p>
          <SocialLinks className="justify-center" />
        </div>

        {/* Resume Action */}
        <div className="pt-2">
          <a
            href={profileData.resumeUrl}
            download="Sumit_Kumar_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> {t('hero.downloadResume')}
          </a>
        </div>
      </div>
    </aside>
  );
}
