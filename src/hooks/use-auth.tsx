
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export interface AppUser {
  uid: string;
  email: string | null;
  fullName: string;
  role: 'admin' | 'vendor' | 'customer';
  photoURL?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userDocRef = doc(db, "users", fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
                uid: fbUser.uid,
                email: fbUser.email,
                fullName: userData.fullName || 'User',
                role: userData.role || 'customer',
                photoURL: fbUser.photoURL,
            });
        } else {
            // This might happen for a new user who signed up but the doc wasn't created yet, or a login where doc is missing.
            // Create a default user object.
             const newUser: AppUser = {
                uid: fbUser.uid,
                email: fbUser.email,
                fullName: fbUser.displayName || 'New User',
                role: 'customer',
                photoURL: fbUser.photoURL,
            };
            setUser(newUser);
        }

      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, setUser }}>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
            <div className="space-y-4 text-center">
                <p className="text-lg font-semibold">Loading Averzo...</p>
                <Skeleton className="h-4 w-[250px] mx-auto" />
                <Skeleton className="h-4 w-[200px] mx-auto" />
            </div>
        </div>
      ) : children}
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
