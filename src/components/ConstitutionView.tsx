import React, { useState } from 'react';
import { Language, Role, Member } from '../types';
import { NexoraLogo } from './NexoraLogo';
import { 
  BookOpen, 
  ShieldCheck, 
  Scale, 
  Scroll, 
  Printer, 
  Search, 
  Building2, 
  Coins, 
  Users, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Lock, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Download,
  Share2
} from 'lucide-react';

interface Props {
  lang: Language;
  role: Role;
  members: Member[];
  currentUser?: any;
  onNavigate?: (tab: string) => void;
}

export const ConstitutionView: React.FC<Props> = ({
  lang,
  role,
  members,
  currentUser,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedArticles, setExpandedArticles] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true
  });
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const toggleArticle = (articleNum: number) => {
    setExpandedArticles(prev => ({
      ...prev,
      [articleNum]: !prev[articleNum]
    }));
  };

  const expandAll = () => {
    setExpandedArticles({
      1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true
    });
  };

  const collapseAll = () => {
    setExpandedArticles({
      1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToArticle = (id: string, num: number) => {
    setActiveSection(num);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 13 Founder Shareholders Data as per official document
  const foundersList = [
    { no: 1, nameBn: 'তুফায়েল', nameEn: 'Tufayel', share: '১০%', amount: '১০,০০০/-', roleBn: 'ব্যবস্থাপনা কমিটি (দেশ)', roleEn: 'Management Committee' },
    { no: 2, nameBn: 'মেহরাব', nameEn: 'Mehrab', share: '১০%', amount: '১০,০০০/-', roleBn: 'ব্যবস্থাপনা কমিটি (দেশ)', roleEn: 'Management Committee' },
    { no: 3, nameBn: 'বায়েজিদ', nameEn: 'Bayezid', share: '১০%', amount: '১০,০০০/-', roleBn: 'ব্যবস্থাপনা কমিটি (দেশ)', roleEn: 'Management Committee' },
    { no: 4, nameBn: 'রাসেল', nameEn: 'Rasel', share: '১০%', amount: '১০,০০০/-', roleBn: 'উপদেষ্টা পরিষদ (প্রবাস)', roleEn: 'Advisory Council' },
    { no: 5, nameBn: 'হুমায়ূন', nameEn: 'Humayun', share: '৫%', amount: '৫,০০০/-', roleBn: 'উপদেষ্টা পরিষদ (প্রবাস)', roleEn: 'Advisory Council' },
    { no: 6, nameBn: 'ইমরান', nameEn: 'Imran', share: '৫%', amount: '৫,০০০/-', roleBn: 'ব্যবস্থাপনা কমিটি (দেশ)', roleEn: 'Management Committee' },
    { no: 7, nameBn: 'জুয়েল', nameEn: 'Jewel', share: '৫%', amount: '৫,০০০/-', roleBn: 'ব্যবস্থাপনা কমিটি (দেশ)', roleEn: 'Management Committee' },
    { no: 8, nameBn: 'কাউসার', nameEn: 'Kawsar', share: '৩%', amount: '৩,০০০/-', roleBn: 'উপদেষ্টা পরিষদ (প্রবাস)', roleEn: 'Advisory Council' },
    { no: 9, nameBn: 'শিমুল', nameEn: 'Shimul', share: '৩%', amount: '৩,০০০/-', roleBn: 'ব্যবস্থাপনা কমিটি (দেশ)', roleEn: 'Management Committee' },
    { no: 10, nameBn: 'উজ্জ্বল', nameEn: 'Uzzal', share: '৩%', amount: '৩,০০০/-', roleBn: 'ব্যবস্থাপনা কমিটি (দেশ)', roleEn: 'Management Committee' },
    { no: 11, nameBn: 'জাকির', nameEn: 'Zakir', share: '৩%', amount: '৩,০০০/-', roleBn: 'উপদেষ্টা পরিষদ (প্রবাস)', roleEn: 'Advisory Council' },
    { no: 12, nameBn: 'তাহের', nameEn: 'Taher', share: '৩%', amount: '৩,০০০/-', roleBn: 'উপদেষ্টা পরিষদ (প্রবাস)', roleEn: 'Advisory Council' },
    { no: 13, nameBn: 'দেলোয়ার', nameEn: 'Delowar', share: '৩%', amount: '৩,০০০/-', roleBn: 'উপদেষ্টা পরিষদ (প্রবাস)', roleEn: 'Advisory Council' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Corporate Document Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <div className="shrink-0 p-1 rounded-2xl bg-slate-950/60 border border-amber-500/30 shadow-xl">
              <NexoraLogo size="xl" variant="badge" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'নথি সংস্করণ: ১.০ (চূড়ান্ত অনুমোদিত)' : 'Doc Version 1.0 (Final Approved)'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>{lang === 'bn' ? 'গোপনীয় ও সুরক্ষিত' : 'Confidential & Secured'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {lang === 'bn' ? 'নেক্সোরা লিমিটেড — পূর্ণাঙ্গ গঠনতন্ত্র ও নীতিমালা' : 'Nexora Limited — Complete Constitution & Bylaws'}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl leading-relaxed">
                {lang === 'bn' 
                  ? 'একটি সুসংগঠিত শরিয়াহভিত্তিক যৌথ ব্যবসায়িক উদ্যোগ ও প্রাতিষ্ঠানিক পরিচালনার সর্বসম্মত সনদ।' 
                  : 'A Shariah-compliant corporate governance framework, shareholder equity agreement, and bylaws charter.'}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2.5 shrink-0 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'bn' ? 'প্রিন্ট / PDF ডাউনলোড' : 'Print / Download PDF'}</span>
            </button>
            <button
              onClick={expandAll}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition"
            >
              {lang === 'bn' ? 'সব খুলুন' : 'Expand All'}
            </button>
            <button
              onClick={collapseAll}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700 transition"
            >
              {lang === 'bn' ? 'সব বন্ধ করুন' : 'Collapse All'}
            </button>
          </div>
        </div>

        {/* Milestone Metadata Badges Grid */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">{lang === 'bn' ? 'প্রতিষ্ঠার প্রস্তাব' : 'Proposal Date'}</span>
            <span className="text-slate-100 font-bold mt-0.5 block">{lang === 'bn' ? '২০ আগস্ট ২০২৬' : '20 Aug 2026'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">{lang === 'bn' ? 'কমিটি চূড়ান্তকরণ' : 'Committee Finalized'}</span>
            <span className="text-slate-100 font-bold mt-0.5 block">{lang === 'bn' ? '২২ আগস্ট ২০২৬' : '22 Aug 2026'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">{lang === 'bn' ? 'কার্যক্রম শুরু' : 'Official Launch'}</span>
            <span className="text-emerald-400 font-bold mt-0.5 block">{lang === 'bn' ? '১ সেপ্টেম্বর ২০২৬' : '01 Sep 2026'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">{lang === 'bn' ? 'মোট শেয়ার' : 'Total Shares'}</span>
            <span className="text-amber-400 font-bold mt-0.5 block">১০০% (১০০ শেয়ার)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">{lang === 'bn' ? 'বিক্রিত শেয়ার' : 'Sold Shares'}</span>
            <span className="text-blue-400 font-bold mt-0.5 block">৭৩% (১৩ অংশীদার)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">{lang === 'bn' ? 'অবিক্রিত শেয়ার' : 'Unsold Pool'}</span>
            <span className="text-purple-400 font-bold mt-0.5 block">২৭% (সংরক্ষিত)</span>
          </div>
        </div>
      </div>

      {/* Main Constitution Layout: Sidebar Table of Contents + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Navigation Sidebar (Sticky) */}
        <div className="lg:col-span-4 space-y-4 print:hidden">
          <div className="sticky top-24 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Scroll className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? 'অনচ্ছেদ সূচিপত্র' : 'Articles & Index'}</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                ৯টি ধারা
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'bn' ? 'গঠনতন্ত্রে খুঁজুন (যেমন: শেয়ার, জরিমানা)...' : 'Search constitution...'}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Article Jump Links */}
            <nav className="space-y-1 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
              {[
                { num: 1, id: 'article-1', titleBn: '১. নাম, কার্যালয় ও পটভূমি', titleEn: '1. Name, Office & Formation' },
                { num: 2, id: 'article-2', titleBn: '২. মূলনীতি ও শরিয়াহ দর্শন', titleEn: '2. Core Shariah Philosophy' },
                { num: 3, id: 'article-3', titleBn: '৩. মূলধন কাঠামো ও শেয়ার বণ্টন', titleEn: '3. Capital & Share Rules' },
                { num: 4, id: 'article-4', titleBn: '৪. তহবিল জমা ও জরিমানা নীতি', titleEn: '4. Fund Deposits & Penalties' },
                { num: 5, id: 'article-5', titleBn: '৫. তহবিল নগদায়ন ও শেয়ার বিক্রয়', titleEn: '5. Liquidation & Share Transfer' },
                { num: 6, id: 'article-6', titleBn: '৬. আর্থিক ব্যবস্থাপনা ও লভ্যাংশ', titleEn: '6. Finance & Dividends' },
                { num: 7, id: 'article-7', titleBn: '৭. পরিচালনা ও উপদেষ্টা কাঠামো', titleEn: '7. Governance & Leadership' },
                { num: 8, id: 'article-8', titleBn: '৮. সভা, কোরাম ও ভোটাভুটি', titleEn: '8. Meetings, Quorum & Voting' },
                { num: 9, id: 'article-9', titleBn: '৯. শৃঙ্খলাভঙ্গ ও গঠনতন্ত্র সংশোধন', titleEn: '9. Discipline & Amendments' },
                { num: 10, id: 'article-10', titleBn: '★ প্রতিষ্ঠাতা অংশীদার ও স্বাক্ষর', titleEn: '★ Founder Shareholders Registry' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToArticle(item.id, item.num)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                    activeSection === item.num
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="truncate">{lang === 'bn' ? item.titleBn : item.titleEn}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0 ml-1" />
                </button>
              ))}
            </nav>

            {/* Shariah Compliance Seal */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{lang === 'bn' ? '১০০% সুদমুক্ত ও শরিয়াহভিত্তিক' : '100% Interest-Free Charter'}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lang === 'bn' ? 'মুদারাবা ও মুশারাকা মূলনীতিতে নিবন্ধিত ১৩ জন প্রতিষ্ঠাতা অংশীদারের চুক্তি।' : 'Governed by Islamic mutual investment, Mudaraba, and Musharaka covenants.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Constitution Document Viewer */}
        <div className="lg:col-span-8 space-y-6">

          {/* Document Preamble / ভূমিকা ও লক্ষ্য */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="text-center space-y-3 pb-6 border-b border-slate-800">
              <p className="text-lg sm:text-xl font-bold font-serif text-amber-300">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-xs text-slate-400 italic">
                {lang === 'bn' ? 'বিসমিল্লাহির রহমানির রহিম' : 'In the name of Allah, the Most Gracious, the Most Merciful'}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>{lang === 'bn' ? 'ভূমিকা ও লক্ষ্য' : 'Preamble & Mission'}</span>
              </h2>
              <div className="text-sm text-slate-300 leading-relaxed space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
                <p>
                  {lang === 'bn'
                    ? 'আমরা নিম্নস্বাক্ষরকারী প্রতিষ্ঠাতা অংশীদারগণ পারস্পরিক বিশ্বাস, সততা, যৌথ উদ্যোগ এবং দীর্ঘমেয়াদী আর্থিক উন্নয়নের লক্ষ্যে একটি সুসংগঠিত ব্যবসায়িক প্রতিষ্ঠান হিসেবে "Nexora Limited" গঠন করছি।'
                    : 'We, the undersigned founding partners, established "Nexora Limited" as an organized corporate business venture based on mutual trust, integrity, joint endeavor, and long-term financial prosperity.'}
                </p>
                <p>
                  {lang === 'bn'
                    ? 'আমাদের মূল লক্ষ্য হলো—প্রতি মাসে নিয়মিত অর্থ জমা করে একটি শক্তিশালী যৌথ তহবিল গঠন করা এবং সেই তহবিল ব্যবহার করে লাভজনক ও বৈধ ব্যবসায় বিনিয়োগ, নতুন ব্যবসা প্রতিষ্ঠা কিংবা ব্যবসা সম্প্রসারণ করা।'
                    : 'Our core mission is to accumulate a robust joint capital fund through disciplined monthly equity contributions and deploy these reserves into profitable, halal, and high-growth ventures.'}
                </p>
                <p className="font-semibold text-amber-300 pt-1">
                  {lang === 'bn'
                    ? 'পরিচালনা পরিষদ ও সাধারণ সদস্যদের সর্বসম্মতিক্রমে প্রণীত এই গঠনতন্ত্র কোম্পানির সকল সদস্যের জন্য চূড়ান্ত ও বাধ্যতামূলক।'
                    : 'Unanimously ratified by the Board of Directors and Founding Members, this constitution is final and strictly binding upon all shareholders.'}
                </p>
              </div>
            </div>
          </div>

          {/* ARTICLE 1: কোম্পানির নাম, কার্যালয় ও গঠনগত পটভূমি */}
          <section id="article-1" className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div 
              onClick={() => toggleArticle(1)}
              className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-sm">
                  ১
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'bn' ? '১. কোম্পানির নাম, কার্যালয় ও গঠনগত পটভূমি' : '1. Company Name, Registered Office & Background'}
                  </h3>
                  <p className="text-xs text-slate-400">{lang === 'bn' ? 'প্রাতিষ্ঠানিক আত্মপ্রকাশ ও নিবন্ধিত কার্যালয়' : 'Formation, incorporation dates, and corporate identity'}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white">
                {expandedArticles[1] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedArticles[1] && (
              <div className="p-6 space-y-4 text-sm text-slate-300 leading-relaxed bg-slate-950/40">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">{lang === 'bn' ? 'প্রতিষ্ঠার প্রস্তাব:' : 'Initial Proposal:'}</strong> {lang === 'bn' ? 'অত্র কোম্পানি গঠনের প্রাথমিক প্রস্তাব ও আলোচনা ২০ আগস্ট ২০২৬ তারিখে গৃহীত হয়।' : 'The foundational proposal was formally discussed and adopted on 20 August 2026.'}
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">{lang === 'bn' ? 'কোম্পানি গঠন ও আত্মপ্রকাশ:' : 'Incorporation & Committee:'}</strong> {lang === 'bn' ? 'সকলের স্বতঃস্ফূর্ত উপস্থিতি ও সম্মতিতে ২২ আগস্ট ২০২৬ তারিখে আনুষ্ঠানিকভাবে "Nexora Limited"-এর গঠন ও কার্যনির্বাহী কমিটি চূড়ান্ত করা হয়।' : 'With spontaneous consensus, the formal structure and executive committee of Nexora Limited were finalized on 22 August 2026.'}
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">{lang === 'bn' ? 'আনুষ্ঠানিক কার্যক্রম শুরু:' : 'Official Launch Date:'}</strong> {lang === 'bn' ? '১ সেপ্টেম্বর ২০২৬ তারিখ থেকে কোম্পানির পূর্ণাঙ্গ ব্যবসায়িক ও দাপ্তরিক কার্যক্রম আনুষ্ঠানিকভাবে শুরু হবে।' : 'Full corporate, business, and operational activities officially commence on 01 September 2026.'}
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">{lang === 'bn' ? 'অফিসিয়াল নাম:' : 'Official Corporate Name:'}</strong> {lang === 'bn' ? 'প্রতিষ্ঠানের অফিসিয়াল নাম হবে "Nexora Limited" (নেক্সোরা লিমিটেড)।' : 'The registered corporate entity name shall strictly be "Nexora Limited".'}
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">{lang === 'bn' ? 'কার্যালয় ও অবস্থান:' : 'Registered Office:'}</strong> {lang === 'bn' ? 'কোম্পানির যাবতীয় দাপ্তরিক ও ব্যবসায়িক কার্যক্রম নির্দিষ্ট প্রধান কার্যালয় বা নিবন্ধিত স্থান থেকে পরিচালিত হবে।' : 'All business and administrative affairs will be operated from the designated primary headquarters and registered office.'}
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* ARTICLE 2: মূলনীতি, ব্যবসায়িক দর্শন ও শরিয়াহ পরিপালন */}
          <section id="article-2" className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div 
              onClick={() => toggleArticle(2)}
              className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
                  ২
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'bn' ? '২. মূলনীতি, ব্যবসায়িক দর্শন ও শরিয়াহ পরিপালন' : '2. Core Principles, Business Philosophy & Shariah Compliance'}
                  </h3>
                  <p className="text-xs text-slate-400">{lang === 'bn' ? '১০০% হালাল ব্যবসা ও সুদমুক্ত অর্থায়ন নীতি' : 'Halal governance and total interest/riba prohibition'}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white">
                {expandedArticles[2] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedArticles[2] && (
              <div className="p-6 space-y-4 text-sm text-slate-300 leading-relaxed bg-slate-950/40">
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-slate-200 space-y-1">
                    <strong className="text-emerald-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'হালাল ও শরিয়াহভিত্তিক পরিচালনা:' : 'Halal & Shariah-Compliant Operations:'}</span>
                    </strong>
                    <p className="text-xs leading-relaxed">
                      {lang === 'bn' 
                        ? 'কোম্পানির সকল ব্যবসায়িক উদ্যোগ ও আর্থিক লেনদেন সম্পূর্ণ হালাল, স্বচ্ছ এবং ইসলামী শরিয়াহর নীতিমালা অনুযায়ী পরিচালিত হবে।' 
                        : 'All business endeavors and financial transactions must be strictly halal, fully transparent, and compliant with Islamic jurisprudence.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-slate-200 space-y-1">
                    <strong className="text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'সুদমুক্ত লেনদেন ও ব্যাংক ঋণ নিষেধাজ্ঞা:' : 'Total Prohibition on Interest & Conventional Loans:'}</span>
                    </strong>
                    <p className="text-xs leading-relaxed">
                      {lang === 'bn' 
                        ? 'সর্বাবস্থায় প্রতিষ্ঠানের সকল কার্যক্রম সম্পূর্ণ সুদমুক্ত থাকবে। ব্যবসা পরিচালনা বা মূলধন বৃদ্ধির উদ্দেশ্যে কোনো প্রকার সুদী ব্যাংক ঋণ বা আর্থিক দায় গ্রহণ করা যাবে না।' 
                        : 'Under no circumstances shall the company engage in interest-bearing bank loans or conventional debt instruments to expand business capital.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 space-y-1">
                    <strong className="text-amber-300 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'দাপ্তরিক সরঞ্জাম ও নথিপত্র:' : 'Official Corporate Instruments & Paperwork:'}</span>
                    </strong>
                    <p className="text-xs leading-relaxed">
                      {lang === 'bn' 
                        ? 'প্রতিষ্ঠানের নামে নিজস্ব অফিসিয়াল প্যাড, রসিদ বই এবং সিলমোহর থাকবে। প্রতিটি আর্থিক লেনদেন লিখিত রসিদের মাধ্যমে নিশ্চিত করতে হবে।' 
                        : 'The entity shall maintain dedicated official letterheads, printed money receipt books, and seals. Every monetary exchange must be documented with written vouchers.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ARTICLE 3: মূলধন কাঠামো, শেয়ার বণ্টন ও সীমা সংক্রান্ত নীতিমালা */}
          <section id="article-3" className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div 
              onClick={() => toggleArticle(3)}
              className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-sm">
                  ৩
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'bn' ? '৩. মূলধন কাঠামো, শেয়ার বণ্টন ও সীমা সংক্রান্ত নীতিমালা' : '3. Capital Structure, Share Allocation & Ceilings'}
                  </h3>
                  <p className="text-xs text-slate-400">{lang === 'bn' ? '১০০% মোট শেয়ার, ৭৩% বিক্রিত ও প্রতি ১% শেয়ারের মাসিক মান' : '100% total shares, 73% sold, 10% maximum individual cap'}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white">
                {expandedArticles[3] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedArticles[3] && (
              <div className="p-6 space-y-4 text-sm text-slate-300 leading-relaxed bg-slate-950/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400 block">{lang === 'bn' ? 'মোট মূলধন ও শেয়ার' : 'Total Authorized Shares'}</span>
                    <span className="text-lg font-bold text-white mt-1 block">১০০% (100 Shares)</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400 block">{lang === 'bn' ? 'প্রতিষ্ঠাকালীন বিক্রিত শেয়ার' : 'Sold Founder Shares'}</span>
                    <span className="text-lg font-bold text-emerald-400 mt-1 block">৭৩% (১৩ জন প্রতিষ্ঠাতা অংশীদার)</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-amber-300">{lang === 'bn' ? 'অবিক্রিত শেয়ার (২৭%):' : 'Unallocated Shares (27%):'}</strong> {lang === 'bn' ? 'অবিক্রিত ২৭% শেয়ার পরিচালনা পরিষদের সিদ্ধান্ত অনুযায়ী ভবিষ্যতে নতুন বিনিয়োগকারী অন্তর্ভুক্তিকরণ অথবা বিদ্যমান অংশীদারদের মধ্যে বরাদ্দ/বিক্রয় করা যাবে।' : 'The remaining 27% unallocated shares may be distributed to new investors or existing partners based on Board approval.'}
                  </li>
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-emerald-300">{lang === 'bn' ? 'শেয়ারের মূল্য ও মাসিক জমার হার:' : 'Share Valuation & Monthly Contribution:'}</strong> {lang === 'bn' ? 'প্রতিটি ১% শেয়ারের নির্ধারিত মাসিক মূল্য ১,০০০/- (এক হাজার) টাকা। প্রত্যেক অংশীদার তার গৃহীত শেয়ারের আনুপাতিক হারে প্রতি মাসে এই অর্থ জমা প্রদান করবেন।' : 'Each 1% equity unit is valued at BDT 1,000/- monthly. Partners contribute strictly proportional to their shareholdings.'}
                  </li>
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-rose-300">{lang === 'bn' ? 'সর্বোচ্চ শেয়ার ধারণের সীমা:' : 'Individual Shareholding Cap:'}</strong> {lang === 'bn' ? 'কোনো একজন অংশীদার ব্যক্তিগতভাবে সর্বোচ্চ ১০% শেয়ার ধারণ করতে পারবেন। কোনো অবস্থাতেই একক ব্যক্তির শেয়ার ১০%-এর অধিক হতে পারবে না।' : 'No individual partner may hold more than 10% equity units under any circumstances.'}
                  </li>
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-cyan-300">{lang === 'bn' ? 'শেয়ার বৃদ্ধির সুযোগ:' : 'Equity Expansion Option:'}</strong> {lang === 'bn' ? 'বর্তমানে যাদের শেয়ার ১০%-এর কম রয়েছে, তারা চাইলে ভবিষ্যতে অবিক্রিত শেয়ার সাপেক্ষে নিজেদের শেয়ার সর্বোচ্চ ১০% পর্যন্ত উন্নীত করতে পারবেন।' : 'Shareholders with under 10% equity may apply to upgrade their holding up to 10% from the unallocated pool.'}
                  </li>
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-purple-300">{lang === 'bn' ? 'পর্যালোচনা ও অতিরিক্ত শেয়ার বরাদ্দের শর্ত:' : '6-Month Review & Additional 2% Option:'}</strong> {lang === 'bn' ? 'কোম্পানি কার্যক্রম শুরুর ৬ (ছয়) মাস পর সকল অংশীদারের শেয়ার ধারণ এবং সামগ্রিক ব্যবসায়িক অগ্রগতি পর্যালোচনা করা হবে। পর্যালোচনায় যদি দেখা যায় যে সকল অংশীদারের ন্যূনতম শেয়ার ৫% বা তদূর্ধ্ব রয়েছে, তবে সর্বসম্মত সিদ্ধান্ত অনুযায়ী প্রত্যেক অংশীদারকে অতিরিক্ত ২% পর্যন্ত শেয়ার বৃদ্ধির বিশেষ সুযোগ প্রদান করা যাবে।' : 'After 6 months of active operations, if all partners hold 5%+ equity, the Board may grant an optional 2% equity expansion opportunity.'}
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* ARTICLE 4: তহবিল জমা, বিলম্ব ফি (জরিমানা) ও নিয়মানুবর্তিতা */}
          <section id="article-4" className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div 
              onClick={() => toggleArticle(4)}
              className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-sm">
                  ৪
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'bn' ? '৪. তহবিল জমা, বিলম্ব ফি (জরিমানা) ও নিয়মানুবর্তিতা' : '4. Fund Deposits, Late Fees (Fines) & Discipline'}
                  </h3>
                  <p className="text-xs text-slate-400">{lang === 'bn' ? '১-১০ তারিখের মধ্যে জমা, প্রতি ১% শেয়ারে ১০০ টাকা বিলম্ব ফি' : 'Deposit timeline (1st-10th), late fine per 1% share, 3-month default forfeiture'}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white">
                {expandedArticles[4] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedArticles[4] && (
              <div className="p-6 space-y-4 text-sm text-slate-300 leading-relaxed bg-slate-950/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-xs text-emerald-400 font-bold block">{lang === 'bn' ? 'ব্যাংক হিসাবে জমা ও সময়সীমা' : 'Monthly Window'}</span>
                    <p className="text-xs text-slate-200 mt-1">
                      {lang === 'bn' ? 'প্রতি মাসের ১ (এক) থেকে ১০ (দশ) তারিখের মধ্যে মাসিক কিস্তির টাকা অফিসিয়াল একাউন্টে পরিশোধ করতে হবে।' : 'Installment contributions must be deposited into the official account between the 1st and 10th of every month.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-xs text-amber-400 font-bold block">{lang === 'bn' ? 'বিলম্ব ফি / জরিমানা হার' : 'Late Fee Rule'}</span>
                    <p className="text-xs text-slate-200 mt-1">
                      {lang === 'bn' ? 'নির্ধারিত সময়ের পর প্রতি ১% শেয়ারের জন্য ১০০/- টাকা বাধ্যতামূলক বিলম্ব জরিমানা আরোপিত হবে।' : 'A mandatory fine of BDT 100/- per 1% equity unit is levied after the 10th of the month.'}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-cyan-300">{lang === 'bn' ? 'রসিদ ও ডিজিটাল গ্রুপে সংরক্ষণ:' : 'Voucher & WhatsApp Group Confirmation:'}</strong> {lang === 'bn' ? 'টাকা জমা দেওয়ার পর ব্যাংক ট্রানজেকশন স্লিপ/রসিদ সংরক্ষণ করতে হবে এবং তাৎক্ষণিকভাবে কোম্পানির অফিসিয়াল WhatsApp Group-এ শেয়ার করে জমা নিশ্চিত করতে হবে।' : 'Partners must preserve deposit slips and immediately share them in the official WhatsApp group for verification.'}
                  </li>
                  <li className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-slate-200">
                    <strong className="text-rose-400">{lang === 'bn' ? 'জরিমানা মওকুফ নিষেধাজ্ঞা ও জবাবদিহিতা:' : 'Strict Ban on Fine Waivers:'}</strong> {lang === 'bn' ? 'কোনো অবস্থাতেই কিংবা ব্যক্তিগত সহমর্মিতার খাতিরে বিলম্ব ফি/জরিমানা মওকুফ করা যাবে না। পরিচালনা কমিটির কোনো সদস্য নিয়মবহির্ভূতভাবে জরিমানা মওকুফ বা শিথিল করলে তা সুস্পষ্ট শৃঙ্খলাভঙ্গ হিসেবে গণ্য হবে এবং উক্ত পরিচালকের পদ বাতিলের বিষয়টি পরিচালনা পরিষদে বিবেচনা ও সিদ্ধান্ত গৃহীত হবে।' : 'Fines cannot be waived under any circumstances. Unauthorized fine exemptions constitute severe misconduct and ground for directorial removal.'}
                  </li>
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-amber-300">{lang === 'bn' ? 'ধারাবাহিক খেলাপি ও সদস্যপদ বাতিল:' : '3-Month Default Termination:'}</strong> {lang === 'bn' ? 'পরপর অথবা সর্বমোট ৩ (তিন) মাস মাসিক কিস্তি প্রদানে ব্যর্থ হলে সংশ্লিষ্ট অংশীদারের সদস্যপদ স্বয়ংক্রিয়ভাবে বাতিল বলে গণ্য হবে।' : 'Defaulting for 3 consecutive or total months automatically terminates the partnership membership.'}
                  </li>
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-emerald-300">{lang === 'bn' ? 'বাতিলকৃত মূলধন ফেরত নীতি:' : 'Refund Policy for Cancelled Equity:'}</strong> {lang === 'bn' ? 'কিস্তি খেলাপির কারণে সদস্যপদ বাতিল হলে, কোম্পানি চলমান থাকা অবস্থায় তার জমাকৃত মূল টাকা (কোনো প্রকার লভ্যাংশ/মুনাফা ব্যতীত) কোম্পানির নিয়ম অনুযায়ী পরবর্তী সময়ে ফেরত প্রদান করা হবে।' : 'In case of default cancellation, only the principal capital contributed (without dividend profits) will be reimbursed as per corporate procedure.'}
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* ARTICLE 5: কোম্পানির তহবিল নগদায়ন ও শেয়ার হস্তান্তর */}
          <section id="article-5" className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div 
              onClick={() => toggleArticle(5)}
              className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400 text-sm">
                  ৫
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'bn' ? '৫. কোম্পানির তহবিল নগদায়ন ও শেয়ার হস্তান্তর' : '5. Fund Liquidation & Share Transfer Rules'}
                  </h3>
                  <p className="text-xs text-slate-400">{lang === 'bn' ? 'তাৎক্ষণিক নগদায়ন নিষেধাজ্ঞা ও অভ্যন্তরীণ বিক্রয় অধিকার' : 'Internal right of first refusal and nominee inheritance rights'}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white">
                {expandedArticles[5] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedArticles[5] && (
              <div className="p-6 space-y-4 text-sm text-slate-300 leading-relaxed bg-slate-950/40">
                <ul className="space-y-3">
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-rose-300">{lang === 'bn' ? 'মেয়াদকালীন পদত্যাগ ও তহবিল নগদায়ন নিষেধাজ্ঞা:' : 'No Immediate Capital Withdrawal:'}</strong> {lang === 'bn' ? 'অংশীদারদের ব্যক্তিগত প্রয়োজনে তাৎক্ষণিকভাবে কোম্পানি থেকে মূলধন উত্তোলন বা নগদায়ন করা নিষিদ্ধ।' : 'Immediate capital liquidation for personal reasons during active business operation is strictly prohibited.'}
                  </li>
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-amber-300">{lang === 'bn' ? 'অভ্যন্তরীণ শেয়ার হস্তান্তর ও বিক্রয় নীতি:' : 'Internal Transfer & Third-Party Prohibition:'}</strong> {lang === 'bn' ? 'কোনো অংশীদার জরুরি প্রয়োজনে শেয়ার হস্তান্তর বা বিক্রি করতে চাইলে সর্বপ্রথম বিদ্যমান অংশীদারদের নিকট বিক্রির লিখিত প্রস্তাব পেশ করতে হবে। বিদ্যমান অংশীদারদের লিখিত সম্মতি ব্যতীত বাইরের কোনো তৃতীয় পক্ষের নিকট শেয়ার হস্তান্তর বা বিক্রি করা সম্পূর্ণ নিষিদ্ধ।' : 'Shares must first be offered in writing to existing shareholders. Selling or transferring shares to outside third parties without written consent is strictly forbidden.'}
                  </li>
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-emerald-300">{lang === 'bn' ? 'উত্তরাধিকার ও নমিনি সংক্রান্ত নিয়ম:' : 'Nominee & Legal Heir Inheritance:'}</strong> {lang === 'bn' ? 'কোনো অংশীদারের আকস্মিক মৃত্যু ঘটলে তার পূর্বে মনোনীত নমিনি (Nominee) অথবা বৈধ আইনি ওয়ারিশ উক্ত শেয়ারের স্বত্ব ও অধিকার লাভ করবেন।' : 'Upon a partner’s demise, full shareholdings and benefits transfer automatically to their registered nominee or legal heirs.'}
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* ARTICLE 6: আর্থিক ব্যবস্থাপনা, হিসাবরক্ষণ ও লভ্যাংশ বণ্টন */}
          <section id="article-6" className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div 
              onClick={() => toggleArticle(6)}
              className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
                  ৬
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'bn' ? '৬. আর্থিক ব্যবস্থাপনা, হিসাবরক্ষণ ও লভ্যাংশ বণ্টন' : '6. Financial Management, Accounting & Dividends'}
                  </h3>
                  <p className="text-xs text-slate-400">{lang === 'bn' ? 'যৌথ ব্যাংক হিসাব পরিচালনা ও শেয়ার অনুপাতে মুনাফা বণ্টন' : 'Joint bank signatures, annual audits, and proportional profit distribution'}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white">
                {expandedArticles[6] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedArticles[6] && (
              <div className="p-6 space-y-4 text-sm text-slate-300 leading-relaxed bg-slate-950/40">
                <ul className="space-y-3">
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-white">{lang === 'bn' ? 'স্বীকৃত ব্যাংকিং চ্যানেল:' : 'Authorized Banking Channels:'}</strong> {lang === 'bn' ? 'প্রতিষ্ঠানের সকল আর্থিক লেনদেন বৈধ ও স্বীকৃত ব্যাংকিং চ্যানেলের মাধ্যমে পরিচালিত হবে।' : 'All corporate transactions must occur through verified and lawful banking routes.'}
                  </li>
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-amber-300">{lang === 'bn' ? 'যৌথ ব্যাংক হিসাব পরিচালনা:' : 'Joint Bank Account Mandate:'}</strong> {lang === 'bn' ? 'ব্যাংকে "Nexora Limited"-এর নামে যৌথ অ্যাকাউন্ট থাকবে। চেয়ারম্যান, ম্যানেজিং ডিরেক্টর (MD) এবং পরিচালক (অর্থ)—এই তিনজনের যৌথ স্বাক্ষরে হিসাব পরিচালিত ও টাকা উত্তোলন করা হবে।' : 'Joint bank accounts require signatures of the Chairman, Managing Director (MD), and Director of Finance for all withdrawals.'}
                  </li>
                  <li className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-slate-200">
                    <strong className="text-rose-400">{lang === 'bn' ? 'ব্যক্তিগত ব্যবহারে কঠোর নিষেধাজ্ঞা:' : 'Prohibition on Personal Use of Funds:'}</strong> {lang === 'bn' ? 'কোনো পরিচালক বা অংশীদার প্রতিষ্ঠানের কোনো অর্থ নিজের ব্যক্তিগত ব্যবসা বা প্রয়োজনে ব্যবহার করতে পারবেন না।' : 'No director or member may utilize company capital for personal businesses or private obligations.'}
                  </li>
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-cyan-300">{lang === 'bn' ? 'হিসাবরক্ষণ ও বার্ষিক অডিট:' : 'Bookkeeping & Annual Audit:'}</strong> {lang === 'bn' ? 'পরিচালক (অর্থ) নিয়মিতভাবে প্রত্যেক সদস্যের জমা, জরিমানা ও বকেয়া হিসাব নিখুঁতভাবে সংরক্ষণ করবেন এবং বার্ষিক পূর্ণাঙ্গ আয়-ব্যয় ও অডিট রিপোর্ট উপস্থাপন করবেন।' : 'The Finance Director shall maintain books of accounts and publish comprehensive audited annual financial statements.'}
                  </li>
                  <li className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-200">
                    <strong className="text-emerald-400">{lang === 'bn' ? 'লভ্যাংশ বণ্টন নীতি:' : 'Dividend Distribution Framework:'}</strong> {lang === 'bn' ? 'ব্যবসায়ে অর্জিত নিট মুনাফা/লভ্যাংশ অংশীদারদের শেয়ারের শতকরা হার (Percentage) অনুযায়ী আনুপাতিক হারে বণ্টন করা হবে।' : 'Net profits shall be distributed proportionally based on each partner’s verified share percentage.'}
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* ARTICLE 7: পরিচালনা পরিষদ, ব্যবস্থাপনা কমিটি ও উপদেষ্টা পরিষদ */}
          <section id="article-7" className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div 
              onClick={() => toggleArticle(7)}
              className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-sm">
                  ৭
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'bn' ? '৭. পরিচালনা পরিষদ, ব্যবস্থাপনা কমিটি ও উপদেষ্টা পরিষদ' : '7. Management Committee & Advisory Council Roles'}
                  </h3>
                  <p className="text-xs text-slate-400">{lang === 'bn' ? 'দ্বৈত নেতৃত্ব কাঠামো (দেশ ও প্রবাস) এবং পদবণ্টন' : 'Dual leadership framework (Domestic & NRI/Expatriate)'}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white">
                {expandedArticles[7] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedArticles[7] && (
              <div className="p-6 space-y-5 text-sm text-slate-300 leading-relaxed bg-slate-950/40">
                <p className="text-xs text-slate-400">
                  {lang === 'bn' 
                    ? 'কোম্পানির বৈশ্বিক অংশীদারদের সক্রিয় অংশগ্রহণ এবং দেশের ব্যবসায়িক কার্যক্রম গতিশীল ও সুশৃঙ্খল রাখার জন্য পরিচালনা কাঠামোকে দুটি স্তরে বিন্যস্ত করা হলো—' 
                    : 'The corporate governance is bifurcated into two coordinated functional tiers:'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Management Committee (Domestic) */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-emerald-400 flex items-center gap-2 text-base pb-2 border-b border-slate-800">
                      <Building2 className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'ব্যবস্থাপনা কমিটি (দেশ)' : 'Management Committee (Domestic)'}</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li>• <strong>চেয়ারম্যান (১ জন):</strong> সভা আহ্বান করবেন, সভাপতিত্ব করবেন এবং দিকনির্দেশনা দেবেন।</li>
                      <li>• <strong>ম্যানেজিং ডিরেক্টর / MD (১ জন):</strong> দৈনিক ব্যবসায়িক কার্যক্রম পরিচালনা ও মাঠপর্যায়ের তদারকি।</li>
                      <li>• <strong>পরিচালক (অর্থ) (১ জন):</strong> হিসাব-নিকাশ, তহবিল ব্যবস্থাপনা ও বার্ষিক রিপোর্ট প্রণয়ন।</li>
                      <li>• <strong>অপারেশনস বিভাগ (২ জন):</strong> মাঠপর্যায়ের কার্যক্রম, সাপ্লাই চেইন ও দৈনিক কাজ পরিচালনা।</li>
                      <li>• <strong>বিজনেস রিসার্চ বিভাগ (৩ জন):</strong> নতুন ব্যবসায়িক সম্ভাবনা ও বাজার গবেষণা।</li>
                    </ul>
                  </div>

                  {/* Advisory Council (Expatriate) */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-amber-400 flex items-center gap-2 text-base pb-2 border-b border-slate-800">
                      <Users className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'উপদেষ্টা পরিষদ (প্রবাস)' : 'Advisory Council (Expatriate)'}</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li>• <strong>প্রধান উপদেষ্টা (১ জন):</strong> প্রবাসে অবস্থানরত অংশীদারদের নেতৃত্ব ও নীতিনির্ধারণী পরামর্শ।</li>
                      <li>• <strong>আন্তর্জাতিক প্রচার সম্পাদক (১ জন):</strong> আন্তর্জাতিক অঙ্গনে ব্র্যান্ডিং ও বৈদেশিক নেটওয়ার্কিং।</li>
                      <li>• <strong>উপদেষ্টাবৃন্দ:</strong> বাকি প্রবাসে অবস্থানরত অংশীদারগণ সক্রিয় পরামর্শক।</li>
                      <li className="pt-2 text-amber-300 font-medium">• বড় বিনিয়োগের পূর্বে অনলাইন সভার মাধ্যমে উপদেষ্টা পরিষদের সম্মতি বাধ্যতামূলক।</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <strong className="text-white block">{lang === 'bn' ? 'পরিষদের মেয়াদ ও পুনর্গঠন:' : 'Term Duration & Annual Reconstitution:'}</strong>
                  <p>
                    {lang === 'bn' 
                      ? 'উভয় কমিটির সামগ্রিক মেয়াদ হইবে ১ (এক) বছর। মেয়াদান্তে সাধারণ সভা ডেকে সর্বসম্মতিক্রমে পরবর্তী ১ বছরের জন্য নতুন কমিটি পুনর্গঠন করা হইবে এবং বিগত ১ বছরের পুঙ্খানুপুঙ্খ আর্থিক ও ব্যবসায়িক হিসাব পেশ করা বাধ্যতামূলক থাকিবে।' 
                      : 'The standard tenure for both leadership bodies is 1 year, followed by an Annual General Meeting (AGM) and formal financial accountability.'}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* ARTICLE 8: সভা, কোরাম ও নীতিগত সিদ্ধান্ত গ্রহণ */}
          <section id="article-8" className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div 
              onClick={() => toggleArticle(8)}
              className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-sm">
                  ৮
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'bn' ? '৮. সভা, কোরাম ও নীতিগত সিদ্ধান্ত গ্রহণ' : '8. Meetings, Quorum & Policy Decisions'}
                  </h3>
                  <p className="text-xs text-slate-400">{lang === 'bn' ? 'মাসিক সভা ও মোট সদস্যের ২/৩ কোরাম নীতি' : 'Monthly meetings, 2/3 quorum requirement, majority consent'}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white">
                {expandedArticles[8] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedArticles[8] && (
              <div className="p-6 space-y-4 text-sm text-slate-300 leading-relaxed bg-slate-950/40">
                <ul className="space-y-3">
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-white">{lang === 'bn' ? 'নিয়মিত সভা:' : 'Monthly Meeting Frequency:'}</strong> {lang === 'bn' ? 'প্রতি মাসে অন্তত ০১ (এক) টি সাধারণ বা পরিচালনা পরিষদের পর্যালোচনা সভা অনুষ্ঠিত হবে।' : 'At least 1 review and coordination meeting must be convened every calendar month.'}
                  </li>
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-amber-300">{lang === 'bn' ? 'সভার কোরাম:' : 'Meeting Quorum Threshold:'}</strong> {lang === 'bn' ? 'পরিচালনা পরিষদ বা সাধারণ সভার মোট সদস্যের দুই-তৃতীয়াংশ (২/৩) উপস্থিত থাকলে সভার কোরাম পূর্ণ হবে এবং শেয়ারভিত্তিক সিদ্ধান্ত গ্রহণ করা হবে।' : 'A quorum requires attendance of two-thirds (2/3) of members for share-weighted decision making.'}
                  </li>
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-emerald-300">{lang === 'bn' ? 'মূলধন ও নতুন শেয়ার ইস্যু:' : 'New Equity Issuance Approval:'}</strong> {lang === 'bn' ? 'যেকোনো নতুন শেয়ার ইস্যু বা মূলধন কাঠামোর পরিবর্তনের ক্ষেত্রে সংখ্যাগরিষ্ঠ অংশীদারদের লিখিত সম্মতি বাধ্যতামূলক।' : 'Any change in authorized capital or issuance of new shares mandates written majority consent.'}
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* ARTICLE 9: শৃঙ্খলাভঙ্গ, বহিষ্কার ও গঠনতন্ত্র সংশোধন নীতি */}
          <section id="article-9" className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div 
              onClick={() => toggleArticle(9)}
              className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center font-bold text-rose-400 text-sm">
                  ৯
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'bn' ? '৯. শৃঙ্খলাভঙ্গ, বহিষ্কার ও গঠনতন্ত্র সংশোধন নীতি' : '9. Discipline, Expulsion & Constitutional Amendments'}
                  </h3>
                  <p className="text-xs text-slate-400">{lang === 'bn' ? 'প্রশাসনিক ব্যবস্থা ও শেয়ারভিত্তিক ভোটাভুটি নীতি' : 'Disciplinary termination and share-weighted voting resolution'}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white">
                {expandedArticles[9] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedArticles[9] && (
              <div className="p-6 space-y-4 text-sm text-slate-300 leading-relaxed bg-slate-950/40">
                <ul className="space-y-3">
                  <li className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-slate-200">
                    <strong className="text-rose-400">{lang === 'bn' ? 'শৃঙ্খলাভঙ্গ ও প্রশাসনিক ব্যবস্থা:' : 'Misconduct & Administrative Expulsion:'}</strong> {lang === 'bn' ? 'কোনো অংশীদার প্রতিষ্ঠান-বিরোধী কার্যকলাপ, আর্থিক অনিয়ম, প্রতারণা বা অনৈতিক আচরণের সাথে যুক্ত থাকলে পরিচালনা পরিষদ অবিলম্বে তার সদস্যপদ বাতিলসহ প্রয়োজনীয় আইনি ও প্রশাসনিক ব্যবস্থা গ্রহণ করতে পারবে।' : 'Any anti-organizational activity, financial fraud, or ethical violations grants the Board authority to revoke membership and initiate legal action.'}
                  </li>
                  <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <strong className="text-amber-300">{lang === 'bn' ? 'গঠনতন্ত্র সংশোধন প্রস্তাব:' : 'Amendment Proposals:'}</strong> {lang === 'bn' ? 'গঠনতন্ত্রের কোনো ধারা বা নীতিমালা সংশোধন, সংযোজন বা বিয়োজন করতে হলে পরিচালনা পরিষদে লিখিত প্রস্তাব পেশ করতে হবে।' : 'Any constitutional amendments or additions must be submitted as a formal written resolution to the Board.'}
                  </li>
                  <li className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-200">
                    <strong className="text-emerald-400">{lang === 'bn' ? 'শেয়ারভিত্তিক ভোটাভুটি (Share-based Voting):' : 'Share-Based Voting Majority:'}</strong> {lang === 'bn' ? 'কোনো নীতিগত সিদ্ধান্ত বা সংশোধনের ক্ষেত্রে মতানৈক্য সৃষ্টি হলে শেয়ারের শতকরা হার (%) অনুযায়ী ভোটাভুটির মাধ্যমে বিষয়টি নিষ্পত্তি হবে। যে পক্ষের পক্ষে অধিক শেয়ারের (Majority Shares) সমর্থন থাকবে, সেই সিদ্ধান্তই চূড়ান্ত বলে কার্যকর হবে।' : 'Disputed resolutions shall be resolved via share-weighted voting. Decisions backed by the majority share equity percentage prevail as binding and final.'}
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* ARTICLE 10 / REGISTRY: প্রতিষ্ঠাতা অংশীদারবৃন্দের নাম, শেয়ার বণ্টন ও স্বাক্ষর */}
          <section id="article-10" className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>{lang === 'bn' ? 'প্রতিষ্ঠাতা অংশীদারবৃন্দের নাম, শেয়ার বণ্টন ও সম্মতি' : 'Founder Shareholders Registry & Equity Allocation'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'bn' ? 'Nexora Limited-এর অনুমোদিত ১৩ জন প্রতিষ্ঠাতা শেয়ারহোল্ডার' : '13 Approved founding shareholders holding 73% subscribed equity'}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                ৭৩% ইকুইটি
              </span>
            </div>

            <div className="p-6 space-y-5 bg-slate-950/60">
              <p className="text-xs text-slate-300 italic p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                "{lang === 'bn' 
                  ? 'আমরা নিম্নে স্বাক্ষরকারী প্রতিষ্ঠাতা সদস্য ও অংশীদারগণ Nexora Limited-এর এই পূর্ণাঙ্গ গঠনতন্ত্র ও নীতিমালার সকল ধারা ও উপধারা পুঙ্খানুপুঙ্খভাবে পাঠ করে, বুঝে এবং পূর্ণ সম্মতির সাথে এটি অনুমোদন করলাম।' 
                  : 'We, the undersigned founding members and shareholders, have thoroughly read, understood, and unanimously ratified all articles of this constitution with full consent.'}"
              </p>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-300 uppercase font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3 text-center">#</th>
                      <th className="p-3">{lang === 'bn' ? 'অংশীদারের নাম' : 'Shareholder Name'}</th>
                      <th className="p-3 text-center">{lang === 'bn' ? 'শেয়ার অংশীদারিত্ব' : 'Equity Share'}</th>
                      <th className="p-3">{lang === 'bn' ? 'মাসিক কিস্তি' : 'Monthly Due'}</th>
                      <th className="p-3">{lang === 'bn' ? 'দায়িত্বপ্রাপ্ত পরিষদ' : 'Designated Council'}</th>
                      <th className="p-3 text-center">{lang === 'bn' ? 'অনুমোদন ও স্ট্যাটাস' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {foundersList.map((f) => (
                      <tr key={f.no} className="hover:bg-slate-900/50 transition">
                        <td className="p-3 text-center font-mono font-bold text-slate-400">{f.no}</td>
                        <td className="p-3 font-semibold text-white">
                          {lang === 'bn' ? f.nameBn : f.nameEn}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-amber-400 bg-amber-500/5">
                          {f.share}
                        </td>
                        <td className="p-3 font-mono text-emerald-400 font-semibold">
                          {f.amount}
                        </td>
                        <td className="p-3 text-slate-300">
                          {lang === 'bn' ? f.roleBn : f.roleEn}
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{lang === 'bn' ? 'স্বাক্ষরিত' : 'Signed'}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-900 font-bold border-t-2 border-slate-700 text-xs">
                    <tr>
                      <td colSpan={2} className="p-3 text-white">
                        {lang === 'bn' ? 'সর্বমোট বিক্রিত শেয়ার (১৩ জন)' : 'Total Sold Equity (13 Founders)'}
                      </td>
                      <td className="p-3 text-center text-amber-400 font-mono text-sm">৭৩%</td>
                      <td className="p-3 text-emerald-400 font-mono">৭৩,০০০/- টাকা</td>
                      <td colSpan={2} className="p-3 text-slate-400 font-mono text-[11px]">
                        অবিক্রিত সংরক্ষিত: ২৭% | মোট ১০০%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Official Seal & Signature Block for Print */}
              <div className="pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
                <div className="space-y-1 text-xs text-slate-400">
                  <p><strong>{lang === 'bn' ? 'কার্যকর তারিখ:' : 'Effective Date:'}</strong> ১ সেপ্টেম্বর ২০২৬ খ্রিঃ</p>
                  <p><strong>{lang === 'bn' ? 'অনুমোদন কর্তৃপক্ষ:' : 'Approving Authority:'}</strong> প্রতিষ্ঠাতা পরিচালনা পরিষদ ও সাধারণ সভা</p>
                  <p className="font-mono text-[11px]">RJSC Reg ID: NXR-LTD-2026 | Shariah Certified</p>
                </div>

                <div className="text-center sm:text-right space-y-2">
                  <div className="inline-block text-center border-t-2 border-slate-600 pt-2 px-8">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      {lang === 'bn' ? 'প্রতিষ্ঠাতা অংশীদারদের পক্ষে অনুমোদিত ও স্বাক্ষরিত' : 'Approved on Behalf of Founder Shareholders'}
                    </p>
                    <p className="text-[10px] text-amber-400 font-mono mt-0.5">Nexora Limited Governance Seal</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
};
