import React from 'react';
import { Project, Language } from '../types';
import { Building2, MapPin, Calendar, TrendingUp, ShieldCheck, CheckCircle2, CircleDot } from 'lucide-react';

interface Props {
  projects: Project[];
  lang: Language;
}

export const ProjectsView: React.FC<Props> = ({ projects, lang }) => {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-3">
          <Building2 className="w-4 h-4" />
          <span>{lang === 'bn' ? 'প্রকল্প ও পোর্টফোলিও' : 'Projects & Portfolios'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {lang === 'bn' ? 'নেক্সোরা বিনিয়োগ প্রকল্প ও বাস্তবায়ন' : 'Nexora Real Estate & Business Ventures'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          {lang === 'bn'
            ? 'প্রতিটি প্রকল্প কঠোরভাবে শরিয়াহ নীতি অনুযায়ী মূল্যায়িত এবং শেয়ারহোল্ডারদের যৌথ তহবিলের মাধ্যমে অর্থায়িত।'
            : 'Every investment project is vetted by our Shariah advisory board and funded through collective shareholder contributions.'}
        </p>
      </div>

      {/* PROJECTS LIST */}
      <div className="space-y-8">
        {projects.map((proj) => {
          const progressPercent = Math.round((proj.raisedBudget / proj.targetBudget) * 100);

          return (
            <div
              key={proj.id}
              className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0 hover:border-slate-700 transition"
            >
              {/* Image Banner */}
              <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
                <img
                  src={proj.image}
                  alt={proj.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${
                    proj.status === 'completed'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      : proj.status === 'ongoing'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-xs text-white lg:hidden">
                  <span className="font-bold">{lang === 'bn' ? proj.categoryBn : proj.categoryEn}</span>
                </div>
              </div>

              {/* Project Body */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      {lang === 'bn' ? proj.categoryBn : proj.categoryEn}
                    </span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {proj.startDate}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {lang === 'bn' ? proj.titleBn : proj.titleEn}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {lang === 'bn' ? proj.descriptionBn : proj.descriptionEn}
                  </p>

                  <div className="flex items-center space-x-2 text-xs text-slate-400 pt-1">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{lang === 'bn' ? proj.locationBn : proj.locationEn}</span>
                  </div>
                </div>

                {/* Financial & Shariah Details */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 block font-medium">
                        {lang === 'bn' ? 'শরিয়াহ চুক্তির ধরন:' : 'Shariah Model:'}
                      </span>
                      <span className="font-semibold text-emerald-400 mt-0.5 block flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {lang === 'bn' ? proj.shariahModelBn : proj.shariahModelEn}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 block font-medium">
                        {lang === 'bn' ? 'প্রত্যাশিত লভ্যাংশ হার:' : 'Expected Return / Yield:'}
                      </span>
                      <span className="font-semibold text-amber-400 mt-0.5 block flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {lang === 'bn' ? proj.expectedReturnBn : proj.expectedReturnEn}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">
                        {lang === 'bn' ? 'তহবিল সংগ্রহ:' : 'Fund Allocation:'}{' '}
                        <span className="text-white font-mono">৳ {proj.raisedBudget.toLocaleString()}</span> / ৳ {proj.targetBudget.toLocaleString()}
                      </span>
                      <span className="text-emerald-400 font-mono">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, progressPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
