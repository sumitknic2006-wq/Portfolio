import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import HeroSection from '../sections/HeroSection.jsx';
import AboutSection from '../sections/AboutSection.jsx';
import SkillsSection from '../sections/SkillsSection.jsx';
import ProjectsSection from '../sections/ProjectsSection.jsx';
import AchievementsSection from '../sections/AchievementsSection.jsx';
import DsaSection from '../sections/DsaSection.jsx';
import EducationSection from '../sections/EducationSection.jsx';
import ContactSection from '../sections/ContactSection.jsx';
import Sidebar from '../layouts/Sidebar.jsx';

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section Banner */}
      <HeroSection />

      {/* Main Central Presentation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-10 relative">
          {/* Day09 Profile Sidebar (Sticky on desktop) */}
          <Sidebar />

          {/* Core Content Feed */}
          <div className="flex-1 w-full min-w-0 space-y-12">
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <AchievementsSection />
            <DsaSection />
            <EducationSection />
            <ContactSection />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
