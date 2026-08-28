import React, { useState } from 'react';
import { Language, Role } from '../types';
import { translations } from '../data/translations';
import { 
  ShieldCheck, Globe, Lock, LogOut, UserCheck, 
  Menu, X, Sparkles, Building2, Bell, FileText, CheckCircle2,
  KeyRound, ChevronRight, User, Cloud, CloudCheck
} from 'lucide-react';

interface Props {
  lang: Language;
  setLang: (lang: Language) => void;
  role: Role;
  currentUser: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenNotice: () => void;
  onOpenChangePassword: () => void;
  pendingCount: number;
  noticeCount?: number;
  isCloudSynced?: boolean;
}

export const Navbar: React.FC<Props> = ({
  lang,
  setLang,
  role,
  currentUser,
  activeTab,
  setActiveTab,
  onOpenLogin,
  onLogout,
  onOpenNotice,
  onOpenChangePassword,
  pendingCount,
  noticeCount = 0,
  isCloudSynced = true
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = translations[lang];

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl print:hidden">
      
      {/* TOP ANNOUNCEMENT & SHARIAH BAR */}
      <div className="bg-emerald-950/40 border-b border-emerald-500/10 px-3 sm:px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold text-[11px] sm:text-xs">{t.shariahBadge}</span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline text-slate-300 text-xs">
              {lang === 'bn' ? '১৩ জন প্রতিষ্ঠাতা অংশীদারের শরিয়াহ-সম্মত নিরাপদ যৌথ প্ল্যাটফর্ম' : 'Secured Portal for 13 Founder Shareholders & Governance'}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{lang === 'bn' ? 'ফায়ারবেস ক্লাউড সিঙ্ক: সক্রিয়' : 'Firestore Cloud Sync: Live'}</span>
            </div>
            <span className="text-slate-400 font-mono">Reg: C-198420/2026</span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center space-x-2.5 sm:space-x-3.5 cursor-pointer group shrink-0"
          onClick={() => setActiveTab(role === 'admin' ? 'admin-dashboard' : role === 'member' ? 'member-dashboard' : 'home')}
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-xl sm:text-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
            N
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition">
                {t.appName}
              </h1>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LTD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block truncate max-w-xs xl:max-w-sm">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Action Tools: Notice Board Button directly adjacent to Language Switcher */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          
          {/* NOTICE BOARD (বিজ্ঞপ্তি বোর্ড) ICON BUTTON - MOVED DIRECTLY NEXT TO LANGUAGE SWITCHER */}
          <button
            onClick={onOpenNotice}
            className="relative flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 shadow-sm active:scale-95 group"
            title="Notice Board / বিজ্ঞপ্তি বোর্ড"
            aria-label="Open Notice Board"
          >
            <Bell className="w-4 h-4 text-amber-400 group-hover:animate-bounce" />
            <span className="hidden sm:inline">{lang === 'bn' ? 'বিজ্ঞপ্তি' : 'Notices'}</span>
            {noticeCount > 0 && (
              <span className="w-4 h-4 sm:w-4 sm:h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] flex items-center justify-center -ml-0.5">
                {noticeCount}
              </span>
            )}
          </button>

          {/* Language Toggle Button */}
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 shadow-sm active:scale-95"
            title="Toggle Language / ভাষা পরিবর্তন"
            aria-label="Toggle Language"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="hidden xs:inline sm:inline">{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Auth Button or User Profile Badge */}
          {role === 'public' ? (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-500/25 active:scale-95 shrink-0"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t.clientArea}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-800/90 border border-slate-700/80 p-1 sm:p-1.5 pr-2 sm:pr-2.5 rounded-2xl shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-[11px] sm:text-xs font-mono">
                {role === 'admin' ? 'ADM' : currentUser?.id?.slice(-3) || 'MEM'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-white leading-tight truncate max-w-[100px] xl:max-w-[130px]">
                  {lang === 'bn' ? (currentUser?.nameBn || currentUser?.name) : currentUser?.name}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono leading-tight">
                  {role === 'admin' ? 'Super Admin' : `${currentUser?.id} (${currentUser?.share}%)`}
                </p>
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                title={t.logout}
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}

          {/* 3-LINE MENU TOGGLE BUTTON (AVAILABLE ON ALL DEVICES) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center shrink-0 active:scale-95"
            title="Menu / মেনু"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
          </button>
        </div>

      </div>

      {/* HORIZONTAL SECONDARY NAVIGATION BAR */}
      <nav className="bg-slate-900/95 border-t border-slate-800/80 px-3 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 py-2 sm:py-2.5 whitespace-nowrap">
          
          {/* Public Views */}
          {role === 'public' && (
            <>
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'home'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {t.home}
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'about'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {t.about}
              </button>
              <button
                onClick={() => setActiveTab('governance')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'governance'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {t.governance}
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'projects'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {t.projects}
              </button>
            </>
          )}

          {/* Member Views */}
          {role === 'member' && (
            <>
              <button
                onClick={() => setActiveTab('member-dashboard')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'member-dashboard'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {t.memberDashboard}
              </button>
              <button
                onClick={() => setActiveTab('member-deposit')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'member-deposit'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {lang === 'bn' ? 'মাসিক কিস্তি জমা দিন' : 'Submit Monthly Installment'}
              </button>
              <button
                onClick={() => setActiveTab('installments')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'installments'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {t.installments}
              </button>
              <button
                onClick={() => setActiveTab('governance')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'governance'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {t.governance}
              </button>
            </>
          )}

          {/* Admin Views */}
          {role === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{t.adminPanel}</span>
                {pendingCount > 0 && (
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('admin-deposit')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'admin-deposit'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {lang === 'bn' ? 'কিস্তি জমা দিন' : 'Deposit Installment'}
              </button>
              <button
                onClick={() => setActiveTab('installments')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'installments'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {t.installments}
              </button>
              <button
                onClick={() => setActiveTab('governance')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'governance'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {t.governance}
              </button>
            </>
          )}

        </div>
      </nav>

      {/* 3-LINE HAMBURGER DROPDOWN MENU */}
      {menuOpen && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xl">
          
          {/* User Profile Banner if logged in */}
          {role !== 'public' && currentUser && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400">
                  {role === 'admin' ? 'ADM' : currentUser.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">
                    {lang === 'bn' ? (currentUser.nameBn || currentUser.name) : currentUser.name}
                  </p>
                  <p className="text-xs text-emerald-400 font-mono">
                    {role === 'admin' ? 'Super Administrator' : `${currentUser.id} • ${currentUser.share}% Equity`}
                  </p>
                </div>
              </div>

              {/* Change Password button */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenChangePassword();
                }}
                className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.changePassword}</span>
              </button>
            </div>
          )}

          {/* Quick Menu Grid */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              {lang === 'bn' ? 'নেভিগেশন মেনু' : 'Navigation Menu'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {role === 'public' ? (
                <>
                  <button onClick={() => handleNavClick('home')} className="p-3 text-left bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-200 font-medium">{t.home}</button>
                  <button onClick={() => handleNavClick('about')} className="p-3 text-left bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-200 font-medium">{t.about}</button>
                  <button onClick={() => handleNavClick('governance')} className="p-3 text-left bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-200 font-medium">{t.governance}</button>
                  <button onClick={() => handleNavClick('projects')} className="p-3 text-left bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-200 font-medium">{t.projects}</button>
                </>
              ) : role === 'member' ? (
                <>
                  <button onClick={() => handleNavClick('member-dashboard')} className="p-3 text-left bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-200 font-medium">{t.memberDashboard}</button>
                  <button onClick={() => handleNavClick('member-deposit')} className="p-3 text-left bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-200 font-medium">{lang === 'bn' ? 'মাসিক কিস্তি জমা দিন' : 'Submit Monthly Installment'}</button>
                  <button onClick={() => handleNavClick('installments')} className="p-3 text-left bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-200 font-medium">{t.installments}</button>
                  <button onClick={() => handleNavClick('governance')} className="p-3 text-left bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-200 font-medium">{t.governance}</button>
                  <button onClick={() => { setMenuOpen(false); onOpenChangePassword(); }} className="p-3 text-left bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-xl font-medium flex items-center gap-1.5 col-span-2 sm:col-span-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{t.changePassword}</span>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleNavClick('admin-dashboard')} className="p-3 text-left bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-200 font-medium">{t.adminPanel}</button>
                  <button onClick={() => handleNavClick('admin-deposit')} className="p-3 text-left bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-200 font-medium">{lang === 'bn' ? 'কিস্তি জমা দিন' : 'Deposit Installment'}</button>
                  <button onClick={() => handleNavClick('installments')} className="p-3 text-left bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-200 font-medium">{t.installments}</button>
                  <button onClick={() => handleNavClick('governance')} className="p-3 text-left bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-200 font-medium">{t.governance}</button>
                  <button onClick={() => { setMenuOpen(false); onOpenChangePassword(); }} className="p-3 text-left bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-xl font-medium flex items-center gap-1.5 col-span-2 sm:col-span-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{t.changePassword}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom actions in menu */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenNotice();
              }}
              className="flex items-center space-x-1.5 text-slate-300 hover:text-white"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>{t.notices}</span>
              {noticeCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-400 rounded-full font-mono text-[10px]">
                  {noticeCount}
                </span>
              )}
            </button>

            {role === 'public' ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenLogin();
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t.clientArea}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold rounded-xl flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.logout}</span>
              </button>
            )}
          </div>

        </div>
      )}

    </header>
  );
};
