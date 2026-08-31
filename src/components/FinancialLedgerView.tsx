import React, { useState, useMemo, useEffect } from 'react';
import { LedgerTransaction, Language, Role } from '../types';
import { COMPANY_INFO } from '../data/initialData';
import { numberToWordsBn, numberToWordsEn } from '../utils/numberToWords';
import { 
  TrendingUp, TrendingDown, Wallet, Landmark, PlusCircle, 
  Search, Filter, Calendar, FileText, Printer, Trash2, 
  Download, CheckCircle2, ArrowUpRight, ArrowDownLeft, 
  ShieldCheck, AlertCircle, X, Check, Edit3, Tag, Building2,
  Receipt, Clock, RefreshCw, Eye, Sparkles, Scale, Info
} from 'lucide-react';

interface Props {
  transactions: LedgerTransaction[];
  lang: Language;
  role: Role;
  onAddTransaction: (txn: LedgerTransaction) => void;
  onDeleteTransaction?: (id: string) => void;
  totalApprovedInstallments?: number;
}

export const FinancialLedgerView: React.FC<Props> = ({
  transactions,
  lang,
  role,
  onAddTransaction,
  onDeleteTransaction,
  totalApprovedInstallments = 0
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datePreset, setDatePreset] = useState<'all' | 'this_month' | '2026'>('all');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingVoucher, setViewingVoucher] = useState<LedgerTransaction | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewingVoucher) setViewingVoucher(null);
        if (showAddModal) setShowAddModal(false);
        if (deleteConfirmId) setDeleteConfirmId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingVoucher, showAddModal, deleteConfirmId]);

  // Form State for new entry
  const [formType, setFormType] = useState<'credit' | 'debit'>('debit');
  const [formTitle, setFormTitle] = useState('');
  const [formTitleBn, setFormTitleBn] = useState('');
  const [formCategory, setFormCategory] = useState('Office & Admin (দাপ্তরিক খরচ)');
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formMethod, setFormMethod] = useState('Islami Bank Bangladesh PLC');
  const [formAccountNo, setFormAccountNo] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const activeTransactions = useMemo(() => {
    return transactions.filter(t => !t.isDeleted);
  }, [transactions]);

  // Chronologically sorted list (oldest to newest) to calculate continuous running balance accurately
  const chronologicalTransactionsWithBalance = useMemo(() => {
    const sorted = [...activeTransactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id.localeCompare(b.id)
    );

    let runningBal = 0;
    return sorted.map((t, idx) => {
      if (t.type === 'credit') {
        runningBal += t.amount;
      } else {
        runningBal -= t.amount;
      }
      return {
        ...t,
        sl: idx + 1,
        runningBalance: runningBal
      };
    });
  }, [activeTransactions]);

  // Overall Financial Totals
  const totalCredits = useMemo(() => {
    return activeTransactions
      .filter(t => t.type === 'credit')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [activeTransactions]);

  const totalDebits = useMemo(() => {
    return activeTransactions
      .filter(t => t.type === 'debit')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [activeTransactions]);

  const netClosingBalance = totalCredits - totalDebits;

  // Filtered list for display (applying Search, Type, Category, Date range)
  const displayTransactions = useMemo(() => {
    return chronologicalTransactionsWithBalance.filter(t => {
      const matchesSearch = 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.titleBn && t.titleBn.includes(searchTerm)) ||
        t.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.method && t.method.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

      let matchesDate = true;
      if (startDate) {
        matchesDate = matchesDate && new Date(t.date) >= new Date(startDate);
      }
      if (endDate) {
        matchesDate = matchesDate && new Date(t.date) <= new Date(endDate);
      }

      return matchesSearch && matchesType && matchesCategory && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // newest first for table view
  }, [chronologicalTransactionsWithBalance, searchTerm, typeFilter, categoryFilter, startDate, endDate]);

  // Unique Categories List
  const categories = useMemo(() => {
    return Array.from(new Set(activeTransactions.map(t => t.category)));
  }, [activeTransactions]);

  // Date Preset Handler
  const handleDatePresetChange = (preset: 'all' | 'this_month' | '2026') => {
    setDatePreset(preset);
    const now = new Date();
    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'this_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      setStartDate(firstDay);
      setEndDate(lastDay);
    } else if (preset === '2026') {
      setStartDate('2026-01-01');
      setEndDate('2026-12-31');
    }
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() && !formTitleBn.trim()) return;
    const amountNum = parseFloat(formAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const voucherNumber = `VCH-NXR-${Date.now().toString().slice(-5)}`;

    const newTxn: LedgerTransaction = {
      id: `LED-${Date.now()}-${Math.floor(Math.random() * 899 + 100)}`,
      voucherNo: voucherNumber,
      type: formType,
      title: formTitle.trim() || formTitleBn.trim(),
      titleBn: formTitleBn.trim() || formTitle.trim(),
      category: formCategory,
      categoryBn: formCategory,
      amount: amountNum,
      date: formDate,
      method: formMethod,
      accountNo: formAccountNo,
      notes: formNotes,
      recordedBy: role === 'admin' ? 'Super Admin' : 'Management Office',
      createdAt: new Date().toISOString()
    };

    onAddTransaction(newTxn);

    // Reset form
    setFormTitle('');
    setFormTitleBn('');
    setFormAmount('');
    setFormNotes('');
    setFormAccountNo('2050-1234-5678-9000');
    setShowAddModal(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'SL',
      'Date',
      'Voucher No',
      'Type',
      'Title / Description',
      'Category',
      'Amount (BDT)',
      'Method / Channel',
      'Account / Slip',
      'Running Balance (BDT)',
      'Recorded By',
      'Notes'
    ];

    const rows = displayTransactions.map(t => [
      t.sl,
      t.date,
      t.voucherNo,
      t.type.toUpperCase(),
      `"${(t.titleBn || t.title).replace(/"/g, '""')}"`,
      `"${t.category.replace(/"/g, '""')}"`,
      t.type === 'credit' ? `+${t.amount}` : `-${t.amount}`,
      `"${t.method.replace(/"/g, '""')}"`,
      `"${(t.accountNo || '').replace(/"/g, '""')}"`,
      t.runningBalance,
      `"${t.recordedBy.replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nexora_Corporate_Bank_Statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* 1. CORPORATE BANK STATEMENT HEADER & BRANDING */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Backing */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <Landmark className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'অফিসিয়াল ব্যাংক স্টেটমেন্ট ও নিরীক্ষা লেজার' : 'Official Treasury & Audit Bank Statement'}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-emerald-400" />
                <span>{lang === 'bn' ? 'নেক্সোরা করপোরেট ট্রেজারি' : 'Nexora Corporate Treasury'}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-semibold border border-amber-500/20">
                100% Shariah Verified
              </span>
              {role !== 'admin' && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 text-[11px] font-semibold border border-blue-500/20 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-blue-400" />
                  <span>{lang === 'bn' ? 'সদস্য উন্মুক্ত দর্শন (রিড-অনলি)' : 'Shareholder Transparency (Read-Only)'}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {lang === 'bn' 
                ? 'করপোরেট আর্থিক লেজার (আয়-ব্যয়, জমা ও ভাউচার বিবরণী)' 
                : 'Corporate Financial Ledger & Bank Statement'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {lang === 'bn' 
                ? 'নেক্সোরা লিমিটেডের যাবতীয় মূলধন জমা, কিস্তি সংগ্রহ, বাণিজ্যিক প্রকল্প খরচ ও দাপ্তরিক ব্যয়ের রিয়েল-টাইম ডেবিট-ক্রেডিট হিসাব এবং অবশিষ্ট মূলধন স্থিতি।' 
                : 'Complete double-entry corporate statement of capital inflows, shareholder subscriptions, operational expenses, project disbursements, and dynamic treasury reserves.'}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {role === 'admin' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-xl shadow-emerald-500/20 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{lang === 'bn' ? '+ নতুন আয় / ব্যয় এন্ট্রি' : '+ Record Entry'}</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition"
              title="Print Bank Statement"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? 'স্টেটমেন্ট প্রিন্ট' : 'Print Statement'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition"
              title="Export CSV"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>{lang === 'bn' ? 'CSV এক্সপোর্ট' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {/* Corporate Transparency Status Micro-Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-300">
              {lang === 'bn' ? 'অডিট স্ট্যাটাস: রিয়েল-টাইম ব্যালেন্স ও ভাউচার সমন্বয় সম্পন্ন' : 'Audit Status: Real-time dynamic treasury balance synchronized'}
            </span>
          </div>
          <div>
            <span className="text-slate-400">{lang === 'bn' ? 'স্টেটমেন্ট তৈরির সময়: ' : 'Statement Generated: '}</span>
            <span className="font-mono text-slate-300 font-semibold">{new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* 2. STATISTICAL SUMMARY TILES (BANK STATEMENT METRIC STRIP) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Net Treasury Reserve (Closing Balance) */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {lang === 'bn' ? 'যাচাইকৃত মোট মূলধন (অবশিষ্ট স্থিতি)' : 'Closing Balance (Verified Capital)'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl sm:text-3xl font-black font-mono ${netClosingBalance >= 0 ? 'text-white' : 'text-rose-400'}`}>
            ৳ {netClosingBalance.toLocaleString()}
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{lang === 'bn' ? 'নীট ট্রেজারি ব্যালেন্স' : 'Net Treasury Reserve'}</span>
            <span className="text-emerald-400 font-semibold font-mono">
              {netClosingBalance >= 0 ? '+ Active Reserve' : 'Deficit'}
            </span>
          </div>
        </div>

        {/* Total Credits (Inflows / Capital Collections) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'bn' ? 'মোট জমা ও রাজস্ব (+ ক্রেডিট)' : 'Total Inflow / Credits (+)'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            ৳ {totalCredits.toLocaleString()}
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{lang === 'bn' ? 'মূলধন ও কিস্তি' : 'Capital & Subscriptions'}</span>
            <span className="text-emerald-400 font-mono font-bold">{activeTransactions.filter(t => t.type === 'credit').length} {lang === 'bn' ? 'টি জমা' : 'Inflows'}</span>
          </div>
        </div>

        {/* Total Debits (Expenses / Investments) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'bn' ? 'মোট প্রাতিষ্ঠানিক ব্যয় (- ডেবিট)' : 'Total Outflow / Debits (-)'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
            ৳ {totalDebits.toLocaleString()}
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{lang === 'bn' ? 'প্রকল্প, নিবন্ধন ও পরিচালনা' : 'Projects & Operations'}</span>
            <span className="text-rose-400 font-mono font-bold">{activeTransactions.filter(t => t.type === 'debit').length} {lang === 'bn' ? 'টি খরচ' : 'Debits'}</span>
          </div>
        </div>

        {/* Vouchers Count */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'bn' ? 'মোট ভাউচার সংখ্যা' : 'Audited Vouchers'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">
            {activeTransactions.length}
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{lang === 'bn' ? 'নিরীক্ষিত রেকর্ড' : 'Audited Records'}</span>
            <span className="text-blue-400 font-medium">{lang === 'bn' ? '১০০% সংরক্ষিত' : 'Synced'}</span>
          </div>
        </div>

      </div>

      {/* 3. CLEAN & MINIMAL SEARCH AND FILTER BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-lg">
        
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'bn' ? 'ভাউচার নং, বিবরণ, খাত বা ব্যাংক দিয়ে খুঁজুন...' : 'Search by voucher, description, category, or channel...'}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter Toggle */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'bn' ? 'সকল' : 'All'} ({activeTransactions.length})
            </button>
            <button
              onClick={() => setTypeFilter('credit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                typeFilter === 'credit'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'জমা (+)' : 'Credit (+)'}</span>
            </button>
            <button
              onClick={() => setTypeFilter('debit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                typeFilter === 'debit'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ব্যয় (-)' : 'Debit (-)'}</span>
            </button>
          </div>

        </div>

        {/* Category & Date Range Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-800/80 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">{lang === 'bn' ? 'খাত:' : 'Category:'}</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">{lang === 'bn' ? 'সকল খাত (All)' : 'All Categories'}</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Date Range Inputs */}
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                title={lang === 'bn' ? 'শুরুর তারিখ' : 'Start Date'}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-slate-500">—</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                title={lang === 'bn' ? 'শেষ তারিখ' : 'End Date'}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Reset Filters if any active */}
          {(searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' || startDate || endDate) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setCategoryFilter('all');
                setStartDate('');
                setEndDate('');
              }}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-[11px] transition border border-slate-700"
            >
              <RefreshCw className="w-3 h-3 text-amber-400" />
              <span>{lang === 'bn' ? 'ফিল্টার রিসেট' : 'Clear Filters'}</span>
            </button>
          )}

        </div>

      </div>

      {/* 4. PROFESSIONAL BANK-STATEMENT TRANSACTION LEDGER TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90">
          <div>
            <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>{lang === 'bn' ? 'লেনদেন বিবরণী ও ব্যালেন্স হিস্ট্রি' : 'Bank Statement Particulars & Running Ledger'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'bn' 
                ? `প্রদর্শিত হচ্ছে ${displayTransactions.length} টি লেনদেন রেকর্ড (জের ক্রমানুসারে সমন্বিত)` 
                : `Displaying ${displayTransactions.length} transaction entries with dynamic running balances`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>{lang === 'bn' ? 'ক্রেডিট (জমা)' : 'Credit (In)'}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>{lang === 'bn' ? 'ডেবিট (ব্যয়)' : 'Debit (Out)'}</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="py-4 px-4 sm:px-5">{lang === 'bn' ? 'তারিখ' : 'Date'}</th>
                <th className="py-4 px-4 sm:px-5">{lang === 'bn' ? 'ভাউচার নং' : 'Voucher No'}</th>
                <th className="py-4 px-4 sm:px-5">{lang === 'bn' ? 'লেনদেনের বিবরণ ও খাত' : 'Description & Category'}</th>
                <th className="py-4 px-4 sm:px-5">{lang === 'bn' ? 'মাধ্যম / অ্যাকাউন্ট' : 'Channel / Account'}</th>
                <th className="py-4 px-4 sm:px-5 text-right font-mono">{lang === 'bn' ? 'জমা (+ ক্রেডিট)' : 'Credit / In (+)'}</th>
                <th className="py-4 px-4 sm:px-5 text-right font-mono">{lang === 'bn' ? 'খরচ (- ডেবিট)' : 'Debit / Out (-)'}</th>
                <th className="py-4 px-4 sm:px-5 text-right font-mono font-bold text-slate-200">{lang === 'bn' ? 'অবশিষ্ট জের' : 'Running Balance'}</th>
                <th className="py-4 px-4 sm:px-5 text-center">{lang === 'bn' ? 'ভাউচার' : 'Voucher'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {displayTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">{lang === 'bn' ? 'কোনো লেনদেন রেকর্ড পাওয়া যায়নি।' : 'No transaction records found matching your filters.'}</p>
                    <p className="text-xs text-slate-600 mt-1">{lang === 'bn' ? 'অন্য কোনো অনুসন্ধান শব্দ বা ফিল্টার ব্যবহার করে দেখুন।' : 'Try changing your search query or reset date filters.'}</p>
                  </td>
                </tr>
              ) : (
                displayTransactions.map((t) => (
                  <tr 
                    key={t.id} 
                    className="hover:bg-slate-800/50 transition duration-150 group"
                  >
                    {/* Date */}
                    <td className="py-4 px-4 sm:px-5 whitespace-nowrap font-medium text-slate-300 font-mono">
                      {t.date}
                    </td>

                    {/* Voucher No */}
                    <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                      <button
                        onClick={() => setViewingVoucher(t)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono font-semibold text-[11px] hover:border-emerald-500/50 hover:text-emerald-400 transition"
                      >
                        <Receipt className="w-3 h-3 text-slate-400" />
                        <span>{t.voucherNo}</span>
                      </button>
                    </td>

                    {/* Particulars & Category */}
                    <td className="py-4 px-4 sm:px-5 min-w-[220px]">
                      <div className="font-semibold text-white text-xs sm:text-sm">
                        {lang === 'bn' ? (t.titleBn || t.title) : t.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-medium">
                          {t.category}
                        </span>
                        {t.notes && (
                          <span className="text-[11px] text-slate-400 truncate max-w-xs italic" title={t.notes}>
                            • {t.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Payment Method / Account */}
                    <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                      <span className="font-medium text-slate-300">{t.method}</span>
                      {t.accountNo && (
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {t.accountNo}
                        </span>
                      )}
                    </td>

                    {/* Credit Column (+) */}
                    <td className="py-4 px-4 sm:px-5 text-right whitespace-nowrap font-mono font-bold text-sm">
                      {t.type === 'credit' ? (
                        <span className="text-emerald-400">
                          + ৳ {t.amount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-700 font-normal">-</span>
                      )}
                    </td>

                    {/* Debit Column (-) */}
                    <td className="py-4 px-4 sm:px-5 text-right whitespace-nowrap font-mono font-bold text-sm">
                      {t.type === 'debit' ? (
                        <span className="text-rose-400">
                          - ৳ {t.amount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-700 font-normal">-</span>
                      )}
                    </td>

                    {/* Running Balance */}
                    <td className="py-4 px-4 sm:px-5 text-right whitespace-nowrap font-mono font-bold text-sm">
                      <span className={`${t.runningBalance >= 0 ? 'text-white' : 'text-rose-400'}`}>
                        ৳ {t.runningBalance.toLocaleString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => setViewingVoucher(t)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 transition"
                          title={lang === 'bn' ? 'ভাউচার দেখুন ও প্রিন্ট করুন' : 'View / Print Voucher'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {role === 'admin' && onDeleteTransaction && (
                          <button
                            onClick={() => setDeleteConfirmId(t.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                            title={lang === 'bn' ? 'ভাউচার মুছে ফেলুন' : 'Delete Entry'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

            {/* Table Footer with Statement Summary */}
            {displayTransactions.length > 0 && (
              <tfoot className="bg-slate-950/90 border-t-2 border-slate-800 text-slate-300 font-bold">
                <tr>
                  <td colSpan={4} className="py-4 px-4 sm:px-5 text-right uppercase tracking-wider text-xs font-semibold text-slate-400">
                    {lang === 'bn' ? 'ফিল্টারকৃত মোট যোগফল (Total Summary):' : 'Period Total Summary:'}
                  </td>
                  <td className="py-4 px-4 sm:px-5 text-right font-mono text-emerald-400 text-sm">
                    + ৳ {displayTransactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 sm:px-5 text-right font-mono text-rose-400 text-sm">
                    - ৳ {displayTransactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 sm:px-5 text-right font-mono text-white text-sm font-black">
                    ৳ {netClosingBalance.toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

      </div>

      {/* 5. VOUCHER VIEW & PRINT MODAL */}
      {viewingVoucher && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingVoucher(null);
          }}
          className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-4 pt-36 sm:pt-40 md:pt-44 pb-12 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-2 text-slate-100 flex flex-col">
            
            {/* Modal Top Bar */}
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 print:hidden">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-xs sm:text-sm font-bold text-white block truncate">
                    {lang === 'bn' ? 'অফিসিয়াল করপোরেট ভাউচার ও নিরীক্ষা রসিদ' : 'Official Corporate Voucher Receipt'}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {viewingVoucher.voucherNo}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 shrink-0">
                {/* Print / Download Report Button */}
                <button
                  onClick={() => window.print()}
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20 active:scale-95"
                  title={lang === 'bn' ? 'ভাউচার প্রিন্ট বা PDF হিসেবে সংরক্ষণ করুন' : 'Print or Save Voucher as PDF'}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'প্রিন্ট বা রিপোর্ট সংরক্ষণ' : 'Print / Save PDF'}</span>
                </button>

                {/* Prominent Close (X) Cross Button */}
                <button
                  onClick={() => setViewingVoucher(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition active:scale-95"
                  aria-label="Close Voucher"
                  title={lang === 'bn' ? 'ভাউচার বন্ধ করুন (Esc)' : 'Close Voucher (Esc)'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Voucher Body */}
            <div className="p-6 sm:p-8 space-y-6 bg-slate-900 text-slate-200 printable-voucher">
              
              {/* Voucher Header */}
              <div className="text-center space-y-2 pb-5 border-b border-slate-800">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>RJSC Reg: {COMPANY_INFO.regNo} • TIN: {COMPANY_INFO.tin}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  NEXORA LIMITED
                </h2>
                <p className="text-xs text-slate-400">
                  {lang === 'bn' ? COMPANY_INFO.headOfficeBn : COMPANY_INFO.headOfficeEn}
                </p>
                <div className="pt-2">
                  <span className={`voucher-badge inline-block px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest ${
                    viewingVoucher.type === 'credit'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-rose-500 text-white'
                  }`}>
                    {viewingVoucher.type === 'credit' 
                      ? (lang === 'bn' ? 'ক্রেডিট ভাউচার (জমা / আয়)' : 'CREDIT VOUCHER (INFLOW / RECEIPT)')
                      : (lang === 'bn' ? 'ডেবিট ভাউচার (ব্যয় / খরচ)' : 'DEBIT VOUCHER (OUTFLOW / PAYMENT)')}
                  </span>
                </div>
              </div>

              {/* Voucher Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">{lang === 'bn' ? 'ভাউচার নম্বর' : 'Voucher No'}</span>
                  <span className="font-mono font-bold text-white text-sm">{viewingVoucher.voucherNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">{lang === 'bn' ? 'তারিখ' : 'Date'}</span>
                  <span className="font-mono text-slate-200">{viewingVoucher.date}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">{lang === 'bn' ? 'হিসাবের খাত' : 'Head of Account'}</span>
                  <span className="font-medium text-emerald-400">{viewingVoucher.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">{lang === 'bn' ? 'পরিশোধ মাধ্যম' : 'Payment Method'}</span>
                  <span className="font-medium text-slate-200">{viewingVoucher.method}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">{lang === 'bn' ? 'অ্যাকাউন্ট / স্লিপ' : 'Account / Slip Ref'}</span>
                  <span className="font-mono text-slate-300">{viewingVoucher.accountNo || 'Central Desk'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">{lang === 'bn' ? 'এন্ট্রি করেছেন' : 'Recorded By'}</span>
                  <span className="font-medium text-slate-300">{viewingVoucher.recordedBy}</span>
                </div>
              </div>

              {/* Description & Particulars */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'bn' ? 'লেনদেনের বিস্তারিত বিবরণ (Particulars):' : 'Transaction Particulars:'}</span>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white">
                  {lang === 'bn' ? (viewingVoucher.titleBn || viewingVoucher.title) : viewingVoucher.title}
                  {viewingVoucher.notes && (
                    <p className="text-xs text-slate-400 mt-2 font-normal leading-relaxed border-t border-slate-800/80 pt-2">
                      <span className="text-slate-500 font-semibold">{lang === 'bn' ? 'মন্তব্য: ' : 'Remarks: '}</span>
                      {viewingVoucher.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Amount Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase">{lang === 'bn' ? 'টাকার পরিমাণ (কথায়):' : 'Amount in Words:'}</span>
                  <p className="text-xs font-medium text-emerald-300 italic mt-0.5">
                    {lang === 'bn' ? numberToWordsBn(viewingVoucher.amount) : numberToWordsEn(viewingVoucher.amount)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-semibold uppercase block">{lang === 'bn' ? 'মোট অংক' : 'Total Amount'}</span>
                  <span className="text-2xl font-black text-white font-mono">
                    ৳ {viewingVoucher.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Signatures Section */}
              <div className="pt-10 grid grid-cols-3 gap-4 text-center text-xs text-slate-400 border-t border-slate-800">
                <div>
                  <div className="border-t border-dashed border-slate-700 pt-2 font-semibold text-slate-300">
                    {lang === 'bn' ? 'গ্রহীতা / প্রস্তুতকারী' : 'Prepared By'}
                  </div>
                  <span className="text-[10px] text-slate-500">{lang === 'bn' ? 'অ্যাকাউন্টস শাখা' : 'Accounts Section'}</span>
                </div>
                <div>
                  <div className="border-t border-dashed border-slate-700 pt-2 font-semibold text-slate-300">
                    {lang === 'bn' ? 'নিরীক্ষা ও শরিয়াহ কর্মকর্তা' : 'Verified & Audited By'}
                  </div>
                  <span className="text-[10px] text-slate-500">{lang === 'bn' ? 'অডিট সুপারভাইজার' : 'Shariah Audit'}</span>
                </div>
                <div>
                  <div className="border-t border-dashed border-slate-700 pt-2 font-semibold text-slate-300">
                    {lang === 'bn' ? 'ব্যবস্থাপনা পরিচালক' : 'Managing Director'}
                  </div>
                  <span className="text-[10px] text-slate-500">{lang === 'bn' ? 'অনুমোদনকারী কর্তৃপক্ষ' : 'Authorized Signatory'}</span>
                </div>
              </div>

            </div>

            {/* Modal Bottom Action Footer */}
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === 'bn' ? 'নেক্সোরা অডিট অনুমোদিত ডিজিটাল ভাউচার' : 'Nexora Audited Official Digital Voucher'}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setViewingVoucher(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <X className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'বন্ধ করুন' : 'Close'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'প্রিন্ট বা PDF সংরক্ষণ' : 'Print / Save PDF'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. ADD NEW TRANSACTION MODAL */}
      {showAddModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
          className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-4 pt-36 sm:pt-40 md:pt-44 pb-12 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl my-2">
            
            <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    {lang === 'bn' ? 'নতুন আয় / ব্যয় লেনদেন রেকর্ড করুন' : 'Record New Income / Expense Transaction'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'সরাসরি করপোরেট লেজারে ভাউচার এন্ট্রি ও মূলধন আপডেট' : 'Direct corporate voucher entry syncing capital reserves'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              
              {/* Type Switcher */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  {lang === 'bn' ? 'লেনদেনের ধরন নির্বাচন করুন *' : 'Transaction Type *'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormType('credit');
                      setFormCategory('Share Capital (মূলধন জমা)');
                    }}
                    className={`py-3 px-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition ${
                      formType === 'credit'
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'ক্রেডিট (+ জমা / আয়)' : 'Credit (+ Inflow)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormType('debit');
                      setFormCategory('Office & Admin (দাপ্তরিক খরচ)');
                    }}
                    className={`py-3 px-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition ${
                      formType === 'debit'
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 ring-2 ring-rose-400'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'ডেবিট (- ব্যয় / খরচ)' : 'Debit (- Expense)'}</span>
                  </button>
                </div>
              </div>

              {/* Title Bangla & English */}
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'bn' ? 'লেনদেনের বিবরণ (বাংলায়) *' : 'Transaction Title (Bengali) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitleBn}
                    onChange={(e) => setFormTitleBn(e.target.value)}
                    placeholder={lang === 'bn' ? 'যেমন: অফিস ভাড়া, আইনি ফি, প্রকল্প সমীক্ষা বা মূলধন জমা' : 'e.g. Office Rent, Legal fees, Feasibility study'}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'bn' ? 'বিবরণ (ইংরেজিতে - ঐচ্ছিক)' : 'Title in English (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Office Stationery, Incorporation Fees"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Category & Amount Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'bn' ? 'হিসাবের খাত (Category) *' : 'Account Category *'}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {formType === 'credit' ? (
                      <>
                        <option value="Share Capital (মূলধন জমা)">Share Capital (মূলধন জমা)</option>
                        <option value="Monthly Installments (মাসিক কিস্তি)">Monthly Installments (মাসিক কিস্তি)</option>
                        <option value="Halal Business Revenue (ব্যবসায়িক আয়)">Halal Business Revenue (ব্যবসায়িক আয়)</option>
                        <option value="Project Returns / Dividends (প্রকল্প লভ্যাংশ)">Project Returns / Dividends (প্রকল্প লভ্যাংশ)</option>
                        <option value="Other Incomes (অন্যান্য আয়)">Other Incomes (অন্যান্য আয়)</option>
                      </>
                    ) : (
                      <>
                        <option value="Office & Admin (দাপ্তরিক খরচ)">Office & Admin (দাপ্তরিক খরচ)</option>
                        <option value="Legal & Compliance (আইনি ও নিবন্ধন)">Legal & Compliance (আইনি ও নিবন্ধন)</option>
                        <option value="Project Investment (প্রকল্প বিনিয়োগ ও সমীক্ষা)">Project Investment (প্রকল্প বিনিয়োগ ও সমীক্ষা)</option>
                        <option value="IT & Infrastructure (আইটি ও সফটওয়্যার)">IT & Infrastructure (আইটি ও সফটওয়্যার)</option>
                        <option value="Stationery & Printing (মুদ্রণ ও স্ট্যাম্প)">Stationery & Printing (মুদ্রণ ও স্ট্যাম্প)</option>
                        <option value="Meeting & AGM (সভা ও আতিথেয়তা)">Meeting & AGM (সভা ও আতিথেয়তা)</option>
                        <option value="Travel & Logistics (যাতায়াত ও পরিদর্শন)">Travel & Logistics (যাতায়াত ও পরিদর্শন)</option>
                        <option value="Miscellaneous (বিবিধ খরচ)">Miscellaneous (বিবিধ খরচ)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'bn' ? 'টাকার পরিমাণ (BDT ৳) *' : 'Amount (BDT ৳) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="যেমন: 10000"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 font-bold placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              {/* Date & Method Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'bn' ? 'তারিখ *' : 'Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'bn' ? 'পরিশোধের মাধ্যম / ব্যাংক *' : 'Payment Method *'}
                  </label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Islami Bank Bangladesh PLC">Islami Bank Bangladesh PLC</option>
                    <option value="bKash Merchant">bKash Merchant</option>
                    <option value="Nagad Merchant">Nagad Merchant</option>
                    <option value="DBBL Rocket">DBBL Rocket</option>
                    <option value="Cash at Head Office">Cash at Head Office (অফিস ক্যাশ)</option>
                    <option value="Bank Transfer (E-Payment)">Bank Transfer (E-Payment)</option>
                  </select>
                </div>
              </div>

              {/* Account / Slip No & Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'bn' ? 'অ্যাকাউন্ট নং / স্লিপ রেফারেন্স' : 'Account / Slip Reference'}
                  </label>
                  <input
                    type="text"
                    value={formAccountNo}
                    onChange={(e) => setFormAccountNo(e.target.value)}
                    placeholder="e.g. 2050-1234-5678-9000"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'bn' ? 'অতিরিক্ত মন্তব্য / নোট' : 'Remarks / Notes'}
                  </label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder={lang === 'bn' ? 'অনুমোদন সূত্র বা প্রাসঙ্গিক তথ্য' : 'Approval reference or note'}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Dynamic Capital Impact Indicator */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">{lang === 'bn' ? 'মূলধনে প্রভাব:' : 'Capital Impact:'}</span>
                <span className={`font-bold font-mono ${formType === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formType === 'credit' 
                    ? `+ ৳ ${Number(formAmount || 0).toLocaleString()} (মূলধনে যোগ হবে)`
                    : `- ৳ ${Number(formAmount || 0).toLocaleString()} (মূলধন থেকে কর্তন হবে)`}
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  {lang === 'bn' ? 'ভাউচার সংরক্ষণ করুন' : 'Save Voucher'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 7. DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteConfirmId(null);
          }}
          className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-4 pt-36 sm:pt-40 md:pt-44 pb-12 overflow-y-auto animate-in fade-in duration-150"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl text-center space-y-4 my-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {lang === 'bn' ? 'ভাউচার রেকর্ডটি মুছে ফেলতে চান?' : 'Confirm Delete Voucher Record?'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'bn' 
                  ? 'এই ভাউচারটি মুছে ফেললে মোট মূলধনের হিসাব স্বয়ংক্রিয়ভাবে পুনঃসমন্বয় হবে।' 
                  : 'Deleting this voucher will automatically recalculate the net verified capital balance.'}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (onDeleteTransaction && deleteConfirmId) {
                    onDeleteTransaction(deleteConfirmId);
                  }
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-500/20"
              >
                {lang === 'bn' ? 'হ্যাঁ, মুছে ফেলুন' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
