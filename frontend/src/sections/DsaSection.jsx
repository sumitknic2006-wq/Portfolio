import React from 'react';
import { Terminal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import SectionHeading from '../components/common/SectionHeading.jsx';
import CodingProfileHub from '../features/coding-profiles/CodingProfileHub.jsx';

export default function DsaSection() {
  const { t } = useLanguage();

  return (
    <section id="dsa" className="py-20 border-t border-slate-900 bg-slate-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          icon={Terminal}
          title={t('dsa.heading')}
          subtitle={t('dsa.subtitle')}
        />

        {/* Verified Competitive Programming Hub (GitHub, LeetCode & Codeforces) */}
        <CodingProfileHub />
      </div>
    </section>
  );
}
