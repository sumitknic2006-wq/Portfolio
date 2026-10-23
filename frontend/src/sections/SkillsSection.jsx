import React from 'react';
import { Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { skillsData } from '../data/skillsData.js';
import SectionHeading from '../components/common/SectionHeading.jsx';
import SkillCard from '../components/cards/SkillCard.jsx';

export default function SkillsSection() {
  const { t } = useLanguage();

  return (
    <section id="skills" className="py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Wrench}
          title={t('skills.heading')}
          subtitle={t('skills.subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {skillsData.map((category) => (
            <SkillCard key={category.categoryKey} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
