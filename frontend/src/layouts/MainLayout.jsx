import React from 'react';
import Navbar from '../components/navigation/Navbar.jsx';
import Footer from '../components/navigation/Footer.jsx';
import BackToTop from '../components/common/BackToTop.jsx';
import { PortfolioAssistant } from '../features/portfolio-assistant/index.js';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
      <BackToTop />
      <PortfolioAssistant />
    </div>
  );
}
