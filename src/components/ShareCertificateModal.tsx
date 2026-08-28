import React from 'react';
import { Member, Language } from '../types';
import { COMPANY_INFO } from '../data/initialData';
import { X, Printer, Award, ShieldCheck, CheckCircle, FileText } from 'lucide-react';

interface Props {
  member: Member;
  lang: Language;
  onClose: () => void;
}

export const ShareCertificateModal: React.FC<Props> = ({ member, lang, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-4 sm:p-8 shadow-2xl relative text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:max-w-none my-auto">
        
        {/* Top Control bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden mb-4 sm:mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
              {lang === 'bn' ? 'অফিসিয়াল শেয়ার সনদপত্র' : 'Official Share Certificate'}
            </span>
            <span className="text-xs text-slate-400 font-mono">CERT-{member.id}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'bn' ? 'প্রিন্ট করুন' : 'Print'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
              title="Close / বন্ধ করুন"
              aria-label="Close Share Certificate"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ORNATE CERTIFICATE DESIGN CONTAINER */}
        <div className="border-2 sm:border-4 border-amber-500/40 print:border-4 print:border-amber-800 rounded-2xl p-1.5 sm:p-2 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 print:bg-white relative">
          
          <div className="border border-dashed sm:border-2 border-amber-500/30 print:border-amber-900 rounded-xl p-5 sm:p-12 text-center relative overflow-hidden">
            
            {/* Background watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 print:opacity-10">
              <Award className="w-72 sm:w-96 h-72 sm:h-96 text-amber-400 print:text-black" />
            </div>

            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-amber-500 mx-auto flex items-center justify-center font-black text-slate-950 text-2xl sm:text-3xl shadow-xl shadow-amber-500/20 print:bg-black print:text-white mb-2 sm:mb-3">
                N
              </div>
              <h1 className="text-xl sm:text-3xl font-serif font-black tracking-wide text-amber-400 print:text-slate-950">
                NEXORA LIMITED
              </h1>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 print:text-slate-700 mt-1">
                Incorporated under the Companies Act (Act XVIII of 1994) | Reg No: {COMPANY_INFO.regNo}
              </p>
              <div className="w-24 sm:w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2 sm:mt-3" />
            </div>

            {/* Title */}
            <div className="my-4 sm:my-6">
              <h2 className="text-lg sm:text-2xl font-serif font-bold text-white print:text-black">
                {lang === 'bn' ? 'প্রতিষ্ঠাতা শেয়ারহোল্ডার সনদপত্র' : 'FOUNDER SHARE CERTIFICATE'}
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-400 print:text-slate-600 mt-1 font-mono">
                Certificate Ref: NXR/FOUNDER/2026/{member.id}
              </p>
            </div>

            {/* Main Certificate Statement */}
            <div className="max-w-xl mx-auto space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed font-sans">
              <p>
                {lang === 'bn' 
                  ? 'এতদ্বারা প্রত্যয়ন করা যাইতেছে যে,' 
                  : 'This is to certify that'}
              </p>

              <div className="py-1 sm:py-2">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white print:text-black tracking-wide">
                  {lang === 'bn' ? member.nameBn : member.name}
                </h3>
                <p className="text-xs text-amber-400 print:text-slate-900 font-mono mt-1">
                  Member ID: {member.id} | {lang === 'bn' ? member.designationBn : member.designationEn}
                </p>
              </div>

              <p className="text-xs sm:text-sm">
                {lang === 'bn'
                  ? `নেক্সোরা লিমিটেডের মোট ইকুইটির মধ্যে ${member.share}% (শতকরা ${member.share} ভাগ) শেয়ারের একক সত্ত্বাধিকারী এবং সম্মানিত প্রতিষ্ঠাতা সদস্য হিসেবে যথাযথভাবে নিবন্ধিত হইয়াছেন।`
                  : `is the duly registered holder of ${member.share}% (Percent) of the Founder Equity shares in NEXORA LIMITED, entitled to full shareholder voting, dividend, and Shariah-compliant joint venture rights.`}
              </p>

              <div className="inline-block bg-slate-900 print:bg-slate-100 border border-amber-500/30 print:border-amber-900 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 my-2 sm:my-4">
                <p className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 uppercase font-semibold">
                  {lang === 'bn' ? 'মোট বরাদ্দকৃত শেয়ার অংশীদারিত্ব' : 'Total Allocated Equity Share'}
                </p>
                <p className="text-2xl sm:text-3xl font-serif font-black text-amber-400 print:text-slate-950 mt-0.5">
                  {member.share}% <span className="text-xs font-sans text-slate-400 print:text-slate-700">({member.share * 1000} BDT/Mo Subscription)</span>
                </p>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-8 sm:pt-12 mt-6 sm:mt-8 border-t border-slate-800 print:border-slate-400 grid grid-cols-3 gap-2 sm:gap-4 items-end text-[10px] sm:text-xs">
              <div>
                <div className="h-8 sm:h-10 border-b border-slate-700 print:border-black flex items-end justify-center pb-1">
                  <span className="font-serif italic text-slate-300 print:text-black text-xs sm:text-sm">Tufayel Ahmed</span>
                </div>
                <p className="text-slate-400 print:text-slate-700 font-medium mt-1">
                  {lang === 'bn' ? 'ব্যবস্থাপনা পরিচালক' : 'Managing Director'}
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-amber-500/60 print:border-black text-amber-400 print:text-black flex flex-col items-center justify-center text-[6px] sm:text-[7px] font-bold uppercase rotate-[-8deg] shadow-lg">
                  <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4 mb-0.5 text-emerald-400 print:text-black" />
                  <span>SEAL OF</span>
                  <span>NEXORA</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-500 print:text-slate-600 mt-1">Shariah Certified</p>
              </div>

              <div>
                <div className="h-8 sm:h-10 border-b border-slate-700 print:border-black flex items-end justify-center pb-1">
                  <span className="font-serif italic text-slate-300 print:text-black text-xs sm:text-sm">Md. Al-Amin</span>
                </div>
                <p className="text-slate-400 print:text-slate-700 font-medium mt-1">
                  {lang === 'bn' ? 'পরিচালক (অর্থ ও হিসাব)' : 'Director (Finance)'}
                </p>
              </div>
            </div>

            {/* Date & Note */}
            <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 text-[9px] sm:text-[10px] text-slate-500 print:text-slate-600 flex flex-col sm:flex-row justify-between gap-1">
              <span>Date of Issue: {member.joinedDate}</span>
              <span>Head Office: {COMPANY_INFO.headOfficeEn}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
