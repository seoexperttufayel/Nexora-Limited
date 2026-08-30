import React, { useState, useEffect } from 'react';
import { Language, Role, Member, Installment, Project, Notice, LedgerTransaction, PaymentAccountConfig } from './types';
import { FOUNDER_MEMBERS, INITIAL_INSTALLMENTS, PROJECTS, NOTICES, COMPANY_INFO } from './data/initialData';
import { INITIAL_LEDGER_TRANSACTIONS } from './data/initialLedger';
import { INITIAL_PAYMENT_ACCOUNTS } from './data/paymentAccounts';
import { translations } from './data/translations';
import { 
  subscribeToInstallments, 
  seedInitialInstallmentsIfEmpty,
  saveInstallmentToCloud,
  approveInstallmentInCloud,
  rejectInstallmentInCloud,
  updateInstallmentDeletionInCloud,
  deleteInstallmentInCloud,
  subscribeToPaymentAccounts,
  seedInitialPaymentAccountsIfEmpty,
  savePaymentAccountToCloud,
  deletePaymentAccountInCloud,
  subscribeToProjects,
  saveProjectToCloud,
  deleteProjectInCloud
} from './services/firebase';

// Components
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { GovernanceView } from './components/GovernanceView';
import { ProjectsView } from './components/ProjectsView';
import { MemberDashboard } from './components/MemberDashboard';
import { MemberDepositView } from './components/MemberDepositView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminDepositView } from './components/AdminDepositView';
import { FinancialLedgerView } from './components/FinancialLedgerView';
import { InstallmentsView } from './components/InstallmentsView';
import { LoginModal } from './components/LoginModal';
import { MoneyReceiptModal } from './components/MoneyReceiptModal';
import { NoticeBoardModal } from './components/NoticeBoardModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { UniversalTrashModal } from './components/UniversalTrashModal';

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

  // Helper for strictly sequential sorting by Member ID: NXR-001 -> NXR-002 -> ... -> NXR-013
  const sortMembersById = (a: Member, b: Member) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  };

  // 3. Members & Installments State
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('nxr_members_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 13) {
          return parsed.sort(sortMembersById);
        }
      } catch {
        // fallback
      }
    }
    return [...FOUNDER_MEMBERS].sort(sortMembersById);
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

  // Projects State (Empty by default with dynamic creation & file management)
  const [projects, setProjects] = useState<Project[]>(() => {
    // Clear legacy mock data key
    try {
      localStorage.removeItem('nxr_projects_v1');
      const saved = localStorage.getItem('nxr_projects_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return PROJECTS; // Defaults to [] from initialData.ts
  });

  // Notices State (with persistence)
  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('nxr_notices_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return NOTICES;
  });

  // Read and dismissed notices persistence
  const [readNoticeIds, setReadNoticeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nxr_read_notices');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [dismissedNoticeIds, setDismissedNoticeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nxr_dismissed_notices');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    safeSetLocalStorage('nxr_read_notices', JSON.stringify(readNoticeIds));
  }, [readNoticeIds]);

  useEffect(() => {
    safeSetLocalStorage('nxr_dismissed_notices', JSON.stringify(dismissedNoticeIds));
  }, [dismissedNoticeIds]);

  // Corporate Financial Ledger Transactions State
  const [ledgerTransactions, setLedgerTransactions] = useState<LedgerTransaction[]>(() => {
    const saved = localStorage.getItem('nxr_ledger_transactions_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_LEDGER_TRANSACTIONS;
  });

  // Payment Channels / Gateway Configurations State
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccountConfig[]>(() => {
    const saved = localStorage.getItem('nxr_payment_accounts_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_PAYMENT_ACCOUNTS;
  });

  // 4. Firestore Real-Time Cross-Device Synchronization
  const [isCloudSynced, setIsCloudSynced] = useState(true);

  useEffect(() => {
    // Seed default installments if Firestore is empty on first run
    seedInitialInstallmentsIfEmpty(INITIAL_INSTALLMENTS);
    seedInitialPaymentAccountsIfEmpty(INITIAL_PAYMENT_ACCOUNTS);

    // Subscribe to real-time installment updates across all devices
    const unsubscribeInstallments = subscribeToInstallments(
      (cloudInstallments) => {
        if (cloudInstallments && cloudInstallments.length > 0) {
          setInstallments(cloudInstallments);
          setIsCloudSynced(true);
        }
      },
      (error) => {
        console.warn('Firestore installments subscription status:', error);
        setIsCloudSynced(false);
      }
    );

    // Subscribe to real-time payment account updates across all devices
    const unsubscribePayments = subscribeToPaymentAccounts(
      (cloudAccounts) => {
        if (cloudAccounts && cloudAccounts.length > 0) {
          setPaymentAccounts(cloudAccounts);
        }
      },
      (error) => {
        console.warn('Firestore payment accounts subscription status:', error);
      }
    );

    // Subscribe to real-time projects updates across all devices
    const unsubscribeProjects = subscribeToProjects(
      (cloudProjects) => {
        if (cloudProjects) {
          setProjects(cloudProjects);
        }
      },
      (error) => {
        console.warn('Firestore projects subscription status:', error);
      }
    );

    return () => {
      unsubscribeInstallments();
      unsubscribePayments();
      unsubscribeProjects();
    };
  }, []);

  // 5. Modals State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Installment | null>(null);

  // Safe LocalStorage setter with Quota Protection
  const safeSetLocalStorage = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn(`LocalStorage write skipped for ${key}:`, err);
    }
  };

  // 6. LocalStorage Persistence Sync Backup
  useEffect(() => {
    safeSetLocalStorage('nxr_lang', lang);
  }, [lang]);

  useEffect(() => {
    safeSetLocalStorage('nxr_role', role);
  }, [role]);

  useEffect(() => {
    if (currentUser) {
      safeSetLocalStorage('nxr_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nxr_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    safeSetLocalStorage('nxr_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    safeSetLocalStorage('nxr_members_v4', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    safeSetLocalStorage('nxr_installments_v4', JSON.stringify(installments));
  }, [installments]);

  useEffect(() => {
    safeSetLocalStorage('nxr_projects_v2', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    safeSetLocalStorage('nxr_notices_v1', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    safeSetLocalStorage('nxr_ledger_transactions_v2', JSON.stringify(ledgerTransactions));
  }, [ledgerTransactions]);

  useEffect(() => {
    safeSetLocalStorage('nxr_payment_accounts_v1', JSON.stringify(paymentAccounts));
  }, [paymentAccounts]);

  // Ledger Handlers
  const handleAddLedgerTransaction = (newTxn: LedgerTransaction) => {
    setLedgerTransactions(prev => [newTxn, ...prev]);
  };

  const handleDeleteLedgerTransaction = (id: string) => {
    setLedgerTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, isDeleted: true } : t))
    );
  };

  const handleRestoreLedgerTransaction = (id: string) => {
    setLedgerTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, isDeleted: false } : t))
    );
  };

  const handlePermanentDeleteLedgerTransaction = (id: string) => {
    setLedgerTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handlePurgeAllTrash = async () => {
    const trashedInstIds = installments.filter(i => i.isDeleted).map(i => i.id);
    setInstallments(prev => prev.filter(i => !i.isDeleted));
    setMembers(prev => prev.filter(m => !m.isDeleted).sort(sortMembersById));
    setLedgerTransactions(prev => prev.filter(t => !t.isDeleted));
    setNotices(prev => prev.filter(n => !n.isDeleted));
    setProjects(prev => prev.filter(p => !p.isDeleted));

    for (const instId of trashedInstIds) {
      try {
        await deleteInstallmentInCloud(instId);
      } catch (err) {
        console.error('Cloud purge error:', err);
      }
    }
  };

  // Payment Account Handlers (Local & Firestore Cloud Synced)
  const handleUpdatePaymentAccount = async (updated: PaymentAccountConfig) => {
    setPaymentAccounts(prev =>
      prev.map(acc => (acc.id === updated.id ? updated : acc))
    );
    try {
      await savePaymentAccountToCloud(updated);
    } catch (err) {
      console.error('Cloud payment account save error:', err);
    }
  };

  const handleAddPaymentAccount = async (newAcc: PaymentAccountConfig) => {
    setPaymentAccounts(prev => [...prev, newAcc]);
    try {
      await savePaymentAccountToCloud(newAcc);
    } catch (err) {
      console.error('Cloud payment account add error:', err);
    }
  };

  const handleDeletePaymentAccount = async (id: string) => {
    setPaymentAccounts(prev => prev.filter(acc => acc.id !== id));
    try {
      await deletePaymentAccountInCloud(id);
    } catch (err) {
      console.error('Cloud payment account delete error:', err);
    }
  };

  const handleResetPaymentAccounts = async () => {
    setPaymentAccounts(INITIAL_PAYMENT_ACCOUNTS);
    for (const acc of INITIAL_PAYMENT_ACCOUNTS) {
      await savePaymentAccountToCloud(acc);
    }
  };

  // Project Handlers (Local & Firestore Cloud Synced)
  const handleCreateProject = async (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    try {
      await saveProjectToCloud(newProject);
    } catch (err) {
      console.error('Cloud project create error:', err);
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    setProjects(prev => prev.map(p => (p.id === updatedProject.id ? updatedProject : p)));
    try {
      await saveProjectToCloud(updatedProject);
    } catch (err) {
      console.error('Cloud project update error:', err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    try {
      await deleteProjectInCloud(projectId);
    } catch (err) {
      console.error('Cloud project delete error:', err);
    }
  };

  // Notice Handlers (Soft Delete to Central Trash Bin)
  const handleAddNotice = (newNotice: Notice) => {
    setNotices(prev => [newNotice, ...prev]);
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(prev =>
      prev.map(n => (n.id === id ? { ...n, isDeleted: true, deletedAt: new Date().toISOString(), deletedBy: currentUser?.name || 'Admin' } : n))
    );
  };

  const handleRestoreNotice = (id: string) => {
    setNotices(prev =>
      prev.map(n => (n.id === id ? { ...n, isDeleted: false, deletedAt: undefined, deletedBy: undefined } : n))
    );
  };

  const handlePermanentDeleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  // Handle Login success
  const handleLoginSuccess = (newRole: Role, user: any) => {
    setRole(newRole);
    setCurrentUser(user);
    safeSetLocalStorage('nxr_role', newRole);
    safeSetLocalStorage('nxr_current_user', JSON.stringify(user));
    const targetTab = newRole === 'admin' ? 'admin-dashboard' : 'member-dashboard';
    setActiveTab(targetTab);
    safeSetLocalStorage('nxr_active_tab', targetTab);
  };

  // Handle Logout (Explicitly by user)
  const handleLogout = () => {
    setRole('public');
    setCurrentUser(null);
    setActiveTab('home');
    localStorage.removeItem('nxr_role');
    localStorage.removeItem('nxr_current_user');
    safeSetLocalStorage('nxr_active_tab', 'home');
  };

  // Submit Installment by Member (Real-time Cloud Broadcast)
  const handleSubmitInstallment = async (data: Partial<Installment>) => {
    const activeMember = members.find(m => m.id === (data.memberId || currentUser?.id)) || currentUser;
    const sharePercentage = activeMember?.share || 10;
    const baseAmount = sharePercentage * 1000;
    
    // Strict Real-time system date
    const submissionDate = new Date().toISOString().split('T')[0];
    const day = new Date().getDate();
    
    // 1st to 10th rule: 0 BDT penalty. Strictly after 10th: 100 BDT per share.
    const calculatedLateFee = day > 10 ? sharePercentage * 100 : 0;
    const finalAmount = data.amount !== undefined ? data.amount : (baseAmount + calculatedLateFee);
    const receiptSerial = data.receiptNo || `NXR-REC-${data.year || new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

    const newInst: Installment = {
      id: `TRX-${Date.now()}-${Math.floor(Math.random() * 8999 + 1000)}`,
      receiptNo: receiptSerial,
      memberId: activeMember?.id || data.memberId || 'NXR-001',
      memberName: activeMember?.name || data.memberName || 'Member',
      memberNameBn: activeMember?.nameBn || data.memberNameBn || data.memberName || 'সদস্য',
      month: data.month || 'September',
      year: data.year || 2026,
      amount: finalAmount,
      lateFee: data.lateFee !== undefined ? data.lateFee : calculatedLateFee,
      method: data.method || 'bKash Merchant',
      trxId: data.trxId || `TXN-${Math.floor(Math.random() * 89999 + 10000)}`,
      date: submissionDate,
      status: 'pending',
      notes: data.notes || '',
      isDeleted: false
    };

    // Optimistic local state update
    setInstallments(prev => [newInst, ...prev]);

    // Save to shared Firestore database for instant cross-device admin visibility
    try {
      await saveInstallmentToCloud(newInst);
    } catch (err) {
      console.error('Cloud installment save error:', err);
    }
  };

  // Admin Approve Installment (Real-time Cloud Broadcast & Auto-link to Ledger)
  const handleApproveInstallment = async (id: string) => {
    let approvedInst: Installment | undefined;
    setInstallments(prev =>
      prev.map(item => {
        if (item.id === id) {
          approvedInst = {
            ...item,
            status: 'approved' as const,
            approvedBy: 'Super Admin',
            approvedAt: new Date().toISOString()
          };
          return approvedInst;
        }
        return item;
      })
    );

    // Auto-record approved installment in Corporate Financial Ledger
    const target = approvedInst || installments.find(i => i.id === id);
    if (target) {
      const ledgerEntry: LedgerTransaction = {
        id: `LED-${target.id}`,
        voucherNo: target.receiptNo,
        type: 'credit',
        title: `Member Installment: ${target.memberName} (${target.month} ${target.year})`,
        titleBn: `সদস্য কিস্তি জমা: ${target.memberNameBn || target.memberName} (${target.month} ${target.year})`,
        category: 'Monthly Installments (মাসিক কিস্তি)',
        categoryBn: 'মাসিক কিস্তি',
        amount: target.amount,
        date: target.date,
        method: target.method,
        notes: `সদস্য আইডি: ${target.memberId} | TrxID: ${target.trxId}`,
        recordedBy: 'Super Admin',
        createdAt: new Date().toISOString()
      };
      setLedgerTransactions(prev => {
        if (prev.some(t => t.voucherNo === target.receiptNo || t.id === ledgerEntry.id)) {
          return prev;
        }
        return [ledgerEntry, ...prev];
      });
    }

    try {
      await approveInstallmentInCloud(id, 'Super Admin');
    } catch (err) {
      console.error('Cloud approve error:', err);
    }
  };

  // Admin Reject Installment (Real-time Cloud Broadcast)
  const handleRejectInstallment = async (id: string, reason?: string) => {
    const finalReason = reason || 'Information mismatched or unverified.';
    setInstallments(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: 'rejected' as const,
            rejectionReason: finalReason
          };
        }
        return item;
      })
    );

    // Remove from ledger if rejected
    setLedgerTransactions(prev => prev.filter(t => t.id !== `LED-${id}`));

    try {
      await rejectInstallmentInCloud(id, finalReason);
    } catch (err) {
      console.error('Cloud reject error:', err);
    }
  };

  // Direct Admin Installment Add (Real-time Cloud Broadcast & Auto-link to Ledger)
  const handleAddDirectInstallment = async (data: Partial<Installment>) => {
    const receiptSerial = `NXR-DIR-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const newInst: Installment = {
      id: `TRX-${Date.now()}-${Math.floor(Math.random() * 8999 + 1000)}`,
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
      notes: data.notes || '',
      isDeleted: false
    };

    setInstallments(prev => [newInst, ...prev]);

    // Auto-record direct approved installment in Corporate Financial Ledger
    const ledgerEntry: LedgerTransaction = {
      id: `LED-${newInst.id}`,
      voucherNo: newInst.receiptNo,
      type: 'credit',
      title: `Member Installment: ${newInst.memberName} (${newInst.month} ${newInst.year})`,
      titleBn: `সদস্য কিস্তি জমা: ${newInst.memberNameBn || newInst.memberName} (${newInst.month} ${newInst.year})`,
      category: 'Monthly Installments (মাসিক কিস্তি)',
      categoryBn: 'মাসিক কিস্তি',
      amount: newInst.amount,
      date: newInst.date,
      method: newInst.method,
      notes: `সদস্য আইডি: ${newInst.memberId} | TrxID: ${newInst.trxId}`,
      recordedBy: 'Super Admin',
      createdAt: new Date().toISOString()
    };
    setLedgerTransactions(prev => [ledgerEntry, ...prev]);

    try {
      await saveInstallmentToCloud(newInst);
    } catch (err) {
      console.error('Cloud direct installment save error:', err);
    }
  };

  // Trash & Installment Management Handlers (Cloud Synced)
  const handleDeleteInstallment = async (id: string) => {
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

    // Sync soft delete in ledger
    setLedgerTransactions(prev =>
      prev.map(t => (t.id === `LED-${id}` ? { ...t, isDeleted: true } : t))
    );

    try {
      await updateInstallmentDeletionInCloud(id, true);
    } catch (err) {
      console.error('Cloud soft delete error:', err);
    }
  };

  const handleRestoreInstallment = async (id: string) => {
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

    // Restore in ledger
    setLedgerTransactions(prev =>
      prev.map(t => (t.id === `LED-${id}` ? { ...t, isDeleted: false } : t))
    );

    try {
      await updateInstallmentDeletionInCloud(id, false);
    } catch (err) {
      console.error('Cloud restore error:', err);
    }
  };

  const handlePermanentDeleteInstallment = (id: string) => {
    setInstallments(prev => prev.filter(item => item.id !== id));
    setLedgerTransactions(prev => prev.filter(t => t.id !== `LED-${id}`));
  };

  // Member Management Handlers (Strictly Locked NXR-001 to NXR-013 Sequential Sorting)
  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(prev =>
      prev.map(m => (m.id === updatedMember.id ? updatedMember : m)).sort(sortMembersById)
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
      }).sort(sortMembersById)
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
      }).sort(sortMembersById)
    );
  };

  const handlePermanentDeleteMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId).sort(sortMembersById));
  };

  const handleAddMember = (newMember: Member) => {
    setMembers(prev => [...prev, newMember].sort(sortMembersById));
  };

  const handleRestoreDefaultMembers = () => {
    const sorted = [...FOUNDER_MEMBERS].sort(sortMembersById);
    setMembers(sorted);
    localStorage.setItem('nxr_members_v4', JSON.stringify(sorted));
  };

  const pendingCount = installments.filter(i => !i.isDeleted && i.status === 'pending').length;
  const trashedCount = 
    installments.filter(i => i.isDeleted).length + 
    members.filter(m => m.isDeleted).length + 
    ledgerTransactions.filter(t => t.isDeleted).length +
    notices.filter(n => n.isDeleted).length;

  const activeNotices = notices.filter(n => !n.isDeleted && !dismissedNoticeIds.includes(n.id));
  const unreadNoticeCount = activeNotices.filter(n => !readNoticeIds.includes(n.id)).length;

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
          onOpenTrash={() => setShowTrashModal(true)}
          trashedCount={trashedCount}
          pendingCount={pendingCount}
          noticeCount={unreadNoticeCount}
          isCloudSynced={isCloudSynced}
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

          {/* Governance & Founder Members (Protected for Authenticated Members and Admins Only) */}
          {activeTab === 'governance' && role !== 'public' && (
            <GovernanceView
              members={members}
              lang={lang}
              role={role}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
              onRestoreMember={handleRestoreMember}
              onPermanentDeleteMember={handlePermanentDeleteMember}
              onAddMember={handleAddMember}
              onRestoreDefaultMembers={handleRestoreDefaultMembers}
            />
          )}

          {/* Fallback if public user somehow tries to access governance directly */}
          {activeTab === 'governance' && role === 'public' && (
            <HomeView
              lang={lang}
              members={members}
              installments={installments}
              projects={projects}
              onOpenLogin={() => setShowLoginModal(true)}
              onSelectTab={setActiveTab}
            />
          )}

          {/* Projects View (Available for All Roles) */}
          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              lang={lang}
              role={role}
              currentUser={currentUser}
              onCreateProject={handleCreateProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {/* Member Dashboard */}
          {activeTab === 'member-dashboard' && role === 'member' && currentUser && (
            <MemberDashboard
              member={currentUser}
              installments={installments}
              lang={lang}
              onViewReceipt={(inst) => setSelectedReceipt(inst)}
              onUpdateMember={handleUpdateMember}
            />
          )}

          {/* Member Dedicated Submit Installment Portal */}
          {activeTab === 'member-deposit' && role === 'member' && currentUser && (
            <MemberDepositView
              member={currentUser}
              lang={lang}
              onSubmitInstallment={handleSubmitInstallment}
              onViewReceipt={(inst) => setSelectedReceipt(inst)}
              onNavigateToDashboard={() => setActiveTab('member-dashboard')}
              paymentAccounts={paymentAccounts}
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
              ledgerTransactions={ledgerTransactions}
              paymentAccounts={paymentAccounts}
              onUpdatePaymentAccount={handleUpdatePaymentAccount}
              onAddPaymentAccount={handleAddPaymentAccount}
              onDeletePaymentAccount={handleDeletePaymentAccount}
              onResetPaymentAccounts={handleResetPaymentAccounts}
              onNavigateToLedger={() => setActiveTab('financial-ledger')}
            />
          )}

          {/* Corporate Financial Ledger (Horizontal Header Menu View) */}
          {activeTab === 'financial-ledger' && (
            <FinancialLedgerView
              transactions={ledgerTransactions}
              lang={lang}
              role={role}
              onAddTransaction={handleAddLedgerTransaction}
              onDeleteTransaction={handleDeleteLedgerTransaction}
              totalApprovedInstallments={installments.filter(i => !i.isDeleted && i.status === 'approved').reduce((sum, i) => sum + i.amount, 0)}
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
              paymentAccounts={paymentAccounts}
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
        members={members}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />

      <NoticeBoardModal
        isOpen={showNoticeModal}
        lang={lang}
        role={role}
        notices={notices}
        onClose={() => setShowNoticeModal(false)}
        onAddNotice={handleAddNotice}
        onDeleteNotice={handleDeleteNotice}
        readNoticeIds={readNoticeIds}
        setReadNoticeIds={setReadNoticeIds}
        dismissedNoticeIds={dismissedNoticeIds}
        setDismissedNoticeIds={setDismissedNoticeIds}
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

      {/* Universal Trash & Audit Bin Modal */}
      <UniversalTrashModal
        isOpen={showTrashModal}
        onClose={() => setShowTrashModal(false)}
        lang={lang}
        installments={installments}
        members={members}
        ledgerTransactions={ledgerTransactions}
        notices={notices}
        projects={projects}
        onRestoreInstallment={handleRestoreInstallment}
        onPermanentDeleteInstallment={handlePermanentDeleteInstallment}
        onRestoreMember={handleRestoreMember}
        onPermanentDeleteMember={handlePermanentDeleteMember}
        onRestoreLedgerTransaction={handleRestoreLedgerTransaction}
        onPermanentDeleteLedgerTransaction={handlePermanentDeleteLedgerTransaction}
        onRestoreNotice={handleRestoreNotice}
        onPermanentDeleteNotice={handlePermanentDeleteNotice}
        onPurgeAllTrash={handlePurgeAllTrash}
      />

    </div>
  );
}
