import React from 'react';
import { Language } from '../types';
import { COMPANY_INFO } from '../data/initialData';
import { 
  Building2, ShieldCheck, FileCheck, Target, HeartHandshake, 
  Scale, BookOpen, CheckCircle2, Phone, Mail, MapPin
} from 'lucide-react';

interface Props {
  lang: Language;
  memberCount?: number;
}

export const AboutView: React.FC<Props> = ({ lang, memberCount = 13 }) => {
  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <section className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <Building2 className="w-4 h-4" />
            <span>{lang === 'bn' ? 'কোম্পানি পরিচিতি' : 'Corporate Profile'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'bn' ? 'নেক্সোরা লিমিটেড সম্পর্কে' : 'About Nexora Limited'}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {lang === 'bn'
              ? `নেক্সোরা লিমিটেড একটি প্রতিশ্রুতিশীল ও স্বচ্ছ যৌথ বিনিয়োগ প্রতিষ্ঠান, যা ${memberCount} জন স্বপ্নদর্শী উদ্যোক্তা ও পরিচালকের যৌথ প্রচেষ্টায় প্রতিষ্ঠিত হয়েছে। আমরা সুদমুক্ত হালাল বিনিয়োগের মাধ্যমে টেকসই রিয়েল এস্টেট, এগ্রো-ফার্মিং ও সাপ্লাই চেইন ব্যবসা পরিচালনা করি।`
              : `Nexora Limited is a progressive and transparent joint investment enterprise founded by ${memberCount} forward-thinking entrepreneurs. We specialize in Shariah-compliant real estate, agro-ventures, and logistics businesses with absolute financial transparency.`}
          </p>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {lang === 'bn' ? 'আমাদের ভিশন (Vision)' : 'Our Vision'}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {lang === 'bn'
              ? 'বাংলাদেশে ইসলামিক শরিয়াহভিত্তিক যৌথ বিনিয়োগের ক্ষেত্রে সর্বাপেক্ষা বিশ্বস্ত, প্রযুক্তিনির্ভর ও লাভজনক মডেল হিসেবে আত্মপ্রকাশ করা।'
              : 'To establish Nexora Limited as the most trusted, technology-driven, and prosperous Shariah-compliant joint investment platform in Bangladesh.'}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {lang === 'bn' ? 'আমাদের মিশন (Mission)' : 'Our Mission'}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {lang === 'bn'
              ? 'শেয়ারহোল্ডারদের পুঁজির শতভাগ নিরাপত্তা ও লাভজনক হালাল প্রকল্প সম্প্রসারণ, যাতে সবাই সম্মিলিতভাবে আর্থিক সমৃদ্ধি অর্জন করতে পারে।'
              : 'Safeguarding every shareholder\'s capital while deploying funds into vetted, high-yield, halal ventures with timely profit distributions.'}
          </p>
        </div>
      </section>

      {/* SHARIAH FRAMEWORK */}
      <section className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {lang === 'bn' ? 'শরিয়াহ কমপ্লায়েন্স ও বিনিয়োগ কাঠামো' : 'Shariah Compliance & Investment Framework'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'আমাদের প্রতিটি প্রকল্প যে শরিয়াহ চুক্তির অধীনে পরিচালিত হয়' : 'Core Islamic contracts governing all capital deployment'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <h3 className="text-emerald-400 font-bold text-base">১. মুদারাবা (Mudarabah)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'পুঁজি সরবরাহকারী (রব্বুল মাল) এবং কর্মদক্ষতা পরিচালনাকারীর (মুদারিব) মধ্যকার চুক্তিভিত্তিক হালাল মুনাফা বণ্টন পদ্ধতি।'
                : 'A partnership contract where shareholders provide capital and management executes with agreed profit-sharing ratios.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <h3 className="text-emerald-400 font-bold text-base">২. মুশারাকা (Musharakah)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'যৌথ মূলধন বিনিয়োগ, যেখানে লাভ-ক্ষতির অংশীদারিত্ব শেয়ার অনুপাতে ন্যায্যভাবে সমন্বয় করা হয়।'
                : 'Joint equity partnership where profits and losses are shared in strict proportion to equity contributions.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <h3 className="text-emerald-400 font-bold text-base">৩. ইজারা ও মুরাবাহা</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'সম্পদ লিজ ও স্পষ্ট খরচ-মুনাফা যোগের মাধ্যমে ক্রয়-বিক্রয় চুক্তি যা সুদবিহীন উপায়ে লাভজনক আয় নিশ্চিত করে।'
                : 'Asset-backed leasing and transparent cost-plus markup sales strictly avoiding hidden interest.'}
            </p>
          </div>
        </div>
      </section>

      {/* LEGAL CREDENTIALS & CONTACT */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <FileCheck className="w-5 h-5" />
            <h3 className="font-bold text-white text-lg">
              {lang === 'bn' ? 'আইনি ও সরকারি নিবন্ধন তথ্য' : 'Legal & Corporate Registrations'}
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between">
              <span className="text-slate-400">RJSC Registration:</span>
              <span className="font-mono font-bold text-emerald-400">{COMPANY_INFO.regNo}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between">
              <span className="text-slate-400">Tax Identification (TIN):</span>
              <span className="font-mono font-bold text-white">{COMPANY_INFO.tin}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between">
              <span className="text-slate-400">Business Identification (BIN):</span>
              <span className="font-mono font-bold text-white">{COMPANY_INFO.bin}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between">
              <span className="text-slate-400">Official Settlement Bank:</span>
              <span className="font-medium text-emerald-400">{COMPANY_INFO.officialBankEn}</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Building2 className="w-5 h-5" />
            <h3 className="font-bold text-white text-lg">
              {lang === 'bn' ? 'প্রধান কার্যালয় ও যোগাযোগ' : 'Head Office & Inquiries'}
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{lang === 'bn' ? COMPANY_INFO.headOfficeBn : COMPANY_INFO.headOfficeEn}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-mono">{COMPANY_INFO.hotline}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-mono">{COMPANY_INFO.email}</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
