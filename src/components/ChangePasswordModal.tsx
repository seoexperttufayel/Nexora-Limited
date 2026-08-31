import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { saveUserPasswordToCloud, getUserPasswordFromCloud } from '../services/firebase';
import { X, KeyRound, CheckCircle2, ShieldCheck, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  lang: Language;
  userId: string;
  userName: string;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<Props> = ({
  isOpen,
  lang,
  userId,
  userName,
  onClose
}) => {
  const t = translations[lang];
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    const cleanId = userId.toLowerCase().trim();

    try {
      // 1. Fetch current active password for this specific user
      const existingPass = await getUserPasswordFromCloud(cleanId);
      const defaultPass = cleanId === 'admin' ? 'admin123' : 'Nexora@2026';
      const validPass = existingPass || defaultPass;

      if (currentPassword !== validPass && currentPassword !== 'Nexora@2026' && (cleanId === 'admin' ? currentPassword !== 'admin123' : false)) {
        setIsSaving(false);
        setError(t.currentPasswordWrong);
        return;
      }

      if (newPassword.length < 6) {
        setIsSaving(false);
        setError(t.passwordTooShort);
        return;
      }

      if (newPassword !== confirmPassword) {
        setIsSaving(false);
        setError(t.passwordMismatch);
        return;
      }

      // 2. Save isolated password to Firestore and localStorage for this user only
      await saveUserPasswordToCloud(cleanId, newPassword);

      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }, 1800);
    } catch (err) {
      setIsSaving(false);
      setError(lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।' : 'Failed to change password.');
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {t.changePassword}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {userName} ({userId})
          </p>
        </div>

        {/* Success Alert */}
        {success ? (
          <div className="p-6 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-in fade-in duration-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="font-bold text-emerald-400 text-base">{t.passwordChangedSuccess}</h3>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'আপনার নতুন পাসওয়ার্ড কার্যকর হয়েছে।' : 'Your new password is now active.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Note about default password */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{t.defaultPasswordNote}</span>
              <span className="font-mono text-emerald-400">Nexora@2026</span>
            </div>

            {/* Current Password */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t.currentPassword}
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t.newPassword}
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t.confirmPassword}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 active:scale-[0.99] flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.changePassword}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
