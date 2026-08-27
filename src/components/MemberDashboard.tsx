import React, { useState, useEffect } from 'react';
import { Member, Installment, Language } from '../types';
import { translations } from '../data/translations';
import { COMPANY_INFO } from '../data/initialData';
import { 
  Wallet, Award, FileText, CheckCircle2, Clock, XCircle, 
  Send, CreditCard, Building2, Download, Printer, ArrowRight,
  ShieldCheck, AlertCircle, Info, Sparkles, Calendar, Timer
} from 'lucide-react';

interface Props {
  member: Member;
  installments: Installment[];
  lang: Language;
  onSubmitInstallment: (installment: Partial<Installment>) => void;
  onViewReceipt: (inst: Installment) => void;
  onViewCertificate: (member: Member) => void;
}

export const MemberDashboard: React.FC<Props> = ({
  member,
  installments,
  lang,
  onSubmitInstallment,
  onViewReceipt,
  onViewCertificate
}) => {
  const t = translations[lang];

  // Submission Form State
  const [month, setMonth] = useState('September');
  const [year, setYear] = useState(2026);
  const [method, setMethod] = useState('bKash Merchant');
  const [trxId, setTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Real-time ticking clock for submission timestamp accuracy
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter installments for this member (exclude deleted)
  const memberInstallments = installments.filter(i => i.memberId === member.id && !i.isDeleted);
  
  const approvedTotal = memberInstallments
    .filter(i => i.status === 'approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingTotal = memberInstallments
    .filter(i => i.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyRequired = member.share * 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitInstallment({
        memberId: member.id,
        memberName: member.name,
        memberNameBn: member.nameBn,
        month,
        year,
        amount: monthlyRequired,
        lateFee: 0,
        method,
        trxId: trxId.trim(),
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        notes: notes.trim()
      });

      setTrxId('');
      setNotes('');
      setIsSubmitting(false);
      alert(t.successSubmitted);
    }, 400);
  };

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* MEMBER PROFILE HERO BANNER */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-2xl shadow-lg shadow-emerald-500/20">
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
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-semibold transition"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>{t.shareCertificate}</span>
          </button>
        </div>
      </div>

      {/* MEMBER FINANCIAL METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Equity Share */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
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
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            {t.totalContributed}
          </span>
          <p className="text-3xl font-black text-emerald-400 font-mono">
            ৳ {approvedTotal.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {lang === 'bn' ? 'অনুমোদিত ও সংরক্ষিত মূলধন' : 'Audited & Confirmed Capital'}
          </p>
        </div>

        {/* Pending Verification */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            {t.pendingReq}
          </span>
          <p className="text-3xl font-black text-amber-400 font-mono">
            ৳ {pendingTotal.toLocaleString()}
          </p>
          <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {lang === 'bn' ? 'অ্যাডমিন যাচাইয়ের অপেক্ষায়' : 'Under Admin Review'}
          </p>
        </div>

      </div>

      {/* SUBMIT INSTALLMENT FORM */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-1">
              <Send className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{t.submitInstallment}</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {lang === 'bn' ? 'মাসিক কিস্তি জমার বিবরণ পূরণ করুন' : 'Submit Your Monthly Contribution'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{t.installmentFormDesc}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time timestamp badge */}
            <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold flex items-center gap-1 justify-end">
                <Timer className="w-3 h-3 text-emerald-400" />
                {lang === 'bn' ? 'বর্তমান সময় (লাইভ)' : 'System Timestamp'}
              </span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {currentTime}
              </span>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                {lang === 'bn' ? 'আপনার মাসিক দেয়' : 'Required Amount'}
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                ৳ {monthlyRequired.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Channels Guide */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-pink-400 font-bold block">bKash Merchant:</span>
            <span className="font-mono text-slate-200">{COMPANY_INFO.bkashMerchant}</span>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-orange-400 font-bold block">Nagad Merchant:</span>
            <span className="font-mono text-slate-200">{COMPANY_INFO.nagadMerchant}</span>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold block">Islami Bank Direct:</span>
            <span className="font-mono text-slate-200">A/C: 2050392019482 (Banani)</span>
          </div>
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Month Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t.selectMonth}</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              {monthsList.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t.selectYear}</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
              <option value={2028}>2028</option>
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t.selectMethod}</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="bKash Merchant">bKash Merchant</option>
              <option value="Nagad">Nagad Merchant</option>
              <option value="Islami Bank Direct">Islami Bank Direct</option>
              <option value="Bank Transfer (BEFTN/NPSB)">Bank Transfer (BEFTN/NPSB)</option>
              <option value="Cash at Head Office">Cash at Head Office</option>
            </select>
          </div>

          {/* TrxID / Reference */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t.trxIdLabel}</label>
            <input
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="e.g. BK99X8123 or IBBL-Slip"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t.notesOptional}</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Monthly equity contribution for the current period"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-1 flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : t.submitBtn}</span>
            </button>
          </div>
        </form>
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
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    {lang === 'bn' ? 'এখনো কোনো কিস্তির রেকর্ড নেই। ওপরের ফর্মের মাধ্যমে কিস্তি জমা দিন।' : 'No installment records found. Submit your first installment above.'}
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
