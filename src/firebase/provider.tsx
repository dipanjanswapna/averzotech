
'use client';
import { Auth, getAuth } from 'firebase/auth';
import { createContext, useContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

export interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

export const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  firestore: null,
});

export const useFirebase = () => useContext(FirebaseContext);

export const useFirebaseApp = () => {
  const { app } = useFirebase();
  return app;
};

export const useFirestore = () => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useAuth = () => {
  const { auth } = useFirebase();
  return auth;
};

export function FirebaseProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
} & FirebaseContextValue) {
  return (
    <FirebaseContext.Provider value={props}>{children}</FirebaseContext.Provider>
  );
}
