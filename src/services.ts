/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth, isFirebaseActive, handleFirestoreError, OperationType } from './firebase';
import { Destination, Package, Booking, UserProfile } from './types';
import { SEED_DESTINATIONS, SEED_PACKAGES, SEED_METADATA } from './data';

// --- Local Storage Simulator Engine (Fallback) ---
const LOCAL_STORAGE_KEYS = {
  DESTINATIONS: 'hobe_destinations',
  PACKAGES: 'hobe_packages',
  BOOKINGS: 'hobe_bookings',
  USERS: 'hobe_users',
  SESSION: 'hobe_session',
  METADATA: 'hobe_metadata'
};

const getLocalStorageData = <T>(key: string, defaultData: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return defaultData;
  }
};

const setLocalStorageData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize fallback engine store with seed data if vacant
const initLocalStorageStore = () => {
  getLocalStorageData(LOCAL_STORAGE_KEYS.DESTINATIONS, SEED_DESTINATIONS);
  getLocalStorageData(LOCAL_STORAGE_KEYS.PACKAGES, SEED_PACKAGES);
  getLocalStorageData(LOCAL_STORAGE_KEYS.BOOKINGS, [] as Booking[]);
  getLocalStorageData(LOCAL_STORAGE_KEYS.USERS, [] as UserProfile[]);
  getLocalStorageData(LOCAL_STORAGE_KEYS.METADATA, SEED_METADATA);
};

initLocalStorageStore();

// --- Auth State Handlers ---
export interface AuthUser {
  uid: string;
  email: string;
  role: 'customer' | 'admin';
  emailVerified: boolean;
}

type AuthCallback = (user: AuthUser | null) => void;
const authListeners = new Set<AuthCallback>();
let currentSimulatedUser: AuthUser | null = (() => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSION);
  if (stored) {
    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  }
  return null;
})();

const notifyAuthListeners = () => {
  const userToNotify = currentSimulatedUser;
  authListeners.forEach(listener => listener(userToNotify));
};

// Start watching auth changes
if (isFirebaseActive() && auth && db) {
  onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      // Fetch user profile from users collection
      let role: 'customer' | 'admin' = 'customer';
      if (fbUser.email === 'hobegorillarwanda@gmail.com') {
        role = 'admin';
      } else {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            role = userDoc.data().role === 'admin' ? 'admin' : 'customer';
          } else {
            // Write default customer profile to firestore
            await setDoc(doc(db, 'users', fbUser.uid), {
              email: fbUser.email,
              role: 'customer',
              createdAt: new Date().toISOString()
            });
          }
        } catch (e) {
          console.warn("Could not retrieve profile role from users collection, using customer default", e);
        }
      }

      const activeUser: AuthUser = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        role: role,
        emailVerified: fbUser.emailVerified
      };
      
      authListeners.forEach(listener => listener(activeUser));
    } else {
      authListeners.forEach(listener => listener(null));
    }
  });
}

// --- Unified Services Definitions ---

