import React from 'react';
import { Member, Installment, Language } from '../types';
import { translations } from '../data/translations';
import { COMPANY_INFO } from '../data/initialData';
import { 
  Wallet, Award, FileText, CheckCircle2, Clock, XCircle, 
  Send, ArrowRight, ShieldCheck, TrendingUp, Sparkles, Building2
} from 'lucide-react';

interface Props {
  member: Member;
  installments: Installment[];
  lang: Language;
  onNavigateToDeposit: () => void;
  onViewReceipt: (inst: Installment) => void;
  onViewCertificate: (member: Member) => void;
}

export const MemberDashboard: React.FC<Props> = ({
  member,
  installments,
  lang,
  onNavigateToDeposit,
  onViewReceipt,
  onViewCertificate
}) => {
  const t = translations[lang];

  // Filter installments for this member (exclude deleted)
  const memberInstallments = installments.filter(i => i.memberId === member.id && !i.isDeleted);
  
  const approvedTotal = memberInstallments
    .filter(i => i.status === 'approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingTotal = memberInstallments
    .filter(i => i.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyRequired = (member.share || 1) * 1000;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* MEMBER PROFILE HERO BANNER */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
            {member.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {lang === 'bn' ? member.nameBn : member.name}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                {member.id}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-400 font-medium mt-0.5">
              {lang === 'bn' ? member.designationBn : member.designationEn} • {lang === 'bn' ? 'নিবন্ধিত প্রতিষ্ঠাতা অংশীদার' : 'Founder Shareholder'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Phone: {member.phone} | Email: {member.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onViewCertificate(member)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-semibold transition shadow-sm"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>{t.shareCertificate}</span>
          </button>

          <button
            onClick={onNavigateToDeposit}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-500/25 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>{lang === 'bn' ? 'মাসিক কিস্তি জমা দিন' : 'Submit Installment'}</span>
          </button>
        </div>
      </div>

      {/* MEMBER FINANCIAL METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Equity Share */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            {t.shareRatio}
          </span>
          <p className="text-3xl font-black text-white font-mono">
            {member.share}%
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {lang === 'bn' ? `মাসিক নির্ধারিত কিস্তি ৳ ${monthlyRequired.toLocaleString()}` : `Required Monthly: ৳ ${monthlyRequired.toLocaleString()}`}
          </p>
        </div>

        {/* Total Contributed Approved */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            {t.totalContributed}
          </span>
          <p className="text-3xl font-black text-emerald-400 font-mono">
            ৳ {approvedTotal.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'অনুমোদিত ও সংরক্ষিত মূলধন' : 'Audited & Confirmed Capital'}</span>
          </p>
        </div>

        {/* Pending Verification */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            {t.pendingReq}
          </span>
          <p className="text-3xl font-black text-amber-400 font-mono">
            ৳ {pendingTotal.toLocaleString()}
          </p>
          <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'অ্যাডমিন যাচাইয়ের অপেক্ষায়' : 'Under Admin Review'}</span>
          </p>
        </div>

      </div>

      {/* QUICK DEPOSIT ACTION PROMO BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Send className="w-4 h-4" />
            <span>{lang === 'bn' ? 'চলতি মাসের কিস্তি পরিশোধ' : 'Monthly Contribution'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {lang === 'bn' ? 'আপনার মাসিক কিস্তির তথ্য সহজে জমা দিন' : 'Submit Your Monthly Installment Easily'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            {lang === 'bn' 
              ? 'বিকাশ, নগদ বা ব্যাংক ট্রান্সফারের মাধ্যমে জমা দিয়ে TrxID সাবমিট করুন। ১-১০ তারিখের মধ্যে জমা দিলে বিলম্ব ফি ৳০।' 
              : 'Submit your transaction ID for instant admin verification. Submissions on or before the 10th have strictly 0 BDT late fee.'}
          </p>
        </div>

        <button
          onClick={onNavigateToDeposit}
          className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-emerald-500/25 flex items-center gap-2 shrink-0 active:scale-95"
        >
          <span>{lang === 'bn' ? 'কিস্তি জমা দিন' : 'Submit Installment Now'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* MEMBER'S INSTALLMENT LEDGER TABLE */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">{t.paymentHistory}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'bn' ? 'সকল অনুমোদিত ও প্রক্রিয়াধীন কিস্তির তালিকা ও ডিজিটাল রসিদ' : 'Comprehensive ledger of all your paid & pending installments'}
            </p>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {memberInstallments.length} Records Found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                <th className="py-3.5 px-4">{t.month}</th>
                <th className="py-3.5 px-4">{t.amount}</th>
                <th className="py-3.5 px-4">{t.method}</th>
                <th className="py-3.5 px-4">{t.date}</th>
                <th className="py-3.5 px-4">{t.status}</th>
                <th className="py-3.5 px-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
              {memberInstallments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 space-y-2">
                    <p>{lang === 'bn' ? 'এখনো কোনো কিস্তির রেকর্ড নেই।' : 'No installment records found.'}</p>
                    <button
                      onClick={onNavigateToDeposit}
                      className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'প্রথম কিস্তি জমা দিন' : 'Submit First Installment'}</span>
                    </button>
                  </td>
                </tr>
              ) : (
                memberInstallments.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {inst.month} {inst.year}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">
                      ৳ {inst.amount.toLocaleString()}
                      {inst.lateFee > 0 && (
                        <span className="block text-[10px] text-amber-400 font-normal">
                          (Late Fee: ৳{inst.lateFee})
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{inst.method}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{inst.trxId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
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
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onViewReceipt(inst)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition border border-slate-700 inline-flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
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

    </div>
  );
};
