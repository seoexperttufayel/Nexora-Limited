import React, { useState } from 'react';
import { Member, Installment, Language, LedgerTransaction, PaymentAccountConfig, AdminProfile } from '../types';
import { translations } from '../data/translations';
import { AdminPaymentAccountsModal } from './AdminPaymentAccountsModal';
import { 
  ShieldCheck, Wallet, Users, Clock, CheckCircle2, 
  XCircle, Printer, FileText, Check, X,
  FileSpreadsheet, TrendingUp, Building2,
  Calendar, CreditCard, Landmark, ArrowUpRight, ArrowDownLeft, UserCheck, UserCog
} from 'lucide-react';

interface Props {
  members: Member[];
  installments: Installment[];
  lang: Language;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
  onViewReceipt: (inst: Installment) => void;
  ledgerTransactions?: LedgerTransaction[];
  onAddLedgerTransaction?: (txn: LedgerTransaction) => void;
  onDeleteLedgerTransaction?: (id: string) => void;
  paymentAccounts?: PaymentAccountConfig[];
  adminProfile?: AdminProfile;
  onOpenAdminProfile?: () => void;
  onUpdatePaymentAccount?: (acc: PaymentAccountConfig) => void;
  onAddPaymentAccount?: (acc: PaymentAccountConfig) => void;
  onDeletePaymentAccount?: (id: string) => void;
  onResetPaymentAccounts?: () => void;
  onNavigateToLedger?: () => void;
}

