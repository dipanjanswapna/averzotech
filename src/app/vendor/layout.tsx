
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { VendorSidebar } from '@/components/vendor-sidebar';
import { useAuth } from '@/hooks/use-auth';

function VendorLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'vendor') {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'vendor') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Loading Vendor Dashboard...</p>
      </div>
    );
  }

  return (
    <AdminSidebarProvider>
      <VendorSidebar user={user} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-[var(--sidebar-width-icon)] group-data-[state=expanded]:lg:ml-[var(--sidebar-width)] transition-[margin-left] ease-in-out duration-300">
        {children}
        <Toaster />
      </main>
    </AdminSidebarProvider>
  );
}

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return <VendorLayoutContent>{children}</VendorLayoutContent>;
}
