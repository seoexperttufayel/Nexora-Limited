import React, { useState } from 'react';
import { Installment, Language, Role } from '../types';
import { translations } from '../data/translations';
import { 
  FileText, Search, Filter, CheckCircle2, Clock, 
  XCircle, Printer, Download, ArrowUpDown, Calendar,
  Trash2, ShieldAlert, RotateCcw, AlertTriangle, Check, X,
  ShieldCheck, AlertCircle
} from 'lucide-react';

interface Props {
  installments: Installment[];
  lang: Language;
  role: Role;
  currentUser: any;
  onViewReceipt: (inst: Installment) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  onDeleteInstallment?: (id: string) => void;
  onRestoreInstallment?: (id: string) => void;
  onPermanentDeleteInstallment?: (id: string) => void;
  initialTab?: 'active' | 'queue' | 'trash';
}

export const InstallmentsView: React.FC<Props> = ({
  installments,
  lang,
  role,
  currentUser,
  onViewReceipt,
  onApprove,
  onReject,
  onDeleteInstallment,
  onRestoreInstallment,
  onPermanentDeleteInstallment,
  initialTab = 'active'
}) => {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'active' | 'queue' | 'trash'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [purgeConfirmId, setPurgeConfirmId] = useState<string | null>(null);
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Active vs Pending vs Trashed
  const activeInstallments = installments.filter(inst => !inst.isDeleted);
  const pendingInstallments = activeInstallments.filter(inst => inst.status === 'pending');
  const trashedInstallments = installments.filter(inst => inst.isDeleted);

  // Filter active installments
  const filteredActiveInstallments = activeInstallments.filter((inst) => {
    // If member role, only show their own
    if (role === 'member' && currentUser && inst.memberId !== currentUser.id) {
      return false;
    }

    const matchesSearch =
      inst.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inst.memberNameBn && inst.memberNameBn.includes(searchTerm)) ||
      inst.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.trxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.receiptNo?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter !== 'all' && inst.status !== statusFilter) return false;
    if (monthFilter !== 'all' && inst.month !== monthFilter) return false;

    return true;
  });

  // Filter queue installments
  const filteredQueueInstallments = pendingInstallments.filter((inst) => {
    const matchesSearch =
      inst.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inst.memberNameBn && inst.memberNameBn.includes(searchTerm)) ||
      inst.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.trxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.receiptNo?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Filter trashed installments
  const filteredTrashedInstallments = trashedInstallments.filter((inst) => {
    const matchesSearch =
      inst.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inst.memberNameBn && inst.memberNameBn.includes(searchTerm)) ||
      inst.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.trxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.receiptNo?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const totalFilteredAmount = filteredActiveInstallments
    .filter(i => i.status === 'approved')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-3">
            <FileText className="w-4 h-4" />
            <span>{lang === 'bn' ? 'সার্বজনীন কিস্তি ও মূলধন লেজার' : 'Central Installment Ledger'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {role === 'member' 
              ? (lang === 'bn' ? 'আপনার কিস্তির পূর্ণাঙ্গ হিসাব' : 'Your Personal Contribution Ledger')
              : (lang === 'bn' ? 'সকল শেয়ারহোল্ডারদের কিস্তি লেজার ও অনুমোদন কিউ' : 'Master Installments Ledger & Approval Queue')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn' 
              ? 'ডিজিটাল মানি রসিদ সংরক্ষণ, অপেক্ষমাণ কিস্তি অনুমোদন ও ট্র্যাশ ম্যানেজমেন্ট' 
              : 'Verifiable money receipts, queue approval workflow, and ledger auditing system'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              {lang === 'bn' ? 'অনুমোদিত মূলধন মোট' : 'Total Verified Capital'}
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              ৳ {totalFilteredAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ADMIN VIEW SWITCHER (ACTIVE LEDGER VS APPROVAL QUEUE VS TRASH & BIN) */}
      {role === 'admin' && (
        <div className="flex flex-wrap items-center justify-between bg-slate-900 border border-slate-800 p-1.5 rounded-2xl gap-2">
          <div className="flex flex-wrap space-x-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'active'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{lang === 'bn' ? 'সক্রিয় কিস্তি লেজার' : 'Active Installment Ledger'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'active' ? 'bg-slate-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {activeInstallments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'queue'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{lang === 'bn' ? 'কিস্তি অনুমোদন কিউ' : 'Approval Queue'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'queue' 
                  ? 'bg-slate-950 text-amber-300' 
                  : pendingInstallments.length > 0 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' 
                    : 'bg-slate-800 text-slate-400'
              }`}>
                {pendingInstallments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('trash')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'trash'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{lang === 'bn' ? 'রিমুভড / ট্র্যাশ বিন' : 'Trash & Bin'}</span>
              {trashedInstallments.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'trash' ? 'bg-slate-950 text-rose-300' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {trashedInstallments.length}
                </span>
              )}
            </button>
          </div>

          <div className="hidden sm:block text-xs text-slate-400 px-3">
            {activeTab === 'active' && (lang === 'bn' ? 'মোট সক্রিয় এন্ট্রি' : 'Active Records')}
            {activeTab === 'queue' && (lang === 'bn' ? 'অনুমোদনের অপেক্ষায় থাকা কিস্তিসমূহ' : 'Pending Verification')}
            {activeTab === 'trash' && (lang === 'bn' ? 'ট্র্যাশকৃত কিস্তি যেকোনো সময় পুনরুদ্ধারযোগ্য' : 'Deleted records can be restored')}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ACTIVE INSTALLMENTS VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {/* SEARCH AND FILTERS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'bn' ? 'সদস্য নাম, আইডি, TrxID বা রসিদ নং দিয়ে খুঁজুন...' : 'Search by name, ID, TrxID, or receipt no...'}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Month Selector */}
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">{lang === 'bn' ? 'সকল মাস' : 'All Months'}</option>
              <option value="August">August 2026</option>
              <option value="September">September 2026</option>
              <option value="October">October 2026</option>
            </select>

            {/* Status Filter Buttons */}
            <div className="flex space-x-1.5 overflow-x-auto">
              {(['all', 'approved', 'pending', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border capitalize transition ${
                    statusFilter === st
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold bg-slate-950/40">
                    <th className="py-4 px-4">{t.receiptNo}</th>
                    <th className="py-4 px-4">{t.member}</th>
                    <th className="py-4 px-4">{t.month}</th>
                    <th className="py-4 px-4">{t.amount}</th>
                    <th className="py-4 px-4">{t.method}</th>
                    <th className="py-4 px-4">{t.date}</th>
                    <th className="py-4 px-4">{t.status}</th>
                    <th className="py-4 px-4 text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
                  {filteredActiveInstallments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        {lang === 'bn' ? 'কোনো কিস্তি পাওয়া যায়নি।' : 'No matching installment records found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredActiveInstallments.map((inst) => (
                      <tr key={inst.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-300">
                          {inst.receiptNo || `NXR-${inst.id}`}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div>{lang === 'bn' ? (inst.memberNameBn || inst.memberName) : inst.memberName}</div>
                          <div className="text-[11px] text-emerald-400 font-mono">{inst.memberId}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-medium">
                          {inst.month} {inst.year}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">
                          ৳ {inst.amount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          <div>{inst.method}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{inst.trxId}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">
                          {inst.date}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            inst.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : inst.status === 'rejected'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {inst.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                            {inst.status === 'pending' && <Clock className="w-3 h-3" />}
                            {inst.status === 'rejected' && <XCircle className="w-3 h-3" />}
                            <span className="capitalize">{inst.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => onViewReceipt(inst)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition border border-slate-700 inline-flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{t.viewReceipt}</span>
                          </button>

                          {role === 'admin' && onDeleteInstallment && (
                            <button
                              onClick={() => setDeleteConfirmId(inst.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition inline-flex items-center gap-1"
                              title="Move to Trash"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. APPROVAL QUEUE SUB-TAB (অনুমোদন কিউ) */}
      {/* ========================================================================= */}
      {activeTab === 'queue' && role === 'admin' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-md">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {lang === 'bn' ? 'কিস্তি অনুমোদন কিউ ও TrxID ভেরিফিকেশন' : 'Installment Verification & Approval Queue'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'bn' 
                    ? 'সদস্যদের জমা দেওয়া কিস্তির পেমেন্ট ও TrxID যাচাই করে অনুমোদন বা প্রত্যাখ্যান করুন' 
                    : 'Review member payment proof and transaction IDs for formal ledger approval'}
                </p>
              </div>
            </div>

            <span className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono self-start sm:self-center ${
              pendingInstallments.length > 0
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {pendingInstallments.length} {lang === 'bn' ? 'টি অপেক্ষমাণ' : 'Pending Verification'}
            </span>
          </div>

          {pendingInstallments.length === 0 ? (
            <div className="text-center py-16 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-80" />
              <p className="text-sm font-bold text-slate-200">
                {lang === 'bn' ? 'কোনো অপেক্ষমাণ কিস্তি নেই!' : 'No Pending Submissions!'}
              </p>
              <p className="text-xs text-slate-400">
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
                  {filteredQueueInstallments.map((inst) => (
                    <tr key={inst.id} className="hover:bg-slate-850/60 transition">
                      <td className="p-4 font-mono font-bold text-amber-400">
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
                        <p className="text-slate-200 font-semibold">{inst.method}</p>
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
                            <FileText className="w-4 h-4 text-slate-200" />
                          </button>
                          {onApprove && (
                            <button
                              onClick={() => onApprove(inst.id)}
                              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center space-x-1 shadow-md shadow-emerald-500/20"
                            >
                              <Check className="w-4 h-4" />
                              <span>{t.approve}</span>
                            </button>
                          )}
                          {onReject && (
                            <button
                              onClick={() => setRejectModalId(inst.id)}
                              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold transition flex items-center space-x-1"
                            >
                              <X className="w-4 h-4" />
                              <span>{t.reject}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TRASH & BIN VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'trash' && role === 'admin' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {lang === 'bn' ? 'রিমুভড কিস্তি আর্কাইভ ও রিস্টোরেশন' : 'Removed Installments Archive & Restoration'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'bn' 
                    ? 'এখানে রাখা যেকোনো কিস্তির হিসাব এক ক্লিকে সক্রিয় লেজারে ফিরিয়ে নেওয়া যাবে।' 
                    : 'Any entry here can be restored to the active ledger with all receipt data intact.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold bg-slate-950/40">
                    <th className="py-4 px-4">{t.receiptNo}</th>
                    <th className="py-4 px-4">{t.member}</th>
                    <th className="py-4 px-4">{t.month}</th>
                    <th className="py-4 px-4">{t.amount}</th>
                    <th className="py-4 px-4">{t.method}</th>
                    <th className="py-4 px-4">Deleted At / By</th>
                    <th className="py-4 px-4 text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
                  {filteredTrashedInstallments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                        <p>{lang === 'bn' ? 'ট্র্যাশ বিন সম্পূর্ণ খালি।' : 'Trash bin is currently empty.'}</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTrashedInstallments.map((inst) => (
                      <tr key={inst.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-400">
                          {inst.receiptNo || `NXR-${inst.id}`}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div>{lang === 'bn' ? (inst.memberNameBn || inst.memberName) : inst.memberName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{inst.memberId}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-medium">
                          {inst.month} {inst.year}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">
                          ৳ {inst.amount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          <div>{inst.method}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{inst.trxId}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400 font-mono">
                          <div>{inst.deletedAt ? new Date(inst.deletedAt).toLocaleDateString() : 'N/A'}</div>
                          <div className="text-rose-400 text-[10px]">{inst.deletedBy || 'Admin'}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                          {onRestoreInstallment && (
                            <button
                              onClick={() => onRestoreInstallment(inst.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition border border-emerald-500/30 inline-flex items-center gap-1"
                              title="Restore to Active Ledger"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>{lang === 'bn' ? 'পুনরুদ্ধার' : 'Restore'}</span>
                            </button>
                          )}

                          {onPermanentDeleteInstallment && (
                            <button
                              onClick={() => setPurgeConfirmId(inst.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition inline-flex items-center gap-1 shadow-sm"
                              title="Permanent Purge"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{lang === 'bn' ? 'স্থায়ী মুছুন' : 'Purge'}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
                  if (onReject) {
                    onReject(rejectModalId, rejectReason);
                  }
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

      {/* DELETE TO TRASH CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Close"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 text-rose-400 pr-6">
              <ShieldAlert className="w-5 h-5" />
              <span>{lang === 'bn' ? 'কিস্তি ট্র্যাশে পাঠান' : 'Move Installment to Trash'}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'bn' 
                ? 'আপনি কি নিশ্চিত যে এই কিস্তির রেকর্ডটি ট্র্যাশ বক্সে সরাতে চান? প্রয়োজনে রিমুভড / ট্র্যাশ সেকশন থেকে এটি যেকোনো সময় পুনরুদ্ধার (Restore) করা যাবে।' 
                : 'Are you sure you want to move this installment record to Trash? It can be restored anytime from the Trash & Bin section.'}
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (onDeleteInstallment && deleteConfirmId) {
                    onDeleteInstallment(deleteConfirmId);
                  }
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ট্র্যাশে সরান' : 'Move to Trash'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERMANENT PURGE CONFIRMATION MODAL */}
      {purgeConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setPurgeConfirmId(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Close"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 text-rose-500 pr-6">
              <AlertTriangle className="w-5 h-5" />
              <span>{lang === 'bn' ? 'স্থায়ীভাবে মুছে ফেলার সতর্কতা' : 'Permanent Purge Warning'}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'bn' 
                ? 'সতর্কতা: এই কিস্তির রেকর্ডটি স্থায়ীভাবে ডাটাবেজ থেকে মুছে যাবে এবং এটি আর পুনরুদ্ধার করা সম্ভব হবে না। আপনি কি এগিয়ে যেতে চান?' 
                : 'Warning: This installment record will be permanently purged from the system and cannot be restored. Proceed?'}
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setPurgeConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (onPermanentDeleteInstallment && purgeConfirmId) {
                    onPermanentDeleteInstallment(purgeConfirmId);
                  }
                  setPurgeConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'স্থায়ীভাবে মুছুন' : 'Permanent Purge'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