export const AdminDashboard: React.FC<Props> = ({
  members,
  installments,
  lang,
  onApprove,
  onReject,
  onViewReceipt,
  ledgerTransactions = [],
  paymentAccounts = [],
  adminProfile,
  onOpenAdminProfile,
  onUpdatePaymentAccount,
  onAddPaymentAccount,
  onDeletePaymentAccount,
  onResetPaymentAccounts,
  onNavigateToLedger
}) => {
  const t = translations[lang];
  const [showPaymentAccountsModal, setShowPaymentAccountsModal] = useState(false);

  // Modals & Confirmation states
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Active members & installments
  const activeMembers = members.filter(m => !m.isDeleted);
  const activeInstallments = installments.filter(i => !i.isDeleted);

  const pendingInstallments = activeInstallments.filter(i => i.status === 'pending');
  const approvedInstallments = activeInstallments.filter(i => i.status === 'approved');

  // Ledger Calculations for Net Capital Synchronization
  const activeLedger = ledgerTransactions.filter(t => !t.isDeleted);
  const totalLedgerCredits = activeLedger
    .filter(t => t.type === 'credit')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalLedgerDebits = activeLedger
    .filter(t => t.type === 'debit')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalCapitalVerified = totalLedgerCredits > 0 
    ? (totalLedgerCredits - totalLedgerDebits)
    : approvedInstallments.reduce((sum, i) => sum + i.amount, 0);

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

        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          {onOpenAdminProfile && (
            <button
              onClick={onOpenAdminProfile}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-semibold transition shadow-md shadow-emerald-500/10"
              title="Manage Admin Profile & Credentials"
            >
              <UserCog className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? 'অ্যাডমিন প্রোফাইল' : 'Admin Profile'}</span>
            </button>
          )}

          {onNavigateToLedger && (
            <button
              onClick={onNavigateToLedger}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs sm:text-sm font-semibold transition"
            >
              <Landmark className="w-4 h-4" />
              <span>{lang === 'bn' ? 'করপোরেট আর্থিক লেজার' : 'Corporate Ledger'}</span>
            </button>
          )}

          <button
            onClick={() => setShowPaymentAccountsModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition"
            title="Manage Payment Gateways"
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>{lang === 'bn' ? 'পেমেন্ট চ্যানেল সেটিংস' : 'Payment Accounts'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>{t.exportExcel}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition"
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
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? 'কার্যকর ট্রেজারি ব্যালেন্স' : 'Net Active Reserve'}</span>
            </div>
            {totalLedgerDebits > 0 && (
              <span className="text-[11px] text-rose-400 font-mono">-৳{totalLedgerDebits.toLocaleString()} {lang === 'bn' ? 'ব্যয়' : 'exp'}</span>
            )}
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

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.totalExpectedMonthly}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-mono">
            ৳ {monthlySubscriptionTarget.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 font-mono">
            <span>{totalSoldShares}% {lang === 'bn' ? 'বিক্রীত ইকুইটি' : 'Sold Equity'}</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.totalFounders}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-mono">
            {activeMembers.length}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
            <span>13 {lang === 'bn' ? 'জন নিবন্ধিত উদ্যোক্তা' : 'Founders Registered'}</span>
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
              <div className="text-center py-12 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
                <p className="text-sm font-semibold text-slate-300">{t.noPending}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'bn' ? 'সব কিস্তি যাচাই ও অনুমোদন সম্পন্ন হয়েছে।' : 'All pending installment submissions have been processed.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">{t.receiptNo}</th>
                      <th className="p-4">{t.member}</th>
                      <th className="p-4">{t.monthYear}</th>
                      <th className="p-4">{t.amount}</th>
                      <th className="p-4">{t.paymentMethod} / TrxID</th>
                      <th className="p-4">{t.date}</th>
                      <th className="p-4 text-right">{t.action}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {pendingInstallments.map((inst) => (
                      <tr key={inst.id} className="hover:bg-slate-850/60 transition">
                        <td className="p-4 font-mono font-bold text-emerald-400">
                          {inst.receiptNo || inst.id}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-white">
                            {lang === 'bn' ? (inst.memberNameBn || inst.memberName) : inst.memberName}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{inst.memberId}</p>
                        </td>
                        <td className="p-4 font-medium">
                          {inst.month} {inst.year}
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-bold text-white font-mono">৳ {inst.amount.toLocaleString()}</span>
                          {inst.lateFee > 0 && (
                            <span className="block text-[10px] text-amber-400 font-mono">
                              (Late: +৳{inst.lateFee})
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="text-slate-200">{inst.method}</p>
                          <p className="font-mono text-emerald-400 font-bold text-[11px]">{inst.trxId}</p>
                        </td>
                        <td className="p-4 text-slate-400 font-mono">
                          {inst.date}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => onViewReceipt(inst)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                              title={t.viewReceipt}
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onApprove(inst.id)}
                              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center space-x-1 shadow-md shadow-emerald-500/20"
                            >
                              <Check className="w-4 h-4" />
                              <span>{t.approve}</span>
                            </button>
                            <button
                              onClick={() => setRejectModalId(inst.id)}
                              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold transition flex items-center space-x-1"
                            >
                              <X className="w-4 h-4" />
                              <span>{t.reject}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 2. RECENT APPROVED LEDGER & GOVERNANCE SUMMARY */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent 6 Verified Deposits */}
            <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {lang === 'bn' ? 'সাম্প্রতিক অনুমোদিত কিস্তিসমূহ' : 'Recent Verified Deposits'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {lang === 'bn' ? 'সরাসরি ডিজিটাল রসিদ ও ভাউচার দেখুন' : 'Latest verified installment money receipts'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  {approvedInstallments.length} Verified
                </span>
              </div>

              <div className="space-y-3">
                {recentApproved.map((inst) => (
                  <div
                    key={inst.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono text-xs">
                        {inst.memberId.replace('NXR-', '')}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs sm:text-sm font-bold text-white">
                            {lang === 'bn' ? (inst.memberNameBn || inst.memberName) : inst.memberName}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">({inst.memberId})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {inst.month} {inst.year} • {inst.method} • <span className="font-mono text-slate-300">{inst.date}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                          ৳ {inst.amount.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-emerald-500 font-semibold">
                          Verified
                        </span>
                      </div>

                      <button
                        onClick={() => onViewReceipt(inst)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
                        title={t.viewReceipt}
                      >
                        <FileText className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Committee Structure & Equity Ratio */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'bn' ? 'কমিটি ইকুইটি ও মূলধন অনুপাত' : 'Committee Equity Breakdown'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'bn' ? 'ব্যবস্থাপনা ও উপদেষ্টা পরিষদের ক্যাপিটাল শেয়ার' : 'Management vs Advisory Council Distribution'}
                </p>
              </div>

              <div className="space-y-4">
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

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
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

      {/* PAYMENT ACCOUNTS CONFIGURATION MODAL */}
      <AdminPaymentAccountsModal
        isOpen={showPaymentAccountsModal}
        lang={lang}
        paymentAccounts={paymentAccounts}
        onClose={() => setShowPaymentAccountsModal(false)}
        onUpdateAccount={onUpdatePaymentAccount || (() => {})}
        onAddAccount={onAddPaymentAccount || (() => {})}
        onDeleteAccount={onDeletePaymentAccount || (() => {})}
        onResetDefaults={onResetPaymentAccounts}
      />

    </div>
  );
};
