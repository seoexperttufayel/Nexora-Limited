import React, { useState } from 'react';
import { Language, Role, Member } from '../types';
import { FOUNDER_MEMBERS } from '../data/initialData';
import { X, Lock, User, ShieldCheck, KeyRound, Sparkles, ChevronRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  lang: Language;
  members?: Member[];
  onClose: () => void;
  onSuccess: (role: Role, user: any) => void;
}

export const LoginModal: React.FC<Props> = ({ isOpen, lang, members, onClose, onSuccess }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentMembersList = members && members.length > 0 ? members : FOUNDER_MEMBERS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = loginId.trim();

    // Check custom password if set
    const storedPasswords = JSON.parse(localStorage.getItem('nxr_user_passwords') || '{}');
    const expectedCustomPass = storedPasswords[cleanId] || storedPasswords[cleanId.toLowerCase()] || storedPasswords[cleanId.toUpperCase()];

    // Check Admin Login
    if (cleanId.toLowerCase() === 'admin') {
      const isValidAdmin = expectedCustomPass 
        ? password === expectedCustomPass 
        : (password === 'Nexora@2026' || password === 'admin' || password === '123456');

      if (isValidAdmin) {
        onSuccess('admin', { id: 'admin', name: 'Super Admin', nameBn: 'সুপার অ্যাডমিন', role: 'admin' });
        onClose();
        setError('');
        return;
      }
    }

    // Check Member Login
    const found = currentMembersList.find(m => m.id.toLowerCase() === cleanId.toLowerCase());
    if (found) {
      const isValidMember = expectedCustomPass 
        ? password === expectedCustomPass 
        : (password === 'Nexora@2026' || password === 'Nexora@123' || password === '123456');

      if (isValidMember) {
        onSuccess('member', found);
        onClose();
        setError('');
        return;
      }
    }

    setError(
      lang === 'bn' 
        ? 'ভুল আইডি অথবা পাসওয়ার্ড! (ডিফল্ট পাসওয়ার্ড: Nexora@2026)' 
        : 'Invalid Member ID or Password! (Default password: Nexora@2026)'
    );
  };

  const fillQuick = (id: string, pass: string) => {
    setLoginId(id);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 mx-auto flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {lang === 'bn' ? 'নেক্সোরা পোর্টাল লগইন' : 'Nexora Portal Login'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'bn' ? 'শেয়ারহোল্ডার ও অ্যাডমিন সিকিউর অ্যাক্সেস' : 'Shareholder & Administrator Secure Access'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
              <span>{lang === 'bn' ? 'ইউজার বা মেম্বার আইডি' : 'User / Member ID'}</span>
              <span className="text-[10px] text-slate-500">e.g. NXR-001 or admin</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="NXR-001 / admin"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
          >
            {lang === 'bn' ? 'লগইন করুন' : 'Secure Login'}
          </button>
        </form>

        {/* Quick Demo Pre-fill Shortcuts */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? 'এক ক্লিকে ডেমো টেস্ট করুন:' : '1-Click Demo Logins:'}</span>
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillQuick('NXR-001', 'Nexora@2026')}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition flex items-center justify-between group"
            >
              <div>
                <p className="font-semibold text-white group-hover:text-emerald-400">Tufayel (MD)</p>
                <p className="text-[10px] text-slate-400 font-mono">NXR-001 (10%)</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() => fillQuick('NXR-002', 'Nexora@2026')}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition flex items-center justify-between group"
            >
              <div>
                <p className="font-semibold text-white group-hover:text-emerald-400">Mehrab (Dir)</p>
                <p className="text-[10px] text-slate-400 font-mono">NXR-002 (10%)</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() => fillQuick('NXR-005', 'Nexora@2026')}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition flex items-center justify-between group"
            >
              <div>
                <p className="font-semibold text-white group-hover:text-emerald-400">Humayun (Dir)</p>
                <p className="text-[10px] text-slate-400 font-mono">NXR-005 (5%)</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() => fillQuick('admin', 'Nexora@2026')}
              className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition flex items-center justify-between group"
            >
              <div>
                <p className="font-semibold text-emerald-400">Super Admin</p>
                <p className="text-[10px] text-emerald-500/80 font-mono">admin / All Access</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
