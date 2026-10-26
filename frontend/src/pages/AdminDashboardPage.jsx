import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Mail,
  MailOpen,
  Clock,
  CheckCircle,
  Archive,
  Trash2,
  Reply,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  AlertCircle,
  Shield,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  User,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import adminService from '../services/admin.service.js';

export default function AdminDashboardPage() {
  const { admin, logout } = useAdminAuth();

  // Overview stats state
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    pending: 0,
    replied: 0,
    archived: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Messages inbox state
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalMessages: 0, totalPages: 1 });
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '' | 'pending' | 'processed' | 'replied' | 'archived'
  const [readFilter, setReadFilter] = useState(''); // '' | 'false' | 'true'

  // Selected message for detail & reply modal
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replyFeedback, setReplyFeedback] = useState(null);

  // Delete confirmation state
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Action status toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch stats from MongoDB
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await adminService.getStats();
      if (res?.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('[Dashboard] Stats fetch error:', err.message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch paginated messages
  const fetchMessages = useCallback(
    async (page = 1) => {
      setInboxLoading(true);
      setInboxError(null);
      try {
        const res = await adminService.getMessages({
          page,
          limit: 10,
          status: statusFilter,
          isRead: readFilter,
          search: searchQuery,
        });
        if (res?.data) {
          setMessages(res.data);
          if (res.meta) {
            setPagination(res.meta);
          }
        }
      } catch (err) {
        console.warn('[Dashboard] Inbox fetch error:', err.message);
        setInboxError(err.message || 'Failed to load contact messages.');
      } finally {
        setInboxLoading(false);
      }
    },
    [statusFilter, readFilter, searchQuery]
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchMessages(1);
  }, [fetchMessages]);

  // Handle Mark as Read / Unread toggle
  const handleToggleRead = async (message, e) => {
    e?.stopPropagation();
    try {
      const nextRead = !message.isRead;
      await adminService.toggleReadStatus(message._id, nextRead);
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? { ...m, isRead: nextRead } : m))
      );
      if (selectedMessage && selectedMessage._id === message._id) {
        setSelectedMessage((prev) => ({ ...prev, isRead: nextRead }));
      }
      fetchStats();
      showToast(`Marked as ${nextRead ? 'read' : 'unread'}`);
    } catch (err) {
      showToast(err.message || 'Failed to update read status', 'error');
    }
  };

  // Handle Status Update
  const handleUpdateStatus = async (messageId, newStatus) => {
    try {
      await adminService.updateStatus(messageId, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, status: newStatus } : m))
      );
      if (selectedMessage && selectedMessage._id === messageId) {
        setSelectedMessage((prev) => ({ ...prev, status: newStatus }));
      }
      fetchStats();
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Handle Delete Confirmed
  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteMessage(messageToDelete._id);
      setMessages((prev) => prev.filter((m) => m._id !== messageToDelete._id));
      if (selectedMessage && selectedMessage._id === messageToDelete._id) {
        setSelectedMessage(null);
      }
      setMessageToDelete(null);
      fetchStats();
      showToast('Message deleted successfully');
    } catch (err) {
      showToast(err.message || 'Failed to delete message', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Handle In-App Reply Dispatch
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || replySending || !selectedMessage) return;

    setReplySending(true);
    setReplyFeedback(null);

    try {
      const res = await adminService.replyToMessage(selectedMessage._id, {
        replyText: replyText.trim(),
        subject: `Re: ${selectedMessage.subject || 'Portfolio Inquiry'}`,
      });

      setReplyFeedback({
        type: 'success',
        message: 'Reply dispatched successfully to visitor and status updated to replied.',
      });

      // Update state
      setMessages((prev) =>
        prev.map((m) =>
          m._id === selectedMessage._id
            ? { ...m, status: 'replied', isRead: true, replyText: replyText.trim() }
            : m
        )
      );
      setSelectedMessage((prev) => ({
        ...prev,
        status: 'replied',
        isRead: true,
        replyText: replyText.trim(),
      }));
      setReplyText('');
      fetchStats();
      showToast('Reply dispatched via Resend');
    } catch (err) {
      setReplyFeedback({
        type: 'error',
        message:
          err.code === 'EMAIL_PROVIDER_UNCONFIGURED'
            ? 'RESEND_API_KEY is not configured in backend environment. You can use the "Reply via Email Client" button above to send via your desktop/mobile mail app.'
            : err.message || 'Failed to transmit reply.',
      });
    } finally {
      setReplySending(false);
    }
  };

  // Open Message Detail Modal
  const openMessageModal = (msg) => {
    setSelectedMessage(msg);
    setReplyFeedback(null);
    setReplyText('');
    // Automatically mark as read if it is unread
    if (!msg.isRead) {
      adminService.toggleReadStatus(msg._id, true).then(() => {
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m))
        );
        fetchStats();
      });
    }
  };

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> Replied
          </span>
        );
      case 'processed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <CheckCircle className="w-3 h-3" /> Processed
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <Archive className="w-3 h-3" /> Archived
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#070d17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium flex items-center gap-2 ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-800'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#091120]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">Portfolio Admin</h1>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-semibold rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {admin?.role || 'admin'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Signed in as: <span className="text-slate-200">{admin?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors inline-flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Site</span>
          </Link>

          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 hover:bg-rose-500/20 transition-colors inline-flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Overview Stats Cards */}
        <section aria-labelledby="stats-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="stats-heading" className="text-sm font-mono uppercase font-semibold text-slate-400 tracking-wider">
              Inquiry Overview
            </h2>
            <button
              onClick={() => {
                fetchStats();
                fetchMessages(pagination.page);
              }}
              className="text-xs text-slate-400 hover:text-cyan-400 inline-flex items-center gap-1 font-mono transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${statsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Messages */}
            <div className="glass-panel p-5 rounded-xl border border-slate-800 glow-card relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-slate-400">Total Inquiries</p>
                  <p className="text-2xl font-bold text-white mt-1 font-mono">
                    {statsLoading ? '...' : stats.total}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Inbox className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Unread */}
            <div className="glass-panel p-5 rounded-xl border border-slate-800 glow-card relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-slate-400">Unread</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1 font-mono">
                    {statsLoading ? '...' : stats.unread}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="glass-panel p-5 rounded-xl border border-slate-800 glow-card relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-slate-400">Pending Action</p>
                  <p className="text-2xl font-bold text-blue-400 mt-1 font-mono">
                    {statsLoading ? '...' : stats.pending}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Replied */}
            <div className="glass-panel p-5 rounded-xl border border-slate-800 glow-card relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-slate-400">Replied</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
                    {statsLoading ? '...' : stats.replied}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Inbox Section */}
        <section aria-labelledby="inbox-heading" className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <h2 id="inbox-heading" className="text-sm font-mono uppercase font-semibold text-slate-400 tracking-wider">
              Contact Inbox
            </h2>

            {/* Toolbar Filters & Search */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search sender, email, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
                <span className="text-slate-500 pl-1.5 hidden sm:inline">Status:</span>
                {['', 'pending', 'replied', 'archived'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded capitalize font-mono text-[11px] transition-colors ${
                      statusFilter === st
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === '' ? 'All' : st}
                  </button>
                ))}
              </div>

              {/* Read/Unread Filter */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
                {['', 'false', 'true'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setReadFilter(r)}
                    className={`px-2 py-1 rounded font-mono text-[11px] transition-colors ${
                      readFilter === r
                        ? 'bg-slate-700 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r === '' ? 'Read/Unread' : r === 'false' ? 'Unread' : 'Read'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Inbox Container */}
          <div className="glass-panel rounded-xl border border-slate-800/90 overflow-hidden shadow-xl">
            {inboxLoading ? (
              <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                <p className="text-xs font-mono">Retrieving contact messages from database...</p>
              </div>
            ) : inboxError ? (
              <div className="p-12 text-center text-rose-400 flex flex-col items-center justify-center gap-2">
                <AlertCircle className="w-8 h-8" />
                <p className="text-sm font-semibold">{inboxError}</p>
                <button
                  onClick={() => fetchMessages(pagination.page)}
                  className="mt-2 text-xs text-cyan-400 underline font-mono"
                >
                  Try Again
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                <Inbox className="w-10 h-10 text-slate-600 stroke-1" />
                <p className="text-sm font-medium text-slate-400">No contact messages found</p>
                <p className="text-xs max-w-sm text-slate-500 font-mono">
                  {searchQuery || statusFilter || readFilter
                    ? 'No messages match your selected search or filters.'
                    : 'Your contact form has not received any submissions yet.'}
                </p>
                {(searchQuery || statusFilter || readFilter) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('');
                      setReadFilter('');
                    }}
                    className="mt-2 text-xs text-cyan-400 hover:underline font-mono"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    onClick={() => openMessageModal(message)}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/30 transition-colors ${
                      !message.isRead ? 'bg-cyan-950/15 border-l-4 border-cyan-400' : ''
                    }`}
                  >
                    {/* Left: Indicator, Visitor, Subject Preview */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <button
                        title={message.isRead ? 'Mark as Unread' : 'Mark as Read'}
                        onClick={(e) => handleToggleRead(message, e)}
                        className="mt-0.5 text-slate-500 hover:text-cyan-400 transition-colors shrink-0"
                      >
                        {message.isRead ? (
                          <MailOpen className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Mail className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-sm font-semibold truncate ${
                              !message.isRead ? 'text-white' : 'text-slate-300'
                            }`}
                          >
                            {message.name}
                          </span>
                          <span className="text-xs text-slate-500 font-mono truncate">
                            &lt;{message.email}&gt;
                          </span>
                          {getStatusBadge(message.status)}
                        </div>

                        <p className="text-xs text-slate-300 font-medium mt-1 truncate">
                          {message.subject || 'General Inquiry'}
                        </p>

                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 text-ellipsis">
                          {message.message}
                        </p>
                      </div>
                    </div>

                    {/* Right: Date and Quick Actions */}
                    <div className="flex items-center gap-4 shrink-0 sm:self-center">
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(message.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openMessageModal(message)}
                          title="View message & reply"
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition-colors"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setMessageToDelete(message)}
                          title="Delete message"
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>
                  Page {pagination.page} of {pagination.totalPages} ({pagination.totalMessages} total)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchMessages(pagination.page - 1)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchMessages(pagination.page + 1)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Message Detail & Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl bg-[#0b1322] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-slate-400">Message Detail</span>
                  {getStatusBadge(selectedMessage.status)}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {selectedMessage.subject || 'General Inquiry'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sender Metadata Table */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-500">From:</span>
                <span className="font-medium text-slate-200">
                  {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-500">Received At:</span>
                <span className="font-mono text-slate-400">
                  {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'medium',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-500">Update Status:</span>
                <select
                  value={selectedMessage.status}
                  onChange={(e) => handleUpdateStatus(selectedMessage._id, e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
                >
                  <option value="pending">Pending</option>
                  <option value="processed">Processed</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <p className="text-xs font-mono text-slate-400 mb-2">Message Content:</p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            {/* Previous reply if exists */}
            {selectedMessage.replyText && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300 space-y-1">
                <p className="font-mono font-semibold text-emerald-400">
                  ✓ Replied on {new Date(selectedMessage.repliedAt || Date.now()).toLocaleDateString()}:
                </p>
                <p className="whitespace-pre-wrap text-slate-300">{selectedMessage.replyText}</p>
              </div>
            )}

            {/* Reply Options */}
            <div className="border-t border-slate-800 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase font-bold text-slate-300 tracking-wider">
                  Reply to Visitor
                </h4>

                {/* Direct mailto button */}
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject || 'Portfolio Inquiry'
                  )}&body=${encodeURIComponent(
                    `\n\n--- Original Message from ${selectedMessage.name} ---\n${selectedMessage.message}`
                  )}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white inline-flex items-center gap-1.5 font-mono transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Reply in Mail Client</span>
                </a>
              </div>

              {/* In-App Direct Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-3">
                <textarea
                  rows="3"
                  value={replyText}
                  disabled={replySending}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write your reply to ${selectedMessage.name}...`}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none disabled:opacity-60"
                />

                {replyFeedback && (
                  <div
                    className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                      replyFeedback.type === 'success'
                        ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                        : 'bg-rose-950/40 border border-rose-800 text-rose-300'
                    }`}
                  >
                    {replyFeedback.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    )}
                    <span>{replyFeedback.message}</span>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={!replyText.trim() || replySending}
                    className="py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-semibold text-xs transition-all shadow-md inline-flex items-center gap-2"
                  >
                    {replySending ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending via Resend...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply Email</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md bg-[#0b1322] border border-rose-900/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Confirm Deletion</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the inquiry from{' '}
              <strong className="text-white">{messageToDelete.name}</strong> (
              <span className="font-mono">{messageToDelete.email}</span>)? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setMessageToDelete(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteMessage}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/20 inline-flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
