import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Mail,
  Send,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Layers,
  Sparkles,
  Eye,
  Sliders,
  History,
  FileText,
  User,
  Shield,
  Activity,
  RefreshCw,
  ExternalLink,
  Users,
  Check,
} from 'lucide-react';
import { api, unwrap } from '../../services/api';

interface HealthStats {
  sentToday: number;
  failed: number;
  queued: number;
  retried: number;
  deliveryRate: number;
  totalCount: number;
}

interface EmailTemplateConfig {
  id: string;
  templateKey: string;
  name: string;
  category: string;
  description: string;
  subject: string;
  emailjsTemplateId: string;
  enabled: boolean;
  automaticEnabled: boolean;
  adminEnabled: boolean;
  requiredVariables: string;
  defaultVariables: string;
}

interface EmailLogItem {
  id: string;
  recipientEmail: string;
  recipientRole?: string;
  templateKey: string;
  category: string;
  subject: string;
  status: 'PENDING' | 'QUEUED' | 'SENT' | 'FAILED' | 'RETRYING';
  triggerType: 'AUTOMATIC' | 'ADMIN_MANUAL';
  variables?: string;
  providerMessageId?: string;
  errorMessage?: string;
  retryCount: number;
  sentAt?: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

const CATEGORIES = [
  'ALL',
  'Account / Registration',
  'Learning',
  'Training',
  'Assessment',
  'Competency',
  'Certification',
  'Trainer',
  'Admin',
];

export function EmailCenter({ defaultTab }: { defaultTab?: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Active Tab
  const paramTab = searchParams.get('tab') || defaultTab || 'composer';
  const [activeTab, setActiveTab] = useState<'composer' | 'catalog' | 'history' | 'settings'>(
    paramTab as any,
  );

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab') as any);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'composer' | 'catalog' | 'history' | 'settings') => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      prev.set('tab', tab);
      return prev;
    });
  };

  // 1. Fetch Health Stats
  const { data: healthData, refetch: refetchHealth } = useQuery<HealthStats>({
    queryKey: ['admin-email-health'],
    queryFn: () => unwrap<HealthStats>(api.get('/admin/email/health')),
    refetchInterval: 15000,
  });

  // 2. Fetch Templates
  const { data: templates = [], isLoading: loadingTemplates } = useQuery<EmailTemplateConfig[]>({
    queryKey: ['admin-email-templates'],
    queryFn: () => unwrap<EmailTemplateConfig[]>(api.get('/admin/email/templates')),
  });

  // =========================================================================
  // Composer State
  // =========================================================================
  const [recipientType, setRecipientType] = useState<'individual' | 'bulk'>('individual');
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<{
    id?: string;
    name: string;
    email: string;
    role: string;
    domain?: string;
    sector?: string;
  } | null>(null);

  const [bulkFilterRole, setBulkFilterRole] = useState('ALL');
  const [bulkFilterDomain, setBulkFilterDomain] = useState('ALL');

  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('welcome-registration');
  const [customVariables, setCustomVariables] = useState<Record<string, string>>({});
  const [customSubject, setCustomSubject] = useState<string>('');

  // Preview State
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewSubject, setPreviewSubject] = useState<string>('');
  const [loadingPreview, setLoadingPreview] = useState<boolean>(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Check URL params for preselected recipient
  useEffect(() => {
    const pEmail = searchParams.get('recipientEmail');
    const pName = searchParams.get('recipientName');
    const pRole = searchParams.get('recipientRole');
    const pId = searchParams.get('recipientId');

    if (pEmail) {
      setSelectedRecipient({
        id: pId || undefined,
        email: pEmail,
        name: pName || 'Learner',
        role: pRole || 'TRAINEE',
      });
      setRecipientSearch(pEmail);
    }
  }, [searchParams]);

  // Recipient search query
  const { data: searchResults = [] } = useQuery({
    queryKey: ['search-recipients', recipientSearch],
    queryFn: async () => {
      if (!recipientSearch || recipientSearch.length < 2) return [];
      const res = await api.get(`/admin/users?search=${encodeURIComponent(recipientSearch)}&limit=8`);
      return res.data?.data?.users || [];
    },
    enabled: recipientSearch.length >= 2,
  });

  // When template changes, load default variables
  useEffect(() => {
    const tmpl = templates.find((t) => t.templateKey === selectedTemplateKey);
    if (tmpl) {
      let defaults: Record<string, string> = {};
      try {
        defaults = typeof tmpl.defaultVariables === 'string' ? JSON.parse(tmpl.defaultVariables) : tmpl.defaultVariables;
      } catch (e) {
        defaults = {};
      }

      setCustomSubject(tmpl.subject);
      setCustomVariables({
        user_name: selectedRecipient?.name || defaults.headline_highlight || 'Aarav Sharma',
        user_email: selectedRecipient?.email || 'student001@skillsync.demo',
        ...defaults,
      });
    }
  }, [selectedTemplateKey, selectedRecipient, templates]);

  // Refresh Preview
  const handleUpdatePreview = async () => {
    if (!selectedTemplateKey) return;
    setLoadingPreview(true);
    try {
      const res = await api.post('/admin/email/preview', {
        templateKey: selectedTemplateKey,
        variables: customVariables,
        recipient: selectedRecipient || {
          email: customVariables.user_email || 'learner@skillsync.demo',
          name: customVariables.user_name || 'Aarav Sharma',
          role: selectedRecipient?.role || 'TRAINEE',
        },
      });
      const data = res.data?.data;
      setPreviewHtml(data?.html || '');
      setPreviewSubject(data?.subject || '');
    } catch (err) {
      console.error('Failed to preview email:', err);
    } finally {
      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'composer') {
      handleUpdatePreview();
    }
  }, [selectedTemplateKey, activeTab]);

  // Send Email Mutation
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [sendErrorMessage, setSendErrorMessage] = useState<string | null>(null);

  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      setSendSuccessMessage(null);
      setSendErrorMessage(null);

      const payload: any = {
        templateKey: selectedTemplateKey,
        variables: customVariables,
        subject: customSubject,
      };

      if (recipientType === 'bulk') {
        payload.bulkFilter = {
          role: bulkFilterRole,
          domain: bulkFilterDomain,
        };
      } else {
        if (!selectedRecipient || !selectedRecipient.email) {
          throw new Error('Please select an active recipient first.');
        }
        payload.recipient = selectedRecipient;
      }

      const res = await api.post('/admin/email/send', payload);
      return res.data?.data;
    },
    onSuccess: (data) => {
      setSendSuccessMessage(data?.message || 'Email successfully dispatched through EmailJS engine!');
      queryClient.invalidateQueries({ queryKey: ['admin-email-health'] });
      queryClient.invalidateQueries({ queryKey: ['admin-email-history'] });
    },
    onError: (err: any) => {
      setSendErrorMessage(err.message || 'Failed to dispatch email.');
    },
  });

  // =========================================================================
  // Delivery History State
  // =========================================================================
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('ALL');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState('ALL');
  const [historyPage, setHistoryPage] = useState(1);
  const [selectedLogModal, setSelectedLogModal] = useState<EmailLogItem | null>(null);

  const { data: historyData, isLoading: loadingHistory, refetch: refetchHistory } = useQuery<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    logs: EmailLogItem[];
  }>({
    queryKey: [
      'admin-email-history',
      { historySearch, historyStatusFilter, historyCategoryFilter, historyPage },
    ],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(historyPage),
        limit: '15',
      });
      if (historySearch) params.set('search', historySearch);
      if (historyStatusFilter !== 'ALL') params.set('status', historyStatusFilter);
      if (historyCategoryFilter !== 'ALL') params.set('category', historyCategoryFilter);

      return unwrap<any>(api.get(`/admin/email/history?${params.toString()}`));
    },
    refetchInterval: 20000,
  });

  // Resend Email Mutation
  const resendMutation = useMutation({
    mutationFn: async (logId: string) => {
      const res = await api.post('/admin/email/resend', { logId });
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-email-history'] });
      queryClient.invalidateQueries({ queryKey: ['admin-email-health'] });
    },
  });

  // Quick Preview Modal for Catalog
  const [catalogPreviewKey, setCatalogPreviewKey] = useState<string | null>(null);
  const [catalogPreviewHtml, setCatalogPreviewHtml] = useState<string>('');

  const handleOpenCatalogPreview = async (tmpl: EmailTemplateConfig) => {
    setCatalogPreviewKey(tmpl.templateKey);
    let defaults: Record<string, string> = {};
    try {
      defaults = typeof tmpl.defaultVariables === 'string' ? JSON.parse(tmpl.defaultVariables) : tmpl.defaultVariables;
    } catch (e) {
      defaults = {};
    }
    const res = await api.post('/admin/email/preview', {
      templateKey: tmpl.templateKey,
      variables: defaults,
    });
    setCatalogPreviewHtml(res.data?.data?.html || '');
  };

  // Catalog Filter
  const [catalogCategory, setCatalogCategory] = useState('ALL');
  const [catalogSearch, setCatalogSearch] = useState('');

  const filteredTemplates = templates.filter((t) => {
    if (catalogCategory !== 'ALL' && t.category !== catalogCategory) return false;
    if (catalogSearch) {
      const q = catalogSearch.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.templateKey.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="page-header-banner bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-6 rounded-2xl text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#93c5fd' }}>
            <Shield className="w-3.5 h-3.5" style={{ color: '#93c5fd' }} />
            EmailJS Central Communication Hub
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white" style={{ color: '#ffffff' }}>Email Command Center</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl" style={{ color: '#cbd5e1' }}>
            Monitor real-time delivery telemetry, preview all 30+ responsive email scenarios, and manually dispatch transactional alerts.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetchHealth()}
            className="btn-banner-action flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition cursor-pointer shadow-xs"
            style={{ color: '#ffffff' }}
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" style={{ color: '#ffffff' }} />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>Sync Telemetry</span>
          </button>
          <button
            onClick={() => handleTabChange('composer')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/30 transition cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            <Send className="w-3.5 h-3.5 text-white" style={{ color: '#ffffff' }} />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>Compose Email</span>
          </button>
        </div>
      </div>

      {/* EMAIL HEALTH METRICS WIDGET (Requirement 16) */}
      <div
        onClick={() => handleTabChange('history')}
        className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer group"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold tracking-wide uppercase text-slate-800 dark:text-white">
              Email Health & Live Delivery Telemetry
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold">
              Live Link
            </span>
          </div>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline flex items-center gap-1">
            Open Delivery History &rarr;
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {/* Sent Today */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Sent Today
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {healthData?.sentToday ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Successful Dispatches</div>
          </div>

          {/* Failed */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-500" /> Failed
            </div>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              {healthData?.failed ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Requires Intervention</div>
          </div>

          {/* Queued */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> Queued
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {healthData?.queued ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">In Transit</div>
          </div>

          {/* Retried */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" /> Retried
            </div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {healthData?.retried ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Auto & Manual Retries</div>
          </div>

          {/* Delivery Rate */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700 col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Delivery Rate
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              {healthData?.deliveryRate ?? 100}%
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${healthData?.deliveryRate ?? 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 gap-2">
        <button
          onClick={() => handleTabChange('composer')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'composer'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          Email Composer
        </button>

        <button
          onClick={() => handleTabChange('catalog')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'catalog'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Template Catalog ({templates.length})
        </button>

        <button
          onClick={() => handleTabChange('history')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          Delivery History
        </button>

        <button
          onClick={() => handleTabChange('settings')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Engine & Provider Settings
        </button>
      </div>

      {/* =====================================================================
          TAB 1: EMAIL COMPOSER
      ===================================================================== */}
      {activeTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Configuration Controls (6 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step 1 & 2: Recipient Selection */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Step 1 & 2 &bull; Target Recipient
                </span>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                  <button
                    onClick={() => setRecipientType('individual')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                      recipientType === 'individual'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Single User
                  </button>
                  <button
                    onClick={() => setRecipientType('bulk')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                      recipientType === 'bulk'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Bulk Cohort
                  </button>
                </div>
              </div>

              {recipientType === 'individual' ? (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Search User by Name, Email, or ID:
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={recipientSearch}
                      onChange={(e) => setRecipientSearch(e.target.value)}
                      placeholder="e.g., student001@skillsync.demo or Aarav"
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500"
                    />

                    {/* Autocomplete Dropdown */}
                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30 max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                        {searchResults.map((u: any) => (
                          <div
                            key={u.id}
                            onClick={() => {
                              setSelectedRecipient({
                                id: u.id,
                                name: u.name,
                                email: u.email,
                                role: u.role,
                                domain: u.profile?.domain,
                                sector: u.profile?.sector,
                              });
                              setRecipientSearch(u.email);
                            }}
                            className="p-3 hover:bg-blue-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <div className="font-semibold text-xs text-slate-900 dark:text-white">
                                {u.name}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {u.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Recipient Card */}
                  {selectedRecipient && (
                    <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          {selectedRecipient.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-slate-900 dark:text-white">
                            {selectedRecipient.name}
                          </div>
                          <div className="text-[11px] text-blue-700 dark:text-blue-300 font-mono">
                            {selectedRecipient.email}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200/60 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {selectedRecipient.role}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* Bulk Cohort Filter */
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Filter by Role:
                    </label>
                    <select
                      value={bulkFilterRole}
                      onChange={(e) => setBulkFilterRole(e.target.value)}
                      className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
                    >
                      <option value="ALL">All Roles</option>
                      <option value="TRAINEE">All Trainees (50+)</option>
                      <option value="TRAINER">All Trainers (25+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Filter by Domain:
                    </label>
                    <select
                      value={bulkFilterDomain}
                      onChange={(e) => setBulkFilterDomain(e.target.value)}
                      className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
                    >
                      <option value="ALL">All Domains</option>
                      <option value="AI">AI & Machine Learning</option>
                      <option value="Cloud">Cloud & DevOps</option>
                      <option value="Cyber">Cybersecurity</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Select Template */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Step 3 &bull; Select Template Scenario
              </span>

              <select
                value={selectedTemplateKey}
                onChange={(e) => setSelectedTemplateKey(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {templates.map((t) => (
                  <option key={t.templateKey} value={t.templateKey}>
                    [{t.category}] {t.name}
                  </option>
                ))}
              </select>

              {/* Template Description */}
              {(() => {
                const currentTmpl = templates.find((t) => t.templateKey === selectedTemplateKey);
                return currentTmpl ? (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Objective: </span>
                    {currentTmpl.description}
                  </div>
                ) : null;
              })()}
            </div>

            {/* Step 4: Configure Variables */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Step 4 &bull; Dynamic Variables
                </span>
                <button
                  onClick={handleUpdatePreview}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-render Preview
                </button>
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Subject Line:
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Variables Form */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {[
                  'user_name',
                  'headline_prefix',
                  'headline_highlight',
                  'hero_description',
                  'cta_text',
                  'cta_url',
                  'detail_label_1',
                  'detail_val_1',
                  'detail_label_2',
                  'detail_val_2',
                  'status_badge_text',
                ].map((key) => (
                  <div key={key}>
                    <label className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                      {`{{${key}}}`}
                    </label>
                    <input
                      type="text"
                      value={customVariables[key] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomVariables((prev) => ({ ...prev, [key]: val }));
                      }}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Step 6: Dispatch Action */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              {sendSuccessMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{sendSuccessMessage}</span>
                </div>
              )}

              {sendErrorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{sendErrorMessage}</span>
                </div>
              )}

              <button
                onClick={() => sendEmailMutation.mutate()}
                disabled={sendEmailMutation.isPending || (recipientType === 'individual' && !selectedRecipient)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {sendEmailMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Dispatching via EmailJS...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {recipientType === 'bulk'
                      ? 'Dispatch Bulk Email to Cohort'
                      : `Dispatch Email to ${selectedRecipient?.name || 'Selected Recipient'}`}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Responsive Preview (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  Step 5 &bull; Real Email Template Preview
                </span>
                <span className="text-xs text-slate-500 font-mono mt-0.5 block truncate max-w-sm">
                  Subject: {previewSubject || customSubject}
                </span>
              </div>

              {/* Device switcher */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    previewDevice === 'desktop'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Desktop View
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    previewDevice === 'mobile'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Mobile View
                </button>
              </div>
            </div>

            {/* Iframe Viewport */}
            <div className="flex justify-center bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[640px]">
              {loadingPreview ? (
                <div className="flex items-center justify-center text-slate-500 text-sm gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                  Rendering dynamic template with substituted variables...
                </div>
              ) : (
                <iframe
                  title="Universal Email Preview"
                  srcDoc={previewHtml}
                  className={`border-0 rounded-xl shadow-lg bg-white transition-all duration-300 ${
                    previewDevice === 'mobile' ? 'w-[375px] h-[700px]' : 'w-full h-[700px]'
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: TEMPLATE CATALOG (30 Scenarios)
      ===================================================================== */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Catalog Controls */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search templates by scenario name or trigger..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatalogCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    catalogCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((tmpl) => (
              <div
                key={tmpl.templateKey}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 uppercase tracking-wider border border-blue-200/50">
                      {tmpl.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {tmpl.templateKey}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenCatalogPreview(tmpl)}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Quick Preview
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTemplateKey(tmpl.templateKey);
                      handleTabChange('composer');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> Compose
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Catalog Preview Modal */}
          {catalogPreviewKey && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Preview: {catalogPreviewKey}
                  </h3>
                  <button
                    onClick={() => setCatalogPreviewKey(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-hidden mt-4 bg-slate-100 rounded-xl">
                  <iframe
                    title="Scenario Preview"
                    srcDoc={catalogPreviewHtml}
                    className="w-full h-[550px] border-0 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 3: DELIVERY HISTORY
      ===================================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => {
                  setHistorySearch(e.target.value);
                  setHistoryPage(1);
                }}
                placeholder="Search recipient email, subject, or ID..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Status filter */}
              <select
                value={historyStatusFilter}
                onChange={(e) => {
                  setHistoryStatusFilter(e.target.value);
                  setHistoryPage(1);
                }}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="SENT">SENT</option>
                <option value="FAILED">FAILED</option>
                <option value="RETRYING">RETRYING</option>
                <option value="QUEUED">QUEUED</option>
              </select>

              <button
                onClick={() => refetchHistory()}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            {loadingHistory ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                Querying delivery history...
              </div>
            ) : historyData?.logs.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No delivery logs match the selected filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Template & Category</th>
                      <th className="py-3 px-4">Triggered By</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Dispatched At</th>
                      <th className="py-3 px-4">Retries</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {historyData?.logs.map((log) => {
                      const isSent = log.status === 'SENT';
                      const isFailed = log.status === 'FAILED';
                      const isRetrying = log.status === 'RETRYING';

                      const statusBadge = isSent
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : isFailed
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300';

                      return (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-900 dark:text-white text-xs">
                              {log.user?.name || log.recipientEmail.split('@')[0]}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {log.recipientEmail}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {log.templateKey}
                            </div>
                            <div className="text-[11px] text-slate-400">{log.category}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                              {log.triggerType}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadge}`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500">
                            {log.sentAt ? new Date(log.sentAt).toLocaleTimeString() : 'Pending'}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500">{log.retryCount}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedLogModal(log)}
                                className="p-1 text-slate-500 hover:text-blue-600 cursor-pointer"
                                title="Inspect Variables & Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (isSent) {
                                    if (
                                      window.confirm(
                                        `This email was already successfully delivered to ${log.recipientEmail}. Are you sure you want to resend?`,
                                      )
                                    ) {
                                      resendMutation.mutate(log.id);
                                    }
                                  } else {
                                    resendMutation.mutate(log.id);
                                  }
                                }}
                                disabled={resendMutation.isPending}
                                className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded cursor-pointer"
                                title="Resend Email"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Variable Inspection Modal */}
          {selectedLogModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Email Dispatch Record
                  </h3>
                  <button
                    onClick={() => setSelectedLogModal(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Recipient</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {selectedLogModal.recipientEmail}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Subject</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedLogModal.subject}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Substituted Variables (JSON)</span>
                    <pre className="mt-1 p-3 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto text-[11px] font-mono">
                      {JSON.stringify(JSON.parse(selectedLogModal.variables || '{}'), null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 4: SETTINGS & CONFIGURATION
      ===================================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 max-w-3xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              EmailJS Service Provider Configuration
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Active production mail transport keys and provider parameters.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Active Email Provider:</span>
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  EmailJS Enterprise Service
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Service ID:</span>
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                  service_2rnemfk
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Universal Template ID:</span>
                <span className="font-mono font-semibold text-purple-600 dark:text-purple-400">
                  template_v4oblec
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">HTML Template Design:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  universal-template.html (Loaded)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Total Registered Scenarios:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  30 Scenarios
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
              <strong>Security Protocol:</strong> Private API keys are kept strictly in backend environment variables and are never transmitted to client browsers. All public-facing requests require authenticated JWT tokens with verified <code>ADMIN</code> role permissions.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
