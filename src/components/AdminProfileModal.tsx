import React, { useState, useRef } from 'react';
import { Language, AdminProfile, AccentColor, ThemeMode } from '../types';
import { ImageCropModal } from './ImageCropModal';
import { 
  ShieldCheck, User, Camera, Upload, Trash2, Check, X,
  Palette, Sun, Moon, KeyRound, Mail, Phone, Building2,
  Sparkles, CheckCircle2
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  adminProfile: AdminProfile;
  onUpdateAdminProfile: (updated: AdminProfile) => void;
  accentColor: AccentColor;
  onSelectAccentColor: (color: AccentColor) => void;
  themeMode: ThemeMode;
  onToggleThemeMode: () => void;
  onOpenChangePassword: () => void;
}

export const AdminProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lang,
  adminProfile,
  onUpdateAdminProfile,
  accentColor,
  onSelectAccentColor,
  themeMode,
  onToggleThemeMode,
  onOpenChangePassword
}) => {
  const [formData, setFormData] = useState<AdminProfile>(adminProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const updated: AdminProfile = {
      ...formData,
      avatarUrl: croppedDataUrl
    };
    setFormData(updated);
    onUpdateAdminProfile(updated);
    setToastMessage(lang === 'bn' ? 'অ্যাডমিন প্রোফাইল ছবি আপডেট হয়েছে!' : 'Admin avatar updated successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleRemoveAvatar = () => {
    const updated: AdminProfile = {
      ...formData,
      avatarUrl: ''
    };
    setFormData(updated);
    onUpdateAdminProfile(updated);
    setToastMessage(lang === 'bn' ? 'প্রোফাইল ছবি মুছে ফেলা হয়েছে।' : 'Profile avatar removed.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAdminProfile(formData);
    setIsEditing(false);
    setToastMessage(lang === 'bn' ? 'অ্যাডমিন প্রোফাইল তথ্য সংরক্ষিত হয়েছে!' : 'Admin profile details saved!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const colorThemes: { id: AccentColor; nameBn: string; nameEn: string; primary: string; bgClass: string; borderClass: string }[] = [
    { id: 'emerald', nameBn: 'শরিয়াহ এমারেল্ড (ডিফল্ট)', nameEn: 'Emerald Green', primary: '#10b981', bgClass: 'bg-emerald-500', borderClass: 'border-emerald-500' },
    { id: 'amber', nameBn: 'রয়্যাল অ্যাম্বার / গোল্ড', nameEn: 'Royal Gold & Amber', primary: '#f59e0b', bgClass: 'bg-amber-500', borderClass: 'border-amber-500' },
    { id: 'cyan', nameBn: 'ইলেকট্রিক সায়ান / স্কাই', nameEn: 'Electric Cyan & Sky', primary: '#06b6d4', bgClass: 'bg-cyan-500', borderClass: 'border-cyan-500' },
    { id: 'rose', nameBn: 'ক্রিমসন রোজ / রেড', nameEn: 'Crimson Rose', primary: '#f43f5e', bgClass: 'bg-rose-500', borderClass: 'border-rose-500' },
    { id: 'violet', nameBn: 'রয়্যাল ভায়োলেট / পার্পল', nameEn: 'Royal Violet', primary: '#8b5cf6', bgClass: 'bg-purple-500', borderClass: 'border-purple-500' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl space-y-6 my-auto text-slate-100 max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  {lang === 'bn' ? 'সুপার অ্যাডমিন প্রোফাইল ও থিম কাস্টমাইজার' : 'Super Admin Profile & Appearance'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                  MASTER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'bn' ? 'প্রোফাইল ছবি, কালার থিম ও অ্যাডমিনিস্ট্রেটিভ সেটিংস পরিচালনা করুন' : 'Manage your executive avatar, visual theme colors, and admin identity'}
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

        {/* Scrollable Content */}
        <div className="space-y-6 overflow-y-auto flex-1 pr-1">
          
          {/* Section 1: Circular Avatar & Admin Identity */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              {/* Circular Avatar with Interactive Hover Effect */}
              <div className="relative group cursor-pointer">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt={formData.name}
                    className="w-20 h-20 rounded-full object-cover aspect-square border-2 border-emerald-500 shadow-lg shadow-emerald-500/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-2xl shadow-lg">
                    <User className="w-9 h-9 text-emerald-400" />
                  </div>
                )}

                {/* Upload Overlay Button */}
                <label className="absolute inset-0 bg-slate-950/75 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer backdrop-blur-[2px]">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] font-bold mt-0.5">
                    {lang === 'bn' ? 'ছবি দিন' : 'Upload'}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarSelect}
                  />
                </label>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'bn' ? (formData.nameBn || formData.name) : formData.name}
                </h3>
                <p className="text-xs text-emerald-400 font-medium">
                  {lang === 'bn' ? formData.designationBn : formData.designationEn}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5 text-[11px] text-slate-400 font-mono">
                  <span>{formData.email}</span>
                  <span>•</span>
                  <span>{formData.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-center sm:self-auto">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ছবি আপলোড' : 'Upload Photo'}</span>
              </button>

              {formData.avatarUrl && (
                <button
                  onClick={handleRemoveAvatar}
                  className="p-1.5 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition"
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Multi-Theme Color Customizer */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">
                  {lang === 'bn' ? 'মাল্টি-থিম কালার কাস্টমাইজার' : 'Multi-Theme Accent Color System'}
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                {lang === 'bn' ? 'ওয়েবসাইটের অ্যাকসেন্ট কালার তাৎক্ষণিক পরিবর্তন করুন' : 'Instant global theme tint'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {colorThemes.map((theme) => {
                const isSelected = accentColor === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onSelectAccentColor(theme.id);
                      setToastMessage(lang === 'bn' ? `থিম পরিবর্তন: ${theme.nameBn}` : `Theme changed to ${theme.nameEn}`);
                      setTimeout(() => setToastMessage(''), 2500);
                    }}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? `${theme.borderClass} bg-slate-900 shadow-md ring-1 ring-white/10`
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div 
                        className={`w-5 h-5 rounded-full ${theme.bgClass} shadow-sm shrink-0 flex items-center justify-center text-slate-950`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {lang === 'bn' ? theme.nameBn : theme.nameEn}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Light / Dark Mode Quick Switcher */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                {themeMode === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {lang === 'bn' ? 'ওয়েবসাইট মোড (Light / Dark Mode)' : 'Interface Appearance Mode'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {themeMode === 'dark' 
                    ? (lang === 'bn' ? 'ডার্ক মোড সক্রিয় (আই-সেফ)' : 'Dark Mode Active') 
                    : (lang === 'bn' ? 'লাইট মোড সক্রিয় (উজ্জ্বল)' : 'Light Mode Active')}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleThemeMode}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition ${
                themeMode === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-md'
              }`}
            >
              {themeMode === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'bn' ? 'লাইট মোড করুন' : 'Switch to Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-950" />
                  <span>{lang === 'bn' ? 'ডার্ক মোড করুন' : 'Switch to Dark'}</span>
                </>
              )}
            </button>
          </div>

          {/* Section 4: Edit Admin Details Form */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'অ্যাডমিন তথ্যাবলি সম্পাদনা' : 'Admin Profile Details'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                {isEditing ? (lang === 'bn' ? 'বাতিল' : 'Cancel') : (lang === 'bn' ? 'সম্পাদনা করুন' : 'Edit Details')}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmitProfile} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'নাম (ইংরেজি) *' : 'Name (English) *'}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'নাম (বাংলা) *' : 'Name (Bengali) *'}</label>
                    <input
                      type="text"
                      required
                      value={formData.nameBn}
                      onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'পদবি (ইংরেজি)' : 'Designation (English)'}</label>
                    <input
                      type="text"
                      value={formData.designationEn}
                      onChange={(e) => setFormData({ ...formData, designationEn: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'পদবি (বাংলা)' : 'Designation (Bengali)'}</label>
                    <input
                      type="text"
                      value={formData.designationBn}
                      onChange={(e) => setFormData({ ...formData, designationBn: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'ইমেইল' : 'Email'}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone'}</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Details'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">{lang === 'bn' ? 'অফিসিয়াল পদবি' : 'Official Role'}</span>
                  <span className="text-white font-bold mt-0.5 block">{formData.designationBn || formData.designationEn}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">{lang === 'bn' ? 'নিরাপত্তা স্থিতি' : 'Security Level'}</span>
                  <span className="text-emerald-400 font-bold font-mono mt-0.5 block">Full Super Administrator (Tier 1)</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Password & Security Action */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                  {lang === 'bn' ? 'অ্যাকাউন্ট সিকিউরিটি ও পাসওয়ার্ড' : 'Security & Access Control'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'নিয়মিত আপনার পাসওয়ার্ড পরিবর্তন করে অ্যাকাউন্ট সুরক্ষিত রাখুন' : 'Update admin master password securely'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenChangePassword();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md"
            >
              {lang === 'bn' ? 'পাসওয়ার্ড বদলান' : 'Change Password'}
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            {lang === 'bn' ? 'সম্পন্ন' : 'Done'}
          </button>
        </div>

      </div>

      {/* Image Crop Modal for Admin Avatar */}
      {cropModalOpen && (
        <ImageCropModal
          isOpen={cropModalOpen}
          imageSrc={cropImageSrc}
          lang={lang}
          onClose={() => setCropModalOpen(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};
