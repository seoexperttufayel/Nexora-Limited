import React from 'react';
import { Notice, Language } from '../types';
import { NOTICES } from '../data/initialData';
import { X, Bell, Calendar, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
}

export const NoticeBoardModal: React.FC<Props> = ({ isOpen, lang, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {lang === 'bn' ? 'নেক্সোরা নোটিশ ও সার্কুলার বোর্ড' : 'Official Notices & Circulars'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'সাধারণ সভা, কিস্তি আহ্বান ও প্রশাসনিক বিজ্ঞপ্তি' : 'AGM notices, installment announcements, and Shariah audits'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notices List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {NOTICES.map((notice) => (
            <div
              key={notice.id}
              className={`p-5 rounded-2xl border transition space-y-2.5 ${
                notice.important
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : 'bg-slate-950 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  notice.category === 'agm'
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    : notice.category === 'installment'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {notice.category.toUpperCase()}
                </span>

                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {notice.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {lang === 'bn' ? notice.titleBn : notice.titleEn}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'bn' ? notice.contentBn : notice.contentEn}
              </p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-500">
          {lang === 'bn' ? 'সকল বিজ্ঞপ্তি ব্যবস্থাপনা কর্তৃপক্ষ কর্তৃক স্বাক্ষরিত।' : 'All corporate circulars are issued by the Board of Directors.'}
        </div>

      </div>
    </div>
  );
};
