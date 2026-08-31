import React, { useState, useEffect } from 'react';
import { Member, Installment, Language, PaymentAccountConfig } from '../types';
import { translations } from '../data/translations';
import { COMPANY_INFO } from '../data/initialData';
import { INITIAL_PAYMENT_ACCOUNTS } from '../data/paymentAccounts';
import { calculateInstallmentFine } from '../utils/fineCalculator';
import { 
  Building2, Wallet, CheckCircle2, Clock, 
  Send, CreditCard, ShieldCheck, Timer, 
  Calendar, FileText, PlusCircle, AlertCircle, ArrowRight,
  Lock, Trash2, RotateCcw, ShieldAlert, X, Scale, Sparkles, BookOpen
} from 'lucide-react';

interface Props {
  members: Member[];
  installments: Installment[];
  lang: Language;
  onAddDirectInstallment: (inst: Partial<Installment>) => void;
  onDeleteInstallment?: (id: string) => void;
  onRestoreInstallment?: (id: string) => void;
  onPermanentDeleteInstallment?: (id: string) => void;
  onViewReceipt: (inst: Installment) => void;
  paymentAccounts?: PaymentAccountConfig[];
}

export const AdminDepositView: React.FC<Props> = ({
  members,
  installments,
  lang,
  onAddDirectInstallment,
  onDeleteInstallment,
  onRestoreInstallment,
  onPermanentDeleteInstallment,
  onViewReceipt,
  paymentAccounts = []
}) => {
  const t = translations[lang];

  // Active payment channels
  const activeAccounts = paymentAccounts.length > 0 
    ? paymentAccounts.filter(a => a.isActive)
    : INITIAL_PAYMENT_ACCOUNTS.filter(a => a.isActive);

  // Default month and current system date
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = monthsList[now.getMonth()] || 'September';

  // Form State
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || 'NXR-001');
  const [month, setMonth] = useState(currentMonthName);
  const [year, setYear] = useState(now.getFullYear() || 2026);
  const [paymentDate, setPaymentDate] = useState<string>(todayStr);
  const defaultMethod = activeAccounts[0]
    ? (lang === 'bn' ? activeAccounts[0].titleBn : activeAccounts[0].titleEn)
    : 'Islami Bank Direct';
  const [method, setMethod] = useState(defaultMethod);
  const [trxId, setTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<Installment | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Update default method if activeAccounts changes
  useEffect(() => {
    if (activeAccounts.length > 0 && !activeAccounts.some(a => (a.titleBn === method || a.titleEn === method))) {
      setMethod(lang === 'bn' ? activeAccounts[0].titleBn : activeAccounts[0].titleEn);
    }
  }, [activeAccounts, lang]);

  // Selected Member calculation
  const currentSelectedMember = members.find(m => m.id === selectedMemberId) || members[0] || {
    id: 'NXR-001',
    name: 'Member',
    nameBn: 'সদস্য',
    share: 10,
    phone: '',
    email: '',
    designationEn: '',
    designationBn: ''
  };

  // Base calculated installment strictly locked to 1% = 1,000 BDT (Clause 3.4)
  const lockedBaseAmount = (currentSelectedMember.share || 1) * 1000;

  // Clause 4 Automated Fine Calculation (धारा ৪ অনুযায়ী স্বয়ংক্রিয় জরিমানা নির্ণয়)
  const fineCalculationDate = paymentDate ? new Date(paymentDate) : now;
  const fineResult = calculateInstallmentFine(
    currentSelectedMember.share || 1, 
    month, 
    year, 
    fineCalculationDate
  );
  const calculatedLateFee = fineResult.lateFee;
  const isLate = fineResult.isLate;
  const isFuture = fineResult.isFuture;
  const totalLockedAmount = lockedBaseAmount + calculatedLateFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedMember) return;

    setIsSubmitting(true);
    const receiptSerial = `NXR-DIR-${year}-${Date.now().toString().slice(-4)}`;
    const finalTrx = trxId.trim() || `DIR-${Date.now().toString().slice(-6)}`;
    const timestampNow = new Date().toISOString();

    const newEntry: Partial<Installment> = {
      receiptNo: receiptSerial,
      memberId: currentSelectedMember.id,
      memberName: currentSelectedMember.name,
      memberNameBn: currentSelectedMember.nameBn,
      month,
      year,
      amount: totalLockedAmount,
      lateFee: calculatedLateFee,
      method,
      trxId: finalTrx,
      date: paymentDate || todayStr,
      status: 'approved',
      approvedBy: 'Super Admin',
      approvedAt: timestampNow,
      notes: notes.trim(),
      isDeleted: false
    };

    setTimeout(() => {
      onAddDirectInstallment(newEntry);
      setIsSubmitting(false);
      setTrxId('');
      setNotes('');
      
      const createdObj: Installment = {
        id: `TRX-${Date.now().toString().slice(-6)}`,
        receiptNo: receiptSerial,
        memberId: currentSelectedMember.id,
        memberName: currentSelectedMember.name,
        memberNameBn: currentSelectedMember.nameBn,
        month,
        year,
        amount: totalLockedAmount,
        lateFee: calculatedLateFee,
        method,
        trxId: finalTrx,
        date: paymentDate || todayStr,
        status: 'approved',
        approvedBy: 'Super Admin',
        approvedAt: timestampNow,
        notes: notes.trim(),
        isDeleted: false
      };
      setSuccessReceipt(createdObj);
    }, 400);
  };

  const activeInstallments = installments.filter(i => !i.isDeleted && (i.approvedBy === 'Super Admin' || i.status === 'approved'));

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* HEADER (CLEAN & WITHOUT LIVE CLOCK) */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'bn' ? 'অফিসিয়াল কিস্তি ডিপোজিট ও সুরক্ষিত এন্ট্রি কাউন্টার' : 'Official Protected Installment Counter'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'bn' ? 'সরাসরি কিস্তি জমা ও এন্ট্রি' : 'Direct Installment Deposit Entry'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn' 
              ? 'গঠনতন্ত্রের ধারা ৩ ও ধারা ৪ অনুযায়ী স্বয়ংক্রিয় বিলম্ব ফিসহ কিস্তির পরিমাণ সরাসরি ক্যাপিটাল লেজারে এন্ট্রি করুন।' 
              : 'Securely record auto-calculated installment amounts with Clause 4 late fines directly into the central capital ledger.'}
          </p>
        </div>

        {/* Selected Member Equity / Clause 4 Indicator Badge */}
        <div className="bg-slate-950 px-5 py-3.5 rounded-2xl border border-slate-800 text-right shrink-0">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">
            {lang === 'bn' ? 'নির্ধারিত মাসিক কিস্তি হার' : 'Locked Monthly Installment'}
          </span>
          <p className="text-xl font-black text-emerald-400 font-mono tracking-tight mt-0.5">
            ৳ {lockedBaseAmount.toLocaleString()}/মাস
          </p>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            {currentSelectedMember.name} • {currentSelectedMember.share}% {lang === 'bn' ? 'শেয়ার' : 'Share'}
          </span>
        </div>
      </div>

      {/* SUCCESS BANNER WHEN ENTRY ADDED */}
      {successReceipt && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-400">
                {lang === 'bn' ? 'কিস্তি সফলভাবে মূলধনে যুক্ত ও অনুমোদিত হয়েছে!' : 'Installment Successfully Logged & Approved!'}
              </h4>
              <p className="text-xs text-slate-300">
                {successReceipt.memberName} ({successReceipt.memberId}) • {successReceipt.month} {successReceipt.year} • ৳{successReceipt.amount.toLocaleString()} ({successReceipt.method})
                {successReceipt.lateFee > 0 && ` [বিলম্ব ফি: ৳${successReceipt.lateFee.toLocaleString()}]`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewReceipt(successReceipt)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <FileText className="w-4 h-4" />
              <span>{t.viewReceipt}</span>
            </button>
            <button
              onClick={() => setSuccessReceipt(null)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* DIRECT DEPOSIT ENTRY FORM CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'bn' ? 'সরাসরি কিস্তি তথ্য এন্ট্রি ফরম' : 'Protected Direct Deposit Form'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' 
                  ? 'শেয়ারহোল্ডার ও জমার তারিখ নির্বাচন করলে ধারা ৪ অনুযায়ী বিলম্ব ফি স্বয়ংক্রিয়ভাবে হিসাব ও লক হবে' 
                  : 'Selecting a shareholder and payment date auto-calculates Clause 4 late fines and strictly locks amounts'}
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              {lang === 'bn' ? 'স্বয়ংক্রিয়ভাবে মোট লক করা পরিমাণ' : 'Locked Total Amount'}
            </span>
            <span className="text-xl font-black text-emerald-400 font-mono flex items-center gap-1.5 justify-end">
              <Lock className="w-4 h-4 text-emerald-400" />
              ৳ {totalLockedAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* CLAUSE 4 FINE STATUS & BANNER */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isFuture
            ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
            : !isLate 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <div className={`p-2 rounded-xl shrink-0 ${
              isFuture ? 'bg-sky-500/20 text-sky-400' : !isLate ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {isFuture ? <Sparkles className="w-5 h-5" /> : isLate ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold">
                  {isFuture
                    ? (lang === 'bn' ? 'ভবিষ্যতের কিস্তি (অগ্রিম জমাকৃত)' : 'Upcoming / Advance Installment')
                    : !isLate 
                    ? (lang === 'bn' ? 'সময়মতো পরিশোধ (১ম থেকে ১০ই তারিখ)' : 'On-Time Submission (1st - 10th)')
                    : (lang === 'bn' ? 'বিলম্বিত পরিশোধ (১০ তারিখের পর)' : 'Late Submission (After 10th)')}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 font-mono border border-slate-700 font-bold">
                  {lang === 'bn' ? 'গঠনতন্ত্র ধারা ৪.৩' : 'Clause 4.3 Rule'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {isFuture
                  ? (lang === 'bn' ? 'ভবিষ্যত মাসের কিস্তির ক্ষেত্রে কোনো বিলম্ব জরিমানা প্রযোজ্য নয় (বিলম্ব ফি: ৳০)।' : 'No late fee applies to advance / future installments (Late Fee: ৳0).')
                  : !isLate 
                  ? (lang === 'bn' ? '১ থেকে ১০ তারিখের মধ্যে জমা হওয়ায় কোনো বিলম্ব ফি প্রযোজ্য নয় (বিলম্ব ফি: ৳০)।' : 'Installment deposited within 1st-10th has strictly 0 BDT late fee.')
                  : (lang === 'bn' 
                      ? `১০ তারিখ অতিক্রম করায় ${currentSelectedMember.share}% শেয়ারের জন্য শেয়ার প্রতি ৳১০০ হারে মোট ৳${calculatedLateFee.toLocaleString()} বিলম্ব ফি যুক্ত হয়েছে (ধারা ৪.৪ অনুযায়ী মওকুফ নিষিদ্ধ)।` 
                      : `Deposited after 10th: 100 BDT per 1% share penalty applied = ৳${calculatedLateFee.toLocaleString()} (Waivers strictly prohibited under Clause 4.4).`)}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              {lang === 'bn' ? 'বিলম্ব ফি (ধারা ৪)' : 'Clause 4 Fine'}
            </span>
            <span className={`text-lg font-black font-mono ${isFuture ? 'text-sky-400' : !isLate ? 'text-emerald-400' : 'text-amber-400'}`}>
              ৳ {calculatedLateFee.toLocaleString()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Member Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center justify-between">
              <span>{lang === 'bn' ? 'সদস্য নির্বাচন করুন (Select Shareholder) *' : 'Select Shareholder *'}</span>
              <span className="text-[10px] text-emerald-400 font-mono">১৩ জন প্রতিষ্ঠাতা অংশীদার (NXR-001 to NXR-013)</span>
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium font-mono"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} — {lang === 'bn' ? m.nameBn : m.name} ({m.name}) • {m.share}% Share • নির্ধারিত কিস্তি: ৳{(m.share * 1000).toLocaleString()}/মাস
                </option>
              ))}
            </select>
          </div>

          {/* Month, Year, Payment Date, and Base Amount Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Month */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">{t.selectMonth} *</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {monthsList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">{t.selectYear} *</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
              </select>
            </div>

            {/* Payment Date */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center justify-between">
                <span>{lang === 'bn' ? 'পরিশোধের তারিখ *' : 'Payment Date *'}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {lang === 'bn' ? '১০ তারিখ নীতি' : '10th Day Rule'}
                </span>
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Base Monthly Installment (Locked) */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center justify-between">
                <span>{lang === 'bn' ? 'মূল কিস্তি (ধারা ৩.৪)' : 'Base Installment (3.4)'}</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <Lock className="w-3 h-3" />
                  {lang === 'bn' ? 'লকড' : 'Locked'}
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  disabled
                  value={`৳ ${lockedBaseAmount.toLocaleString()} (${currentSelectedMember.share}%)`}
                  className="w-full bg-slate-950/80 border border-emerald-500/40 rounded-xl p-3.5 text-sm text-emerald-400 font-mono font-bold cursor-not-allowed select-none pl-9"
                />
                <Lock className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

          </div>

          {/* SUBMISSION SUMMARY INTERFACE (LOCKED BREAKDOWN) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                {lang === 'bn' ? 'শেয়ার ও সদস্য' : 'Shareholder & Equity'}
              </span>
              <p className="text-sm font-bold text-white mt-1">
                {lang === 'bn' ? currentSelectedMember.nameBn : currentSelectedMember.name}
              </p>
              <p className="text-[11px] text-emerald-400 font-mono">
                {currentSelectedMember.id} • {currentSelectedMember.share}% Share
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                {lang === 'bn' ? 'মৌলিক কিস্তির পরিমাণ' : 'Base Installment Amount'}
              </span>
              <p className="text-lg font-bold text-white font-mono mt-1">
                ৳ {lockedBaseAmount.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400">
                {lang === 'bn' ? '১% = ৳১,০০০ (ধারা ৩.৪)' : '1% Share = ৳1,000 (Clause 3.4)'}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                {lang === 'bn' ? 'বিলম্ব ফি (ধারা ৪.৩)' : 'Clause 4 Late Fine'}
              </span>
              <p className={`text-lg font-bold font-mono mt-1 ${calculatedLateFee > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                ৳ {calculatedLateFee.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400">
                {calculatedLateFee > 0 
                  ? (lang === 'bn' ? `${currentSelectedMember.share} শেয়ার × ৳১০০` : `${currentSelectedMember.share} shares × ৳100`) 
                  : (lang === 'bn' ? 'কোনো জরিমানা নেই' : 'No fine applied')}
              </p>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl">
              <span className="text-[11px] font-bold text-emerald-400 block uppercase">
                {lang === 'bn' ? 'সর্বমোট জমার পরিমাণ' : 'Total Payable Amount'}
              </span>
              <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                ৳ {totalLockedAmount.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                {paymentDate} • {currentTime}
              </p>
            </div>
          </div>

          {/* Payment Method and TrxID Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Payment Method */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">{t.selectMethod} *</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {activeAccounts.map((acc) => {
                  const label = lang === 'bn' ? acc.titleBn : acc.titleEn;
                  return (
                    <option key={acc.id} value={label}>
                      {label} ({acc.accountNumber})
                    </option>
                  );
                })}
                <option value="Bank Transfer (BEFTN/NPSB)">Bank Transfer (BEFTN/NPSB)</option>
                <option value="Cash at Head Office">Cash at Head Office (Banani)</option>
              </select>
            </div>

            {/* TrxID / Deposit Slip */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                {t.trxIdLabel}
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="e.g. IBBL-88192 or CASH-RECEIPT-01"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

          </div>

          {/* Notes / Reference */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              {t.notesOptional}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Direct wire transfer from shareholder corporate account"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-base transition shadow-xl shadow-emerald-500/20 active:scale-[0.99] flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {isSubmitting 
                  ? (lang === 'bn' ? 'প্রসেসিং হচ্ছে...' : 'Processing...') 
                  : (lang === 'bn' 
                      ? `সরাসরি মূলধনে ৳${totalLockedAmount.toLocaleString()} জমা ও অনুমোদন নিশ্চিত করুন (ধারা ৪ পরিপালিত)` 
                      : `Log & Approve Direct Capital Deposit of ৳${totalLockedAmount.toLocaleString()} (Clause 4 Verified)`)}
              </span>
            </button>
          </div>

        </form>
      </div>

      {/* RECENT DIRECT DEPOSITS TABLE */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              {lang === 'bn' ? 'সম্প্রতি অনুমোদিত কিস্তি এন্ট্রি তালিকা' : 'Recently Logged & Verified Deposits'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'সর্বশেষ অনুমোদিত কিস্তিসমূহের রসিদ ও অডিট ব্যবস্থাপনা' : 'Latest verified installment receipts with audit tracking'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                <th className="py-3 px-3">{t.receiptNo}</th>
                <th className="py-3 px-3">{t.member}</th>
                <th className="py-3 px-3">{t.month}</th>
                <th className="py-3 px-3">{t.amount}</th>
                <th className="py-3 px-3">{t.method}</th>
                <th className="py-3 px-3">{t.date}</th>
                <th className="py-3 px-3 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
              {activeInstallments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    {lang === 'bn' ? 'এখনো কোনো কিস্তি এন্ট্রি করা হয়নি। ওপরের ফর্মের মাধ্যমে প্রথম কিস্তি জমা দিন।' : 'No installments logged yet. Use the form above to add an entry.'}
                  </td>
                </tr>
              ) : (
                activeInstallments.slice(0, 10).map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-mono text-xs font-bold text-slate-300">
                      {inst.receiptNo || `NXR-${inst.id}`}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      <div>{lang === 'bn' ? (inst.memberNameBn || inst.memberName) : inst.memberName}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">{inst.memberId}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {inst.month} {inst.year}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-400 font-mono">
                      ৳ {inst.amount.toLocaleString()}
                      {inst.lateFee && inst.lateFee > 0 ? (
                        <span className="block text-[10px] text-amber-400 font-normal">
                          {lang === 'bn' ? `(ফি: ৳${inst.lateFee})` : `(Fine: ৳${inst.lateFee})`}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <div>{inst.method}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{inst.trxId}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-xs">
                      {inst.date}
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => onViewReceipt(inst)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition border border-slate-700 inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{t.viewReceipt}</span>
                      </button>

                      {onDeleteInstallment && (
                        <button
                          onClick={() => setDeleteConfirmId(inst.id)}
                          className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition border border-rose-500/20 inline-flex items-center gap-1"
                          title="Move to Trash"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* DELETE CONFIRMATION MODAL */}
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
              <span>{lang === 'bn' ? 'কিস্তি ট্র্যাশে স্থানান্তর নিশ্চিতকরণ' : 'Move Installment to Trash'}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'bn' 
                ? 'আপনি কি নিশ্চিত যে এই কিস্তিটি মুছে ট্র্যাশে স্থানান্তর করতে চান? অডিট রেকর্ডের জন্য এটি সেন্ট্রাল ট্র্যাশে সংরক্ষিত থাকবে এবং যেকোনো সময় পুনরুদ্ধার করা যাবে।' 
                : 'Are you sure you want to move this installment to Trash? It will be archived in the central trash for audit compliance.'}
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
                <span>{lang === 'bn' ? 'ট্র্যাশে পাঠান' : 'Move to Trash'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