export const authService = {
  subscribe(callback: AuthCallback): () => void {
    authListeners.add(callback);
    // Push current immediately on subscribe
    if (isFirebaseActive() && auth) {
      const fbUser = auth.currentUser;
      if (fbUser) {
        // Find existing stored role or guess from email
        const isAdm = fbUser.email === 'hobegorillarwanda@gmail.com';
        callback({
          uid: fbUser.uid,
          email: fbUser.email || '',
          role: isAdm ? 'admin' : 'customer',
          emailVerified: fbUser.emailVerified
        });
      } else {
        callback(null);
      }
    } else {
      callback(currentSimulatedUser);
    }

    return () => {
      authListeners.delete(callback);
    };
  },

  async signInWithGoogle(): Promise<AuthUser> {
    if (isFirebaseActive() && auth && db) {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const fbUser = result.user;
        const isAdminUser = fbUser.email === 'hobegorillarwanda@gmail.com';
        const role = isAdminUser ? 'admin' : 'customer';
        
        // Sync to Firestore 'users' collection
        await setDoc(doc(db, 'users', fbUser.uid), {
          email: fbUser.email,
          role: role,
          createdAt: new Date().toISOString()
        }, { merge: true });

        return {
          uid: fbUser.uid,
          email: fbUser.email || '',
          role: role,
          emailVerified: true
        };
      } catch (err) {
        console.error("Google Sign In Error:", err);
        throw err;
      }
    } else {
      // Local Simulation
      const mockUid = 'google_user_sim_777';
      const mockUser: AuthUser = {
        uid: mockUid,
        email: 'hobegorillarwanda@gmail.com', // Admin Google sign in simulation
        role: 'admin',
        emailVerified: true
      };
      currentSimulatedUser = mockUser;
      localStorage.setItem(LOCAL_STORAGE_KEYS.SESSION, JSON.stringify(mockUser));
      notifyAuthListeners();
      return mockUser;
    }
  },

  async signUpWithEmail(email: string, pass: string): Promise<AuthUser> {
    const isAdm = email.trim().toLowerCase() === 'hobegorillarwanda@gmail.com';
    const role = isAdm ? 'admin' : 'customer';

    const fallbackLocalSignUp = () => {
      const users = getLocalStorageData<UserProfile[]>(LOCAL_STORAGE_KEYS.USERS, []);
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error("User registration failed: email ya registered!");
      }
      const newUid = 'sim_uid_' + Math.floor(Math.random() * 1000000);
      const newProfile: UserProfile = {
        uid: newUid,
        email: email,
        role: role,
        createdAt: new Date().toISOString()
      };
      users.push(newProfile);
      setLocalStorageData(LOCAL_STORAGE_KEYS.USERS, users);

      const authUser: AuthUser = {
        uid: newUid,
        email: email,
        role: role,
        emailVerified: true
      };
      currentSimulatedUser = authUser;
      localStorage.setItem(LOCAL_STORAGE_KEYS.SESSION, JSON.stringify(authUser));
      notifyAuthListeners();
      return authUser;
    };

    if (isFirebaseActive() && auth && db) {
      try {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        const fbUser = result.user;
        
        // Sync profile
        await setDoc(doc(db, 'users', fbUser.uid), {
          email: fbUser.email,
          role: role,
          createdAt: new Date().toISOString()
        });

        return {
          uid: fbUser.uid,
          email: email,
          role: role,
          emailVerified: true
        };
      } catch (err: any) {
        if (err && err.code === 'auth/operation-not-allowed') {
          console.warn("Firebase Email/Password provider is disabled. Falling back to local simulation.", err);
          return fallbackLocalSignUp();
        }
        console.error("Signup error in Firebase:", err);
        throw err;
      }
    } else {
      // Local simulation
      return fallbackLocalSignUp();
    }
  },

  async signInWithEmail(email: string, pass: string): Promise<AuthUser> {
    const isAdm = email.trim().toLowerCase() === 'hobegorillarwanda@gmail.com';
    const role = isAdm ? 'admin' : 'customer';

    const fallbackLocalSignIn = () => {
      if (isAdm && pass !== 'Expert100%') {
        throw new Error("Invalid admin password. Please use correct password.");
      }
      const authUser: AuthUser = {
        uid: isAdm ? 'admin_sim_uid' : 'customer_sim_uid_' + Math.floor(Math.random() * 100000),
        email: email,
        role: role,
        emailVerified: true
      };
      currentSimulatedUser = authUser;
      localStorage.setItem(LOCAL_STORAGE_KEYS.SESSION, JSON.stringify(authUser));
      notifyAuthListeners();
      return authUser;
    };

    if (isFirebaseActive() && auth && db) {
      try {
        let result;
        try {
          result = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), pass);
        } catch (signErr: any) {
          if (signErr && signErr.code === 'auth/operation-not-allowed') {
            console.warn("Firebase Email/Password provider is disabled. Falling back to local simulation.", signErr);
            return fallbackLocalSignIn();
          }
          // If the login fails but it is the requested admin with correct password, register them automatically inside Firebase
          if (isAdm && pass === 'Expert100%' && (signErr.code === 'auth/user-not-found' || signErr.code === 'auth/invalid-credential' || signErr.code === 'auth/wrong-password')) {
            try {
              result = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), pass);
              // Sync profile as admin in firestore
              await setDoc(doc(db, 'users', result.user.uid), {
                email: result.user.email,
                role: 'admin',
                createdAt: new Date().toISOString()
              });
            } catch (createErr: any) {
              if (createErr && createErr.code === 'auth/operation-not-allowed') {
                console.warn("Firebase Email/Password sign-up provider is disabled. Falling back to local simulation during auto-registration.", createErr);
                return fallbackLocalSignIn();
              }
              console.error("Auto-registration of admin failed, throwing original sign-in error", createErr);
              throw signErr;
            }
          } else {
            throw signErr;
          }
        }
        const fbUser = result.user;
        return {
          uid: fbUser.uid,
          email: fbUser.email || email,
          role: role,
          emailVerified: true
        };
      } catch (err: any) {
        if (err && err.code === 'auth/operation-not-allowed') {
          console.warn("Firebase Email/Password provider is disabled. Falling back to local simulation.", err);
          return fallbackLocalSignIn();
        }
        console.error("Sign in error in Firebase:", err);
        throw err;
      }
    } else {
      // Local simulation
      return fallbackLocalSignIn();
    }
  },

  async signOut(): Promise<void> {
    if (isFirebaseActive() && auth) {
      await fbSignOut(auth);
    } else {
      currentSimulatedUser = null;
      localStorage.removeItem(LOCAL_STORAGE_KEYS.SESSION);
      notifyAuthListeners();
    }
  }
};

