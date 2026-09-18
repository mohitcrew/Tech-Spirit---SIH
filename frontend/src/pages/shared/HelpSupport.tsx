import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  HelpCircle, Search, MessageSquare, ChevronDown, Send,
  LifeBuoy, Mail, Phone, ExternalLink, CheckCircle2, AlertCircle
} from 'lucide-react';
import { learnerService, SupportTicketItem, FaqItem } from '../../services/learnerService';

export default function HelpSupport() {
  const [searchFaq, setSearchFaq] = useState('');
  const [selectedFaqCat, setSelectedFaqCat] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Ticket Form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Competencies & Gaps');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState<SupportTicketItem | null>(null);

  const { data: faqs = [] } = useQuery({
    queryKey: ['faqs', selectedFaqCat],
    queryFn: () => learnerService.getFaqs(selectedFaqCat),
  });

  const [tickets, setTickets] = useState<SupportTicketItem[]>(() => learnerService.getSupportTickets());

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    const newTicket = learnerService.submitSupportTicket({
      subject: subject.trim(),
      category,
      priority,
      description: description.trim(),
    });
    setTickets([newTicket, ...tickets]);
    setTicketSubmitted(newTicket);
    setSubject('');
    setDescription('');
  };

  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(searchFaq.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchFaq.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="page-header-banner p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2 text-white" style={{ color: '#ffffff' }}>
            <LifeBuoy className="w-3.5 h-3.5 text-white" />
            <span className="text-white" style={{ color: '#ffffff' }}>Support Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ color: '#ffffff' }}>
            Help & Technical Support
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl" style={{ color: '#dbeafe' }}>
            Frequently asked questions, system troubleshooting guides, and direct assistance ticketing for SIH 2026 fellows.
          </p>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-2 flex-shrink-0">
          <div className="flex items-center gap-2 font-semibold">
            <Mail className="w-4 h-4 text-cyan-300" />
            <span>support@skillsync.gov.in</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-4 h-4 text-emerald-300" />
            <span>Toll-Free: 1800-11-SYNC (7962)</span>
          </div>
        </div>
      </div>

      {/* FAQ Search and Filter */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search help articles (e.g. certificates, calculate skill gap, learning paths)..."
            value={searchFaq}
            onChange={e => setSearchFaq(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3 pt-2">
          {filteredFaqs.map(faq => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-4 flex items-center justify-between text-left gap-4 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/80 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Ticket Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Submit Ticket Form */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>Submit a Support Request</span>
          </h2>

          <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject / Issue Title</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Brief summary of your inquiry..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Competencies & Gaps">Competencies & Gaps</option>
                  <option value="Certificates">Certificates & Verification</option>
                  <option value="Course Access">Course Room & Video Player</option>
                  <option value="Assessments">Assessment Submissions</option>
                  <option value="Technical Bug">Technical Bug</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High (Urgent)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Detailed Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Please describe what occurred and any error messages shown..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
            >
              <span>Submit Support Ticket</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {ticketSubmitted && (
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Ticket <strong>{ticketSubmitted.id}</strong> logged successfully! Support team will respond within 2 business hours.</span>
            </div>
          )}
        </div>

        {/* Existing Tickets History */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Your Support History
          </h2>

          <div className="space-y-3">
            {tickets.map(t => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-400 font-bold">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    t.status === 'Resolved'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.subject}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                  <span>{t.category} · Priority: {t.priority}</span>
                  <span>{t.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
