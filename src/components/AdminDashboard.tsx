import React, { useState } from 'react';
import { Member, Installment, Language } from '../types';
import { translations } from '../data/translations';
import { 
  ShieldCheck, Wallet, Users, Clock, CheckCircle2, 
  XCircle, Printer, FileText, Check, X,
  FileSpreadsheet, ArrowUpRight, TrendingUp, Building2,
  Calendar, Award, AlertCircle, Sparkles
} from 'lucide-react';

interface Props {
  members: Member[];
  installments: Installment[];
  lang: Language;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
  onViewReceipt: (inst: Installment) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  members,
  installments,
  lang,
  onApprove,
  onReject,
  onViewReceipt
}) => {
  const t = translations[lang];

  // Modals & Confirmation states
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Active members & installments
  const activeMembers = members.filter(m => !m.isDeleted);
  const activeInstallments = installments.filter(i => !i.isDeleted);

  const pendingInstallments = activeInstallments.filter(i => i.status === 'pending');
  const approvedInstallments = activeInstallments.filter(i => i.status === 'approved');

  const totalCapitalVerified = approvedInstallments.reduce((sum, i) => sum + i.amount, 0);
  const totalPendingAmount = pendingInstallments.reduce((sum, i) => sum + i.amount, 0);
  const totalSoldShares = activeMembers.reduce((sum, m) => sum + m.share, 0);
  const monthlySubscriptionTarget = totalSoldShares * 1000;

  // Management vs Advisory Equity breakdown
  const managementMembers = activeMembers.filter(m => m.committeeGroup === 'management' || ['NXR-004', 'NXR-007', 'NXR-006', 'NXR-012', 'NXR-008', 'NXR-011', 'NXR-010', 'NXR-013'].includes(m.id));
  const advisoryMembers = activeMembers.filter(m => m.committeeGroup === 'advisor' || ['NXR-003', 'NXR-001', 'NXR-002', 'NXR-005', 'NXR-009'].includes(m.id));

  const managementShares = managementMembers.reduce((sum, m) => sum + m.share, 0);
  const advisoryShares = advisoryMembers.reduce((sum, m) => sum + m.share, 0);

  const managementCapital = approvedInstallments
    .filter(i => managementMembers.some(m => m.id === i.memberId))
    .reduce((sum, i) => sum + i.amount, 0);

  const advisoryCapital = approvedInstallments
    .filter(i => advisoryMembers.some(m => m.id === i.memberId))
    .reduce((sum, i) => sum + i.amount, 0);

  // Recent approved installments (last 6)
  const recentApproved = [...approvedInstallments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Receipt No', 'Member ID', 'Member Name', 'Month', 'Year', 'Amount (BDT)', 'Method', 'TrxID', 'Date', 'Status'];
    const rows = activeInstallments.map(i => [
      i.receiptNo || i.id,
      i.memberId,
      `"${i.memberName}"`,
      i.month,
      i.year,
      i.amount,
      `"${i.method}"`,
      `"${i.trxId}"`,
      i.date,
      i.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nexora_Executive_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* ENTERPRISE EXECUTIVE HEADER */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'bn' ? 'সেন্ট্রাল অ্যাডমিনিস্ট্রেটিভ পোর্টাল ও গভর্ন্যান্স' : 'Central Governance & Executive Portal'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.adminTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.adminSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>{t.exportExcel}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition"
            title="Print Summary"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* CORE 4 EXECUTIVE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.totalCapital}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono">
            ৳ {totalCapitalVerified.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{approvedInstallments.length} {lang === 'bn' ? 'অনুমোদিত ডিপোজিট' : 'Approved Deposits'}</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.pendingReq}</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              pendingInstallments.length > 0 ? 'bg-amber-500/20 text-amber-300 animate-pulse' : 'bg-slate-800 text-slate-400'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-400 font-mono">
            {pendingInstallments.length}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400/90 font-mono">
            <span>৳ {totalPendingAmount.toLocaleString()} {lang === 'bn' ? 'যাচাইয়ের অপেক্ষায়' : 'awaiting verification'}</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.totalExpectedMonthly}</span>
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-mono">
            ৳ {monthlySubscriptionTarget.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span>{totalSoldShares}% Equity Total ({activeMembers.length} Members)</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.totalFounders}</span>
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-mono">
            {activeMembers.length}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span>{managementMembers.length} Management • {advisoryMembers.length} Advisory</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PRIMARY APPROVAL QUEUE (অনুমোদন কিউ) */}
      {/* ========================================================================= */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t.approvalQueue}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'bn' 
                  ? 'সদস্যদের জমা দেওয়া কিস্তির পেমেন্ট ও TrxID যাচাই করে অনুমোদন বা প্রত্যাখ্যান করুন' 
                  : 'Review member payment proof and transaction IDs for formal ledger approval'}
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
            pendingInstallments.length > 0
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {pendingInstallments.length} {lang === 'bn' ? 'টি অপেক্ষমাণ' : 'Pending'}
          </span>
        </div>

        {pendingInstallments.length === 0 ? (
          <div className="p-10 text-center bg-slate-950 rounded-2xl border border-slate-800/80 text-slate-400 text-sm space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-90" />
            <p className="font-semibold text-white">{lang === 'bn' ? 'সকল কিস্তি অনুমোদিত এবং হালনাগাদ রয়েছে!' : 'All installments are reviewed and up to date!'}</p>
            <p className="text-xs text-slate-500">{t.noPending}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold bg-slate-950/40">
                  <th className="py-3.5 px-4">{t.member}</th>
                  <th className="py-3.5 px-4">{t.month}</th>
                  <th className="py-3.5 px-4">{t.amount}</th>
                  <th className="py-3.5 px-4">{t.method}</th>
                  <th className="py-3.5 px-4">{t.date}</th>
                  <th className="py-3.5 px-4 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
                {pendingInstallments.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{lang === 'bn' ? (inst.memberNameBn || inst.memberName) : inst.memberName}</div>
                      <div className="text-[11px] text-emerald-400 font-mono">{inst.memberId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {inst.month} {inst.year}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">
                      <div>৳ {inst.amount.toLocaleString()}</div>
                      {inst.lateFee > 0 && (
                        <div className="text-[10px] text-amber-400 font-normal">
                          (Late Fee: ৳{inst.lateFee})
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{inst.method}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{inst.trxId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">
                      {inst.date}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => onApprove(inst.id)}
                        className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition inline-flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.approve}</span>
                      </button>

                      <button
                        onClick={() => {
                          setRejectModalId(inst.id);
                          setRejectReason('');
                        }}
                        className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{t.reject}</span>
                      </button>

                      <button
                        onClick={() => onViewReceipt(inst)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1 border border-slate-700"
                        title="View Submission Details"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{t.viewReceipt}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. RECENT VERIFIED TRANSACTIONS & CAPITAL BREAKDOWN */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT VERIFIED TRANSACTIONS (2 Cols) */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'bn' ? 'সাম্প্রতিক অনুমোদিত কিস্তিসমূহ' : 'Recent Verified Deposits'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'bn' ? 'সর্বশেষ যাচাইকৃত ও সংরক্ষিত মানি রসিদ' : 'Latest verified contributions and receipts'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {approvedInstallments.length} Total Approved
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold bg-slate-950/40">
                  <th className="py-3 px-3">{t.receiptNo}</th>
                  <th className="py-3 px-3">{t.member}</th>
                  <th className="py-3 px-3">{t.month}</th>
                  <th className="py-3 px-3">{t.amount}</th>
                  <th className="py-3 px-3 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentApproved.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      {lang === 'bn' ? 'এখনো কোনো অনুমোদিত ডিপোজিট নেই।' : 'No approved deposits yet.'}
                    </td>
                  </tr>
                ) : (
                  recentApproved.map((inst) => (
                    <tr key={inst.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-3 font-mono text-xs font-bold text-slate-300">
                        {inst.receiptNo || `NXR-${inst.id}`}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        <div>{lang === 'bn' ? (inst.memberNameBn || inst.memberName) : inst.memberName}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">{inst.memberId}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {inst.month} {inst.year}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-400 font-mono">
                        ৳ {inst.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onViewReceipt(inst)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition border border-slate-700 inline-flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{t.viewReceipt}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* EQUITY & CAPITAL DISTRIBUTION BREAKDOWN (1 Col) */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'bn' ? 'ইকুইটি ও মূলধন বিন্যাস' : 'Capital Allocation'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'bn' ? 'পরিষদভিত্তিক অংশীদারিত্ব' : 'Governance Equity Share'}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {/* Management Committee */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{lang === 'bn' ? 'ব্যবস্থাপনা কমিটি (সিলেট)' : 'Management (Domestic)'}</span>
                  <span className="font-mono font-bold text-emerald-400">{managementShares}% Share</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(managementShares / 80) * 100}%` }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{managementMembers.length} Members</span>
                  <span className="font-mono text-white font-semibold">৳ {managementCapital.toLocaleString()}</span>
                </div>
              </div>

              {/* Advisory Council */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{lang === 'bn' ? 'উপদেষ্টা পরিষদ (প্রবাসী)' : 'Advisory (Overseas)'}</span>
                  <span className="font-mono font-bold text-emerald-400">{advisoryShares}% Share</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(advisoryShares / 80) * 100}%` }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{advisoryMembers.length} Members</span>
                  <span className="font-mono text-white font-semibold">৳ {advisoryCapital.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {lang === 'bn' 
                ? 'মোট বরাদ্দকৃত ৮০% প্রতিষ্ঠাতা ইকুইটি অনুমোদিত শরিয়াহ নীতি অনুযায়ী সংকলিত।' 
                : '80% Founder Equity compiled under verified Shariah-compliant bylaws.'}
            </span>
          </div>
        </div>

      </div>

      {/* REJECT WITH REASON MODAL */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 text-rose-400">
                <XCircle className="w-5 h-5" />
                <span>{lang === 'bn' ? 'কিস্তি প্রত্যাখ্যানের কারণ' : 'Reject Installment'}</span>
              </h3>
              <button 
                onClick={() => setRejectModalId(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                {lang === 'bn' ? 'প্রত্যাখ্যানের সুনির্দিষ্ট কারণ উল্লেখ করুন (সদস্যের কাছে প্রদর্শিত হবে):' : 'Specify Reason for Rejection (Visible to Member):'}
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={lang === 'bn' ? 'যেমন: TrxID ভুল অথবা ব্যাংকে টাকা জমা হয়নি...' : 'e.g. Invalid TrxID or mismatched deposit amount...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:border-rose-500 focus:outline-none placeholder-slate-600"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setRejectModalId(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  onReject(rejectModalId, rejectReason);
                  setRejectModalId(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
              >
                <X className="w-4 h-4" />
                <span>{lang === 'bn' ? 'প্রত্যাখ্যান নিশ্চিত করুন' : 'Confirm Rejection'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