// --- Destination Data Services ---
export const destinationService = {
  async getAll(): Promise<Destination[]> {
    if (isFirebaseActive() && db) {
      try {
        const snap = await getDocs(collection(db, 'destinations'));
        const list: Destination[] = [];
        snap.forEach(d => list.push(d.data() as Destination));
        
        // Auto pre-population seed trigger if database is empty 
        if (list.length === 0) {
          console.log("Seeding Firestore destination collection...");
          for (const d of SEED_DESTINATIONS) {
            try {
              await setDoc(doc(db, 'destinations', d.id), d);
            } catch (seedErr) {
              console.warn(`Skiped writing destination seed ${d.id} to cloud due to permission rules (non-admin active write protection).`, seedErr);
            }
            list.push(d);
          }
        }
        return list;
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'destinations');
      }
    } else {
      return getLocalStorageData<Destination[]>(LOCAL_STORAGE_KEYS.DESTINATIONS, SEED_DESTINATIONS);
    }
  },

  async save(dest: Destination): Promise<void> {
    if (isFirebaseActive() && db) {
      try {
        await setDoc(doc(db, 'destinations', dest.id), dest);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `destinations/${dest.id}`);
      }
    } else {
      const items = getLocalStorageData<Destination[]>(LOCAL_STORAGE_KEYS.DESTINATIONS, SEED_DESTINATIONS);
      const isExistIdx = items.findIndex(item => item.id === dest.id);
      if (isExistIdx >= 0) {
        items[isExistIdx] = dest;
      } else {
        items.push(dest);
      }
      setLocalStorageData(LOCAL_STORAGE_KEYS.DESTINATIONS, items);
    }
  },

  async delete(id: string): Promise<void> {
    if (isFirebaseActive() && db) {
      try {
        await deleteDoc(doc(db, 'destinations', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `destinations/${id}`);
      }
    } else {
      let items = getLocalStorageData<Destination[]>(LOCAL_STORAGE_KEYS.DESTINATIONS, SEED_DESTINATIONS);
      items = items.filter(item => item.id !== id);
      setLocalStorageData(LOCAL_STORAGE_KEYS.DESTINATIONS, items);
    }
  }
};

// --- Package Data Services ---
export const packageService = {
  async getAll(): Promise<Package[]> {
    if (isFirebaseActive() && db) {
      try {
        const snap = await getDocs(collection(db, 'packages'));
        const list: Package[] = [];
        snap.forEach(d => list.push(d.data() as Package));

        // Auto pre-population seed trigger if database is empty
        if (list.length === 0) {
          console.log("Seeding Firestore packages collection...");
          for (const p of SEED_PACKAGES) {
            try {
              await setDoc(doc(db, 'packages', p.id), p);
            } catch (seedErr) {
              console.warn(`Skiped writing package seed ${p.id} to cloud due to permission rules (non-admin active write protection).`, seedErr);
            }
            list.push(p);
          }
        }
        return list;
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'packages');
      }
    } else {
      return getLocalStorageData<Package[]>(LOCAL_STORAGE_KEYS.PACKAGES, SEED_PACKAGES);
    }
  },

  async save(pkg: Package): Promise<void> {
    if (isFirebaseActive() && db) {
      try {
        await setDoc(doc(db, 'packages', pkg.id), pkg);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `packages/${pkg.id}`);
      }
    } else {
      const items = getLocalStorageData<Package[]>(LOCAL_STORAGE_KEYS.PACKAGES, SEED_PACKAGES);
      const isExistIdx = items.findIndex(item => item.id === pkg.id);
      if (isExistIdx >= 0) {
        items[isExistIdx] = pkg;
      } else {
        items.push(pkg);
      }
      setLocalStorageData(LOCAL_STORAGE_KEYS.PACKAGES, items);
    }
  },

  async delete(id: string): Promise<void> {
    if (isFirebaseActive() && db) {
      try {
        await deleteDoc(doc(db, 'packages', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `packages/${id}`);
      }
    } else {
      let items = getLocalStorageData<Package[]>(LOCAL_STORAGE_KEYS.PACKAGES, SEED_PACKAGES);
      items = items.filter(item => item.id !== id);
      setLocalStorageData(LOCAL_STORAGE_KEYS.PACKAGES, items);
    }
  }
};

