'use client';

import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { VendorSidebar } from '@/components/vendor-sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user, loading } = useAuth();
  const router = useRouter();
  
   if (loading || !user || user.role !== 'vendor') {
      return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading or redirecting...</p>
        </div>
      )
  }


    return (
        <div className="flex min-h-screen">
            <VendorSidebar user={user} />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                {children}
                <Toaster />
            </main>
        </div>
    );
}
