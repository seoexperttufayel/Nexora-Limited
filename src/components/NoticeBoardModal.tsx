import React, { useState, useEffect } from 'react';
import { Notice, Language, Role } from '../types';
import { translations } from '../data/translations';
import { 
  X, Bell, Calendar, AlertCircle, FileText, CheckCircle2, 
  PlusCircle, Trash2, Tag, Send, AlertTriangle, Sparkles,
  CheckCheck, Eye, EyeOff, RotateCcw
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  lang: Language;
  role: Role;
  notices: Notice[];
  onClose: () => void;
  onAddNotice?: (notice: Notice) => void;
  onDeleteNotice?: (id: string) => void;
  readNoticeIds?: string[];
  setReadNoticeIds?: React.Dispatch<React.SetStateAction<string[]>>;
  dismissedNoticeIds?: string[];
  setDismissedNoticeIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const NoticeBoardModal: React.FC<Props> = ({ 
  isOpen, 
  lang, 
  role,
  notices,
  onClose,
  onAddNotice,
  onDeleteNotice,
  readNoticeIds: externalReadIds,
  setReadNoticeIds: externalSetReadIds,
  dismissedNoticeIds: externalDismissedIds,
  setDismissedNoticeIds: externalSetDismissedIds
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [contentBn, setContentBn] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [category, setCategory] = useState<'general' | 'agm' | 'installment' | 'dividend'>('general');
  const [important, setImportant] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Internal fallback if not provided
  const [internalReadIds, setInternalReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nxr_read_notices');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [internalDismissedIds, setInternalDismissedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nxr_dismissed_notices');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const readNoticeIds = externalReadIds !== undefined ? externalReadIds : internalReadIds;
  const setReadNoticeIds = externalSetReadIds || setInternalReadIds;

  const dismissedNoticeIds = externalDismissedIds !== undefined ? externalDismissedIds : internalDismissedIds;
  const setDismissedNoticeIds = externalSetDismissedIds || setInternalDismissedIds;

  if (!isOpen) return null;

  const toggleMarkAsRead = (id: string) => {
    setReadNoticeIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const markAllAsRead = () => {
    const allIds = notices.map(n => n.id);
    setReadNoticeIds(allIds);
  };

  const handleDismissAll = () => {
    const allActiveIds = notices.filter(n => !n.isDeleted).map(n => n.id);
    setDismissedNoticeIds(prev => Array.from(new Set([...prev, ...allActiveIds])));
    setReadNoticeIds(prev => Array.from(new Set([...prev, ...allActiveIds])));
  };

  const handleDismissNotice = (id: string) => {
    setDismissedNoticeIds(prev => [...prev, id]);
    setReadNoticeIds(prev => [...prev, id]);
  };

  const restoreDismissedNotices = () => {
    setDismissedNoticeIds([]);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn.trim() && !titleEn.trim()) return;

    const newNotice: Notice = {
      id: `NOT-${Date.now().toString().slice(-6)}`,
      titleBn: titleBn.trim() || titleEn.trim(),
      titleEn: titleEn.trim() || titleBn.trim(),
      contentBn: contentBn.trim() || contentEn.trim(),
      contentEn: contentEn.trim() || contentBn.trim(),
      category,
      important,
      date: new Date().toISOString().split('T')[0]
    };

    if (onAddNotice) {
      onAddNotice(newNotice);
    }

    // Reset form
    setTitleBn('');
    setTitleEn('');
    setContentBn('');
    setContentEn('');
    setCategory('general');
    setImportant(false);
    setShowAddForm(false);
  };

  // Filter out soft-deleted and dismissed notices for active user view
  const activeNotices = notices.filter(n => !n.isDeleted && !dismissedNoticeIds.includes(n.id));

  const filteredNotices = activeNotices.filter(n => {
    if (filterCategory === 'unread') return !readNoticeIds.includes(n.id);
    if (filterCategory === 'all') return true;
    return n.category === filterCategory;
  });

  const unreadCount = activeNotices.filter(n => !readNoticeIds.includes(n.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative text-slate-100 space-y-5 max-h-[90vh] flex flex-col my-auto">
        
        {/* Header with Clear Close Cross Button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 shadow-md shadow-amber-500/10">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  {lang === 'bn' ? 'বিজ্ঞপ্তি বোর্ড ও নোটিশ' : 'Official Notice Board'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
                  {activeNotices.length}
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30 animate-pulse">
                    {unreadCount} {lang === 'bn' ? 'নতুন' : 'New'}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                {lang === 'bn' ? 'সাধারণ সভা, কিস্তি আহ্বান ও প্রশাসনিক বিজ্ঞপ্তি' : 'AGM notices, installment announcements, and Shariah circulars'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {role === 'admin' && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  showAddForm 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                }`}
              >
                {showAddForm ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'বাতিল' : 'Cancel'}</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? '+ নোটিশ দিন' : '+ Post Notice'}</span>
                  </>
                )}
              </button>
            )}

            {/* Universal Close 'X' Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
              title="Close / বন্ধ করুন"
              aria-label="Close Notice Board"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ADMIN NOTICE CREATION FORM (VISIBLE WHEN ADMIN CLICKS "+ Post Notice") */}
        {role === 'admin' && showAddForm && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 shrink-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {lang === 'bn' ? 'নতুন নোটিশ / বিজ্ঞপ্তি তৈরি ও প্রকাশ' : 'Create & Publish New Notice'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Super Admin Action</span>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'bn' ? 'শিরোনাম (বাংলা) *' : 'Title (Bengali) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="যেমন: সেপ্টেম্বর মাসের কিস্তি জমাদান সংক্রান্ত..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'bn' ? 'শিরোনাম (ইংরেজি)' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Notice regarding September Installment..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="general">General (সাধারণ)</option>
                    <option value="installment">Installment (কিস্তি সংক্রান্ত)</option>
                    <option value="agm">AGM / Meeting (সাধারণ সভা)</option>
                    <option value="dividend">Dividend / Profit (মুনাফা বণ্টন)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="importantNoticeCheck"
                    checked={important}
                    onChange={(e) => setImportant(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                  <label htmlFor="importantNoticeCheck" className="text-xs text-slate-300 cursor-pointer font-medium">
                    {lang === 'bn' ? 'জরুরি বিজ্ঞপ্তি হিসেবে চিহ্নিত করুন (Important / Urgent)' : 'Mark as Urgent / Important'}
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'bn' ? 'বিস্তারিত নোটিশ (বাংলা) *' : 'Notice Body (Bengali) *'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={contentBn}
                    onChange={(e) => setContentBn(e.target.value)}
                    placeholder="বিজ্ঞপ্তির বিস্তারিত বিবরণ লিখুন..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'bn' ? 'বিস্তারিত নোটিশ (ইংরেজি)' : 'Notice Body (English)'}
                  </label>
                  <textarea
                    rows={3}
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    placeholder="Enter detailed English description..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'নোটিশ প্রকাশ করুন' : 'Publish Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Action Bar: Category Filters & Mark All as Read */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                filterCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'bn' ? 'সকল' : 'All'} ({activeNotices.length})
            </button>
            {unreadCount > 0 && (
              <button
                onClick={() => setFilterCategory('unread')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  filterCategory === 'unread'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-emerald-400 hover:text-emerald-300'
                }`}
              >
                {lang === 'bn' ? 'অপঠিত' : 'Unread'} ({unreadCount})
              </button>
            )}
            <button
              onClick={() => setFilterCategory('installment')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                filterCategory === 'installment'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'bn' ? 'কিস্তি' : 'Installment'}
            </button>
            <button
              onClick={() => setFilterCategory('agm')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                filterCategory === 'agm'
                  ? 'bg-purple-500 text-white font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'bn' ? 'সাধারণ সভা' : 'AGM'}
            </button>
            <button
              onClick={() => setFilterCategory('general')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                filterCategory === 'general'
                  ? 'bg-blue-500 text-white font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'bn' ? 'সাধারণ' : 'General'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold transition flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'সব পড়া হয়েছে' : 'Mark All as Read'}</span>
              </button>
            )}

            {dismissedNoticeIds.length > 0 && (
              <button
                onClick={restoreDismissedNotices}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[11px] transition flex items-center gap-1"
                title="Restore cleared notices"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'bn' ? `মুছে ফেলা ফিরিয়ে আনুন (${dismissedNoticeIds.length})` : `Restore (${dismissedNoticeIds.length})`}</span>
              </button>
            )}
          </div>
        </div>

        {/* Notices List (Scrollable) */}
        <div className="space-y-3.5 overflow-y-auto flex-1 pr-1">
          {filteredNotices.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              {lang === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি।' : 'No notices in this category.'}
            </div>
          ) : (
            filteredNotices.map((notice) => {
              const isRead = readNoticeIds.includes(notice.id);
              return (
                <div
                  key={notice.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition space-y-2.5 relative group ${
                    !isRead
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-md shadow-emerald-500/5'
                      : notice.important
                      ? 'bg-amber-500/5 border-amber-500/30 opacity-90'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 opacity-80'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        notice.category === 'agm'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : notice.category === 'installment'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : notice.category === 'dividend'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {notice.category.toUpperCase()}
                      </span>

                      {notice.important && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          {lang === 'bn' ? 'জরুরি' : 'URGENT'}
                        </span>
                      )}

                      {!isRead ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                          ● {lang === 'bn' ? 'অপঠিত' : 'UNREAD'}
                        </span>
                      ) : (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                          ✓ {lang === 'bn' ? 'পড়া হয়েছে' : 'READ'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {notice.date}
                      </span>

                      {/* Mark as Read / Unread toggle */}
                      <button
                        onClick={() => toggleMarkAsRead(notice.id)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
                          isRead
                            ? 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                        }`}
                        title={isRead ? (lang === 'bn' ? 'অপঠিত হিসেবে চিহ্নিত করুন' : 'Mark as unread') : (lang === 'bn' ? 'পড়া হয়েছে হিসেবে চিহ্নিত করুন' : 'Mark as read')}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="hidden sm:inline">
                          {isRead ? (lang === 'bn' ? 'পড়া হয়েছে' : 'Read') : (lang === 'bn' ? 'পড়া হয়েছে চিহ্নিত করুন' : 'Mark as Read')}
                        </span>
                      </button>

                      {/* Notice Action Buttons */}
                      {onDeleteNotice && (
                        <button
                          onClick={() => {
                            onDeleteNotice(notice.id);
                            // Also ensure it's recorded as read so unread counter never lags
                            setReadNoticeIds(prev => Array.from(new Set([...prev, notice.id])));
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[11px] font-semibold transition flex items-center gap-1 active:scale-95"
                          title={lang === 'bn' ? 'ট্র্যাশ বিনে পাঠান' : 'Move to Trash Bin'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDismissNotice(notice.id)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                        title={lang === 'bn' ? 'তালিকা থেকে লুকান' : 'Dismiss'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className={`text-sm sm:text-base font-bold leading-snug ${!isRead ? 'text-white font-extrabold' : 'text-slate-200'}`}>
                    {lang === 'bn' ? notice.titleBn : notice.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {lang === 'bn' ? notice.contentBn : notice.contentEn}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer note */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>{lang === 'bn' ? 'সকল বিজ্ঞপ্তি পরিচালনা পরিষদ কর্তৃক অনুমোদিত।' : 'All circulars authorized by the Board of Directors.'}</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition"
          >
            {translations[lang].close}
          </button>
        </div>

      </div>
    </div>
  );
};
