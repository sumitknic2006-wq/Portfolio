import React, { useState } from 'react';
import { Mail, Send, FileDown, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Phase 1 Foundation note: backend API connection planned for subsequent phases
    setStatus('Message queued for delivery. Full backend REST API integration will be completed in the integration phase.');
  };

  return (
    <section id="contact" className="py-20 border-t border-slate-900 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Get In Touch
          </h2>
        </div>
        <p className="text-slate-400 max-w-2xl mb-12">
          Interested in discussing projects, engineering opportunities, or technical collaboration? Send a message or download my resume.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details & Resume */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl glass-panel glow-card">
              <h3 className="text-lg font-bold text-white mb-2">Let's Connect</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                I am actively seeking software engineering internships, open-source collaborations, and tech opportunities. Feel free to reach out directly.
              </p>

              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">Location:</span> Indore, Madhya Pradesh, India
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">University:</span> SAGE University, Indore
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <a
                  href="/files/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-sm"
                >
                  <FileDown className="w-4 h-4" /> Download Resume Document
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-6 rounded-xl glass-panel">
            <h3 className="text-lg font-bold text-white mb-4">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Sumit's Collaborator"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Hello Sumit, let's discuss..."
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm transition-all shadow-md shadow-cyan-500/20 inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>

              {status && (
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{status}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
