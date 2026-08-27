import React, { useState, useEffect } from 'react';
import { Language, Role, Member, Installment, Project } from './types';
import { FOUNDER_MEMBERS, INITIAL_INSTALLMENTS, PROJECTS, COMPANY_INFO } from './data/initialData';
import { translations } from './data/translations';

// Components
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { GovernanceView } from './components/GovernanceView';
import { ProjectsView } from './components/ProjectsView';
import { MemberDashboard } from './components/MemberDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminDepositView } from './components/AdminDepositView';
import { InstallmentsView } from './components/InstallmentsView';
import { LoginModal } from './components/LoginModal';
import { MoneyReceiptModal } from './components/MoneyReceiptModal';
import { ShareCertificateModal } from './components/ShareCertificateModal';
import { NoticeBoardModal } from './components/NoticeBoardModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';

// Icons
import { 
  ShieldCheck, Users, Wallet, Phone, Mail, MapPin, 
  Sparkles, Lock, ArrowRight, Heart 
} from 'lucide-react';

export default function App() {
  // 1. Language State
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('nxr_lang');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  // 2. Auth and Role State (Restored on Page Refresh)
  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem('nxr_role');
    return (saved === 'admin' || saved === 'member') ? saved : 'public';
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('nxr_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedTab = localStorage.getItem('nxr_active_tab');
    const savedRole = localStorage.getItem('nxr_role');
    if (savedTab) return savedTab;
    if (savedRole === 'admin') return 'admin-dashboard';
    if (savedRole === 'member') return 'member-dashboard';
    return 'home';
  });

  // 3. Members & Installments State
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('nxr_members_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 13) return parsed;
      } catch {
        // fallback
      }
    }
    return FOUNDER_MEMBERS;
  });

  const [installments, setInstallments] = useState<Installment[]>(() => {
    const saved = localStorage.getItem('nxr_installments_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_INSTALLMENTS;
  });

  const [projects] = useState<Project[]>(PROJECTS);

  // 4. Modals State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Installment | null>(null);
  const [selectedCertificateMember, setSelectedCertificateMember] = useState<Member | null>(null);

  // 5. LocalStorage Persistence Sync
  useEffect(() => {
    localStorage.setItem('nxr_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('nxr_role', role);
  }, [role]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nxr_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nxr_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nxr_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('nxr_members_v4', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('nxr_installments_v4', JSON.stringify(installments));
  }, [installments]);

  // Handle Login success
  const handleLoginSuccess = (newRole: Role, user: any) => {
    setRole(newRole);
    setCurrentUser(user);
    localStorage.setItem('nxr_role', newRole);
    localStorage.setItem('nxr_current_user', JSON.stringify(user));
    const targetTab = newRole === 'admin' ? 'admin-dashboard' : 'member-dashboard';
    setActiveTab(targetTab);
    localStorage.setItem('nxr_active_tab', targetTab);
  };

  // Handle Logout (Explicitly by user)
  const handleLogout = () => {
    setRole('public');
    setCurrentUser(null);
    setActiveTab('home');
    localStorage.removeItem('nxr_role');
    localStorage.removeItem('nxr_current_user');
    localStorage.setItem('nxr_active_tab', 'home');
  };

  // Submit Installment by Member
  const handleSubmitInstallment = (data: Partial<Installment>) => {
    const receiptSerial = `NXR-REC-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const newInst: Installment = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      receiptNo: receiptSerial,
      memberId: data.memberId || 'NXR-001',
      memberName: data.memberName || 'Member',
      memberNameBn: data.memberNameBn || data.memberName || 'Member',
      month: data.month || 'September',
      year: data.year || 2026,
      amount: data.amount || 10000,
      lateFee: 0,
      method: data.method || 'bKash Merchant',
      trxId: data.trxId || `TXN-${Math.floor(Math.random() * 89999 + 10000)}`,
      date: data.date || new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: data.notes
    };

    setInstallments(prev => [newInst, ...prev]);
  };

  // Admin Approve Installment
  const handleApproveInstallment = (id: string) => {
    setInstallments(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: 'approved',
            approvedBy: 'Super Admin',
            approvedAt: new Date().toISOString()
          };
        }
        return item;
      })
    );
  };

  // Admin Reject Installment
  const handleRejectInstallment = (id: string, reason?: string) => {
    setInstallments(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: 'rejected',
            rejectionReason: reason || 'Information mismatched or unverified.'
          };
        }
        return item;
      })
    );
  };

  // Direct Admin Installment Add
  const handleAddDirectInstallment = (data: Partial<Installment>) => {
    const receiptSerial = `NXR-DIR-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const newInst: Installment = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      receiptNo: receiptSerial,
      memberId: data.memberId || 'NXR-001',
      memberName: data.memberName || 'Member',
      memberNameBn: data.memberNameBn || data.memberName || 'Member',
      month: data.month || 'September',
      year: data.year || 2026,
      amount: data.amount || 10000,
      lateFee: 0,
      method: data.method || 'Cash at Head Office',
      trxId: data.trxId || `DIR-${Math.floor(Math.random() * 89999 + 10000)}`,
      date: data.date || new Date().toISOString().split('T')[0],
      status: 'approved',
      approvedBy: 'Super Admin',
      approvedAt: new Date().toISOString(),
      notes: data.notes
    };

    setInstallments(prev => [newInst, ...prev]);
  };

  // Trash & Installment Management Handlers
  const handleDeleteInstallment = (id: string) => {
    setInstallments(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            isDeleted: true,
            deletedAt: new Date().toISOString(),
            deletedBy: 'Super Admin'
          };
        }
        return item;
      })
    );
  };

  const handleRestoreInstallment = (id: string) => {
    setInstallments(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            isDeleted: false,
            deletedAt: undefined,
            deletedBy: undefined
          };
        }
        return item;
      })
    );
  };

  const handlePermanentDeleteInstallment = (id: string) => {
    setInstallments(prev => prev.filter(item => item.id !== id));
  };

  // Member Management Handlers
  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(prev =>
      prev.map(m => (m.id === updatedMember.id ? updatedMember : m))
    );
    // If current logged in user is this member, update current user state too
    if (currentUser && currentUser.id === updatedMember.id) {
      setCurrentUser(updatedMember);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            isDeleted: true,
            deletedAt: new Date().toISOString(),
            deletedBy: 'Super Admin'
          };
        }
        return m;
      })
    );
  };

  const handleRestoreMember = (memberId: string) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            isDeleted: false,
            deletedAt: undefined,
            deletedBy: undefined
          };
        }
        return m;
      })
    );
  };

  const handlePermanentDeleteMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const handleAddMember = (newMember: Member) => {
    setMembers(prev => [...prev, newMember]);
  };

  const handleRestoreDefaultMembers = () => {
    setMembers(FOUNDER_MEMBERS);
    localStorage.setItem('nxr_members_v4', JSON.stringify(FOUNDER_MEMBERS));
  };

  const pendingCount = installments.filter(i => !i.isDeleted && i.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col justify-between">
      
      <div>
        {/* TOP NAVBAR */}
        <Navbar
          lang={lang}
          setLang={setLang}
          role={role}
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenLogin={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onOpenNotice={() => setShowNoticeModal(true)}
          onOpenChangePassword={() => setShowChangePasswordModal(true)}
          pendingCount={pendingCount}
        />

        {/* MAIN BODY VIEW CONTAINER */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Public Landing View */}
          {activeTab === 'home' && (
            <HomeView
              lang={lang}
              members={members}
              installments={installments}
              projects={projects}
              onOpenLogin={() => setShowLoginModal(true)}
              onSelectTab={setActiveTab}
            />
          )}

          {/* About View */}
          {activeTab === 'about' && (
            <AboutView lang={lang} />
          )}

          {/* Governance & Founder Members */}
          {activeTab === 'governance' && (
            <GovernanceView
              members={members}
              lang={lang}
              role={role}
              onViewCertificate={(mem) => setSelectedCertificateMember(mem)}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
              onRestoreMember={handleRestoreMember}
              onPermanentDeleteMember={handlePermanentDeleteMember}
              onAddMember={handleAddMember}
              onRestoreDefaultMembers={handleRestoreDefaultMembers}
            />
          )}

          {/* Projects View (Public side only) */}
          {activeTab === 'projects' && role === 'public' && (
            <ProjectsView
              projects={projects}
              lang={lang}
            />
          )}

          {/* Member Dashboard */}
          {activeTab === 'member-dashboard' && role === 'member' && currentUser && (
            <MemberDashboard
              member={currentUser}
              installments={installments}
              lang={lang}
              onSubmitInstallment={handleSubmitInstallment}
              onViewReceipt={(inst) => setSelectedReceipt(inst)}
              onViewCertificate={(mem) => setSelectedCertificateMember(mem)}
            />
          )}

          {/* Admin Dashboard */}
          {activeTab === 'admin-dashboard' && role === 'admin' && (
            <AdminDashboard
              members={members}
              installments={installments}
              lang={lang}
              onApprove={handleApproveInstallment}
              onReject={handleRejectInstallment}
              onViewReceipt={(inst) => setSelectedReceipt(inst)}
            />
          )}

          {/* Admin Dedicated Deposit Entry */}
          {activeTab === 'admin-deposit' && role === 'admin' && (
            <AdminDepositView
              members={members.filter(m => !m.isDeleted)}
              installments={installments}
              lang={lang}
              onAddDirectInstallment={handleAddDirectInstallment}
              onViewReceipt={(inst) => setSelectedReceipt(inst)}
              onDeleteInstallment={handleDeleteInstallment}
              onRestoreInstallment={handleRestoreInstallment}
              onPermanentDeleteInstallment={handlePermanentDeleteInstallment}
            />
          )}

          {/* Installments & Universal Ledger */}
          {activeTab === 'installments' && (
            <InstallmentsView
              installments={installments}
              lang={lang}
              role={role}
              currentUser={currentUser}
              onViewReceipt={(inst) => setSelectedReceipt(inst)}
              onDeleteInstallment={role === 'admin' ? handleDeleteInstallment : undefined}
              onRestoreInstallment={role === 'admin' ? handleRestoreInstallment : undefined}
              onPermanentDeleteInstallment={role === 'admin' ? handlePermanentDeleteInstallment : undefined}
            />
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 print:hidden mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
                N
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {translations[lang].appName}
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              {translations[lang].subTagline}. {lang === 'bn' 
                ? 'ইসলামিক শরিয়াহ অনুসারী যৌথ বিনিয়োগ কোম্পানি, নিবন্ধিত ১৩ জন প্রতিষ্ঠাতা অংশীদারের ঐক্যবদ্ধ শক্তি।' 
                : 'Shariah-compliant joint investment enterprise managed by 13 founder directors and shareholders.'}
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
                RJSC: {COMPANY_INFO.regNo}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
                TIN: {COMPANY_INFO.tin}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400">
                100% Shariah Compliant
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-400">
            <p className="font-bold text-white uppercase tracking-wider text-xs">
              {lang === 'bn' ? 'দ্রুত লিঙ্ক' : 'Quick Navigation'}
            </p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-emerald-400 transition">
                  {translations[lang].home}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('governance')} className="hover:text-emerald-400 transition">
                  {translations[lang].governance}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('projects')} className="hover:text-emerald-400 transition">
                  {translations[lang].projects}
                </button>
              </li>
              <li>
                <button onClick={() => setShowLoginModal(true)} className="hover:text-emerald-400 transition">
                  {translations[lang].clientArea}
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-xs text-slate-400">
            <p className="font-bold text-white uppercase tracking-wider text-xs">
              {lang === 'bn' ? 'যোগাযোগ ও সাপোর্ট' : 'Head Office Contact'}
            </p>
            <div className="space-y-2 leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{lang === 'bn' ? COMPANY_INFO.headOfficeBn : COMPANY_INFO.headOfficeEn}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">{COMPANY_INFO.hotline}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">{COMPANY_INFO.email}</span>
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>© 2026 Nexora Limited. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            <span>Powered by Shariah Governance & Islamic Joint Venture Principles</span>
          </p>
        </div>
      </footer>

      {/* MODALS */}
      <LoginModal
        isOpen={showLoginModal}
        lang={lang}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />

      <NoticeBoardModal
        isOpen={showNoticeModal}
        lang={lang}
        onClose={() => setShowNoticeModal(false)}
      />

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        lang={lang}
        userId={currentUser?.id || (role === 'admin' ? 'admin' : 'NXR-001')}
        userName={currentUser?.name || (role === 'admin' ? 'Super Admin' : 'Shareholder')}
        onClose={() => setShowChangePasswordModal(false)}
      />

      {selectedReceipt && (
        <MoneyReceiptModal
          installment={selectedReceipt}
          member={members.find(m => m.id === selectedReceipt.memberId)}
          lang={lang}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {selectedCertificateMember && (
        <ShareCertificateModal
          member={selectedCertificateMember}
          lang={lang}
          onClose={() => setSelectedCertificateMember(null)}
        />
      )}

    </div>
  );
}
