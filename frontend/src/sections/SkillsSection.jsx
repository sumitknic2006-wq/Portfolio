import React, { useState, useEffect, useCallback } from 'react';
import { Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { skillsService } from '../services/skills.service.js';
import SectionHeading from '../components/common/SectionHeading.jsx';
import SkillCard from '../components/cards/SkillCard.jsx';
import SectionSkeleton from '../components/feedback/SectionSkeleton.jsx';
import ErrorState from '../components/feedback/ErrorState.jsx';
import EmptyState from '../components/feedback/EmptyState.jsx';

export default function SkillsSection() {
  const { t } = useLanguage();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await skillsService.getSkills();
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('[SkillsSection] API query error:', err.message);
      setError(err.message || 'Unable to load technical skills.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return (
    <section id="skills" className="py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Wrench}
          title={t('skills.heading')}
          subtitle={t('skills.subtitle')}
        />

        {loading && (
          <SectionSkeleton
            cards={6}
            columns="grid-cols-1 md:grid-cols-2"
            cardHeight="h-72"
          />
        )}

        {error && !loading && (
          <ErrorState
            title="Technical Skills Unavailable"
            message={error}
            onRetry={fetchSkills}
          />
        )}

        {!loading && !error && skills.length === 0 && (
          <EmptyState
            icon={Wrench}
            title="No Skills Found"
            message="Technical skills data is currently being updated in the portfolio database."
          />
        )}

        {!loading && !error && skills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((category) => (
              <SkillCard key={category.categoryKey} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
