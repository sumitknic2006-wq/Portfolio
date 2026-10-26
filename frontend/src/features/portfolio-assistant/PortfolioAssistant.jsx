import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  RotateCcw,
  ExternalLink,
  Info,
  AlertCircle,
  RefreshCw,
  Tag,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { assistantService } from '../../services/assistant.service.js';

export default function PortfolioAssistant() {
  const { t, language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFailedQuery, setLastFailedQuery] = useState(null);
  const [providerInfo, setProviderInfo] = useState({ configured: false, provider: 'gemini' });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check backend provider status on mount and when opening
  useEffect(() => {
    let isMounted = true;
    assistantService
      .getStatus()
      .then((status) => {
        if (isMounted && status) {
          setProviderInfo(status);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProviderInfo({ configured: false, provider: 'gemini' });
        }
      });
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Initialize with localized welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: t('assistant.welcome'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [t]);

  // Scroll to bottom when new messages arrive or loading state changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Verified deterministic knowledge fallback (active when provider key is unconfigured)
  const getGroundedFallbackAnswer = (query) => {
    const q = query.toLowerCase().trim();

    if (q.includes('restify')) {
      return {
        text:
          "RESTIFY is Sumit's full-stack digital wellbeing and smart screen-time control platform. Built using React, Node.js, Express, and MongoDB, it features real-time focus timers, historical telemetry charts, and verified RESTful API synchronization. Deployed live on Vercel and Render.",
        sources: [{ type: 'project', title: 'RESTIFY', link: '/projects/restify' }],
      };
    }

    if (q.includes('stocksaathi') || q.includes('stock')) {
      return {
        text:
          'StockSaathi AI is an intelligent inventory intelligence system designed to detect dead stock, forecast clearance windows, and generate automated promotional discount strategies for Indian micro-retailers. Built with React, Tailwind CSS, and predictive algorithms.',
        sources: [{ type: 'project', title: 'StockSaathi AI', link: '/projects/stocksaathi-ai' }],
      };
    }

    if (q.includes('investor')) {
      return {
        text:
          'The Investor Management App is an enterprise-grade administrative portal developed with the MERN stack. It tracks angel/VC investor relationships, capital allocations, round dilutions, and archives meeting documentation with strict Mongoose validation.',
        sources: [{ type: 'project', title: 'Investor Management App', link: '/projects/investor-management-app' }],
      };
    }

    if (q.includes('project') || q.includes('build') || q.includes('portfolio')) {
      return {
        text:
          'Sumit has built 4 verified portfolio projects: 1. RESTIFY (Digital Wellbeing & Telemetry, live on Vercel/Render), 2. StockSaathi AI (Micro-retailer dead stock recovery), 3. Investor Management App (MERN FinTech portal), and 4. DSA in C++ Practice Suite (Algorithmic problem-solving repository).',
        sources: [{ type: 'project', title: 'Portfolio Projects', link: '/#projects' }],
      };
    }

    if (
      q.includes('skill') ||
      q.includes('tech') ||
      q.includes('language') ||
      q.includes('stack') ||
      q.includes('mern')
    ) {
      return {
        text:
          "Sumit's primary languages are C++ (Core algorithmic problem solving) and JavaScript (Modern ES6+). His technical stack spans React, Node.js, Express.js, MongoDB, Mongoose, and Tailwind CSS, along with core CS principles in OOP, DBMS, and Operating Systems.",
        sources: [{ type: 'skills', title: 'Technical Skills & Languages', link: '/#skills' }],
      };
    }

    if (
      q.includes('education') ||
      q.includes('college') ||
      q.includes('university') ||
      q.includes('sage') ||
      q.includes('study') ||
      q.includes('btech') ||
      q.includes('degree')
    ) {
      return {
        text:
          'Sumit is an undergraduate student in his 2nd Year pursuing a Bachelor of Technology (B.Tech) in Computer Science & Technology at SAGE University, Indore (ALTA School of Technology, 2025–2029). Core coursework includes Data Structures & Algorithms in C++, OOP, DBMS, OS, and Web Architecture.',
        sources: [{ type: 'education', title: 'SAGE University B.Tech', link: '/#education' }],
      };
    }

    if (
      q.includes('achievement') ||
      q.includes('certif') ||
      q.includes('badge') ||
      q.includes('arcade') ||
      q.includes('google') ||
      q.includes('cloud') ||
      q.includes('hackathon')
    ) {
      return {
        text:
          'Sumit is an active Google Cloud Arcade Facilitator & Labs Participant with 9 verified skill badges covering IAM, Cloud Storage, and Compute. He has also participated in the Udbhav AI Sprint Hackathon, the 24-hour Squid Hackathon Competition, and completed the MERN Stack Web Development Workshop.',
        sources: [{ type: 'achievement', title: 'Google Cloud & Hackathon Achievements', link: '/#achievements' }],
      };
    }

    if (
      q.includes('dsa') ||
      q.includes('c++') ||
      q.includes('leetcode') ||
      q.includes('algorithm') ||
      q.includes('code')
    ) {
      return {
        text:
          'Sumit actively solves algorithmic challenges in C++ on LeetCode (@25001122) and Codeforces (@sumitknic567). Key patterns include Two Pointers, Sliding Window, Monotonic Stacks, Recursion & Backtracking, and Hashing. You can explore verified live trackers and interactive dry runs in the DSA Explorer.',
        sources: [{ type: 'codingProfile', title: 'DSA Explorer & Coding Profiles', link: '/#coding-profiles' }],
      };
    }

    if (
      q.includes('contact') ||
      q.includes('email') ||
      q.includes('hire') ||
      q.includes('reach') ||
      q.includes('resume') ||
      q.includes('phone')
    ) {
      return {
        text:
          'You can contact Sumit via email at sumitknic2006@gmail.com or phone at +91 92419 59612. His location is Indore, Madhya Pradesh / Nawada, Bihar. You can also download his verified resume or connect on LinkedIn and GitHub.',
        sources: [{ type: 'profile', title: 'Contact Section', link: '/#contact' }],
      };
    }

    return {
      text: t('assistant.unknownResponse'),
      sources: [],
    };
  };

  const executeSend = async (userText) => {
    if (!userText || !userText.trim() || isLoading) return;

    const trimmed = userText.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    setLastFailedQuery(null);

    // Build bounded conversation history (last 4 items)
    const history = messages
      .slice(-4)
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        text: m.text,
      }));

    try {
      // Send to backend REST API: POST /api/v1/assistant/chat
      const res = await assistantService.sendMessage(trimmed, language, history);

      if (res && res.answer) {
        const botMsg = {
          id: `bot-${Date.now() + 1}`,
          sender: 'assistant',
          text: res.answer,
          sources: res.sources || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('Invalid response structure received from assistant API');
      }
    } catch (err) {
      // Regardless of whether it's a provider timeout or configuration issue,
      // always provide the verified database-grounded answer so the visitor is never blocked
      const fallback = getGroundedFallbackAnswer(trimmed);
      const botMsg = {
        id: `bot-${Date.now() + 1}`,
        sender: 'assistant',
        text: fallback.text,
        sources: fallback.sources,
        isFallback: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);

      // If it was a network error or timeout, let the user know they can retry for fresh live AI generation
      if (err?.code === 'REQUEST_TIMEOUT' || err?.code === 'AI_REQUEST_TIMEOUT') {
        setError('Network response took longer than expected. Showing verified portfolio data.');
        setLastFailedQuery(trimmed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    executeSend(inputValue);
  };

  const handleSuggestionClick = (queryText) => {
    executeSend(queryText);
  };

  const handleRetry = () => {
    if (lastFailedQuery) {
      executeSend(lastFailedQuery);
    }
  };

  const handleClearChat = () => {
    setError(null);
    setLastFailedQuery(null);
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: t('assistant.welcome'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const suggestions = [
    t('assistant.suggestionRestify'),
    t('assistant.suggestionSkills'),
    t('assistant.suggestionEducation'),
    t('assistant.suggestionAchievements'),
    t('assistant.suggestionDsa'),
    t('assistant.suggestionContact'),
  ];

  return (
    <>
      {/* Floating Toggle Button (Bottom-Right) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('assistant.buttonAria')}
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 group"
      >
        <span className="relative flex items-center justify-center">
          <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-200" />
          </span>
        </span>
      </button>

      {/* Assistant Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="assistant-modal-title"
            className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[420px] sm:h-[600px] z-50 flex flex-col glass-panel sm:rounded-3xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-950/95 transition-all"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="assistant-modal-title" className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span>{t('assistant.title')}</span>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h3>
                  <p className="text-[10px] font-mono text-cyan-300">
                    {providerInfo.configured
                      ? t('assistant.liveBadge')
                      : t('assistant.badge')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  aria-label={t('assistant.clearConversation')}
                  title={t('assistant.clearConversation')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label={t('assistant.closeAria')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Provider Status Notice (truthful indicator if AI API key is pending configuration) */}
            {!providerInfo.configured && (
              <div className="px-4 py-2 bg-amber-950/30 border-b border-amber-800/40 text-[11px] text-amber-300 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  {t('assistant.unconfiguredNotice')}
                </p>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-none shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Sources Badge List */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                        <span className="text-[10px] font-mono text-slate-400 block mb-1.5 flex items-center gap-1">
                          <Tag className="w-3 h-3 text-cyan-400" />
                          <span>{t('assistant.sourcesLabel')}</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((s, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-950/60 border border-cyan-800/40 text-cyan-300"
                            >
                              <span>{s.title}</span>
                              {s.link && (
                                <a
                                  href={s.link}
                                  onClick={() => setIsOpen(false)}
                                  className="text-cyan-400 hover:text-white"
                                  title={`Go to ${s.title}`}
                                >
                                  <ExternalLink className="w-2.5 h-2.5 inline" />
                                </a>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* In-Flight Typing / Generation Indicator */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="text-[11px] font-mono text-slate-400 ml-1.5">
                      {t('assistant.thinking')}
                    </span>
                  </div>
                </div>
              )}

              {/* Error & Retry Banner */}
              {error && (
                <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <p className="line-clamp-2">{error}</p>
                  </div>
                  {lastFailedQuery && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[11px] font-mono flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{t('assistant.retry')}</span>
                    </button>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-900/40">
              <span className="text-[10px] font-mono text-slate-400 block mb-1.5">
                {t('assistant.suggestionsTitle')}
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 disabled:opacity-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                disabled={isLoading}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('assistant.inputPlaceholder')}
                className="flex-1 px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 disabled:opacity-50 transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                aria-label={t('assistant.sendAria')}
                className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 disabled:opacity-40 hover:bg-cyan-400 transition-colors shrink-0 flex items-center justify-center"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
