import React, { useState, useEffect } from 'react';
import { Member, Installment, Language, PaymentAccountConfig } from '../types';
import { translations } from '../data/translations';
import { COMPANY_INFO } from '../data/initialData';
import { INITIAL_PAYMENT_ACCOUNTS } from '../data/paymentAccounts';
import { calculateInstallmentFine } from '../utils/fineCalculator';
import { 
  Send, CreditCard, Building2, CheckCircle2, Clock, 
  Timer, Calendar, Lock, AlertCircle, ShieldCheck, 
  FileText, ArrowRight, Wallet, Sparkles, Info, Smartphone
} from 'lucide-react';

interface Props {
  member: Member;
  lang: Language;
  onSubmitInstallment: (installment: Partial<Installment>) => void;
  onViewReceipt: (inst: Installment) => void;
  onNavigateToDashboard: () => void;
  paymentAccounts?: PaymentAccountConfig[];
}

export const MemberDepositView: React.FC<Props> = ({
  member,
  lang,
  onSubmitInstallment,
  onViewReceipt,
  onNavigateToDashboard,
  paymentAccounts = []
}) => {
  const t = translations[lang];

  // Active payment accounts list
  const activeAccounts = paymentAccounts.length > 0 
    ? paymentAccounts.filter(a => a.isActive)
    : INITIAL_PAYMENT_ACCOUNTS.filter(a => a.isActive);

  // Default month and today's real-time date
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = monthsList[now.getMonth()] || 'September';

  // Form State
  const [month, setMonth] = useState(currentMonthName);
  const [year, setYear] = useState(now.getFullYear() || 2026);
  const paymentDate = todayStr; // Strictly locked to real-time system date
  const defaultMethod = activeAccounts[0] 
    ? (lang === 'bn' ? activeAccounts[0].titleBn : activeAccounts[0].titleEn) 
    : 'bKash Merchant';
  const [method, setMethod] = useState(defaultMethod);
  const [trxId, setTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<Installment | null>(null);

  // Update default method if activeAccounts changes
  useEffect(() => {
    if (activeAccounts.length > 0 && !activeAccounts.some(a => (a.titleBn === method || a.titleEn === method))) {
      setMethod(lang === 'bn' ? activeAccounts[0].titleBn : activeAccounts[0].titleEn);
    }
  }, [activeAccounts, lang]);

  // Live ticking clock & formatted live date
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [liveDateFormatted, setLiveDateFormatted] = useState(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));

  useEffect(() => {
    const timer = setInterval(() => {
      const live = new Date();
      setCurrentTime(live.toLocaleTimeString());
      setLiveDateFormatted(live.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Base monthly installment (1% share = ৳1,000)
  const baseMonthlyAmount = (member.share || 1) * 1000;

  // Accurate Late Fine Calculation (No fine on future or on-time installments)
  const fineResult = calculateInstallmentFine(member.share || 1, month, year, now);
  const calculatedLateFee = fineResult.lateFee;
  const isLate = fineResult.isLate;
  const isFuture = fineResult.isFuture;
  const totalPayableAmount = baseMonthlyAmount + calculatedLateFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) return;

    setIsSubmitting(true);
    const receiptSerial = `NXR-REC-${year}-${Date.now().toString().slice(-4)}`;
    const finalTrx = trxId.trim();

    const payload: Partial<Installment> = {
      receiptNo: receiptSerial,
      memberId: member.id,
      memberName: member.name,
      memberNameBn: member.nameBn,
      month,
      year,
      amount: totalPayableAmount,
      lateFee: calculatedLateFee,
      method,
      trxId: finalTrx,
      date: todayStr, // Strictly real-time system date
      status: 'pending',
      notes: notes.trim(),
      isDeleted: false
    };

    // Synchronous dispatch to prevent any sync delay
    onSubmitInstallment(payload);

    const previewReceipt: Installment = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      receiptNo: receiptSerial,
      memberId: member.id,
      memberName: member.name,
      memberNameBn: member.nameBn,
      month,
      year,
      amount: totalPayableAmount,
      lateFee: calculatedLateFee,
      method,
      trxId: finalTrx,
      date: todayStr,
      status: 'pending',
      notes: notes.trim(),
      isDeleted: false
    };

    setSubmittedReceipt(previewReceipt);
    setTrxId('');
    setNotes('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* HEADER WITH REAL-TIME CLOCK & MEMBER PROFILE SUMMARY */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-3">
            <Send className="w-4 h-4" />
            <span>{lang === 'bn' ? 'অফিসিয়াল মাসিক কিস্তি জমা কাউন্টার' : 'Official Monthly Installment Portal'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'bn' ? 'মাসিক কিস্তি জমা দিন' : 'Submit Monthly Installment'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn' 
              ? `${member.nameBn} (${member.id}) • আপনার ${member.share}% শেয়ারের নির্ধারিত কিস্তির বিবরণ জমা দিন`
              : `${member.name} (${member.id}) • Submit installment payment details for your ${member.share}% share`}
          </p>
        </div>

        {/* Real-time timestamp & share equity badge */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-2xl text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold flex items-center gap-1 justify-end">
              <Timer className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'bn' ? 'লাইভ সময়' : 'Live Clock'}
            </span>
            <span className="text-xs font-mono font-bold text-slate-200">
              {currentTime}
            </span>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-2xl text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              {lang === 'bn' ? 'আপনার শেয়ার অংশ' : 'Your Equity Share'}
            </span>
            <span className="text-base font-black text-emerald-400 font-mono">
              {member.share}% (৳{baseMonthlyAmount.toLocaleString()}/মাস)
            </span>
          </div>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION ALERT (IF SUBMITTED) */}
      {submittedReceipt && (
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-emerald-400">
                {lang === 'bn' ? 'কিস্তি সফলভাবে জমা হয়েছে ও অ্যাডমিন কিউতে পাঠানো হয়েছে!' : 'Installment Submitted to Admin Queue Successfully!'}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">
                Receipt #{submittedReceipt.receiptNo} • {submittedReceipt.month} {submittedReceipt.year} • ৳{submittedReceipt.amount.toLocaleString()} ({submittedReceipt.method})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onViewReceipt(submittedReceipt)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>{t.viewReceipt}</span>
            </button>
            <button
              onClick={onNavigateToDashboard}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700"
            >
              {lang === 'bn' ? 'ড্যাশবোর্ডে যান' : 'Go to Dashboard'}
            </button>
          </div>
        </div>
      )}

      {/* OFFICIAL PAYMENT CHANNELS CARD */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between text-slate-300 text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'bn' ? 'নেক্সোরা লিমিটেডের অফিসিয়াল পেমেন্ট চ্যানেলসমূহ' : 'Official Payment Channels for Installments'}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {activeAccounts.length} {lang === 'bn' ? 'টি সক্রিয় চ্যানেল' : 'Active Channels'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs text-slate-300">
          {activeAccounts.map((acc) => {
            const isBkash = acc.type === 'bkash';
            const isNagad = acc.type === 'nagad';
            const isRocket = acc.type === 'rocket';
            const isBank = acc.type === 'bank';

            const badgeColor = isBkash 
              ? 'text-pink-400 bg-pink-500/10 border-pink-500/20' 
              : isNagad 
              ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
              : isRocket
              ? 'text-purple-400 bg-purple-500/10 border-purple-500/20'
              : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

            const titleColor = isBkash ? 'text-pink-400' : isNagad ? 'text-orange-400' : isRocket ? 'text-purple-400' : 'text-emerald-400';

            return (
              <div key={acc.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2.5 hover:border-slate-700 transition">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-bold ${titleColor} flex items-center gap-1.5`}>
                      {isBank ? <Building2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                      <span>{lang === 'bn' ? acc.titleBn : acc.titleEn}</span>
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${badgeColor}`}>
                      {acc.accountTypeBn || acc.accountTypeEn || 'Official'}
                    </span>
                  </div>
                  <p className="font-mono text-white text-sm font-bold tracking-wide">
                    {acc.accountNumber}
                  </p>
                  {(acc.bankNameBn || acc.branchBn) && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      {acc.bankNameBn} {acc.branchBn ? `(${acc.branchBn})` : ''}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{lang === 'bn' ? 'রেফারেন্স:' : 'Ref:'} <strong className="text-emerald-400 font-mono">{member.id}</strong></span>
                  {acc.instructionsBn && (
                    <span className="text-[10px] text-slate-500 truncate max-w-[120px]" title={acc.instructionsBn}>
                      {acc.instructionsBn}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INSTALLMENT SUBMISSION FORM CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-xl font-bold text-white">
            {lang === 'bn' ? 'কিস্তি জমার তথ্য ফরম' : 'Installment Submission Form'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'bn' 
              ? 'নিচে নির্ধারিত মাস, পরিশোধের তারিখ ও ট্রানজেকশন আইডি (TrxID) সঠিকভাবে প্রদান করুন।' 
              : 'Provide accurate month, payment date, and transaction ID for admin verification.'}
          </p>
        </div>

        {/* 1st to 10th Penalty Rule Live Indicator Box */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isFuture
            ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
            : !isLate 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            {isFuture ? (
              <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
            ) : isLate ? (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <div>
              <p className="font-bold">
                {isFuture
                  ? (lang === 'bn' ? 'ভবিষ্যতের কিস্তি (অগ্রিম পরিশোধ)' : 'Upcoming / Advance Installment')
                  : !isLate 
                  ? (lang === 'bn' ? 'সময়মতো পরিশোধ (১ম থেকে ১০ই তারিখ)' : 'On-Time Submission (1st - 10th of Month)')
                  : (lang === 'bn' ? '১০ তারিখের পরবর্তী জমা (বিলম্ব ফি প্রযোজ্য)' : 'Late Submission (After 10th of Month)')}
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                {isFuture
                  ? (lang === 'bn' ? 'ভবিষ্যত মাসের কিস্তির ক্ষেত্রে কোনো বিলম্ব জরিমানা প্রযোজ্য নয় (বিলম্ব ফি: ৳০)।' : 'No late fee applies to advance / future installments (Late Fee: ৳0).')
                  : !isLate 
                  ? (lang === 'bn' ? '১ থেকে ১০ তারিখের মধ্যে জমা দিলে কোনো বিলম্ব ফি নেই (বিলম্ব ফি: ৳০)।' : 'Installments submitted on or before 10th have strictly 0 BDT late fee.')
                  : (lang === 'bn' ? `১০ তারিখ অতিক্রম করায় শেয়ার প্রতি ৳১০০ হারে মোট ৳${calculatedLateFee.toLocaleString()} বিলম্ব ফি যোগ হয়েছে।` : `Submission after 10th incurs 100 BDT per share penalty (Late Fee: ৳${calculatedLateFee.toLocaleString()}).`)}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              {lang === 'bn' ? 'বিলম্ব ফি' : 'Late Fee'}
            </span>
            <span className={`text-lg font-black font-mono ${isFuture ? 'text-sky-400' : !isLate ? 'text-emerald-400' : 'text-amber-400'}`}>
              ৳ {calculatedLateFee.toLocaleString()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Month Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t.selectMonth} *</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                {monthsList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Year Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t.selectYear} *</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none font-mono"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
              </select>
            </div>

            {/* Payment Date - Strictly Real-Time Locked */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'bn' ? 'জমার তারিখ (রিয়েল-টাইম)' : 'Payment Date (Real-Time)'}</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                  {lang === 'bn' ? 'সিস্টেম লকড' : 'Locked'}
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={`${paymentDate} (${liveDateFormatted})`}
                  readOnly
                  disabled
                  title={lang === 'bn' ? 'সিস্টেম রিয়েল-টাইম তারিখ স্বয়ংক্রিয়ভাবে প্রযোজ্য' : 'Real-time system date is automatically locked'}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-emerald-300 font-mono cursor-not-allowed select-none opacity-95"
                />
              </div>
            </div>

            {/* Dynamic Payment Method Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t.selectMethod} *</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                {activeAccounts.map((acc) => {
                  const label = lang === 'bn' ? acc.titleBn : acc.titleEn;
                  return (
                    <option key={acc.id} value={label}>
                      {label} ({acc.accountNumber})
                    </option>
                  );
                })}
                <option value="Cash at Head Office">{lang === 'bn' ? 'ক্যাশ (প্রধান কার্যালয়)' : 'Cash at Head Office'}</option>
              </select>
            </div>

          </div>

          {/* Amount Breakdown Summary Panel */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                {lang === 'bn' ? 'নির্ধারিত মাসিক কিস্তি (১% = ৳১,০০০)' : 'Base Monthly Amount'}
              </span>
              <p className="text-xl font-bold text-white font-mono mt-1">
                ৳ {baseMonthlyAmount.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-400 mt-0.5">
                {member.share}% Shareholder Equity
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                {lang === 'bn' ? 'বিলম্ব ফি (১০ তারিখের পর)' : 'Late Fee (After 10th)'}
              </span>
              <p className={`text-xl font-bold font-mono mt-1 ${calculatedLateFee > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                ৳ {calculatedLateFee.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {isLate ? `${member.share} shares × ৳100` : 'No late fee applied'}
              </p>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl">
              <span className="text-[11px] font-bold text-emerald-400 block uppercase">
                {lang === 'bn' ? 'সর্বমোট জমার পরিমাণ' : 'Total Payable Amount'}
              </span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                ৳ {totalPayableAmount.toLocaleString()}
              </p>
            </div>

          </div>

          {/* TrxID and Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>{t.trxIdLabel} *</span>
                <span className="text-[10px] text-slate-400 font-mono">bKash / Nagad / Bank Slip</span>
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="e.g. BK98X12903 or IBBL-DEP-09"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t.notesOptional}</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={lang === 'bn' ? 'যেমন: সেপ্টেম্বর মাসের নিয়মিত কিস্তি' : 'e.g. Regular installment payment'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !trxId.trim()}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-sm sm:text-base transition shadow-xl shadow-emerald-500/25 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Submitting...' : t.submitBtn}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
