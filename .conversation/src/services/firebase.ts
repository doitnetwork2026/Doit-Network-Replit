import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Use provisioned Firestore database ID
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

/**
 * Normalizes an Indian phone number to standard international E.164 (+91XXXXXXXXXX).
 * Throws an error if invalid.
 */
export function normalizeIndianPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  if (phone.startsWith('+91') && digits.length === 12) {
    return `+${digits}`;
  }
  throw new Error('Please enter a valid 10-digit Indian mobile number.');
}

/**
 * Normalizes email address to lowercase trimmed string.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Checks for existing user with same phone or email to prevent duplicate registration.
 */
export async function checkDuplicateUser(email: string, phone: string, role: string): Promise<{ exists: boolean; reason?: string }> {
  try {
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizeIndianPhoneNumber(phone);

    const usersRef = collection(db, 'users');

    // Query email
    const emailQuery = query(usersRef, where('email', '==', normalizedEmail));
    const emailSnap = await getDocs(emailQuery);
    if (!emailSnap.empty) {
      return { exists: true, reason: 'This email is already registered. Please log in instead.' };
    }

    // Query phone and role
    const phoneQuery = query(usersRef, where('phone', '==', normalizedPhone), where('role', '==', role));
    const phoneSnap = await getDocs(phoneQuery);
    if (!phoneSnap.empty) {
      return { exists: true, reason: 'This mobile number is already registered for this role. Please log in instead.' };
    }

    return { exists: false };
  } catch (error) {
    console.warn('Duplicate check fallback (local network/permissions):', error);
    return { exists: false };
  }
}

/**
 * Synchronizes Firebase Auth user with Firestore user document.
 */
export async function syncUserProfile(user: FirebaseUser, role: 'customer' | 'provider' | 'admin', extraData: any = {}) {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  const payload = {
    uid: user.uid,
    email: user.email ? normalizeEmail(user.email) : '',
    role,
    updatedAt: serverTimestamp(),
    ...extraData
  };

  if (!snap.exists()) {
    await setDoc(userRef, {
      ...payload,
      createdAt: serverTimestamp(),
      accountStatus: 'ACTIVE'
    });
  } else {
    await updateDoc(userRef, payload);
  }
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
};
