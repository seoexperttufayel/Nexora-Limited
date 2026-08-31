import React, { useState } from 'react';
import { Installment, Language, Role } from '../types';
import { translations } from '../data/translations';
import { 
  FileText, Search, Filter, CheckCircle2, Clock, 
  XCircle, Printer, Download, ArrowUpDown, Calendar,
  Trash2, ShieldAlert, RotateCcw, AlertTriangle, Check, X
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

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Active Installments only (Trash is centralized globally in the header)
  const activeInstallments = installments.filter(inst => !inst.isDeleted);

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
              ? 'ডিজিটাল মানি রসিদ সংরক্ষণ, অডিট ভেরিফিকেশন ও মূলধন স্বচ্ছতা' 
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

      {/* ACTIVE INSTALLMENTS VIEW */}
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
                        {inst.lateFee && inst.lateFee > 0 ? (
                          <span className="block text-[10px] text-amber-400 font-normal">
                            {lang === 'bn' ? `(বিলম্ব ফি: ৳${inst.lateFee})` : `(Fine: ৳${inst.lateFee})`}
                          </span>
                        ) : null}
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
                ? 'আপনি কি নিশ্চিত যে এই কিস্তির রেকর্ডটি ট্র্যাশ বক্সে সরাতে চান? হেডার মেনুর সার্বজনীন ট্র্যাশ বিন থেকে এটি যেকোনো সময় পুনরুদ্ধার (Restore) করা যাবে।' 
                : 'Are you sure you want to move this installment record to Trash? It can be restored anytime from the global Central Trash Bin in the header.'}
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

    </div>
  );
};
