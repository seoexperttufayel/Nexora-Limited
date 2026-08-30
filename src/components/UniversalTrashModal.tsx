import React, { useState } from 'react';
import { Installment, Member, LedgerTransaction, Notice, Project, Language } from '../types';
import { 
  Trash2, RotateCcw, AlertTriangle, X, Check, 
  FileText, Users, Landmark, AlertCircle, ShieldAlert, Sparkles,
  Bell, Building2
} from 'lucide-react';

interface UniversalTrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  installments: Installment[];
  members: Member[];
  ledgerTransactions: LedgerTransaction[];
  notices?: Notice[];
  projects?: Project[];
  onRestoreInstallment?: (id: string) => void;
  onPermanentDeleteInstallment?: (id: string) => void;
  onRestoreMember?: (id: string) => void;
  onPermanentDeleteMember?: (id: string) => void;
  onRestoreLedgerTransaction?: (id: string) => void;
  onPermanentDeleteLedgerTransaction?: (id: string) => void;
  onRestoreNotice?: (id: string) => void;
  onPermanentDeleteNotice?: (id: string) => void;
  onRestoreProject?: (id: string) => void;
  onPermanentDeleteProject?: (id: string) => void;
  onPurgeAllTrash?: () => void;
}

export const UniversalTrashModal: React.FC<UniversalTrashModalProps> = ({
  isOpen,
  onClose,
  lang,
  installments,
  members,
  ledgerTransactions,
  notices = [],
  projects = [],
  onRestoreInstallment,
  onPermanentDeleteInstallment,
  onRestoreMember,
  onPermanentDeleteMember,
  onRestoreLedgerTransaction,
  onPermanentDeleteLedgerTransaction,
  onRestoreNotice,
  onPermanentDeleteNotice,
  onRestoreProject,
  onPermanentDeleteProject,
  onPurgeAllTrash
}) => {
  const [filterType, setFilterType] = useState<'all' | 'installments' | 'members' | 'ledger' | 'notices' | 'projects'>('all');
  const [showPurgeAllConfirm, setShowPurgeAllConfirm] = useState(false);
  const [singlePurgeTarget, setSinglePurgeTarget] = useState<{ id: string; type: 'installment' | 'member' | 'ledger' | 'notice' | 'project'; name: string } | null>(null);

  if (!isOpen) return null;

  const trashedInstallments = installments.filter(i => i.isDeleted);
  const trashedMembers = members.filter(m => m.isDeleted);
  const trashedLedger = ledgerTransactions.filter(t => t.isDeleted);
  const trashedNotices = notices.filter(n => n.isDeleted);
  const trashedProjects = projects.filter(p => p.isDeleted);

  const totalTrashedCount = 
    trashedInstallments.length + 
    trashedMembers.length + 
    trashedLedger.length + 
    trashedNotices.length + 
    trashedProjects.length;

  const handleConfirmPurgeAll = () => {
    if (onPurgeAllTrash) {
      onPurgeAllTrash();
    }
    setShowPurgeAllConfirm(false);
  };

  const handleConfirmSinglePurge = () => {
    if (!singlePurgeTarget) return;
    if (singlePurgeTarget.type === 'installment' && onPermanentDeleteInstallment) {
      onPermanentDeleteInstallment(singlePurgeTarget.id);
    } else if (singlePurgeTarget.type === 'member' && onPermanentDeleteMember) {
      onPermanentDeleteMember(singlePurgeTarget.id);
    } else if (singlePurgeTarget.type === 'ledger' && onPermanentDeleteLedgerTransaction) {
      onPermanentDeleteLedgerTransaction(singlePurgeTarget.id);
    } else if (singlePurgeTarget.type === 'notice' && onPermanentDeleteNotice) {
      onPermanentDeleteNotice(singlePurgeTarget.id);
    } else if (singlePurgeTarget.type === 'project' && onPermanentDeleteProject) {
      onPermanentDeleteProject(singlePurgeTarget.id);
    }
    setSinglePurgeTarget(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl relative text-slate-100 space-y-5 max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 shadow-md">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  {lang === 'bn' ? 'সেন্ট্রাল ট্র্যাশ ও অডিট বিন' : 'Central Trash & Audit Bin'}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/30">
                  {totalTrashedCount} {lang === 'bn' ? 'টি আইটেম' : 'Items'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                {lang === 'bn' 
                  ? 'মুছে ফেলা কিস্তি, বিজ্ঞপ্তি, সদস্য ও রেকর্ড এক ক্লিকে পুনরুদ্ধার অথবা স্থায়ী নিষ্কাশন' 
                  : 'Central repository to restore or permanently purge trashed records & notices'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {totalTrashedCount > 0 && onPurgeAllTrash && (
              <button
                onClick={() => setShowPurgeAllConfirm(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
                title="Empty Entire Trash Bin"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ট্র্যাশ খালি করুন' : 'Clear All Trash'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
              title="Close / বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 shrink-0 border-b border-slate-800/80">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
              filterType === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'সকল' : 'All'} ({totalTrashedCount})
          </button>

          <button
            onClick={() => setFilterType('notices')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
              filterType === 'notices'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'বিজ্ঞপ্তি' : 'Notices'}</span>
            <span className="font-mono text-[11px]">({trashedNotices.length})</span>
          </button>

          <button
            onClick={() => setFilterType('installments')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
              filterType === 'installments'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'কিস্তি' : 'Installments'}</span>
            <span className="font-mono text-[11px]">({trashedInstallments.length})</span>
          </button>

          <button
            onClick={() => setFilterType('members')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
              filterType === 'members'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সদস্য' : 'Members'}</span>
            <span className="font-mono text-[11px]">({trashedMembers.length})</span>
          </button>

          <button
            onClick={() => setFilterType('ledger')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
              filterType === 'ledger'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'লেজার ভাউচার' : 'Ledger Vouchers'}</span>
            <span className="font-mono text-[11px]">({trashedLedger.length})</span>
          </button>

          {trashedProjects.length > 0 && (
            <button
              onClick={() => setFilterType('projects')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
                filterType === 'projects'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'প্রকল্প' : 'Projects'}</span>
              <span className="font-mono text-[11px]">({trashedProjects.length})</span>
            </button>
          )}
        </div>

        {/* Trashed Items List */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1 max-h-[50vh]">
          {totalTrashedCount === 0 ? (
            <div className="py-14 text-center text-slate-500 space-y-2">
              <Sparkles className="w-10 h-10 mx-auto text-emerald-400/40" />
              <p className="text-sm font-semibold text-slate-300">
                {lang === 'bn' ? 'ট্র্যাশ বিন সম্পূর্ণ পরিষ্কার!' : 'Trash bin is completely clean!'}
              </p>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'মুছে ফেলা কোনো আইটেম পাওয়া যায়নি।' : 'No trashed items awaiting restoration or purge.'}
              </p>
            </div>
          ) : (
            <>
              {/* Trashed Notices */}
              {(filterType === 'all' || filterType === 'notices') && trashedNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-mono font-bold text-[10px]">
                        NOTICE
                      </span>
                      <span className="font-mono text-slate-400 font-semibold">{notice.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-200 font-bold">{lang === 'bn' ? notice.titleBn : notice.titleEn}</span>
                    </div>
                    <p className="text-slate-400 line-clamp-1">
                      {lang === 'bn' ? notice.contentBn : notice.contentEn}
                    </p>
                    {notice.deletedAt && (
                      <p className="text-[10px] text-slate-500">
                        {lang === 'bn' ? 'মুছে ফেলা হয়েছে:' : 'Deleted on:'} {new Date(notice.deletedAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {onRestoreNotice && (
                      <button
                        onClick={() => onRestoreNotice(notice.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'পুনরুদ্ধার' : 'Restore'}</span>
                      </button>
                    )}
                    {onPermanentDeleteNotice && (
                      <button
                        onClick={() => setSinglePurgeTarget({ id: notice.id, type: 'notice', name: lang === 'bn' ? notice.titleBn : notice.titleEn })}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                        title="Permanently Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Trashed Installments */}
              {(filterType === 'all' || filterType === 'installments') && trashedInstallments.map((inst) => (
                <div
                  key={inst.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 font-mono font-bold text-[10px]">
                        INSTALLMENT
                      </span>
                      <span className="font-mono text-slate-400 font-semibold">{inst.receiptNo || inst.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 font-bold">{inst.memberName} ({inst.memberId})</span>
                    </div>
                    <p className="text-slate-400">
                      {inst.month} {inst.year} • <strong className="text-emerald-400 font-mono">৳ {inst.amount.toLocaleString()}</strong> via {inst.method}
                      {inst.trxId && <span className="font-mono text-slate-500"> (TrxID: {inst.trxId})</span>}
                    </p>
                    {inst.deletedAt && (
                      <p className="text-[10px] text-slate-500">
                        {lang === 'bn' ? 'মুছে ফেলা হয়েছে:' : 'Deleted on:'} {new Date(inst.deletedAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {onRestoreInstallment && (
                      <button
                        onClick={() => onRestoreInstallment(inst.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'পুনরুদ্ধার' : 'Restore'}</span>
                      </button>
                    )}
                    {onPermanentDeleteInstallment && (
                      <button
                        onClick={() => setSinglePurgeTarget({ id: inst.id, type: 'installment', name: `${inst.memberName} (${inst.month} ${inst.year})` })}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                        title="Permanently Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Trashed Members */}
              {(filterType === 'all' || filterType === 'members') && trashedMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-mono font-bold text-[10px]">
                        MEMBER
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">{member.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-white font-bold">{lang === 'bn' ? member.nameBn : member.name}</span>
                    </div>
                    <p className="text-slate-400">
                      {lang === 'bn' ? member.designationBn : member.designationEn} • {member.share}% Share Equity • {member.phone}
                    </p>
                    {member.deletedAt && (
                      <p className="text-[10px] text-slate-500">
                        {lang === 'bn' ? 'মুছে ফেলা হয়েছে:' : 'Deleted on:'} {new Date(member.deletedAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {onRestoreMember && (
                      <button
                        onClick={() => onRestoreMember(member.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'পুনরুদ্ধার' : 'Restore'}</span>
                      </button>
                    )}
                    {onPermanentDeleteMember && (
                      <button
                        onClick={() => setSinglePurgeTarget({ id: member.id, type: 'member', name: `${member.name} (${member.id})` })}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                        title="Permanently Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Trashed Ledger Transactions */}
              {(filterType === 'all' || filterType === 'ledger') && trashedLedger.map((txn) => (
                <div
                  key={txn.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-mono font-bold text-[10px]">
                        LEDGER VOUCHER
                      </span>
                      <span className="font-mono text-slate-300 font-bold">{txn.voucherNo}</span>
                      <span className="text-slate-500">•</span>
                      <span className={`font-mono font-bold ${txn.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {txn.type === 'credit' ? `+ ৳ ${txn.amount.toLocaleString()}` : `- ৳ ${txn.amount.toLocaleString()}`}
                      </span>
                    </div>
                    <p className="text-slate-300 font-medium">
                      {lang === 'bn' ? (txn.titleBn || txn.title) : txn.title} ({txn.category})
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {onRestoreLedgerTransaction && (
                      <button
                        onClick={() => onRestoreLedgerTransaction(txn.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'পুনরুদ্ধার' : 'Restore'}</span>
                      </button>
                    )}
                    {onPermanentDeleteLedgerTransaction && (
                      <button
                        onClick={() => setSinglePurgeTarget({ id: txn.id, type: 'ledger', name: txn.voucherNo })}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                        title="Permanently Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Trashed Projects */}
              {(filterType === 'all' || filterType === 'projects') && trashedProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 font-mono font-bold text-[10px]">
                        PROJECT
                      </span>
                      <span className="font-mono text-purple-300 font-bold">{proj.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-white font-bold">{lang === 'bn' ? proj.titleBn : proj.titleEn}</span>
                    </div>
                    <p className="text-slate-400">
                      {lang === 'bn' ? proj.categoryBn : proj.categoryEn} • {lang === 'bn' ? proj.locationBn : proj.locationEn}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {onRestoreProject && (
                      <button
                        onClick={() => onRestoreProject(proj.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'পুনরুদ্ধার' : 'Restore'}</span>
                      </button>
                    )}
                    {onPermanentDeleteProject && (
                      <button
                        onClick={() => setSinglePurgeTarget({ id: proj.id, type: 'project', name: lang === 'bn' ? proj.titleBn : proj.titleEn })}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                        title="Permanently Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>{lang === 'bn' ? 'সুপার অ্যাডমিন অডিট কনসোল' : 'Super Admin Audit Console'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>

      {/* Confirmation Modal for Purge All */}
      {showPurgeAllConfirm && (
        <div 
          className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowPurgeAllConfirm(false)}
        >
          <div 
            className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {lang === 'bn' ? 'সম্পূর্ণ ট্র্যাশ স্থায়ীভাবে খালি করতে চান?' : 'Purge & Empty All Trashed Records?'}
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {lang === 'bn' 
                  ? 'এই ক্রিয়ার মাধ্যমে ট্র্যাশে থাকা সকল কিস্তি, বিজ্ঞপ্তি, সদস্য এবং লেজার রেকর্ড স্থায়ীভাবে মুছে যাবে। এটি আর পুনরুদ্ধার করা সম্ভব হবে না।' 
                  : 'This will permanently delete all trashed installments, notices, members, and ledger vouchers. This action cannot be reversed.'}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowPurgeAllConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmPurgeAll}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-500/25"
              >
                {lang === 'bn' ? 'হ্যাঁ, সম্পূর্ণ খালি করুন' : 'Yes, Purge Everything'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Single Permanent Purge */}
      {singlePurgeTarget && (
        <div 
          className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSinglePurgeTarget(null)}
        >
          <div 
            className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {lang === 'bn' ? 'স্থায়ীভাবে মুছে ফেলতে চান?' : 'Permanently Delete Record?'}
              </h4>
              <p className="text-xs text-slate-300 font-mono font-bold mt-1">
                {singlePurgeTarget.name}
              </p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {lang === 'bn' 
                  ? 'এই রেকর্ডটি সিস্টেম থেকে চিরতরে মুছে যাবে।' 
                  : 'This record will be permanently purged from the system.'}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setSinglePurgeTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmSinglePurge}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-500/25"
              >
                {lang === 'bn' ? 'স্থায়ী মুছুন' : 'Purge'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
