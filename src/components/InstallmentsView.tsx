import React, { useState } from 'react';
import { Installment, Language, Role } from '../types';
import { translations } from '../data/translations';
import { 
  FileText, Search, Filter, CheckCircle2, Clock, 
  XCircle, Printer, Download, ArrowUpDown, Calendar,
  Trash2, ShieldAlert, RotateCcw, AlertTriangle, Check
} from 'lucide-react';

interface Props {
  installments: Installment[];
  lang: Language;
  role: Role;
  currentUser: any;
  onViewReceipt: (inst: Installment) => void;
  onDeleteInstallment?: (id: string) => void;
  onRestoreInstallment?: (id: string) => void;
  onPermanentDeleteInstallment?: (id: string) => void;
}

export const InstallmentsView: React.FC<Props> = ({
  installments,
  lang,
  role,
  currentUser,
  onViewReceipt,
  onDeleteInstallment,
  onRestoreInstallment,
  onPermanentDeleteInstallment
}) => {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [purgeConfirmId, setPurgeConfirmId] = useState<string | null>(null);

  // Active vs Trashed
  const activeInstallments = installments.filter(inst => !inst.isDeleted);
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
              : (lang === 'bn' ? 'সকল শেয়ারহোল্ডারদের কিস্তি লেজার ও অডিট' : 'Master Installments Ledger & Audit')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn' 
              ? 'ডিজিটাল মানি রসিদ সংরক্ষণ, অডিট ভেরিফিকেশন ও ট্র্যাশ ম্যানেজমেন্ট' 
              : 'Verifiable money receipts, transaction archives, and auditing system'}
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

      {/* ADMIN VIEW SWITCHER (ACTIVE LEDGER VS TRASH & BIN) */}
      {role === 'admin' && (
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <div className="flex space-x-1">
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
            {activeTab === 'active' 
              ? (lang === 'bn' ? 'মোট সক্রিয় এন্ট্রি' : 'Active Records') 
              : (lang === 'bn' ? 'ট্র্যাশকৃত কিস্তি যেকোনো সময় পুনরুদ্ধারযোগ্য' : 'Deleted records can be restored')}
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
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
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
      {/* 2. TRASH & BIN VIEW */}
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

      {/* DELETE TO TRASH CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 text-rose-400">
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
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 text-rose-500">
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
