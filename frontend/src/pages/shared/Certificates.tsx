import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Award, Download, ExternalLink, CheckCircle, ShieldCheck,
  Calendar, FileText, Search, Sparkles, Share2, Eye, Lock,
  Trophy, AlertCircle, CheckCircle2
} from 'lucide-react';
import { learnerService, CertificateItem } from '../../services/learnerService';

export default function Certificates() {
  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => learnerService.getCertificates(),
  });

  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [verifyIdInput, setVerifyIdInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; message: string } | null>(null);

  // XP progression metrics
  const totalXp = learnerService.getTotalXP();
  const targetXp = 2000;
  const xpNeeded = Math.max(0, targetXp - totalXp);
  const xpPercent = Math.min(100, Math.round((totalXp / targetXp) * 100));

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyIdInput.trim()) return;
    const found = certificates.find(c =>
      c.certificateNumber.toLowerCase() === verifyIdInput.trim().toLowerCase() ||
      c.id.toLowerCase() === verifyIdInput.trim().toLowerCase()
    );
    if (found) {
      setVerificationResult({
        verified: true,
        message: `Verified Authentic Certificate: Issued to Priya Sharma for "${found.courseTitle}" with score ${found.score}%.`,
      });
    } else {
      setVerificationResult({
        verified: false,
        message: `Certificate ID "${verifyIdInput}" could not be located in the national registry.`,
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Credentials & Certification Progression</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Earned Certificates & Credentials Center
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
            Tamper-proof verifiable credentials certifying completion of competency-aligned curricula and roadmap stages.
          </p>
        </div>

        {/* Certificate Count Badge */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center flex-shrink-0">
          <div className="text-[10px] uppercase font-bold text-amber-100">Issued Certifications</div>
          <div className="text-3xl font-black mt-0.5">{certificates.length}</div>
          <div className="text-[10px] text-emerald-300 font-bold mt-1">100% Cryptographically Signed</div>
        </div>
      </div>

      {/* FINAL CERTIFICATION PROGRESSION TRACKER */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-black">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Final SkillSync National Competency Certification</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase">
                  {totalXp >= targetXp ? 'Unlocked' : 'In Progress'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {totalXp >= targetXp
                  ? 'All prerequisites fulfilled! Your final national certification has been unlocked.'
                  : `Requires 2,000 XP + completion of core roadmap stages. You are currently ${xpNeeded} XP away.`}
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-xs font-bold text-slate-400">Progression Toward Final Credential</div>
            <div className="text-lg font-black text-amber-600 dark:text-amber-400">
              {totalXp.toLocaleString()} / {targetXp.toLocaleString()} XP
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>82% Minimum Diagnostic Score (Passed)</span>
            <span>{xpPercent}% XP Threshold Met</span>
          </div>
        </div>

        {/* Locked Prerequisite Checklist */}
        {totalXp < targetXp && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Pass Baseline Diagnostic Assessment (Done)</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Stage 1 & 2 Roadmap Curricula (Done)</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-200">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span>Reach 2,000 XP (Earn {xpNeeded} more XP)</span>
            </div>
          </div>
        )}
      </div>

      {/* Verification Search Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Verify any certificate by entering ID (e.g. SS-2026-DL-89211 or STG-01)..."
              value={verifyIdInput}
              onChange={e => setVerifyIdInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Credential</span>
          </button>
        </form>

        {verificationResult && (
          <div className={`mt-4 p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
            verificationResult.verified
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-800'
          }`}>
            {verificationResult.verified ? <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <ShieldCheck className="w-4 h-4 text-rose-600 flex-shrink-0" />}
            <span>{verificationResult.message}</span>
          </div>
        )}
      </div>

      {/* Certificates Grid (Stage Certificates + Course Certificates) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-1">
          Your Verified Stage & Course Credentials ({certificates.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-transparent">
                    {cert.certificateNumber}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                    {cert.courseTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Issued by {cert.issuer}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Date</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{cert.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Score / Grade</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">{cert.score}% ({cert.grade})</span>
                  </div>
                </div>

                {/* Skills verified */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Verified Competencies:</div>
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.map(sk => (
                      <span key={sk} className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-[10px] text-amber-800 dark:text-amber-300 font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full</span>
                </button>
                <button
                  onClick={() => alert(`Downloading high-resolution verified PDF for ${cert.certificateNumber}`)}
                  className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-md shadow-amber-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Modal Viewer */}
      {selectedCert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl animate-scaleUp relative overflow-hidden">
            {/* Certificate Border Design */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Certificate of Achievement</h3>
                  <p className="text-xs text-slate-400">Credential ID: {selectedCert.certificateNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-3 py-4">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">This is proudly presented to</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-wide">Priya Sharma</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                For outstanding demonstration of mastery, completing all curriculum milestones with a score of <strong>{selectedCert.score}% ({selectedCert.grade})</strong> in:
              </p>
              <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 py-1">
                {selectedCert.courseTitle}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Authorized Signatory</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCert.issuer}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Issued On</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCert.issueDate}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(selectedCert.credentialUrl);
                  alert('Credential verification URL copied to clipboard!');
                }}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Copy Share Link</span>
              </button>
              <button
                onClick={() => {
                  alert(`Downloading PDF certificate ${selectedCert.certificateNumber}`);
                  setSelectedCert(null);
                }}
                className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30"
              >
                <Download className="w-4 h-4" />
                <span>Save to PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
