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
import { Installment, Member } from '../types';
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
 * Real-time subscription to members collection in Firestore
 */
export const subscribeToMembers = (
  onData: (members: Member[]) => void,
  onError?: (error: Error) => void
) => {
  try {
    const colRef = collection(db, MEMBERS_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const items: Member[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Member);
        });
        onData(items);
      }
    }, (err) => {
      console.warn('Firestore members subscription error:', err);
      if (onError) onError(err);
    });
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
};
