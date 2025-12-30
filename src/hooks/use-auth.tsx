
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, getAuth, Auth } from 'firebase/auth';
import { doc, getDoc, getFirestore, Firestore } from 'firebase/firestore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useFirebase } from '@/firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  fullName: string;
  role: 'customer' | 'vendor' | 'admin' | 'delivery';
  status: 'active' | 'pending' | 'suspended';
  photoURL?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { app, auth, firestore } = useFirebase();

  useEffect(() => {
    if (!app || !auth || !firestore) {
        // Firebase services are not available yet.
        // The loading state is true by default, so we just wait.
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
            const userDocRef = doc(firestore, "users", firebaseUser.uid);
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
  }, [app, auth, firestore]);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, setUser }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
