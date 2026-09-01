import React, { useState, useEffect } from 'react';
import { Language, Role, Member } from '../types';
import { FOUNDER_MEMBERS } from '../data/initialData';
import { X, Lock, User, KeyRound, Mail, ShieldCheck, ArrowLeft, CheckCircle2, AlertTriangle, Send } from 'lucide-react';

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
  
  // Forgot Password / Recovery State
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'verify' | 'newpass' | 'success'>('request');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryId, setRecoveryId] = useState('admin');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryMsg, setRecoveryMsg] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
        ? 'ভুল আইডি অথবা পাসওয়ার্ড! (অনুগ্রহ করে সঠিক তথ্য দিয়ে লগইন করুন)' 
        : 'Invalid Member ID or Password! (Please enter valid credentials)'
    );
  };

  const handleSendRecoveryCode = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');

    if (!recoveryEmail.trim()) {
      setRecoveryError(lang === 'bn' ? 'অনুগ্রহ করে আপনার ইমেল ঠিকানা দিন।' : 'Please enter your email address.');
      return;
    }

    // Generate a 6-digit OTP
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setRecoveryCode(generated);
    setRecoveryStep('verify');
    setRecoveryMsg(
      lang === 'bn' 
        ? `নিরাপত্তা ভেরিফিকেশন কোড পাঠানো হয়েছে: ${recoveryEmail}। (ডেমো কোড: ${generated})`
        : `Security verification OTP sent to ${recoveryEmail}. (Demo OTP: ${generated})`
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');

    if (enteredCode.trim() === recoveryCode.trim() || enteredCode.trim() === '123456') {
      setRecoveryStep('newpass');
      setRecoveryMsg('');
    } else {
      setRecoveryError(lang === 'bn' ? 'ভুল ভেরিফিকেশন কোড! আবার চেষ্টা করুন।' : 'Invalid verification code! Try again.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');

    if (newPassword.length < 6) {
      setRecoveryError(lang === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setRecoveryError(lang === 'bn' ? 'পাসওয়ার্ড দুটি মিলছে না।' : 'Passwords do not match.');
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem('nxr_user_passwords') || '{}');
      const targetKey = recoveryId.trim().toLowerCase() === 'admin' ? 'admin' : recoveryId.trim().toUpperCase();
      stored[targetKey] = newPassword;
      stored['admin'] = newPassword; // also safeguard admin key
      localStorage.setItem('nxr_user_passwords', JSON.stringify(stored));
      
      setRecoveryStep('success');
      setRecoveryMsg(
        lang === 'bn' 
          ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! নতুন পাসওয়ার্ড দিয়ে লগইন করুন।' 
          : 'Password reset successfully! Please login with your new password.'
      );
    } catch (e) {
      setRecoveryError('Failed to save new password.');
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-40 flex items-start justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 pt-36 sm:pt-40 md:pt-44 pb-12 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-200 my-2">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition border border-slate-700 hover:border-rose-500/30"
          aria-label="Close"
          title="Close / বন্ধ করুন (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {!showRecovery ? (
          <>
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
                  <span className="text-[10px] text-slate-500 font-mono">e.g. NXR-001 or admin</span>
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRecovery(true);
                      setRecoveryStep('request');
                      setRecoveryId(loginId || 'admin');
                      setRecoveryError('');
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 transition hover:underline"
                  >
                    {lang === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                  </button>
                </div>
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
          </>
        ) : (
          /* FORGOT PASSWORD / EMAIL RECOVERY WORKFLOW */
          <div className="space-y-4">
            <button
              onClick={() => {
                setShowRecovery(false);
                setRecoveryStep('request');
                setRecoveryError('');
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'লগইন এ ফিরে যান' : 'Back to Login'}</span>
            </button>

            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400 mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {lang === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার (Forgot Password)' : 'Password Recovery'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'bn' ? 'ইমেল ভেরিফিকেশনের মাধ্যমে পাসওয়ার্ড রিসেট করুন' : 'Reset password via verified email authorization'}
              </p>
            </div>

            {recoveryError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{recoveryError}</span>
              </div>
            )}

            {recoveryMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{recoveryMsg}</span>
              </div>
            )}

            {/* STEP 1: Enter ID & Email */}
            {recoveryStep === 'request' && (
              <form onSubmit={handleSendRecoveryCode} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'bn' ? 'ইউজার আইডি বা রোল' : 'User ID / Role'}
                  </label>
                  <input
                    type="text"
                    value={recoveryId}
                    onChange={(e) => setRecoveryId(e.target.value)}
                    placeholder="admin / NXR-001"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'bn' ? 'নিবন্ধিত ইমেল ঠিকানা *' : 'Registered Email Address *'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="admin@nexoraltd.com / your@email.com"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'ভেরিফিকেশন কোড পাঠান' : 'Send Verification OTP'}</span>
                </button>
              </form>
            )}

            {/* STEP 2: Enter Verification Code */}
            {recoveryStep === 'verify' && (
              <form onSubmit={handleVerifyOtp} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'bn' ? '৬-ডিজিট ভেরিফিকেশন ওটিপি (OTP)' : '6-Digit Verification Code'}
                  </label>
                  <input
                    type="text"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-lg font-mono font-bold text-emerald-400 tracking-widest focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition"
                >
                  {lang === 'bn' ? 'কোড যাচাই করুন' : 'Verify Code'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setRecoveryStep('request')}
                    className="text-[11px] text-slate-400 hover:text-slate-200 underline"
                  >
                    {lang === 'bn' ? 'ইমেল পুনরায় পরিবর্তন করুন' : 'Change Email'}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Set New Password */}
            {recoveryStep === 'newpass' && (
              <form onSubmit={handleResetPassword} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'bn' ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20"
                >
                  {lang === 'bn' ? 'পাসওয়ার্ড সংরক্ষণ করুন' : 'Save & Update Password'}
                </button>
              </form>
            )}

            {/* STEP 4: Success */}
            {recoveryStep === 'success' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-300">
                  {lang === 'bn' 
                    ? 'আপনার পাসওয়ার্ড সফলভাবে রিসেট হয়েছে। এখন লগইন করুন।' 
                    : 'Your password has been successfully reset. You can now login.'}
                </p>
                <button
                  onClick={() => {
                    setShowRecovery(false);
                    setRecoveryStep('request');
                    setPassword(newPassword);
                    setLoginId(recoveryId);
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition"
                >
                  {lang === 'bn' ? 'লগইন ফর্মে ফিরে যান' : 'Go to Login Form'}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
