'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    // This code runs only on the client
    const { app, auth, firestore } = initializeFirebase();
    setInstances({ app, auth, db: firestore });
  }, []);

  if (!instances) {
    // You can return a loader here if you want
    return null; 
  }

  return (
    <FirebaseProvider app={instances.app} auth={instances.auth} db={instances.db}>
      {children}
    </FirebaseProvider>
  );
}
