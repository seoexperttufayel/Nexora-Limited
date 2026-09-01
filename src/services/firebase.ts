import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { Installment, Member, Project } from '../types';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAgzk2UrwfR6UBwk1yTXExPqYK1k9taLIo",
  authDomain: "ai-studio-applet-webapp-b06c8.firebaseapp.com",
  projectId: "ai-studio-applet-webapp-b06c8",
  storageBucket: "ai-studio-applet-webapp-b06c8.firebasestorage.app",
  messagingSenderId: "844767791115",
  appId: "1:844767791115:web:d2ec118222403bb09bdf0e",
  firestoreDatabaseId: firebaseAppletConfig.firestoreDatabaseId || "ai-studio-nexoralimitedsha-e182529d-3c08-4f8e-822c-090b711b2794"
};

// Initialize Firebase App instance
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const INSTALLMENTS_COLLECTION = 'installments';
const MEMBERS_COLLECTION = 'members';
const PAYMENT_ACCOUNTS_COLLECTION = 'payment_accounts';
const LEDGER_COLLECTION = 'ledger_transactions';
const PROJECTS_COLLECTION = 'projects';

/**
 * Real-time subscription to installments collection in Firestore.
 * Automatically notifies callback whenever any installment is submitted, approved, or changed cross-device.
 */
export const subscribeToInstallments = (
  onData: (installments: Installment[]) => void,
  onError?: (error: Error) => void
) => {
  try {
    const colRef = collection(db, INSTALLMENTS_COLLECTION);
    const q = query(colRef, orderBy('date', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const items: Installment[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Installment);
      });
      onData(items);
    }, (err) => {
      console.warn('Firestore real-time subscription error:', err);
      if (onError) onError(err);
    });
  } catch (err: any) {
    console.warn('Failed to start Firestore subscription:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Seed initial installments if collection is currently empty
 */
export const seedInitialInstallmentsIfEmpty = async (defaultInstallments: Installment[]) => {
  try {
    const colRef = collection(db, INSTALLMENTS_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty && defaultInstallments.length > 0) {
      const batch = writeBatch(db);
      for (const item of defaultInstallments) {
        const docRef = doc(db, INSTALLMENTS_COLLECTION, item.id);
        batch.set(docRef, { ...item, isDeleted: item.isDeleted || false });
      }
      await batch.commit();
      console.log('Seeded initial installments to Firestore');
    }
  } catch (err) {
    console.warn('Could not seed initial installments:', err);
  }
};

/**
 * Save / Create new Installment to Firestore (Real-Time cross-device broadcast)
 */
export const saveInstallmentToCloud = async (installment: Installment): Promise<void> => {
  const docRef = doc(db, INSTALLMENTS_COLLECTION, installment.id);
  await setDoc(docRef, {
    ...installment,
    isDeleted: false,
    createdAt: new Date().toISOString()
  });
};

/**
 * Approve Installment in Firestore
 */
export const approveInstallmentInCloud = async (
  id: string, 
  approvedBy: string = 'Super Admin'
): Promise<void> => {
  const docRef = doc(db, INSTALLMENTS_COLLECTION, id);
  await updateDoc(docRef, {
    status: 'approved',
    approvedBy,
    approvedAt: new Date().toISOString()
  });
};

/**
 * Reject Installment in Firestore
 */
export const rejectInstallmentInCloud = async (
  id: string, 
  reason: string
): Promise<void> => {
  const docRef = doc(db, INSTALLMENTS_COLLECTION, id);
  await updateDoc(docRef, {
    status: 'rejected',
    rejectionReason: reason || 'Information mismatched or unverified.'
  });
};

/**
 * Soft delete or restore Installment
 */
export const updateInstallmentDeletionInCloud = async (
  id: string, 
  isDeleted: boolean
): Promise<void> => {
  const docRef = doc(db, INSTALLMENTS_COLLECTION, id);
  await updateDoc(docRef, {
    isDeleted,
    deletedAt: isDeleted ? new Date().toISOString() : null
  });
};

/**
 * Permanent Delete Installment in Firestore
 */
export const deleteInstallmentInCloud = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, INSTALLMENTS_COLLECTION, id);
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Cloud delete installment error:', err);
  }
};

/**
 * Real-time subscription to payment accounts collection in Firestore
 */
export const subscribeToPaymentAccounts = (
  onData: (accounts: any[]) => void,
  onError?: (error: Error) => void
) => {
  try {
    const colRef = collection(db, PAYMENT_ACCOUNTS_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const items: any[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data());
        });
        onData(items);
      }
    }, (err) => {
      console.warn('Firestore payment accounts subscription error:', err);
      if (onError) onError(err);
    });
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Seed initial payment accounts if empty in Firestore
 */
export const seedInitialPaymentAccountsIfEmpty = async (defaults: any[]) => {
  try {
    const colRef = collection(db, PAYMENT_ACCOUNTS_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty && defaults.length > 0) {
      const batch = writeBatch(db);
      for (const item of defaults) {
        const docRef = doc(db, PAYMENT_ACCOUNTS_COLLECTION, item.id);
        batch.set(docRef, item);
      }
      await batch.commit();
      console.log('Seeded initial payment accounts to Firestore');
    }
  } catch (err) {
    console.warn('Could not seed initial payment accounts:', err);
  }
};

/**
 * Save / Update Payment Account in Firestore
 */
export const savePaymentAccountToCloud = async (account: any): Promise<void> => {
  try {
    const docRef = doc(db, PAYMENT_ACCOUNTS_COLLECTION, account.id);
    await setDoc(docRef, account, { merge: true });
  } catch (err) {
    console.warn('Cloud save payment account error:', err);
  }
};

/**
 * Delete Payment Account in Firestore
 */
export const deletePaymentAccountInCloud = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, PAYMENT_ACCOUNTS_COLLECTION, id);
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Cloud delete payment account error:', err);
  }
};

/**
 * Real-time subscription to projects collection in Firestore
 */
export const subscribeToProjects = (
  onData: (projects: Project[]) => void,
  onError?: (error: Error) => void
) => {
  try {
    const colRef = collection(db, PROJECTS_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      const items: Project[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Project);
      });
      onData(items);
    }, (err) => {
      console.warn('Firestore projects subscription error:', err);
      if (onError) onError(err);
    });
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Save / Update Project in Firestore
 */
export const saveProjectToCloud = async (project: Project): Promise<void> => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, project.id);
    await setDoc(docRef, project, { merge: true });
  } catch (err) {
    console.warn('Cloud save project error:', err);
  }
};

/**
 * Delete Project in Firestore
 */
export const deleteProjectInCloud = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Cloud delete project error:', err);
  }
};

const SETTINGS_COLLECTION = 'settings';

/**
 * Real-time subscription to admin profile settings in Firestore
 */
export const subscribeToAdminProfile = (
  onData: (profile: any) => void,
  onError?: (error: Error) => void
) => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'adminProfile');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data());
      }
    }, (err) => {
      console.warn('Firestore admin profile subscription error:', err);
      if (onError) onError(err);
    });
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Save / Update Admin Profile in Firestore
 */
export const saveAdminProfileInCloud = async (profile: any): Promise<void> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'adminProfile');
    await setDoc(docRef, profile, { merge: true });
  } catch (err) {
    console.warn('Cloud save admin profile error:', err);
  }
};


