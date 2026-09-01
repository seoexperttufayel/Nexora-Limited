import React, { useEffect } from 'react';
import { Installment, Language, Member } from '../types';
import { COMPANY_INFO } from '../data/initialData';
import { NexoraLogo } from './NexoraLogo';
import { numberToWordsBn, numberToWordsEn } from '../utils/numberToWords';
import { X, Printer, ShieldCheck, CheckCircle2, Download, Building2 } from 'lucide-react';

interface Props {
  installment: Installment;
  member?: Member;
  lang: Language;
  onClose: () => void;
}

export const MoneyReceiptModal: React.FC<Props> = ({ installment, member, lang, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-40 flex items-start justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 pt-36 sm:pt-40 md:pt-44 pb-12 overflow-y-auto print:p-0 print:bg-white animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl relative text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:max-w-none my-2">
        
        {/* Modal Action Bar (hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden mb-4 sm:mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              {lang === 'bn' ? 'অফিসিয়াল মানি রসিদ' : 'Official Money Receipt'}
            </span>
            <span className="text-xs text-slate-400 font-mono">{installment.receiptNo || installment.id}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md active:scale-95"
              title={lang === 'bn' ? 'রসিদ প্রিন্ট করুন' : 'Print Receipt'}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'প্রিন্ট বা সংরক্ষণ' : 'Print / Save'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 transition border border-slate-700 hover:border-rose-500/30"
              title="Close / বন্ধ করুন (Esc)"
              aria-label="Close Money Receipt"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTAINER */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-8 relative overflow-hidden print:bg-white print:border-2 print:border-slate-900 print:p-8">
          
          {/* Header watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 select-none print:opacity-10">
            <span className="text-6xl sm:text-8xl font-black tracking-widest text-white print:text-black">NEXORA</span>
          </div>

          {/* Receipt Top Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 sm:pb-6 border-b border-slate-800 print:border-slate-900">
            <div className="flex items-center space-x-3">
              <NexoraLogo size="md" variant="badge" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white print:text-black tracking-wide">NEXORA LIMITED</h2>
                <p className="text-[11px] sm:text-xs text-emerald-400 print:text-slate-700 font-medium">
                  {lang === 'bn' ? 'নেক্সোরা লিমিটেড (শরিয়াহ ভিত্তিক যৌথ বিনিয়োগ)' : 'Shariah-Compliant Property & Business Investments'}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 print:text-slate-600 font-mono">
                  RJSC Reg: {COMPANY_INFO.regNo} | TIN: {COMPANY_INFO.tin}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right w-full sm:w-auto">
              <div className="inline-block bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300 rounded-lg px-3 py-1 text-left sm:text-right">
                <p className="text-[9px] sm:text-[10px] text-slate-400 print:text-slate-600 uppercase tracking-wider font-semibold">
                  {lang === 'bn' ? 'মানি রসিদ নং' : 'Money Receipt No'}
                </p>
                <p className="text-xs sm:text-sm font-bold text-emerald-400 print:text-slate-900 font-mono">
                  {installment.receiptNo || `NXR-REC-${installment.id}`}
                </p>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 print:text-slate-600 mt-1">
                {lang === 'bn' ? 'ইস্যুর তারিখ:' : 'Issue Date:'} <span className="font-semibold text-slate-200 print:text-black font-mono">{installment.date}</span>
              </p>
            </div>
          </div>

          {/* Receipt Body */}
          <div className="py-4 sm:py-6 space-y-3 sm:space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-slate-900/60 print:bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-800/80 print:border-slate-200">
              <div>
                <span className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 block">{lang === 'bn' ? 'শেয়ারহোল্ডারের নাম' : 'Shareholder Name'}</span>
                <span className="font-bold text-white print:text-black text-sm sm:text-base">
                  {lang === 'bn' ? (installment.memberNameBn || installment.memberName) : installment.memberName}
                </span>
                <span className="text-[11px] sm:text-xs text-emerald-400 print:text-emerald-800 font-mono block mt-0.5">
                  ID: {installment.memberId}
                </span>
              </div>

              <div>
                <span className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 block">{lang === 'bn' ? 'কিস্তির মাস ও বছর' : 'Installment Month & Year'}</span>
                <span className="font-bold text-white print:text-black text-sm sm:text-base">
                  {installment.month} {installment.year}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 print:text-slate-600 block mt-0.5">
                  {lang === 'bn' ? 'নিয়মিত মূলধন অংশীদারি' : 'Regular Equity Contribution'}
                </span>
              </div>
            </div>

            {/* Payment Specifics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
              <div className="p-2.5 sm:p-3 bg-slate-900/40 print:bg-white rounded-lg border border-slate-800 print:border-slate-200">
                <span className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 block">{lang === 'bn' ? 'পরিশোধের মাধ্যম' : 'Payment Method'}</span>
                <span className="font-semibold text-white print:text-black mt-0.5 block">{installment.method}</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-slate-900/40 print:bg-white rounded-lg border border-slate-800 print:border-slate-200">
                <span className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 block">{lang === 'bn' ? 'ট্রানজেকশন / স্লিপ নং' : 'Trx ID / Slip No'}</span>
                <span className="font-mono font-semibold text-emerald-400 print:text-black mt-0.5 block truncate">{installment.trxId}</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-slate-900/40 print:bg-white rounded-lg border border-slate-800 print:border-slate-200">
                <span className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 block">{lang === 'bn' ? 'ভেরিফিকেশন স্ট্যাটাস' : 'Verification Status'}</span>
                <span className="font-bold text-emerald-400 print:text-emerald-700 capitalize mt-0.5 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {installment.status}
                </span>
              </div>
            </div>

            {/* Amount Box */}
            <div className="p-3.5 sm:p-4 bg-emerald-500/10 print:bg-slate-100 border border-emerald-500/20 print:border-slate-300 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 block">{lang === 'bn' ? 'মোট জমাকৃত অর্থের পরিমাণ' : 'Total Amount Received'}</span>
                <p className="text-xs text-slate-300 print:text-slate-700 font-medium italic mt-0.5">
                  {lang === 'bn' ? 'কথায়: ' : 'In words: '} {lang === 'bn' ? numberToWordsBn(installment.amount) : numberToWordsEn(installment.amount)}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 print:text-slate-950 font-mono">
                  ৳ {installment.amount.toLocaleString()}
                </span>
              </div>
            </div>

          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 sm:pt-8 mt-4 border-t border-dashed border-slate-800 print:border-slate-400 grid grid-cols-2 gap-4 sm:gap-8 text-center text-xs">
            <div>
              <div className="w-20 sm:w-24 h-10 sm:h-12 mx-auto border-b border-slate-700 print:border-black flex items-end justify-center pb-1">
                <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 print:text-black">Digital Ack</span>
              </div>
              <p className="text-slate-400 print:text-slate-700 font-medium mt-1 text-[11px] sm:text-xs">
                {lang === 'bn' ? 'জমাদানকারীর স্বাক্ষর' : 'Depositor Signature'}
              </p>
            </div>

            <div>
              <div className="w-24 sm:w-28 h-10 sm:h-12 mx-auto border-b border-slate-700 print:border-black flex items-center justify-center relative">
                <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full border border-emerald-500/40 text-emerald-400 print:border-black print:text-black flex items-center justify-center text-[7px] sm:text-[8px] font-bold uppercase rotate-[-12deg]">
                  VERIFIED
                </div>
              </div>
              <p className="text-slate-400 print:text-slate-700 font-medium mt-1 text-[11px] sm:text-xs">
                {lang === 'bn' ? 'অনুমোদিত স্বাক্ষর (নেক্সোরা লিঃ)' : 'Authorized Signature (Nexora)'}
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-900 print:border-slate-300 text-center text-[9px] sm:text-[10px] text-slate-500 print:text-slate-600">
            <p>{COMPANY_INFO.headOfficeEn} | Hotline: {COMPANY_INFO.hotline}</p>
            <p className="mt-0.5">{lang === 'bn' ? 'এটি একটি কম্পিউটার জেনারেটেড ডিজিটাল রসিদ, যা শরিয়াহ নিরীক্ষায় সংরক্ষিত।' : 'This is a computer-generated digital receipt maintained under Shariah compliance.'}</p>
          </div>

        </div>

      </div>
    </div>
  );
};
