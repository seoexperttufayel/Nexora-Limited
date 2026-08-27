import React, { useState } from 'react';
import { Language, Member, Installment, Project } from '../types';
import { translations } from '../data/translations';
import { COMPANY_INFO } from '../data/initialData';
import { 
  ShieldCheck, Users, Wallet, ArrowRight, CheckCircle2, 
  TrendingUp, Building2, Calculator, ChevronRight, Lock, 
  Sparkles, FileText, Check, Award
} from 'lucide-react';

interface Props {
  lang: Language;
  members: Member[];
  installments: Installment[];
  projects: Project[];
  onOpenLogin: () => void;
  onSelectTab: (tab: string) => void;
}

export const HomeView: React.FC<Props> = ({
  lang,
  members,
  installments,
  projects,
  onOpenLogin,
  onSelectTab
}) => {
  const t = translations[lang];
  const [calcShares, setCalcShares] = useState(5);

  const totalCapitalVerified = installments
    .filter(i => i.status === 'approved')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalSoldShares = members.reduce((sum, m) => sum + m.share, 0);
  const monthlySubscriptionTarget = totalSoldShares * 1000;

  return (
    <div className="space-y-16 pb-12 animate-in fade-in duration-300">
      
      {/* HERO SECTION */}
      <section className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-14 overflow-hidden shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.shariahBadge} • RJSC Reg: {COMPANY_INFO.regNo}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {lang === 'bn' ? (
              <>ব্যবসার ভবিষ্যৎ ও <span className="text-emerald-400">শরিয়াহ-সম্মত</span> নিরাপদ যৌথ বিনিয়োগ</>
            ) : (
              <>Innovating Shariah-Compliant <span className="text-emerald-400">Joint Investments</span></>
            )}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {t.subTagline}. {lang === 'bn' 
              ? '১৩ জন উদ্যোক্তার ঐকমত্যে প্রতিষ্ঠিত সুদমুক্ত যৌথ মালিকানাধীন ব্যবসায়িক কাঠামো।' 
              : 'Formed by 13 founder entrepreneurs with zero-interest, transparent profit-sharing principles.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base transition shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 group"
            >
              <Lock className="w-4 h-4" />
              <span>{t.clientArea}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => onSelectTab('governance')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm sm:text-base transition border border-slate-700"
            >
              {t.governance}
            </button>
          </div>
        </div>
      </section>

      {/* METRICS & VERIFIED CORPORATE PILLARS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* RJSC Corporate Registration */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition relative group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'bn' ? 'সরকারি নিবন্ধন' : 'RJSC Registration'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            {COMPANY_INFO.regNo.split(' ')[0]}
          </p>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {lang === 'bn' ? 'RJSC অনুমোদিত লিমিটেড কোম্পানি' : 'Incorporated Limited Company'}
          </p>
        </div>

        {/* Founder Shareholders */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition relative group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.soldEquity}</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {totalSoldShares}% <span className="text-xs font-sans text-slate-400 font-normal">/ 100%</span>
          </p>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            {lang === 'bn' ? '১৩ জন প্রতিষ্ঠাতা উদ্যোক্তা' : '13 Founder Shareholder Board'}
          </p>
        </div>

        {/* Shariah Compliance */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition relative group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.ribaFree}</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400">
            {lang === 'bn' ? '১০০% সুদ ও রিবা মুক্ত' : '100% Halal Model'}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {lang === 'bn' ? 'মুশারাকা ও মুদারাবা নীতি' : 'Musharakah & Mudarabah'}
          </p>
        </div>

        {/* Investment Formula */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition relative group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'bn' ? 'কিস্তি ফ্রেমওয়ার্ক' : 'Installment Rate'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            ৳ ১,০০০ <span className="text-xs font-sans text-slate-400 font-normal">/ ১% শেয়ার</span>
          </p>
          <p className="text-xs text-amber-400 mt-2 flex items-center gap-1 font-medium">
            <span>{lang === 'bn' ? 'মাসিক নির্ধারিত শেয়ার অনুপাত' : 'Monthly per 1% share'}</span>
          </p>
        </div>

      </section>

      {/* INTERACTIVE SHARE / INSTALLMENT CALCULATOR */}
      <section className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                <Calculator className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {lang === 'bn' ? 'শেয়ার ও কিস্তি হিসাব ক্যালকুলেটর' : 'Share & Installment Calculator'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {lang === 'bn' ? 'আপনার বিনিয়োগ অনুপাত গণনা করুন' : 'Calculate Equity & Monthly Contribution'}
              </h2>
            </div>
            <div className="text-xs text-slate-400">
              {lang === 'bn' ? '১% শেয়ার = মাসিক ৳১,০০০ কিস্তি' : '1% Share = ৳1,000 Monthly Installment'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2 flex justify-between">
                  <span>{lang === 'bn' ? 'শেয়ারের শতকরা হার (%)' : 'Share Percentage (%)'}</span>
                  <span className="font-bold text-emerald-400 font-mono text-base">{calcShares}%</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={calcShares}
                  onChange={(e) => setCalcShares(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1.5">
                  <span>1%</span>
                  <span>5%</span>
                  <span>10% (Director)</span>
                  <span>25%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1, 3, 10].map((val) => (
                  <button
                    key={val}
                    onClick={() => setCalcShares(val)}
                    className={`py-2 text-xs rounded-xl font-semibold border transition ${
                      calcShares === val
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {val}% {val === 10 ? '(Founder Dir)' : val === 3 ? '(Shareholder)' : '(Min)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">
                  {lang === 'bn' ? 'মাসিক নির্ধারিত কিস্তি' : 'Monthly Required Installment'}
                </span>
                <p className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                  ৳ {(calcShares * 1000).toLocaleString()} <span className="text-xs font-normal text-slate-400">/mo</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>{lang === 'bn' ? 'বার্ষিক মোট মূলধন সৃষ্টি:' : '12-Month Total Capital:'}</span>
                  <span className="font-semibold text-white font-mono">৳ {(calcShares * 1000 * 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'bn' ? 'লভ্যাংশ অধিকার:' : 'Profit Entitlement:'}</span>
                  <span className="font-semibold text-emerald-400 font-mono">{calcShares}% proportionate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTED PROJECTS PREVIEW */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              {lang === 'bn' ? 'চলমান প্রকল্পসমূহ' : 'Active Portfolio'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {lang === 'bn' ? 'নেক্সোরা বিনিয়োগ প্রকল্প ও অর্জন' : 'Featured Investment Projects'}
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('projects')}
            className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 transition"
          >
            <span>{lang === 'bn' ? 'সকল প্রকল্প দেখুন' : 'View All Projects'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col hover:border-slate-700 transition group shadow-lg"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={proj.image}
                  alt={proj.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  {lang === 'bn' ? proj.categoryBn : proj.categoryEn}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition leading-snug">
                    {lang === 'bn' ? proj.titleBn : proj.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {lang === 'bn' ? proj.descriptionBn : proj.descriptionEn}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>{lang === 'bn' ? 'তহবিল সংগ্রহ' : 'Funding Progress'}</span>
                    <span className="font-bold text-white font-mono">
                      {Math.round((proj.raisedBudget / proj.targetBudget) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (proj.raisedBudget / proj.targetBudget) * 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-emerald-400 font-medium pt-1">
                    <span>{lang === 'bn' ? proj.shariahModelBn : proj.shariahModelEn}</span>
                    <span className="text-slate-400">৳ {(proj.raisedBudget / 100000).toFixed(1)}L Raised</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDER COMMITTEE & SHAREHOLDERS SHOWCASE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              {lang === 'bn' ? 'পরিচালনা পরিষদ ও কমিটি' : 'Governance & Leadership'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {lang === 'bn' ? '১৩ জন প্রতিষ্ঠাতা সদস্য ও দায়িত্বপ্রাপ্ত কমিটি' : '13 Founder Members & Executive Committee'}
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('governance')}
            className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 transition"
          >
            <span>{lang === 'bn' ? 'সম্পূর্ণ পরিষদ ও শেয়ার সনদ' : 'Full Board & Certificates'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-emerald-400 text-xs group-hover:border-emerald-500 transition">
                  {m.id}
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {m.share}% Share
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                  {lang === 'bn' ? m.nameBn : m.name}
                </h4>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {lang === 'bn' ? m.designationBn : m.designationEn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'bn' ? 'মাসিক কিস্তি:' : 'Monthly:'}</span>
                <span className="font-mono font-semibold text-white">৳{(m.share * 1000).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ISLAMIC FINANCING PRINCIPLES / WHY NEXORA */}
      <section className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
            {lang === 'bn' ? 'আমাদের ভিত্তি' : 'Core Principles'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {lang === 'bn' ? 'কেন নেক্সোরা লিমিটেড সম্পূর্ণ আলাদা?' : 'Why Nexora Limited Stands Out?'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">
              {lang === 'bn' ? '১০০% সুদ ও রিবা মুক্ত' : '100% Riba Free'}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {lang === 'bn'
                ? 'ইসলামিক শরিয়াহর মুদারাবা ও মুশারাকা মূলনীতিতে প্রতিটি বিনিয়োগ প্রকল্প বাস্তবায়িত হয়।'
                : 'Every project is strictly screened and audited to ensure zero interest-bearing exposure.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">
              {lang === 'bn' ? 'সম্পূর্ণ আর্থিক স্বচ্ছতা' : 'Full Financial Transparency'}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {lang === 'bn'
                ? 'প্রতিটি কিস্তি জমায় ডিজিটাল মানি রসিদ, কিস্তি স্টেটমেন্ট এবং অনলাইন অনুমোদন কিউ।'
                : 'Real-time ledger access, digital receipt generation, and live approval tracking for every founder.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">
              {lang === 'bn' ? 'আইনি ও সরকারি নিবন্ধন' : 'Legal & RJSC Registered'}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {lang === 'bn'
                ? `যৌথমূলধন কোম্পানি ও ফার্মসমূহের পরিদপ্তর (RJSC) নিবন্ধিত লিমিটেড কোম্পানি: ${COMPANY_INFO.regNo}`
                : `Duly incorporated under Bangladesh RJSC Limited Company framework with legal shareholder rights.`}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
