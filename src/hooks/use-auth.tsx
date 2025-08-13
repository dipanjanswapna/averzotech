
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  fullName: string;
  role: 'customer' | 'vendor' | 'admin';
  status: 'active' | 'pending' | 'suspended';
  photoURL?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Optimistically set a basic user object from Firebase Auth
        const basicUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: firebaseUser.displayName || 'User',
            role: 'customer', // default role
            status: 'active', // default status
            photoURL: firebaseUser.photoURL,
        };
        setUser(basicUser);

        try {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              // Set the full user object with Firestore data
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                fullName: userData.fullName || firebaseUser.displayName || 'User',
                role: userData.role || 'customer',
                status: userData.status || 'active',
                photoURL: userData.photoURL || firebaseUser.photoURL,
              });
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

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
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
