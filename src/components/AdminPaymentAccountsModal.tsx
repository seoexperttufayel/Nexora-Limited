import React, { useState, useEffect } from 'react';
import { PaymentAccountConfig, Language } from '../types';
import { 
  CreditCard, PlusCircle, Edit3, Trash2, Check, X, 
  Building2, Smartphone, ShieldCheck, AlertCircle, RefreshCw,
  Wallet, Layers
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  lang: Language;
  paymentAccounts: PaymentAccountConfig[];
  onClose: () => void;
  onUpdateAccount: (updated: PaymentAccountConfig) => void;
  onAddAccount: (account: PaymentAccountConfig) => void;
  onDeleteAccount: (id: string) => void;
  onResetDefaults?: () => void;
}

export const AdminPaymentAccountsModal: React.FC<Props> = ({
  isOpen,
  lang,
  paymentAccounts,
  onClose,
  onUpdateAccount,
  onAddAccount,
  onDeleteAccount,
  onResetDefaults
}) => {
  const [editingAccount, setEditingAccount] = useState<PaymentAccountConfig | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State for new account
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newType, setNewType] = useState<PaymentAccountConfig['type']>('bkash');
  const [newAccountTypeBn, setNewAccountTypeBn] = useState('মার্চেন্ট অ্যাকাউন্ট');
  const [newAccountTypeEn, setNewAccountTypeEn] = useState('Merchant Account');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newBankNameBn, setNewBankNameBn] = useState('');
  const [newBankNameEn, setNewBankNameEn] = useState('');
  const [newBranchBn, setNewBranchBn] = useState('');
  const [newBranchEn, setNewBranchEn] = useState('');
  const [newRoutingNumber, setNewRoutingNumber] = useState('');
  const [newInstructionsBn, setNewInstructionsBn] = useState('');
  const [newInstructionsEn, setNewInstructionsEn] = useState('');

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    onUpdateAccount(editingAccount);
    setEditingAccount(null);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleBn && !newTitleEn) return;
    if (!newAccountNumber) return;

    const created: PaymentAccountConfig = {
      id: `pay-${Date.now().toString().slice(-6)}`,
      titleBn: newTitleBn.trim() || newTitleEn.trim(),
      titleEn: newTitleEn.trim() || newTitleBn.trim(),
      type: newType,
      accountTypeBn: newAccountTypeBn,
      accountTypeEn: newAccountTypeEn,
      accountNumber: newAccountNumber.trim(),
      bankNameBn: newBankNameBn,
      bankNameEn: newBankNameEn,
      branchBn: newBranchBn,
      branchEn: newBranchEn,
      routingNumber: newRoutingNumber,
      instructionsBn: newInstructionsBn,
      instructionsEn: newInstructionsEn,
      isActive: true
    };

    onAddAccount(created);
    setShowAddForm(false);

    // Reset inputs
    setNewTitleBn('');
    setNewTitleEn('');
    setNewAccountNumber('');
    setNewBankNameBn('');
    setNewBankNameEn('');
    setNewBranchBn('');
    setNewBranchEn('');
    setNewRoutingNumber('');
    setNewInstructionsBn('');
    setNewInstructionsEn('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 pt-24 sm:pt-28 pb-8 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl space-y-6 my-auto text-slate-100 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {lang === 'bn' ? 'পেমেন্ট অ্যাকাউন্ট সেটিংস (বিকাশ, নগদ ও ব্যাংক)' : 'Payment Accounts & Gateway Settings'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'bn' ? 'সদস্যদের কিস্তি জমার অ্যাকাউন্ট নম্বর ও তথ্য সম্পাদনা করুন' : 'Manage corporate bank and mobile banking channels'}
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

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingAccount(null);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showAddForm ? (lang === 'bn' ? 'বাতিল' : 'Cancel') : (lang === 'bn' ? '+ নতুন অ্যাকাউন্ট যুক্ত করুন' : '+ Add Account')}</span>
          </button>

          {onResetDefaults && (
            <button
              onClick={() => {
                if (window.confirm(lang === 'bn' ? 'ডিফল্ট অ্যাকাউন্ট তথ্য রিস্টোর করতে চান?' : 'Reset to default accounts?')) {
                  onResetDefaults();
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'ডিফল্ট রিস্টোর' : 'Reset Defaults'}</span>
            </button>
          )}
        </div>

        {/* CREATE NEW ACCOUNT FORM */}
        {showAddForm && (
          <form onSubmit={handleCreateAccount} className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 shrink-0 text-xs">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'bn' ? 'নতুন পেমেন্ট মাধ্যম যোগ করুন' : 'Add New Payment Gateway'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'অ্যাকাউন্টের নাম (বাংলা) *' : 'Title (Bengali) *'}</label>
                <input
                  type="text"
                  required
                  value={newTitleBn}
                  onChange={(e) => setNewTitleBn(e.target.value)}
                  placeholder="যেমন: বিকাশ মার্চেন্ট..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'অ্যাকাউন্টের ধরন (Gateway Type) *' : 'Gateway Type *'}</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="bkash">bKash (বিকাশ)</option>
                  <option value="nagad">Nagad (নগদ)</option>
                  <option value="bank">Bank Account (ব্যাংক অ্যাকাউন্ট)</option>
                  <option value="rocket">Rocket (রকেট)</option>
                  <option value="other">Other Gateway (অন্যান্য)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'হিসাব বা মোবাইল নম্বর *' : 'Account / Mobile Number *'}</label>
                <input
                  type="text"
                  required
                  value={newAccountNumber}
                  onChange={(e) => setNewAccountNumber(e.target.value)}
                  placeholder="e.g. 01712-XXXXXX or 2050-XXXX"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'অ্যাকাউন্ট টাইপ (যেমন: মার্চেন্ট/চলতি)' : 'Account Label'}</label>
                <input
                  type="text"
                  value={newAccountTypeBn}
                  onChange={(e) => setNewAccountTypeBn(e.target.value)}
                  placeholder="মার্চেন্ট অ্যাকাউন্ট"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {newType === 'bank' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">ব্যাংকের নাম</label>
                  <input
                    type="text"
                    value={newBankNameBn}
                    onChange={(e) => setNewBankNameBn(e.target.value)}
                    placeholder="ইসলামী ব্যাংক..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">শাখা</label>
                  <input
                    type="text"
                    value={newBranchBn}
                    onChange={(e) => setNewBranchBn(e.target.value)}
                    placeholder="জিন্দাবাজার শাখা..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">রাউটিং নং</label>
                  <input
                    type="text"
                    value={newRoutingNumber}
                    onChange={(e) => setNewRoutingNumber(e.target.value)}
                    placeholder="125261458"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'পেমেন্ট নির্দেশিকা (Instructions)' : 'Payment Instructions'}</label>
              <textarea
                rows={2}
                value={newInstructionsBn}
                onChange={(e) => setNewInstructionsBn(e.target.value)}
                placeholder="সদস্যদের জন্য পেমেন্ট করার ধাপসমূহ..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'যুক্ত করুন' : 'Add Gateway'}</span>
              </button>
            </div>
          </form>
        )}

        {/* EDIT SELECTED ACCOUNT FORM */}
        {editingAccount && (
          <form onSubmit={handleSaveEdit} className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3 shrink-0 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4" />
                <span>{lang === 'bn' ? `অ্যাকাউন্ট সম্পাদনা: ${editingAccount.titleBn || editingAccount.titleEn}` : `Edit Gateway: ${editingAccount.titleEn}`}</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'অ্যাকাউন্টের নাম (বাংলা)' : 'Title (Bengali)'}</label>
                <input
                  type="text"
                  required
                  value={editingAccount.titleBn}
                  onChange={(e) => setEditingAccount({...editingAccount, titleBn: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'অ্যাকাউন্ট নম্বর / মোবাইল নম্বর *' : 'Account / Mobile Number *'}</label>
                <input
                  type="text"
                  required
                  value={editingAccount.accountNumber}
                  onChange={(e) => setEditingAccount({...editingAccount, accountNumber: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'অ্যাকাউন্ট টাইপ' : 'Account Type'}</label>
                <input
                  type="text"
                  value={editingAccount.accountTypeBn}
                  onChange={(e) => setEditingAccount({...editingAccount, accountTypeBn: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'সক্রিয় স্থিতি (Active Status)' : 'Active Status'}</label>
                <select
                  value={editingAccount.isActive ? 'true' : 'false'}
                  onChange={(e) => setEditingAccount({...editingAccount, isActive: e.target.value === 'true'})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="true">{lang === 'bn' ? 'সক্রিয় (পেমেন্ট পেজে দেখাবে)' : 'Active (Visible)'}</option>
                  <option value="false">{lang === 'bn' ? 'নিষ্ক্রিয় (লুকানো থাকবে)' : 'Inactive (Hidden)'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">{lang === 'bn' ? 'পেমেন্ট নির্দেশিকা' : 'Instructions'}</label>
              <textarea
                rows={2}
                value={editingAccount.instructionsBn || ''}
                onChange={(e) => setEditingAccount({...editingAccount, instructionsBn: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}

        {/* LIST OF EXISTING PAYMENT ACCOUNTS */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1">
          {paymentAccounts.map((acc) => (
            <div
              key={acc.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  {acc.type === 'bank' ? <Building2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">
                      {lang === 'bn' ? acc.titleBn : acc.titleEn}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ${
                      acc.isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {acc.isActive ? (lang === 'bn' ? 'সক্রিয়' : 'Active') : (lang === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive')}
                    </span>
                  </div>
                  <p className="font-mono text-emerald-400 font-bold text-sm mt-0.5">
                    {acc.accountNumber}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {acc.accountTypeBn || acc.accountTypeEn}
                    {acc.bankNameBn ? ` • ${acc.bankNameBn}` : ''}
                    {acc.branchBn ? ` • ${acc.branchBn}` : ''}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-1.5 self-end sm:self-center">
                <button
                  onClick={() => {
                    setEditingAccount(acc);
                    setShowAddForm(false);
                  }}
                  className="p-1.5 px-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center gap-1 text-xs font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(lang === 'bn' ? `"${acc.titleBn || acc.titleEn}" অ্যাকাউন্টটি মুছে ফেলতে চান?` : `Delete account "${acc.titleEn || acc.titleBn}"?`)) {
                      onDeleteAccount(acc.id);
                    }
                  }}
                  title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                  className="p-1.5 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition flex items-center gap-1 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lang === 'bn' ? 'মুছুন' : 'Delete'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            {lang === 'bn' ? 'সম্পন্ন' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  );
};
