import React, { useState } from 'react';
import { Member, Installment, Language, LedgerTransaction, PaymentAccountConfig } from '../types';
import { translations } from '../data/translations';
import { AdminPaymentAccountsModal } from './AdminPaymentAccountsModal';
import { 
  ShieldCheck, Wallet, Users, Clock, CheckCircle2, 
  XCircle, Printer, FileText, Check, X,
  FileSpreadsheet, TrendingUp, Building2,
  Calendar, CreditCard, Landmark, ArrowUpRight, ArrowDownLeft,
  ChevronRight, Sparkles, AlertCircle, Info, Layers
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
  onUpdatePaymentAccount?: (acc: PaymentAccountConfig) => void;
  onAddPaymentAccount?: (acc: PaymentAccountConfig) => void;
  onDeletePaymentAccount?: (id: string) => void;
  onResetPaymentAccounts?: () => void;
  onNavigateToLedger?: () => void;
  onNavigateToInstallmentsQueue?: () => void;
  onNavigateToGovernance?: () => void;
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
  onUpdatePaymentAccount,
  onAddPaymentAccount,
  onDeletePaymentAccount,
  onResetPaymentAccounts,
  onNavigateToLedger,
  onNavigateToInstallmentsQueue,
  onNavigateToGovernance
}) => {
  const t = translations[lang];
  const [showPaymentAccountsModal, setShowPaymentAccountsModal] = useState(false);

  // Interactive Stat Card Modals
  const [showCapitalModal, setShowCapitalModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showEquityModal, setShowEquityModal] = useState(false);

  // Quick reject state
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

      {/* CORE 4 EXECUTIVE METRIC CARDS (WITH INTERACTIVE CLICKABLE ICONS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. Total Capital Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.totalCapital}</span>
            <button
              onClick={() => setShowCapitalModal(true)}
              className="w-8 h-8 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/25 flex items-center justify-center text-emerald-400 transition cursor-pointer border border-emerald-500/20 active:scale-95"
              title={lang === 'bn' ? 'মূলধন ও ট্রেজারি বিস্তারিত দেখুন' : 'View Capital & Treasury Breakdown'}
            >
              <Wallet className="w-4 h-4" />
            </button>
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

        {/* 2. Pending Requests Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.pendingReq}</span>
            <button
              onClick={() => setShowPendingModal(true)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer active:scale-95 ${
                pendingInstallments.length > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse hover:bg-amber-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              title={lang === 'bn' ? 'অপেক্ষমাণ কিস্তির তালিকা ও অনুমোদন' : 'View Pending Queue & Approvals'}
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>
          <p className="text-3xl font-black text-amber-400 font-mono">
            {pendingInstallments.length}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400/90 font-mono">
            <span>৳ {totalPendingAmount.toLocaleString()} {lang === 'bn' ? 'যাচাইয়ের অপেক্ষায়' : 'awaiting verification'}</span>
          </div>
        </div>

        {/* 3. Monthly Expected Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.totalExpectedMonthly}</span>
            <button
              onClick={() => setShowTargetModal(true)}
              className="w-8 h-8 rounded-xl bg-blue-500/10 hover:bg-blue-500/25 flex items-center justify-center text-blue-400 transition cursor-pointer border border-blue-500/20 active:scale-95"
              title={lang === 'bn' ? 'মাসিক ফান্ড লক্ষ্যমাত্রা ও অগ্রগতি' : 'View Monthly Target & Breakdown'}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
          <p className="text-3xl font-black text-white font-mono">
            ৳ {monthlySubscriptionTarget.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 font-mono">
            <span>{totalSoldShares}% {lang === 'bn' ? 'বিক্রীত ইকুইটি' : 'Sold Equity'}</span>
          </div>
        </div>

        {/* 4. Total Founders / Shareholders Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.totalFounders}</span>
            <button
              onClick={() => setShowEquityModal(true)}
              className="w-8 h-8 rounded-xl bg-purple-500/10 hover:bg-purple-500/25 flex items-center justify-center text-purple-400 transition cursor-pointer border border-purple-500/20 active:scale-95"
              title={lang === 'bn' ? 'প্রতিষ্ঠাতা ও শেয়ারহোল্ডারদের ইকুইটি' : 'View Founders & Equity Distribution'}
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
          <p className="text-3xl font-black text-white font-mono">
            {activeMembers.length}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
            <span>13 {lang === 'bn' ? 'জন নিবন্ধিত উদ্যোক্তা' : 'Founders Registered'}</span>
          </div>
        </div>
      </div>

      {/* PENDING APPROVAL QUEUE QUICK BANNER */}
      {pendingInstallments.length > 0 && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {lang === 'bn' ? `${pendingInstallments.length} টি নতুন কিস্তি অনুমোদনের অপেক্ষায় রয়েছে` : `${pendingInstallments.length} Pending Installment Verifications`}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {lang === 'bn' 
                  ? `মোট ৳ ${totalPendingAmount.toLocaleString()} টাকার কিস্তি ও TrxID যাচাইয়ের জন্য কিউতে রয়েছে।` 
                  : `Total ৳ ${totalPendingAmount.toLocaleString()} awaiting verification in Installments Approval Queue.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowPendingModal(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl transition"
            >
              {lang === 'bn' ? 'দ্রুত পর্যালোচনা' : 'Quick Review'}
            </button>
            {onNavigateToInstallmentsQueue && (
              <button
                onClick={onNavigateToInstallmentsQueue}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
              >
                <span>{lang === 'bn' ? 'অনুমোদন কিউতে যান' : 'Go to Approval Queue'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CAPITAL & TREASURY MODAL (Triggered by Wallet icon) */}
      {/* ========================================================================= */}
      {showCapitalModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4"
          onClick={() => setShowCapitalModal(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'bn' ? 'মূলধন ও ট্রেজারি অডিট বিশ্লেষণ' : 'Capital & Treasury Breakdown'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'অনুমোদিত কিস্তি, লেজার ক্রেডিট/ডেবিট ও মোট রিজার্ভ' : 'Verified installments, corporate ledger, and active reserve'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowCapitalModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">{lang === 'bn' ? 'অনুমোদিত কিস্তি মোট' : 'Approved Deposits'}</span>
                <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">
                  ৳ {approvedInstallments.reduce((s, i) => s + i.amount, 0).toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">{lang === 'bn' ? 'লেজার মোট ব্যয়' : 'Ledger Debits'}</span>
                <span className="text-xl font-bold text-rose-400 font-mono mt-1 block">
                  ৳ {totalLedgerDebits.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 bg-emerald-950/10">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold block">{lang === 'bn' ? 'ট্রেজারি নেট ব্যালেন্স' : 'Net Treasury Reserve'}</span>
                <span className="text-xl font-bold text-emerald-300 font-mono mt-1 block">
                  ৳ {totalCapitalVerified.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {lang === 'bn' ? 'কমিটি অনুযায়ী মূলধন অংশ' : 'Committee Contributions'}
              </h4>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">{lang === 'bn' ? 'ব্যবস্থাপনা পরিষদ (সিলেট)' : 'Management (Domestic)'}</span>
                  <span className="text-slate-400 text-[11px]">{managementMembers.length} Members • {managementShares}% Equity</span>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">৳ {managementCapital.toLocaleString()}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">{lang === 'bn' ? 'উপদেষ্টা পরিষদ (প্রবাসী)' : 'Advisory (Overseas)'}</span>
                  <span className="text-slate-400 text-[11px]">{advisoryMembers.length} Members • {advisoryShares}% Equity</span>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">৳ {advisoryCapital.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-800">
              {onNavigateToLedger && (
                <button
                  onClick={() => {
                    setShowCapitalModal(false);
                    onNavigateToLedger();
                  }}
                  className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Landmark className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'সম্পূর্ণ আর্থিক লেজারে যান' : 'Go to Financial Ledger'}</span>
                </button>
              )}
              <button
                onClick={() => setShowCapitalModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl ml-auto"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PENDING REQUESTS MODAL (Triggered by Clock icon) */}
      {/* ========================================================================= */}
      {showPendingModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4"
          onClick={() => setShowPendingModal(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'bn' ? 'অপেক্ষমাণ কিস্তি যাচাই ও দ্রুত পর্যালোচনা' : 'Pending Installment Approvals'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? `মোট ${pendingInstallments.length} টি কিস্তি ভেরিফিকেশনের জন্য অপেক্ষমাণ` : `${pendingInstallments.length} installment submissions pending review`}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowPendingModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pendingInstallments.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
                <p className="text-sm font-bold text-slate-200">{lang === 'bn' ? 'কোনো অপেক্ষমাণ কিস্তি নেই!' : 'No Pending Submissions!'}</p>
                <p className="text-xs text-slate-400">{lang === 'bn' ? 'সব কিস্তি যাচাই ও অনুমোদন সম্পন্ন হয়েছে।' : 'All pending installment submissions have been verified.'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingInstallments.map((inst) => (
                  <div
                    key={inst.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 hover:border-amber-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-400 font-bold">{inst.receiptNo || inst.id}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-white font-bold">{lang === 'bn' ? (inst.memberNameBn || inst.memberName) : inst.memberName}</span>
                        <span className="text-slate-400 font-mono text-[11px]">({inst.memberId})</span>
                      </div>
                      <p className="text-slate-300">
                        {inst.month} {inst.year} • <strong className="text-emerald-400 font-mono">৳ {inst.amount.toLocaleString()}</strong> via {inst.method}
                        <span className="font-mono text-amber-300 ml-2 font-bold">(TrxID: {inst.trxId})</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setShowPendingModal(false);
                          onViewReceipt(inst);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="View Receipt Voucher"
                      >
                        <FileText className="w-4 h-4 text-emerald-400" />
                      </button>
                      <button
                        onClick={() => onApprove(inst.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1 shadow-md shadow-emerald-500/20"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.approve}</span>
                      </button>
                      <button
                        onClick={() => setRejectModalId(inst.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{t.reject}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-between items-center border-t border-slate-800">
              {onNavigateToInstallmentsQueue && (
                <button
                  onClick={() => {
                    setShowPendingModal(false);
                    onNavigateToInstallmentsQueue();
                  }}
                  className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'অনুমোদন কিউ পেজে যান' : 'Go to Full Queue Tab'}</span>
                </button>
              )}
              <button
                onClick={() => setShowPendingModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl ml-auto"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MONTHLY TARGET BREAKDOWN MODAL (Triggered by Calendar icon) */}
      {/* ========================================================================= */}
      {showTargetModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4"
          onClick={() => setShowTargetModal(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'bn' ? 'মাসিক চাঁদা ও তহবিল লক্ষ্যমাত্রা' : 'Monthly Target & Collection Metrics'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? '৮০% শেয়ার ইকুইটি ভিত্তিক প্রতি মাসের নির্ধারিত ফান্ড হিসাব' : 'Expected monthly fund collection for 80% issued equity'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowTargetModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/20 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">{lang === 'bn' ? 'প্রতি শেয়ার মাসিক কিস্তি:' : 'Rate per Share (Monthly):'}</span>
                <span className="text-blue-400 font-mono font-bold text-sm">৳ 1,000 / Share</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">{lang === 'bn' ? 'মোট বরাদ্দকৃত ইকুইটি শেয়ার:' : 'Total Issued Equity Shares:'}</span>
                <span className="text-white font-mono font-bold text-sm">{totalSoldShares} Shares (80%)</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-white">{lang === 'bn' ? 'মাসিক প্রত্যাশিত সর্বমোট ফান্ড:' : 'Expected Monthly Target:'}</span>
                <span className="text-2xl font-black text-blue-400 font-mono">৳ {monthlySubscriptionTarget.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {lang === 'bn' ? '১৩ জন উদ্যোক্তার মাসিক চাঁদা তালিকা' : '13 Shareholders Monthly Quota'}
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {activeMembers.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-emerald-400 font-bold">{m.id}</span>
                      <span className="text-white font-semibold">{lang === 'bn' ? m.nameBn : m.name}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-slate-300 font-bold">{m.share}% Share</span>
                      <span className="text-blue-400 ml-2 font-bold">৳ {(m.share * 1000).toLocaleString()}/mo</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-800">
              <button
                onClick={() => setShowTargetModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SHAREHOLDERS & EQUITY OVERVIEW MODAL (Triggered by Users icon) */}
      {/* ========================================================================= */}
      {showEquityModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4"
          onClick={() => setShowEquityModal(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'bn' ? '১৩ জন প্রতিষ্ঠাতা শেয়ারহোল্ডার ও ইকুইটি প্রোফাইল' : '13 Founding Shareholders & Equity Cap Table'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'ব্যবস্থাপনা ও উপদেষ্টা পরিষদের পূর্ণাঙ্গ গঠনকাঠামো' : 'Full governance structure and equity allocation'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowEquityModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400">{lang === 'bn' ? 'ব্যবস্থাপনা পরিষদ (সিলেট)' : 'Management (Domestic)'}</span>
                <p className="text-2xl font-black text-white font-mono">{managementShares}% Equity</p>
                <p className="text-xs text-slate-400">{managementMembers.length} Founders Registered</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-purple-400">{lang === 'bn' ? 'উপদেষ্টা পরিষদ (প্রবাসী)' : 'Advisory (Overseas)'}</span>
                <p className="text-2xl font-black text-white font-mono">{advisoryShares}% Equity</p>
                <p className="text-xs text-slate-400">{advisoryMembers.length} Founders Registered</p>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {activeMembers.map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-emerald-400 text-xs">
                      {m.id.replace('NXR-', '')}
                    </div>
                    <div>
                      <h5 className="font-bold text-white">{lang === 'bn' ? m.nameBn : m.name}</h5>
                      <p className="text-[11px] text-slate-400">{lang === 'bn' ? m.designationBn : m.designationEn} • {m.phone}</p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20">
                      {m.share}% Share
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-800">
              {onNavigateToGovernance && (
                <button
                  onClick={() => {
                    setShowEquityModal(false);
                    onNavigateToGovernance();
                  }}
                  className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'গভর্ন্যান্স ও পরিষদ পাতায় যান' : 'Go to Governance View'}</span>
                </button>
              )}
              <button
                onClick={() => setShowEquityModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl ml-auto"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

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
