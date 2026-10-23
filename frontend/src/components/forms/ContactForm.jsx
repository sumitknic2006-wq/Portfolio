import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function ContactForm() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (minimum 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a descriptive message (minimum 10 characters).';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatusMessage(null);
      return;
    }

    setErrors({});
    setSubmitting(true);

    // Simulate validation flow while maintaining strict honesty (no fake network success)
    setTimeout(() => {
      setSubmitting(false);
      setStatusMessage({
        type: 'info',
        text: 'Client validation passed! Note: Live email transmission will be enabled once the backend REST API is wired in Phase 3. Your inquiry structure is fully verified.',
      });
    }, 600);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setStatusMessage(null);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl glow-card border border-slate-800/80">
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
        {t('contact.heading')}
      </h3>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        {t('contact.infoText')}
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Name input */}
        <div>
          <label htmlFor="contact-name" className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
            {t('contact.nameLabel')} <span className="text-cyan-400">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('contact.namePlaceholder')}
            className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 transition-colors ${
              errors.name
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                : 'border-slate-800 focus:border-cyan-400 focus:ring-cyan-400'
            }`}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Email input */}
        <div>
          <label htmlFor="contact-email" className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
            {t('contact.emailLabel')} <span className="text-cyan-400">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={t('contact.emailPlaceholder')}
            className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 transition-colors ${
              errors.email
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                : 'border-slate-800 focus:border-cyan-400 focus:ring-cyan-400'
            }`}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Message input */}
        <div>
          <label htmlFor="contact-message" className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
            {t('contact.messageLabel')} <span className="text-cyan-400">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows="4"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={t('contact.messagePlaceholder')}
            className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 transition-colors resize-none ${
              errors.message
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                : 'border-slate-800 focus:border-cyan-400 focus:ring-cyan-400'
            }`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.message}</span>
            </p>
          )}
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 px-5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-70 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-cyan-500/20 inline-flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t('contact.sendingButton')}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t('contact.sendButton')}</span>
              </>
            )}
          </button>

          {(formData.name || formData.email || formData.message) && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs flex items-start gap-2.5 mt-3">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{statusMessage.text}</p>
          </div>
        )}
      </form>
    </div>
  );
}
