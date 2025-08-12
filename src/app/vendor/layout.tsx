
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { VendorSidebar } from '@/components/vendor-sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';


export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'vendor') {
        router.push('/login');
      } else if (user.status !== 'active') {
          toast({
              title: "Approval Pending",
              description: "Your vendor account has not been approved yet.",
              variant: "destructive",
          });
          router.push('/');
      }
    }
  }, [user, loading, router, toast]);


  if (loading || !user || user.status !== 'active') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Loading Vendor Dashboard...</p>
      </div>
    );
  }

  return (
    <AdminSidebarProvider>
      <VendorSidebar user={user}/>
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-[var(--sidebar-width-icon)] group-data-[state=expanded]:lg:ml-[var(--sidebar-width)] transition-[margin-left] ease-in-out duration-300">
            {children}
            <Toaster />
        </main>
    </AdminSidebarProvider>
  );
}
