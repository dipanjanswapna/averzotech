'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading || !user || user.role !== 'admin') {
      return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading or redirecting...</p>
        </div>
      )
  }

  return (
      <div className="flex min-h-screen">
        <AdminSidebar user={user}/>
        <main className="flex-1 p-4 sm:p-6 md:p-8">
            {children}
            <Toaster />
        </main>
      </div>
  );
}
