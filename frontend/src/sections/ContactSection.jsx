import React, { useState } from 'react';
import { Mail, Phone, MapPin, Download, Check, Copy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { profileData } from '../data/profileData.js';
import SectionHeading from '../components/common/SectionHeading.jsx';
import ContactForm from '../components/forms/ContactForm.jsx';
import SocialLinks from '../components/common/SocialLinks.jsx';

export default function ContactSection() {
  const { t } = useLanguage();
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section id="contact" className="py-20 border-t border-slate-900 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Mail}
          title={t('contact.heading')}
          subtitle={t('contact.subtitle')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Details Card */}
          <div className="space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl glow-card border border-slate-800/80">
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                {t('contact.letsConnect')}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {t('contact.infoText')}
              </p>

              <div className="space-y-3.5 mb-8">
                {/* Email with copy */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Direct Email</p>
                      <a
                        href={`mailto:${profileData.email}`}
                        className="text-xs sm:text-sm text-white hover:text-cyan-300 transition-colors font-medium truncate block"
                      >
                        {profileData.email}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(profileData.email, 'email')}
                    className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                    title="Copy Email"
                  >
                    {copiedKey === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone with copy */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Phone</p>
                      <a
                        href={`tel:${profileData.phone.replace(/\s+/g, '')}`}
                        className="text-xs sm:text-sm text-white hover:text-cyan-300 transition-colors font-medium truncate block"
                      >
                        {profileData.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(profileData.phone, 'phone')}
                    className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                    title="Copy Phone"
                  >
                    {copiedKey === 'phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Location</p>
                    <p className="text-xs sm:text-sm text-white font-medium">{profileData.location}</p>
                  </div>
                </div>
              </div>

              {/* Social Link row */}
              <div className="pt-4 border-t border-slate-800/80 mb-6">
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Professional Profiles:
                </p>
                <SocialLinks showLabels />
              </div>

              {/* Download Resume Link */}
              <div className="pt-4 border-t border-slate-800/80">
                <a
                  href={profileData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('contact.resumeButton')}</span>
                </a>
                <p className="text-[11px] text-slate-500 text-center mt-2 font-mono">
                  {t('contact.resumeNote')}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
