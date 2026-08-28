import React, { useState } from 'react';
import { Language, Member, Installment, Project, CompanyPost } from '../types';
import { translations } from '../data/translations';
import { COMPANY_INFO, COMPANY_POSTS } from '../data/initialData';
import { 
  ShieldCheck, Users, Wallet, ArrowRight, CheckCircle2, 
  TrendingUp, Building2, Calculator, ChevronRight, Lock, 
  Sparkles, FileText, Check, Award, Calendar, Clock, Tag, 
  X, ExternalLink, Newspaper, Eye, Shield, Landmark, Scale
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
  const [selectedPost, setSelectedPost] = useState<CompanyPost | null>(null);
  const [postCategoryFilter, setPostCategoryFilter] = useState<string>('all');

  const totalSoldShares = members.filter(m => !m.isDeleted).reduce((sum, m) => sum + m.share, 0);

  // Filtered Company Posts
  const filteredPosts = postCategoryFilter === 'all'
    ? COMPANY_POSTS
    : COMPANY_POSTS.filter(p => p.categoryEn.toLowerCase() === postCategoryFilter.toLowerCase());

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
              ? '১৩ জন উদ্যোক্তা পরিচালকের ঐকমত্যে প্রতিষ্ঠিত সুদমুক্ত প্রাতিষ্ঠানিক যৌথ ব্যবসায়িক প্ল্যাটফর্ম।' 
              : 'Institutional Shariah-compliant enterprise founded by 13 directors with zero-interest, transparent profit-sharing principles.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base transition shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 group active:scale-95"
            >
              <Lock className="w-4 h-4" />
              <span>{t.clientArea}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => onSelectTab('about')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm sm:text-base transition border border-slate-700 active:scale-95"
            >
              {t.about}
            </button>
          </div>
        </div>
      </section>

      {/* VERIFIED CORPORATE PILLARS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* 1. RJSC Corporate Registration */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition relative group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'bn' ? 'সরকারি নিবন্ধন' : 'RJSC Registration'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            {COMPANY_INFO.regNo.split(' ')[0]}
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'নিবন্ধিত লিমিটেড কোম্পানি' : 'Incorporated Company'}</span>
          </div>
        </div>

        {/* 2. Corporate Governance & Equity */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition relative group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'bn' ? 'পরিচালনা পরিষদ' : 'Board Structure'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            ১৩ প্রতিষ্ঠাতা পরিচালক
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{lang === 'bn' ? 'ব্যবস্থাপনা ও উপদেষ্টা' : 'Management & Advisory'}</span>
            <span className="font-semibold text-purple-300 font-mono">১০০% যৌথ মালিকানা</span>
          </div>
        </div>

        {/* 3. Shariah Compliance */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition relative group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'bn' ? 'শরিয়াহ মডেল' : 'Islamic Model'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400">
            {lang === 'bn' ? '১০০% সুদ ও রিবা মুক্ত' : '100% Halal Model'}
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1 text-xs text-slate-400">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? 'মুশারাকা ও মুদারাবা নীতি' : 'Musharakah & Mudarabah'}</span>
          </div>
        </div>

      </section>

      {/* SECTION: COMPANY HIGHLIGHTS & POSTS (5 PROFESSIONAL UPDATES) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-1">
              <Newspaper className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {lang === 'bn' ? 'কোম্পানি হাইলাইটস ও বুলেটিন' : 'Corporate Highlights & Updates'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'bn' ? 'নেক্সোরা লিমিটেড সংবাদ ও সাম্প্রতিক অগ্রগতি' : 'Nexora Limited News & Milestone Posts'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              {lang === 'bn' 
                ? 'শরিয়াহ বোর্ড অডিট, আরজেএসসি সনদ, টেকসই এগ্রো প্রকল্প এবং ক্লাউড লেজার প্রযুক্তির সর্বশেষ আপডেটসমূহ।' 
                : 'Latest verified updates on Shariah audits, RJSC incorporation, agro-investments, and cloud transparency.'}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', labelBn: 'সকল পোস্ট (৫)', labelEn: 'All Posts (5)' },
              { id: 'Shariah & Ethics', labelBn: 'শরিয়াহ', labelEn: 'Shariah' },
              { id: 'Corporate & Legal', labelBn: 'আইনি', labelEn: 'Legal' },
              { id: 'Project Progress', labelBn: 'প্রকল্প', labelEn: 'Projects' },
              { id: 'Tech & Transparency', labelBn: 'প্রযুক্তি', labelEn: 'Tech' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setPostCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  postCategoryFilter.toLowerCase() === cat.id.toLowerCase()
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {lang === 'bn' ? cat.labelBn : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, idx) => (
            <article
              key={post.id}
              className={`bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition duration-300 flex flex-col justify-between overflow-hidden group shadow-lg ${
                idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div>
                {/* Post Cover Photo */}
                <div className={`overflow-hidden relative ${idx === 0 ? 'h-56 sm:h-64' : 'h-48'}`}>
                  <img
                    src={post.image}
                    alt={post.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Category Chip */}
                  <div className="absolute top-3.5 left-3.5 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5 shadow-md">
                    <Tag className="w-3 h-3" />
                    <span>{lang === 'bn' ? post.categoryBn : post.categoryEn}</span>
                  </div>

                  {/* Date Chip */}
                  <div className="absolute bottom-3 left-3.5 flex items-center space-x-2 text-xs text-slate-300 font-medium">
                    <span className="flex items-center space-x-1 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700/80 backdrop-blur-sm">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      <span>{post.date}</span>
                    </span>
                    <span className="flex items-center space-x-1 bg-slate-900/80 px-2 py-1 rounded-md border border-slate-700/80 backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{lang === 'bn' ? post.readTimeBn : post.readTimeEn}</span>
                    </span>
                  </div>
                </div>

                {/* Post Body */}
                <div className="p-6 space-y-3">
                  <div className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? post.authorBn : post.authorEn}</span>
                  </div>

                  <h3 className={`font-bold text-white group-hover:text-emerald-400 transition leading-snug ${
                    idx === 0 ? 'text-lg sm:text-xl' : 'text-base'
                  }`}>
                    {lang === 'bn' ? post.titleBn : post.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {lang === 'bn' ? post.summaryBn : post.summaryEn}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(lang === 'bn' ? post.tagsBn : post.tagsEn).map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-6 pt-0 border-t border-slate-800/80 mt-2">
                <button
                  onClick={() => setSelectedPost(post)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition flex items-center justify-center space-x-2 group/btn border border-slate-700"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400 group-hover/btn:text-slate-950" />
                  <span>{lang === 'bn' ? 'সম্পূর্ণ আর্টিকেল পড়ুন' : 'Read Full Article'}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* INTERACTIVE SHARE & CAPITAL CALCULATOR */}
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

      {/* INSTITUTIONAL GOVERNANCE & PRIVACY-PROTECTED LEADERSHIP OVERVIEW */}
      <section className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'প্রাতিষ্ঠানিক গভর্ন্যান্স কাঠামো' : 'Corporate Governance Structure'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'bn' ? 'পরিচালনা পর্ষদ ও প্রাতিষ্ঠানিক পরিষদ' : 'Board of Directors & Governance Council'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              {lang === 'bn'
                ? 'নেক্সোরা লিমিটেড ১৩ জন প্রতিষ্ঠাতা অংশীদারের সমন্বয়ে গঠিত যৌথ মূলধনী প্রতিষ্ঠান।'
                : 'Nexora Limited is structured by 13 founder directors governing executive operations and strategic growth.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold transition flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'শেয়ারহোল্ডার লগইন' : 'Shareholder Login'}</span>
            </button>
          </div>
        </div>

        {/* 3 Executive Divisions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'bn' ? 'ব্যবস্থাপনা কমিটি (দেশ)' : 'Management Committee (Domestic)'}
              </h3>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">
                {lang === 'bn' ? '৮ জন পরিচালক • সিলেট, বাংলাদেশ' : '8 Executive Directors • Sylhet, Bangladesh'}
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'কোম্পানির দৈনন্দিন নির্বাহী কার্যক্রম, প্রকল্প বাস্তবায়ন, অর্থ ও হিসাবরক্ষণ এবং সরাসরি ব্যবসায়িক পরিচালনা নিশ্চিত করেন।'
                : 'Overseeing daily operational workflows, capital deployment, on-ground project execution, and local treasury management.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'bn' ? 'উপদেষ্টা পরিষদ (প্রবাস)' : 'Advisory Council (Abroad)'}
              </h3>
              <p className="text-xs text-blue-400 font-medium mt-0.5">
                {lang === 'bn' ? '৫ জন পরিচালক • সৌদি আরব, যুক্তরাজ্য, ইউএই' : '5 Directors • KSA, UK, UAE'}
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'আন্তর্জাতিক অভিজ্ঞতা, বৈদেশিক অংশীদারিত্ব, কৌশলগত পরিকল্পনা এবং বিনিয়োগের দিকনির্দেশনা প্রদান করেন।'
                : 'Providing global investment insights, foreign capital alignment, diaspora networking, and long-term strategic oversight.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'bn' ? 'শরিয়াহ সুপারভাইজরি কমিটি' : 'Shariah Supervisory Council'}
              </h3>
              <p className="text-xs text-amber-400 font-medium mt-0.5">
                {lang === 'bn' ? 'স্বতন্ত্র ইসলামিক স্কলার প্যানেল' : 'Independent Islamic Jurisprudence Panel'}
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'সকল চুক্তি, প্রকল্প লভ্যাংশ বণ্টন এবং বিনিয়োগ প্রক্রিয়ার শতভাগ ইসলামিক কমপ্লায়েন্স ও অডিট তত্ত্বাবধান করেন।'
                : 'Quarterly auditing all asset contracts, revenue-sharing distributions, and ensuring 100% interest-free execution.'}
            </p>
          </div>

        </div>

        {/* Shareholder Privacy Banner */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3 text-slate-300">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {lang === 'bn'
                ? 'আইনি নীতিমালা ও ব্যক্তিগত সুরক্ষার স্বার্থে শেয়ারহোল্ডারদের ব্যক্তিগত শেয়ার অনুপাত, ফোন নম্বর এবং শেয়ার সনদসমূহ ক্লায়েন্ট এরিয়ায় লগইন সাপেক্ষে সংরক্ষিত।'
                : 'To protect shareholder privacy and regulatory compliance, individual share units, private contact details, and official share certificates are secured inside the authorized Client Portal.'}
            </span>
          </div>
          <button
            onClick={onOpenLogin}
            className="text-emerald-400 hover:text-emerald-300 font-bold whitespace-nowrap underline shrink-0"
          >
            {lang === 'bn' ? 'লগইন করুন →' : 'Sign In Now →'}
          </button>
        </div>
      </section>

      {/* ISLAMIC FINANCING PRINCIPLES / WHY NEXORA */}
      <section className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
            {lang === 'bn' ? 'আমাদের মূলভিত্তি' : 'Core Principles'}
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

      {/* FULL POST READER MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            
            {/* Modal Image Header */}
            <div className="h-56 sm:h-64 relative overflow-hidden shrink-0">
              <img
                src={selectedPost.image}
                alt={selectedPost.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider mb-2">
                  {lang === 'bn' ? selectedPost.categoryBn : selectedPost.categoryEn}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {lang === 'bn' ? selectedPost.titleBn : selectedPost.titleEn}
                </h2>
              </div>
            </div>

            {/* Modal Metadata & Content */}
            <div className="p-6 sm:p-8 space-y-6 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-slate-200">
                    {lang === 'bn' ? selectedPost.authorBn : selectedPost.authorEn}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedPost.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'bn' ? selectedPost.readTimeBn : selectedPost.readTimeEn}</span>
                  </span>
                </div>
              </div>

              {/* Body Text */}
              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p className="font-medium text-emerald-400/90 text-base leading-relaxed">
                  {lang === 'bn' ? selectedPost.summaryBn : selectedPost.summaryEn}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {lang === 'bn' ? selectedPost.contentBn : selectedPost.contentEn}
                </p>
              </div>

              {/* Tags & Official Corporate Seal */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {(lang === 'bn' ? selectedPost.tagsBn : selectedPost.tagsEn).map((tag, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 font-mono flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Corporate Bulletin</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-6 pt-0 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

