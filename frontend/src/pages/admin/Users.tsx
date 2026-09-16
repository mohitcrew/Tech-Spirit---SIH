import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Users as UsersIcon,
  Search,
  Filter,
  Shield,
  GraduationCap,
  Briefcase,
  CheckCircle,
  XCircle,
  Mail,
  UserCheck,
  UserX,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { api, unwrap } from '../../services/api';

interface UserProfile {
  sector?: string;
  domain?: string;
  targetRole?: string;
  experience?: number;
  skills?: string;
  designation?: string;
  department?: string;
}

interface UserItem {
  id: string;
  email: string;
  name: string;
  role: 'TRAINEE' | 'TRAINER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  onboardingCompleted: boolean;
  onboardingStatus: string;
  firstLoginRequired: boolean;
  createdAt: string;
  lastLoginAt?: string;
  profile?: UserProfile;
  _count?: {
    enrollments: number;
    certificates: number;
    emailLogs: number;
  };
}

interface UsersApiResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  users: UserItem[];
}

export function AdminUsers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [onboardingFilter, setOnboardingFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const limit = 15;

  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Fetch Users
  const { data, isLoading, isFetching, refetch } = useQuery<UsersApiResponse>({
    queryKey: ['admin-users-list', { search, roleFilter, domainFilter, statusFilter, onboardingFilter, page }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.set('search', search);
      if (roleFilter !== 'ALL') params.set('role', roleFilter);
      if (domainFilter !== 'ALL') params.set('domain', domainFilter);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (onboardingFilter !== 'ALL') params.set('onboardingStatus', onboardingFilter);

      const res = await api.get(`/admin/users?${params.toString()}`);
      return res.data?.data as UsersApiResponse;
    },
  });

  // Toggle user status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      const res = await api.patch(`/admin/users/${id}/status`, { status: newStatus });
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
    },
  });

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleComposeEmail = (user: UserItem) => {
    navigate(`/admin/email-center?tab=composer&recipientEmail=${encodeURIComponent(user.email)}&recipientName=${encodeURIComponent(user.name)}&recipientRole=${user.role}&recipientId=${user.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            Institutional Governance & Directory
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Platform User Management</h1>
          <p className="text-slate-300 text-sm mt-1">
            Directory of all 75+ verified synthetic demo learners, faculty trainers, and platform administrators.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/10 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => navigate('/admin/email-center?tab=composer')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-lg shadow-blue-500/30 transition cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            Dispatch Email
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Accounts</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{total}</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> 100% Verified Demo Roster
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Trainees / Students</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">51</div>
          <div className="text-xs text-slate-500 mt-1">STU-001 to STU-050</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Trainers / Faculty</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">26</div>
          <div className="text-xs text-slate-500 mt-1">TRN-001 to TRN-025</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Governance</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">2</div>
          <div className="text-xs text-slate-500 mt-1">System Administrators</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, or domain..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-medium">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="TRAINEE">Trainee</option>
              <option value="TRAINER">Trainer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Domain Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-medium">Domain:</span>
            <select
              value={domainFilter}
              onChange={(e) => {
                setDomainFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none"
            >
              <option value="ALL">All Domains</option>
              <option value="AI">AI & ML</option>
              <option value="Cloud">Cloud & DevOps</option>
              <option value="Cyber">Cybersecurity</option>
              <option value="Data">Data Science</option>
              <option value="Full-Stack">Full-Stack Web</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Onboarding Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-medium">Onboarding:</span>
            <select
              value={onboardingFilter}
              onChange={(e) => {
                setOnboardingFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none"
            >
              <option value="ALL">All States</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-2" />
            Loading registered platform accounts...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <UsersIcon className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="font-medium text-slate-700 dark:text-slate-300">No users match your filters.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search keyword or filter options.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Sector & Domain</th>
                  <th className="py-3.5 px-4">Onboarding</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Activity</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {users.map((u) => {
                  const roleBadgeColor =
                    u.role === 'ADMIN'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200'
                      : u.role === 'TRAINER'
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200';

                  const isActive = u.status === 'ACTIVE';

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {u.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                              {u.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleBadgeColor}`}
                        >
                          {u.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                          {u.role === 'TRAINER' && <Briefcase className="w-3 h-3" />}
                          {u.role === 'TRAINEE' && <GraduationCap className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>

                      {/* Domain & Sector */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          {u.profile?.domain || 'General Track'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Sector: {u.profile?.sector || 'IT'}
                        </div>
                      </td>

                      {/* Onboarding */}
                      <td className="py-3.5 px-4">
                        {u.onboardingCompleted ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                            <RefreshCw className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {u.status}
                        </span>
                      </td>

                      {/* Activity */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          {u._count?.enrollments || 0} courses &bull; {u._count?.certificates || 0} certs
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {u._count?.emailLogs || 0} emails dispatched
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send Email Action */}
                          <button
                            onClick={() => handleComposeEmail(u)}
                            title="Compose Email to User"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition cursor-pointer"
                          >
                            <Mail className="w-4 h-4" />
                          </button>

                          {/* Inspect Profile */}
                          <button
                            onClick={() => setSelectedUser(u)}
                            title="View Full Profile Details"
                            className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Toggle Active Status */}
                          <button
                            onClick={() =>
                              toggleStatusMutation.mutate({
                                id: u.id,
                                newStatus: isActive ? 'INACTIVE' : 'ACTIVE',
                              })
                            }
                            title={isActive ? 'Deactivate Account' : 'Activate Account'}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              isActive
                                ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50'
                                : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                            }`}
                          >
                            {isActive ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
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

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{users.length}</span> of{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{total}</span> users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {selectedUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedUser.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">{selectedUser.email}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-xs text-slate-400 block">System Role</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedUser.role}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Platform Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {selectedUser.status}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Sector / Industry</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedUser.profile?.sector || 'IT & Software'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Specialization Domain</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedUser.profile?.domain || 'General Track'}
                  </span>
                </div>
              </div>

              {selectedUser.profile?.skills && (
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Competency Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUser.profile.skills.split(',').map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                <button
                  onClick={() => {
                    handleComposeEmail(selectedUser);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Compose Email
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
