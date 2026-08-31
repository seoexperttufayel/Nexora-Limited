import React, { useState, useRef } from 'react';
import { AdminProfile, Language } from '../types';
import { ImageCropModal } from './ImageCropModal';
import { saveAdminProfileToCloud, saveUserPasswordToCloud } from '../services/firebase';
import { 
  X, User, Mail, Phone, ShieldCheck, Camera, 
  CheckCircle2, KeyRound, Lock, FileText, Sparkles, Loader2 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  adminProfile: AdminProfile;
  lang: Language;
  onClose: () => void;
  onUpdateAdminProfile: (updated: AdminProfile) => void;
}

export const AdminProfileModal: React.FC<Props> = ({
  isOpen,
  adminProfile,
  lang,
  onClose,
  onUpdateAdminProfile
}) => {
  const [formData, setFormData] = useState<AdminProfile>({ ...adminProfile });
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  
  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  // Image Cropper State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status & Notification
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCropImageSrc(reader.result);
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setFormData(prev => ({
      ...prev,
      avatarUrl: croppedDataUrl
    }));
  };

  const handleRemoveAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatarUrl: ''
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSaving(true);

    if (!formData.email || !formData.email.includes('@')) {
      setIsSaving(false);
      setErrorMsg(lang === 'bn' ? 'অনুগ্রহ করে সঠিক ইমেল ঠিকানা দিন।' : 'Please enter a valid email address.');
      return;
    }

    try {
      const updated: AdminProfile = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      // Save in Firestore Cloud & Local state
      await saveAdminProfileToCloud(updated);
      onUpdateAdminProfile(updated);

      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setIsSaving(false);
      setErrorMsg(lang === 'bn' ? 'প্রোফাইল সংরক্ষণ ব্যর্থ হয়েছে।' : 'Failed to save admin profile.');
    }
  };

  const handleUpdateAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword.length < 6) {
      setPassError(lang === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError(lang === 'bn' ? 'পাসওয়ার্ড দুটি মিলছে না।' : 'Passwords do not match.');
      return;
    }

    try {
      setIsSaving(true);
      await saveUserPasswordToCloud('admin', newPassword);
      setIsSaving(false);
      setPassSuccess(lang === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!' : 'Admin password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(''), 3000);
    } catch (err) {
      setIsSaving(false);
      setPassError(lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।' : 'Failed to change admin password.');
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {lang === 'bn' ? 'অ্যাডমিন প্রোফাইল ম্যানেজমেন্ট' : 'Admin Profile Management'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn' 
                ? 'অ্যাডমিন তথ্য, যোগাযোগ ইমেইল ও নিরাপত্তা পাসওয়ার্ড পরিচালনা করুন' 
                : 'Manage admin profile credentials, email authorization, and security'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{lang === 'bn' ? 'প্রোফাইল বিবরণ' : 'Profile Details'}</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>{lang === 'bn' ? 'লগইন ও পাসওয়ার্ড' : 'Security & Password'}</span>
          </button>
        </div>

        {/* Feedback messages */}
        {saveSuccess && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{lang === 'bn' ? 'অ্যাডমিন প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!' : 'Admin profile saved successfully!'}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        {/* TAB 1: Profile Information */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            
            {/* Avatar Section */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt={formData.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/20 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
                    A
                  </div>
                )}

                <label className="absolute inset-0 bg-slate-950/70 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer backdrop-blur-[2px]">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] font-bold text-center mt-1">
                    {lang === 'bn' ? 'ছবি বদলান' : 'Change'}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileSelect}
                  />
                </label>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <p className="text-sm font-bold text-white">
                  {lang === 'bn' ? 'অ্যাডমিন প্রোফাইল ছবি' : 'Admin Profile Photo'}
                </p>
                <p className="text-xs text-slate-400">
                  {lang === 'bn' ? 'ছবি আপলোড করে সঠিক অনুপাতে ক্রপ করে নিন।' : 'Upload photo and crop to custom square aspect ratio.'}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                  <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition inline-flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'bn' ? 'নতুন ছবি আপলোড' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFileSelect}
                    />
                  </label>
                  {formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/20 transition"
                    >
                      {lang === 'bn' ? 'ছবি মুছুন' : 'Remove'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'bn' ? 'অ্যাডমিনের নাম (ইংরেজি) *' : 'Admin Name (English) *'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'bn' ? 'অ্যাডমিনের নাম (বাংলা) *' : 'Admin Name (Bangla) *'}
                </label>
                <input
                  type="text"
                  value={formData.nameBn}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'bn' ? 'অফিসিয়াল ইমেইল (পাসওয়ার্ড রিসেট ও লগইন) *' : 'Official Email (Password Reset & Login) *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="admin@nexoraltd.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {lang === 'bn' 
                    ? 'এই ইমেইলটি Forgot Password রিকোয়েস্ট যাচাই করতে ব্যবহৃত হবে।' 
                    : 'This email is authorized to verify forgot password requests.'}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1711-000000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Designation & NID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'bn' ? 'পদবী (ইংরেজি)' : 'Designation (English)'}
                </label>
                <input
                  type="text"
                  value={formData.designationEn}
                  onChange={(e) => setFormData({ ...formData, designationEn: e.target.value })}
                  placeholder="Chief Executive Administrator"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'bn' ? 'পদবী (বাংলা)' : 'Designation (Bangla)'}
                </label>
                <input
                  type="text"
                  value={formData.designationBn}
                  onChange={(e) => setFormData({ ...formData, designationBn: e.target.value })}
                  placeholder="প্রধান নির্বাহী প্রশাসক"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* NID */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {lang === 'bn' ? 'জাতীয় পরিচয়পত্র নং (NID)' : 'National ID (NID)'}
              </label>
              <input
                type="text"
                value={formData.nid || ''}
                onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                placeholder="1985269258000099"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{lang === 'bn' ? 'সংরক্ষণ করা হচ্ছে...' : 'Saving Profile...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'প্রোফাইল তথ্য সংরক্ষণ করুন' : 'Save Admin Profile'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Isolated Admin Password Change */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-amber-400">
                <Lock className="w-4 h-4" />
                <h3 className="font-bold text-xs sm:text-sm text-white">
                  {lang === 'bn' ? 'আইসোলেটেড অ্যাডমিন পাসওয়ার্ড' : 'Isolated Admin Password'}
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'bn'
                  ? 'এই পাসওয়ার্ডটি পরিবর্তন করলে শুধুমাত্র কেন্দ্রীয় অ্যাডমিনিস্ট্রেটর একাউন্টেই আপডেট হবে। কোনো মেম্বার বা সাধারণ শেয়ারহোল্ডার একাউন্টে কোনো প্রভাব পড়বে না।'
                  : 'Changing this password updates only the Super Admin account credentials in isolated cloud storage.'}
              </p>
            </div>

            {passSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            {passError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {passError}
              </div>
            )}

            <form onSubmit={handleUpdateAdminPassword} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'bn' ? 'নতুন অ্যাডমিন পাসওয়ার্ড' : 'New Admin Password'}
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
                  {lang === 'bn' ? 'নতুন পাসওয়ার্ড পুনরায় লিখুন' : 'Confirm New Password'}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{lang === 'bn' ? 'সংরক্ষণ করা হচ্ছে...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড আপডেট করুন' : 'Update Admin Password'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Image Cropper Modal */}
        <ImageCropModal
          isOpen={cropModalOpen}
          imageSrc={cropImageSrc}
          lang={lang}
          onClose={() => setCropModalOpen(false)}
          onCropComplete={handleCropComplete}
        />

      </div>
    </div>
  );
};
