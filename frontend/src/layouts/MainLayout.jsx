import React from 'react';
import Navbar from '../components/navigation/Navbar.jsx';
import Footer from '../components/navigation/Footer.jsx';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
