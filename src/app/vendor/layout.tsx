
'use client';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { app } from '@/lib/firebase';
import { AdminSidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { VendorSidebar } from '@/components/vendor-sidebar';
import { useAuth } from '@/hooks/use-auth';


export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'vendor') {
        router.push('/login');
      }
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Loading Vendor Dashboard...</p>
      </div>
    );
  }

  return (
    <AdminSidebarProvider>
      <VendorSidebar user={user}/>
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-[--sidebar-width-icon] group-data-[collapsible=icon]:lg:ml-[var(--sidebar-width)] transition-[margin-left] ease-in-out duration-300">
            {children}
            <Toaster />
        </main>
    </AdminSidebarProvider>
  );
}
