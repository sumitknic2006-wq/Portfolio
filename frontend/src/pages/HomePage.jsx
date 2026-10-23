import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import HeroSection from '../sections/HeroSection.jsx';
import AboutSection from '../sections/AboutSection.jsx';
import SkillsSection from '../sections/SkillsSection.jsx';
import ProjectsSection from '../sections/ProjectsSection.jsx';
import DsaSection from '../sections/DsaSection.jsx';
import AchievementsSection from '../sections/AchievementsSection.jsx';
import EducationSection from '../sections/EducationSection.jsx';
import ContactSection from '../sections/ContactSection.jsx';

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <DsaSection />
      <AchievementsSection />
      <EducationSection />
      <ContactSection />
    </MainLayout>
  );
}
