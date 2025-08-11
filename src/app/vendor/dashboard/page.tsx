
'use client';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { app } from '@/lib/firebase';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function VendorDashboard() {
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
        if (userDoc.exists() && userDoc.data().role === 'vendor') {
          setUser({ ...firebaseUser, ...userDoc.data() });
        } else {
          // If not a vendor, redirect to home
           toast({
                title: "Access Denied",
                description: "You do not have permission to view this page.",
                variant: "destructive",
            });
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
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-grow container py-8">
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <p className="text-lg mt-2">Welcome, {user.fullName}!</p>
            <div className="mt-8">
                {/* Vendor specific content goes here */}
                <p>This is the vendor-only area. Here you can manage your products, view orders, and check your sales analytics.</p>
            </div>
        </main>
        <SiteFooter />
    </div>
  );
}
