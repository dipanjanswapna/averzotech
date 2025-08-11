
'use client';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { app } from '@/lib/firebase';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function AdminDashboard() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setUser({ ...firebaseUser, ...userDoc.data() });
        } else {
          // If not an admin, redirect to home
          router.push('/');
        }
      } else {
        // If not logged in, redirect to login
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-grow container py-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-lg mt-2">Welcome, {user.fullName}!</p>
            <div className="mt-8">
                {/* Admin specific content goes here */}
                <p>This is the admin-only area. Here you can manage users, products, and site settings.</p>
            </div>
        </main>
        <SiteFooter />
    </div>
  );
}
