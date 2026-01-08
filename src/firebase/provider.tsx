
'use client';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '.';
import { LoadingSpinner } from '@/components/ui/loading-spinner';


export interface AppUser {
  uid: string;
  email: string | null;
  fullName: string;
  role: 'customer' | 'vendor' | 'admin' | 'delivery';
  status: 'active' | 'pending' | 'suspended';
  photoURL?: string | null;
}

export interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
}

export const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};

export function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { app, auth, firestore: db } = initializeFirebase();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                fullName: userData.fullName || firebaseUser.displayName || 'User',
                role: userData.role || 'customer',
                status: userData.status || 'active',
                photoURL: userData.photoURL || firebaseUser.photoURL,
              });
            } else {
                 console.warn(`No user document found in Firestore for UID: ${firebaseUser.uid}. Logging out.`);
                 await auth.signOut();
                 setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user data from Firestore, signing out:", error);
            await auth.signOut().catch(e => console.error("Sign out failed after fetch error:", e));
            setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);
  
  const isAdmin = user?.role === 'admin';

  const value = { app, auth, db, user, loading, isAdmin, setUser };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <FirebaseContext.Provider value={value}>
        {children}
    </FirebaseContext.Provider>
  );
}
