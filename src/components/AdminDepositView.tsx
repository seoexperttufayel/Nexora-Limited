import React, { useState, useEffect } from 'react';
import { Member, Installment, Language } from '../types';
import { translations } from '../data/translations';
import { COMPANY_INFO } from '../data/initialData';
import { 
  Building2, Wallet, CheckCircle2, Clock, 
  Send, CreditCard, ShieldCheck, Timer, 
  Calendar, FileText, PlusCircle, AlertCircle, ArrowRight,
  Lock, Trash2, RotateCcw, ShieldAlert
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
}

export const AdminDepositView: React.FC<Props> = ({
  members,
  installments,
  lang,
  onAddDirectInstallment,
  onDeleteInstallment,
  onRestoreInstallment,
  onPermanentDeleteInstallment,
  onViewReceipt
}) => {
  const t = translations[lang];

  // Form State
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || 'NXR-001');
  const [month, setMonth] = useState('September');
  const [year, setYear] = useState(2026);
  const [method, setMethod] = useState('Islami Bank Direct');
  const [trxId, setTrxId] = useState('');
  const [lateFee, setLateFee] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<Installment | null>(null);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  // Base calculated installment strictly locked to 1% = 1000 BDT
  const lockedBaseAmount = (currentSelectedMember.share || 1) * 1000;
  const totalLockedAmount = lockedBaseAmount + (Number(lateFee) || 0);

  // Real-time ticking clock
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [currentDateString, setCurrentDateString] = useState(new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDateString(now.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [lang]);

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedMember) return;

    setIsSubmitting(true);
    const receiptSerial = `NXR-DIR-${year}-${Date.now().toString().slice(-4)}`;
    const finalTrx = trxId.trim() || `DIR-${Date.now().toString().slice(-6)}`;

    const newEntry: Partial<Installment> = {
      memberId: currentSelectedMember.id,
      memberName: currentSelectedMember.name,
      memberNameBn: currentSelectedMember.nameBn,
      month,
      year,
      amount: totalLockedAmount,
      lateFee: Number(lateFee) || 0,
      method,
      trxId: finalTrx,
      date: new Date().toISOString().split('T')[0],
      status: 'approved',
      approvedBy: 'Super Admin',
      approvedAt: new Date().toISOString(),
      notes: notes.trim(),
      isDeleted: false
    };

    setTimeout(() => {
      onAddDirectInstallment(newEntry);
      setIsSubmitting(false);
      setTrxId('');
      setLateFee(0);
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
        lateFee: Number(lateFee) || 0,
        method,
        trxId: finalTrx,
        date: new Date().toISOString().split('T')[0],
        status: 'approved',
        approvedBy: 'Super Admin',
        approvedAt: new Date().toISOString(),
        notes: notes.trim(),
        isDeleted: false
      };
      setSuccessReceipt(createdObj);
    }, 400);
  };

  const activeInstallments = installments.filter(i => !i.isDeleted && (i.approvedBy === 'Super Admin' || i.status === 'approved'));
  const trashedInstallments = installments.filter(i => i.isDeleted);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* HEADER WITH REAL-TIME CLOCK */}
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
              ? 'ইকুইটি ফর্মুলা অনুযায়ী সুরক্ষিত ও লক করা কিস্তির পরিমাণ সরাসরি ক্যাপিটাল লেজারে এন্ট্রি করুন।' 
              : 'Securely record auto-calculated installment amounts directly into the central capital ledger.'}
          </p>
        </div>

        {/* REAL-TIME TIMESTAMP BADGE & TRASH BUTTON */}
        <div className="flex items-center gap-4">
          {trashedInstallments.length > 0 && (
            <button
              onClick={() => setShowTrashModal(true)}
              className="flex items-center gap-1.5 px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-2xl text-xs font-semibold transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>{lang === 'bn' ? `ট্র্যাশ / অডিট (${trashedInstallments.length})` : `Trash (${trashedInstallments.length})`}</span>
            </button>
          )}

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right shrink-0">
            <div className="flex items-center justify-end gap-1.5 text-[10px] text-emerald-400 uppercase font-bold mb-1">
              <Timer className="w-3.5 h-3.5 animate-pulse" />
              <span>{lang === 'bn' ? 'সিস্টেম রিয়েল-টাইম' : 'System Real-Time'}</span>
            </div>
            <p className="text-2xl font-black text-white font-mono tracking-tight">
              {currentTime}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {currentDateString}
            </p>
          </div>
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
                {successReceipt.memberName} • {successReceipt.month} {successReceipt.year} • ৳{successReceipt.amount.toLocaleString()} ({successReceipt.method})
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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'bn' ? 'সরাসরি কিস্তি তথ্য এন্ট্রি ফর্ম' : 'Protected Direct Deposit Form'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'শেয়ারহোল্ডার নির্বাচন করলে কিস্তির পরিমাণ স্বয়ংক্রিয়ভাবে গণনা ও লক হবে' : 'Selecting a shareholder auto-calculates and strictly locks the installment amount'}
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              {lang === 'bn' ? 'স্বয়ংক্রিয়ভাবে লক করা পরিমাণ' : 'Locked Monthly Amount'}
            </span>
            <span className="text-xl font-black text-emerald-400 font-mono flex items-center gap-1.5 justify-end">
              <Lock className="w-4 h-4 text-emerald-400" />
              ৳ {totalLockedAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Member Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center justify-between">
              <span>{lang === 'bn' ? 'সদস্য নির্বাচন করুন (Select Shareholder) *' : 'Select Shareholder *'}</span>
              <span className="text-[10px] text-emerald-400 font-mono">১৩ জন সদস্য (NXR-001 to NXR-013)</span>
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

          {/* Month, Year, and LOCKED Amount Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            {/* Month */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">{t.selectMonth}</label>
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
              <label className="text-xs font-semibold text-slate-300 block mb-2">{t.selectYear}</label>
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

            {/* LOCKED Amount (Read-Only) */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center justify-between">
                <span>{t.amount} (BDT)</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <Lock className="w-3 h-3" />
                  {lang === 'bn' ? 'সুরক্ষিত ও লক' : 'Locked'}
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
              <p className="text-[10px] text-slate-500 mt-1">
                {lang === 'bn' ? '১% শেয়ার = ৳১,০০০ হারে স্বয়ংক্রিয় নির্ধারিত' : 'Auto-calculated based on 1% share = ৳1,000'}
              </p>
            </div>

            {/* Optional Late Fee */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                {lang === 'bn' ? 'বিলম্ব ফি (যদি থাকে)' : 'Late Fee (Optional)'}
              </label>
              <input
                type="number"
                min={0}
                value={lateFee || ''}
                onChange={(e) => setLateFee(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                {lang === 'bn' ? `মোট জমা হবে: ৳ ${totalLockedAmount.toLocaleString()}` : `Total to log: ৳ ${totalLockedAmount.toLocaleString()}`}
              </p>
            </div>

          </div>

          {/* Payment Method and TrxID Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Payment Method */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">{t.selectMethod}</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Islami Bank Direct">Islami Bank Direct (A/C: 2050392019482)</option>
                <option value="Bank Transfer (BEFTN/NPSB)">Bank Transfer (BEFTN/NPSB)</option>
                <option value="bKash Merchant">bKash Merchant (01711-000000)</option>
                <option value="Nagad Merchant">Nagad Merchant (01811-000000)</option>
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
                  : (lang === 'bn' ? `সরাসরি মূলধনে ৳${totalLockedAmount.toLocaleString()} জমা ও অনুমোদন নিশ্চিত করুন` : `Log & Approve Direct Capital Deposit of ৳${totalLockedAmount.toLocaleString()}`)}
              </span>
            </button>
          </div>

        </form>
      </div>

      {/* RECENT DIRECT DEPOSITS TABLE WITH DELETE / TRASH OPTION */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              {lang === 'bn' ? 'সম্প্রতি অনুমোদিত কিস্তি এন্ট্রি তালিকা' : 'Recently Logged & Verified Deposits'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'সর্বশেষ অনুমোদিত কিস্তিসমূহের রসিদ ও অডিট ম্যানেজমেন্ট' : 'Latest verified installment receipts with audit tracking'}
            </p>
          </div>

          {trashedInstallments.length > 0 && (
            <button
              onClick={() => setShowTrashModal(true)}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? `ট্র্যাশ দেখুন (${trashedInstallments.length})` : `View Trash (${trashedInstallments.length})`}</span>
            </button>
          )}
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <span>{lang === 'bn' ? 'কিস্তি ট্র্যাশে স্থানান্তর নিশ্চিতকরণ' : 'Move Installment to Trash'}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'bn' 
                ? 'আপনি কি নিশ্চিত যে এই কিস্তিটি মুছে ট্র্যাশে স্থানান্তর করতে চান? অডিট রেকর্ডের জন্য এটি ট্র্যাশে সংরক্ষিত থাকবে এবং যেকোনো সময় পুনরুদ্ধার করা যাবে।' 
                : 'Are you sure you want to move this installment to Trash? It will be archived for audit compliance and can be restored anytime.'}
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

      {/* TRASH & AUDIT TRAIL MODAL */}
      {showTrashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'bn' ? 'ট্র্যাশ ও অডিট ট্রেইল' : 'Installment Audit & Trash System'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'মুছে ফেলা কিস্তির তালিকা ও পুনরুদ্ধার ব্যবস্থা' : 'Archived deleted installments with restore and purge options'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTrashModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
              >
                {t.close}
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1">
              {trashedInstallments.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  {lang === 'bn' ? 'ট্র্যাশে কোনো কিস্তি নেই।' : 'Trash is empty.'}
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                      <th className="py-2.5 px-3">Receipt / Member</th>
                      <th className="py-2.5 px-3">Period</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Deleted Date</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {trashedInstallments.map((inst) => (
                      <tr key={inst.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{inst.memberName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{inst.receiptNo || inst.id} ({inst.memberId})</div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {inst.month} {inst.year}
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-400 font-mono">
                          ৳ {inst.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                          {inst.deletedAt ? new Date(inst.deletedAt).toLocaleDateString() : inst.date}
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          {onRestoreInstallment && (
                            <button
                              onClick={() => onRestoreInstallment(inst.id)}
                              className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{lang === 'bn' ? 'পুনরুদ্ধার' : 'Restore'}</span>
                            </button>
                          )}
                          {onPermanentDeleteInstallment && (
                            <button
                              onClick={() => {
                                if (window.confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত যে এটি স্থায়ীভাবে মুছে ফেলতে চান?' : 'Permanently purge this record?')) {
                                  onPermanentDeleteInstallment(inst.id);
                                }
                              }}
                              className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs transition"
                              title="Purge Permanently"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>Total in Trash: {trashedInstallments.length}</span>
              <button
                onClick={() => setShowTrashModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