// --- Booking Services ---
export const bookingService = {
  async create(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
    const bookingId = 'booking_' + Math.floor(Math.random() * 100000) + '_' + Date.now();
    const newBooking: Booking = {
      ...booking,
      id: bookingId,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    if (isFirebaseActive() && db) {
      try {
        await setDoc(doc(db, 'bookings', bookingId), newBooking);
        return newBooking;
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `bookings/${bookingId}`);
      }
    } else {
      const bookings = getLocalStorageData<Booking[]>(LOCAL_STORAGE_KEYS.BOOKINGS, []);
      bookings.push(newBooking);
      setLocalStorageData(LOCAL_STORAGE_KEYS.BOOKINGS, bookings);
      return newBooking;
    }
  },

  async getAll(): Promise<Booking[]> {
    if (isFirebaseActive() && db) {
      try {
        const snap = await getDocs(collection(db, 'bookings'));
        const list: Booking[] = [];
        snap.forEach(d => list.push(d.data() as Booking));
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'bookings');
      }
    } else {
      const bookings = getLocalStorageData<Booking[]>(LOCAL_STORAGE_KEYS.BOOKINGS, []);
      return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  // Get bookings for an individual client
  async getByUser(uid: string): Promise<Booking[]> {
    if (isFirebaseActive() && db) {
      try {
        const q = query(collection(db, 'bookings'), where('userId', '==', uid));
        const snap = await getDocs(q);
        const list: Booking[] = [];
        snap.forEach(d => list.push(d.data() as Booking));
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'bookings');
      }
    } else {
      const bookings = getLocalStorageData<Booking[]>(LOCAL_STORAGE_KEYS.BOOKINGS, []);
      return bookings
        .filter(b => b.userId === uid)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  async updateStatus(id: string, status: 'Pending' | 'Confirmed' | 'Cancelled'): Promise<void> {
    if (isFirebaseActive() && db) {
      try {
        await updateDoc(doc(db, 'bookings', id), { status });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${id}`);
      }
    } else {
      const bookings = getLocalStorageData<Booking[]>(LOCAL_STORAGE_KEYS.BOOKINGS, []);
      const bookingIdx = bookings.findIndex(b => b.id === id);
      if (bookingIdx >= 0) {
        bookings[bookingIdx].status = status;
        setLocalStorageData(LOCAL_STORAGE_KEYS.BOOKINGS, bookings);
      }
    }
  },

  async claimBooking(id: string, uid: string): Promise<void> {
    if (isFirebaseActive() && db) {
      try {
        await updateDoc(doc(db, 'bookings', id), { userId: uid });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${id}`);
      }
    } else {
      const bookings = getLocalStorageData<Booking[]>(LOCAL_STORAGE_KEYS.BOOKINGS, []);
      const bookingIdx = bookings.findIndex(b => b.id === id);
      if (bookingIdx >= 0) {
        bookings[bookingIdx].userId = uid;
        setLocalStorageData(LOCAL_STORAGE_KEYS.BOOKINGS, bookings);
      }
    }
  },

  async delete(id: string): Promise<void> {
    if (isFirebaseActive() && db) {
      try {
        await deleteDoc(doc(db, 'bookings', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `bookings/${id}`);
      }
    } else {
      let bookings = getLocalStorageData<Booking[]>(LOCAL_STORAGE_KEYS.BOOKINGS, []);
      bookings = bookings.filter(b => b.id !== id);
      setLocalStorageData(LOCAL_STORAGE_KEYS.BOOKINGS, bookings);
    }
  }
};

// --- App Metadata Manager ---
export const metadataService = {
  async get(): Promise<Omit<Booking, 'id'>> {
    // Return standard global contact and summary details
    return getLocalStorageData(LOCAL_STORAGE_KEYS.METADATA, SEED_METADATA) as any;
  },
  async update(meta: typeof SEED_METADATA): Promise<void> {
    setLocalStorageData(LOCAL_STORAGE_KEYS.METADATA, meta);
  }
};
