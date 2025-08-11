
'use client';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { app } from '@/lib/firebase';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Toaster } from '@/components/ui/toaster';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setUser({ ...firebaseUser, ...userDoc.data() });
        } else {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="flex min-h-screen bg-secondary/50">
      <AdminSidebar user={user}/>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {children}
         <Toaster />
      </main>
    </div>
  );
}
