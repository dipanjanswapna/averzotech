
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebar } from '@/components/admin-sidebar';
import { AdminSidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/use-auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AdminSidebarProvider>
      <AdminSidebar user={user}/>
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-[var(--sidebar-width-icon)] group-data-[state=expanded]:lg:ml-[var(--sidebar-width)] transition-[margin-left] ease-in-out duration-300">
            {children}
            <Toaster />
        </main>
    </AdminSidebarProvider>
  );
}
