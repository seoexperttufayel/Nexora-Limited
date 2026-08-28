import React, { useState } from 'react';
import { Member, Language, Role } from '../types';
import { 
  Search, UserCheck, Shield, Phone, Mail, CheckCircle2, 
  ChevronRight, Globe, MapPin, Building, Edit3, Trash2, 
  UserPlus, RotateCcw, ShieldAlert, AlertTriangle, Check, X,
  Users
} from 'lucide-react';

interface Props {
  members: Member[];
  lang: Language;
  role?: Role;
  onUpdateMember?: (updatedMember: Member) => void;
  onDeleteMember?: (memberId: string) => void;
  onRestoreMember?: (memberId: string) => void;
  onPermanentDeleteMember?: (memberId: string) => void;
  onAddMember?: (newMember: Member) => void;
  onRestoreDefaultMembers?: () => void;
}

export const GovernanceView: React.FC<Props> = ({ 
  members, 
  lang, 
  role,
  onUpdateMember,
  onDeleteMember,
  onRestoreMember,
  onPermanentDeleteMember,
  onAddMember,
  onRestoreDefaultMembers
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<'all' | 'management' | 'advisor'>('all');
  const [viewTrashed, setViewTrashed] = useState(false);

  // Admin Modal States
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [memberToPurge, setMemberToPurge] = useState<Member | null>(null);

  // Helper for strictly sequential sorting by Member ID: NXR-001 -> NXR-002 -> ... -> NXR-013
  const sortMembersById = (a: Member, b: Member) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  };

  // New Member Form State
  const [newMemberForm, setNewMemberForm] = useState<Partial<Member>>({
    id: `NXR-${String(members.length + 1).padStart(3, '0')}`,
    name: '',
    nameBn: '',
    designationEn: 'Shareholder',
    designationBn: 'শেয়ারহোল্ডার',
    committeeGroup: 'advisor',
    locationEn: 'Sylhet, Bangladesh',
    locationBn: 'সিলেট, বাংলাদেশ',
    share: 3,
    phone: '01700-000000',
    email: 'member@nexora.com.bd'
  });

  const activeMembers = [...members.filter(m => !m.isDeleted)].sort(sortMembersById);
  const trashedMembers = [...members.filter(m => m.isDeleted)].sort(sortMembersById);

  const displayList = viewTrashed ? trashedMembers : activeMembers;

  const filteredMembers = displayList.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nameBn.includes(searchTerm) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.designationEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.designationBn.includes(searchTerm) ||
      (m.locationBn && m.locationBn.includes(searchTerm)) ||
      (m.locationEn && m.locationEn.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterGroup === 'management') {
      return m.committeeGroup === 'management' || ['NXR-004', 'NXR-006', 'NXR-007', 'NXR-008', 'NXR-010', 'NXR-011', 'NXR-012', 'NXR-013'].includes(m.id);
    }
    if (filterGroup === 'advisor') {
      return m.committeeGroup === 'advisor' || ['NXR-001', 'NXR-002', 'NXR-003', 'NXR-005', 'NXR-009'].includes(m.id);
    }
    return true;
  }).sort(sortMembersById);

  const managementList = filteredMembers.filter(m => (m.committeeGroup === 'management' || ['NXR-004', 'NXR-006', 'NXR-007', 'NXR-008', 'NXR-010', 'NXR-011', 'NXR-012', 'NXR-013'].includes(m.id))).sort(sortMembersById);
  const advisorList = filteredMembers.filter(m => (m.committeeGroup === 'advisor' || ['NXR-001', 'NXR-002', 'NXR-003', 'NXR-005', 'NXR-009'].includes(m.id))).sort(sortMembersById);

  const totalActiveShares = activeMembers.reduce((acc, curr) => acc + curr.share, 0);

  // Save Member Edit Handler
  const handleSaveMemberEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !onUpdateMember) return;
    onUpdateMember(editingMember);
    setEditingMember(null);
  };

  // Create Member Handler
  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddMember || !newMemberForm.name || !newMemberForm.nameBn) return;
    const fullMember: Member = {
      id: newMemberForm.id || `NXR-${String(members.length + 1).padStart(3, '0')}`,
      name: newMemberForm.name || '',
      nameBn: newMemberForm.nameBn || '',
      designationEn: newMemberForm.designationEn || 'Shareholder',
      designationBn: newMemberForm.designationBn || 'শেয়ারহোল্ডার',
      committeeGroup: (newMemberForm.committeeGroup as any) || 'advisor',
      locationEn: newMemberForm.locationEn || 'Sylhet, Bangladesh',
      locationBn: newMemberForm.locationBn || 'সিলেট, বাংলাদেশ',
      share: Number(newMemberForm.share) || 3,
      phone: newMemberForm.phone || '01700-000000',
      email: newMemberForm.email || 'member@nexora.com.bd',
      addressEn: newMemberForm.locationEn || 'Sylhet, Bangladesh',
      addressBn: newMemberForm.locationBn || 'সিলেট, বাংলাদেশ',
      joinedDate: '2026-01-01'
    };
    onAddMember(fullMember);
    setShowAddMemberModal(false);
    setNewMemberForm({
      id: `NXR-${String(members.length + 2).padStart(3, '0')}`,
      name: '',
      nameBn: '',
      designationEn: 'Shareholder',
      designationBn: 'শেয়ারহোল্ডার',
      committeeGroup: 'advisor',
      locationEn: 'Sylhet, Bangladesh',
      locationBn: 'সিলেট, বাংলাদেশ',
      share: 3,
      phone: '01700-000000',
      email: 'member@nexora.com.bd'
    });
  };

  // Reusable Member Card Component
  const renderMemberCard = (member: Member) => (
    <div
      key={member.id}
      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between space-y-3 shadow-lg group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0">
        <div className="text-[11px] font-black px-2.5 py-0.5 rounded-bl-xl font-mono bg-slate-800 text-emerald-400 border-l border-b border-slate-700">
          {member.share}% SHARE
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-xs font-mono group-hover:border-emerald-500/50 transition shrink-0">
            {member.id}
          </div>
          <div className="pr-12">
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition leading-snug">
              {lang === 'bn' ? member.nameBn : member.name}
            </h3>
            <p className="text-xs text-emerald-400 font-medium mt-0.5">
              {lang === 'bn' ? member.designationBn : member.designationEn}
            </p>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{lang === 'bn' ? (member.locationBn || 'বাংলাদেশ') : (member.locationEn || 'Bangladesh')}</span>
            </span>
            <span className="font-mono font-semibold text-white">৳{(member.share * 1000).toLocaleString()}/mo</span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-0.5">
            <Phone className="w-3 h-3 text-slate-400" />
            <span className="font-mono">{member.phone}</span>
          </div>

          <div className="pt-1">
            <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${
              member.committeeGroup === 'management' || ['NXR-004', 'NXR-006', 'NXR-007', 'NXR-008', 'NXR-010', 'NXR-011', 'NXR-012', 'NXR-013'].includes(member.id)
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>
              {member.committeeGroup === 'management' || ['NXR-004', 'NXR-006', 'NXR-007', 'NXR-008', 'NXR-010', 'NXR-011', 'NXR-012', 'NXR-013'].includes(member.id)
                ? (lang === 'bn' ? 'ব্যবস্থাপনা কমিটি (সিলেট)' : 'Management (Domestic)')
                : (lang === 'bn' ? 'উপদেষ্টা পরিষদ (প্রবাস)' : 'Advisory (Overseas)')}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 pt-2">
        {role === 'admin' && !viewTrashed && (
          <div className="flex items-center gap-1.5">
            {onUpdateMember && (
              <button
                onClick={() => setEditingMember(member)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>{lang === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
              </button>
            )}
            {onDeleteMember && (
              <button
                onClick={() => setMemberToDelete(member)}
                className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition"
                title="Move to Trash"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {role === 'admin' && viewTrashed && (
          <div className="flex items-center gap-1.5">
            {onRestoreMember && (
              <button
                onClick={() => onRestoreMember(member.id)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'bn' ? 'পুনরুদ্ধার' : 'Restore'}</span>
              </button>
            )}
            {onPermanentDeleteMember && (
              <button
                onClick={() => setMemberToPurge(member)}
                className="p-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition"
                title="Permanent Purge"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-3">
            <UserCheck className="w-4 h-4" />
            <span>{lang === 'bn' ? 'পরিচালনা পরিষদ ও শেয়ারহোল্ডার তালিকা' : 'Governance & Founder Shareholders'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'bn' ? '১৩ জন প্রতিষ্ঠাতা অংশীদার ও পরিচালনা পরিষদ' : '13 Founder Members & Governance Council'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn' 
              ? 'নেক্সোরা লিমিটেডের ব্যবস্থাপনা কমিটি (সিলেট, বাংলাদেশ) ও উপদেষ্টা পরিষদ (প্রবাস) — ক্রমিক NXR-001 থেকে NXR-013' 
              : 'Management Committee (Sylhet, BD) and Advisory Council (Overseas) — Sequential NXR-001 to NXR-013'}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              {lang === 'bn' ? 'মোট ইকুইটি অংশীদারিত্ব' : 'Total Equity Share'}
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{totalActiveShares}%</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              {lang === 'bn' ? 'মোট প্রতিষ্ঠাতা সদস্য' : 'Active Founders'}
            </span>
            <span className="text-2xl font-black text-white font-mono">{activeMembers.length}</span>
          </div>
        </div>
      </div>

      {/* ADMIN GOVERNANCE & SHAREHOLDER MANAGEMENT TOOLBAR */}
      {role === 'admin' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-2.5">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                {lang === 'bn' ? 'অ্যাডমিন শেয়ারহোল্ডার ব্যবস্থাপনা প্যানেল' : 'Admin Shareholder Management Controls'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' 
                  ? 'সদস্যদের প্রোফাইল সম্পাদনা, শেয়ার পরিবর্তন বা নতুন অংশীদার যুক্ত করুন' 
                  : 'Edit profiles, adjust equity allocations, and manage shareholder directory'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onAddMember && (
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'নতুন সদস্য যুক্ত করুন' : 'Add Shareholder'}</span>
              </button>
            )}

            {onRestoreDefaultMembers && (
              <button
                onClick={() => {
                  if (window.confirm(lang === 'bn' ? '১৩ জন প্রতিষ্ঠাতা সদস্যের অফিসিয়াল তালিকা রিস্টোর করতে চান?' : 'Reset to the official 13 founder members?')) {
                    onRestoreDefaultMembers();
                  }
                }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700"
                title="Restore default 13 founder members"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'ডিফল্ট ১৩ সদস্য রিস্টোর' : 'Restore 13 Founders'}</span>
              </button>
            )}

            {trashedMembers.length > 0 && (
              <button
                onClick={() => setViewTrashed(!viewTrashed)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                  viewTrashed 
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{viewTrashed ? (lang === 'bn' ? 'সক্রিয় সদস্যবৃন্দ দেখুন' : 'View Active') : `${lang === 'bn' ? 'ট্র্যাশ বিন' : 'Trash Bin'} (${trashedMembers.length})`}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'bn' ? 'নাম, আইডি, পদবী বা অবস্থান দিয়ে খুঁজুন (যেমন: NXR-001)...' : 'Search by name, ID, designation, or location (e.g. NXR-001)...'}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilterGroup('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              filterGroup === 'all'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {lang === 'bn' ? `সকল (NXR-001 হতে NXR-013) [${displayList.length}]` : `All (NXR-001 to NXR-013) [${displayList.length}]`}
          </button>
          <button
            onClick={() => setFilterGroup('management')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              filterGroup === 'management'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {lang === 'bn' ? 'ব্যবস্থাপনা কমিটি (দেশ)' : 'Management (Domestic)'}
          </button>
          <button
            onClick={() => setFilterGroup('advisor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              filterGroup === 'advisor'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {lang === 'bn' ? 'উপদেষ্টা পরিষদ (প্রবাস)' : 'Advisory Council (Abroad)'}
          </button>
        </div>
      </div>

      {/* TRASH VIEW BANNER IF VIEWING TRASHED */}
      {viewTrashed && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>{lang === 'bn' ? 'বর্তমানে মুছে ফেলা / ট্র্যাশকৃত সদস্যদের প্রোফাইল প্রদর্শন করা হচ্ছে।' : 'Currently displaying deleted shareholder profiles in Trash.'}</span>
          </div>
          <button
            onClick={() => setViewTrashed(false)}
            className="font-bold underline hover:text-white"
          >
            {lang === 'bn' ? 'সক্রিয় তালিকায় ফিরুন' : 'Back to Active'}
          </button>
        </div>
      )}

      {/* VIEW: ALL MEMBERS (SEQUENTIALLY SORTED NXR-001 TO NXR-013) */}
      {filterGroup === 'all' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {lang === 'bn' ? 'সকল প্রতিষ্ঠাতা সদস্য ও অংশীদার তালিকা (NXR-001 থেকে NXR-013 ক্রমিক)' : 'All Founder Shareholders & Members (Sequential NXR-001 to NXR-013)'}
                </h2>
                <p className="text-xs text-slate-400">
                  {lang === 'bn' ? 'সদস্য আইডি অনুযায়ী ক্রমানুসারে সাজানো সম্পূর্ণ ডিরেক্টরি' : 'Strictly sorted ascending by member identification code'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {filteredMembers.length} Members
            </span>
          </div>

          {filteredMembers.length === 0 ? (
            <div className="p-10 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
              <p>{lang === 'bn' ? 'কোনো সদস্য পাওয়া যায়নি।' : 'No members found matching your search.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredMembers.map((member) => renderMemberCard(member))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: MANAGEMENT COMMITTEE (দেশ - সিলেট, বাংলাদেশ) */}
      {filterGroup === 'management' && managementList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {lang === 'bn' ? 'ব্যবস্থাপনা কমিটি (দেশ - সিলেট, বাংলাদেশ)' : 'Management Committee (Domestic - Sylhet, Bangladesh)'}
                </h2>
                <p className="text-xs text-slate-400">
                  {lang === 'bn' ? 'নির্বাহী পরিচালনা ও ব্যবসায়িক কার্যক্রম' : 'Executive Operations & Business Leadership'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {managementList.length} Members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {managementList.map((member) => renderMemberCard(member))}
          </div>
        </div>
      )}

      {/* VIEW: ADVISORY COUNCIL (প্রবাসী ও বিশেষজ্ঞ পরিষদ) */}
      {filterGroup === 'advisor' && advisorList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {lang === 'bn' ? 'উপদেষ্টা পরিষদ (প্রবাসী ও কৌশলগত অংশীদার)' : 'Advisory Council (Overseas & Strategic Partners)'}
                </h2>
                <p className="text-xs text-slate-400">
                  {lang === 'bn' ? 'আন্তর্জাতিক পরামর্শ ও কৌশলগত দিকনির্দেশনা' : 'Global Strategy & Advisory Governance'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {advisorList.length} Members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advisorList.map((member) => renderMemberCard(member))}
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  {lang === 'bn' ? `সদস্য প্রোফাইল সম্পাদনা: ${editingMember.id}` : `Edit Shareholder: ${editingMember.id}`}
                </h3>
              </div>
              <button 
                onClick={() => setEditingMember(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMemberEdit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">নাম (বাংলায়)</label>
                  <input
                    type="text"
                    required
                    value={editingMember.nameBn}
                    onChange={(e) => setEditingMember({...editingMember, nameBn: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">Designation (English)</label>
                  <input
                    type="text"
                    required
                    value={editingMember.designationEn}
                    onChange={(e) => setEditingMember({...editingMember, designationEn: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">পদবী (বাংলায়)</label>
                  <input
                    type="text"
                    required
                    value={editingMember.designationBn}
                    onChange={(e) => setEditingMember({...editingMember, designationBn: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">Committee Group</label>
                  <select
                    value={editingMember.committeeGroup}
                    onChange={(e) => setEditingMember({...editingMember, committeeGroup: e.target.value as any})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="management">ব্যবস্থাপনা কমিটি (সিলেট, বাংলাদেশ)</option>
                    <option value="advisor">উপদেষ্টা পরিষদ (প্রবাসী ও কৌশলগত)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">Equity Share Percentage (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={editingMember.share}
                    onChange={(e) => setEditingMember({...editingMember, share: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">Location / Address (English)</label>
                  <input
                    type="text"
                    value={editingMember.locationEn || ''}
                    onChange={(e) => setEditingMember({...editingMember, locationEn: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'তথ্য হালনাগাদ করুন' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW MEMBER MODAL */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">
                  {lang === 'bn' ? 'নতুন শেয়ারহোল্ডার / সদস্য যুক্ত করুন' : 'Add New Founder / Shareholder'}
                </h3>
              </div>
              <button 
                onClick={() => setShowAddMemberModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">Member ID</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.id}
                    onChange={(e) => setNewMemberForm({...newMemberForm, id: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-emerald-400 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">Name (English)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm({...newMemberForm, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">নাম (বাংলায়)</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ করিম"
                    value={newMemberForm.nameBn}
                    onChange={(e) => setNewMemberForm({...newMemberForm, nameBn: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">Designation (English)</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.designationEn}
                    onChange={(e) => setNewMemberForm({...newMemberForm, designationEn: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">পদবী (বাংলায়)</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.designationBn}
                    onChange={(e) => setNewMemberForm({...newMemberForm, designationBn: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">Committee Allocation</label>
                  <select
                    value={newMemberForm.committeeGroup}
                    onChange={(e) => setNewMemberForm({...newMemberForm, committeeGroup: e.target.value as any})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="management">ব্যবস্থাপনা কমিটি (সিলেট, বাংলাদেশ)</option>
                    <option value="advisor">উপদেষ্টা পরিষদ (প্রবাসী ও আন্তর্জাতিক)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">Share Percentage (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newMemberForm.share}
                    onChange={(e) => setNewMemberForm({...newMemberForm, share: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.phone}
                    onChange={(e) => setNewMemberForm({...newMemberForm, phone: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1 font-semibold">Location / Country</label>
                  <input
                    type="text"
                    value={newMemberForm.locationEn}
                    onChange={(e) => setNewMemberForm({...newMemberForm, locationEn: e.target.value, locationBn: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'সদস্য তালিকাভুক্ত করুন' : 'Confirm Registration'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOVE MEMBER TO TRASH MODAL */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setMemberToDelete(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Close"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 text-rose-400 pr-6">
              <ShieldAlert className="w-5 h-5" />
              <span>{lang === 'bn' ? 'সদস্য প্রোফাইল ট্র্যাশে পাঠান' : 'Move Shareholder to Trash'}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'bn' 
                ? `আপনি কি নিশ্চিত যে ${memberToDelete.name} (${memberToDelete.id})-কে ট্র্যাশ বক্সে সরাতে চান? প্রয়োজনে অ্যাডমিন প্যানেল থেকে যেকোনো সময় এটি পুনরুদ্ধার (Restore) করা যাবে।` 
                : `Are you sure you want to move ${memberToDelete.name} (${memberToDelete.id}) to Trash? It can be restored anytime.`}
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (onDeleteMember && memberToDelete) {
                    onDeleteMember(memberToDelete.id);
                  }
                  setMemberToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ট্র্যাশে সরান' : 'Move to Trash'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERMANENT PURGE MEMBER MODAL */}
      {memberToPurge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setMemberToPurge(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Close"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 text-rose-500 pr-6">
              <AlertTriangle className="w-5 h-5" />
              <span>{lang === 'bn' ? 'স্থায়ীভাবে মুছে ফেলার সতর্কতা' : 'Permanent Purge Member'}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'bn' 
                ? `সতর্কতা: ${memberToPurge.name} (${memberToPurge.id})-এর প্রোফাইল স্থায়ীভাবে সিস্টেম থেকে মুছে যাবে। আপনি কি নিশ্চিত?` 
                : `Warning: ${memberToPurge.name} (${memberToPurge.id}) will be permanently deleted and cannot be recovered.`}
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setMemberToPurge(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (onPermanentDeleteMember && memberToPurge) {
                    onPermanentDeleteMember(memberToPurge.id);
                  }
                  setMemberToPurge(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'স্থায়ী মুছুন' : 'Permanent Purge'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
