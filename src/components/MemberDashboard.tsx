import React from 'react';
import { Member, Installment, Language } from '../types';
import { translations } from '../data/translations';
import { 
  FileText, CheckCircle2, Clock, XCircle, 
  ShieldCheck, TrendingUp, Sparkles, Building2,
  Wallet, Landmark
} from 'lucide-react';

interface Props {
  member: Member;
  installments: Installment[];
  lang: Language;
  onViewReceipt: (inst: Installment) => void;
}

export const MemberDashboard: React.FC<Props> = ({
  member,
  installments,
  lang,
  onViewReceipt
}) => {
  const t = translations[lang];

  // Company-wide total accumulated verified capital across all members
  const totalCompanyCapital = installments
    .filter(i => !i.isDeleted && i.status === 'approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

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
          {member.avatarUrl ? (
            <img 
              src={member.avatarUrl} 
              alt={member.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/20 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
              {member.name.charAt(0)}
            </div>
          )}
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
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1.5">
              <span><strong className="text-slate-300">Phone:</strong> {member.phone}</span>
              {member.email && <span>• <strong className="text-slate-300">Email:</strong> {member.email}</span>}
              {member.nid && <span>• <strong className="text-emerald-400 font-mono">NID:</strong> <span className="font-mono text-emerald-300">{member.nid}</span></span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-slate-300 font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'bn' ? 'যাচাইকৃত সক্রিয় প্রোফাইল' : 'Verified Active Profile'}</span>
          </div>
        </div>
      </div>

      {/* FINANCIAL METRICS (FEATURING COMPANY TOTAL CAPITAL & MEMBER SHARES) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. Company Total Accumulated Capital (মোট পুঞ্জীভূত মূলধন) */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/50 transition relative group shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {lang === 'bn' ? 'মোট পুঞ্জীভূত মূলধন' : 'Total Company Capital'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">
            ৳ {totalCompanyCapital.toLocaleString()}
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{lang === 'bn' ? 'অনুমোদিত মূলধন:' : 'Authorized:'}</span>
            <span className="font-semibold text-emerald-300 font-mono">৳ ১,০০,০০,০০০</span>
          </div>
        </div>

        {/* 2. Equity Share */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t.shareRatio}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">
            {member.share}%
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            {lang === 'bn' ? `নির্ধারিত কিস্তি: ৳ ${monthlyRequired.toLocaleString()}/মাস` : `Monthly: ৳ ${monthlyRequired.toLocaleString()}`}
          </div>
        </div>

        {/* 3. Total Contributed Approved */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t.totalContributed}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            ৳ {approvedTotal.toLocaleString()}
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <span>{lang === 'bn' ? 'অনুমোদিত জমা মূলধন' : 'Audited & Confirmed'}</span>
          </div>
        </div>

        {/* 4. Pending Verification */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t.pendingReq}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            ৳ {pendingTotal.toLocaleString()}
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1 text-xs text-amber-400">
            <span>{lang === 'bn' ? 'অ্যাডমিন যাচাইয়ের অপেক্ষায়' : 'Under Admin Review'}</span>
          </div>
        </div>

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
                  <td colSpan={6} className="py-10 text-center text-slate-500 space-y-1">
                    <p className="font-medium">{lang === 'bn' ? 'এখনো কোনো কিস্তির রেকর্ড নেই।' : 'No installment records found.'}</p>
                    <p className="text-xs text-slate-400">
                      {lang === 'bn' 
                        ? 'নতুন কিস্তি জমা দিতে উপরের নেভিগেশন বার থেকে "মাসিক কিস্তি জমা দিন" বাটনে ক্লিক করুন।' 
                        : 'To submit your installment, select "Submit Monthly Installment" from the top navigation bar.'}
                    </p>
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
