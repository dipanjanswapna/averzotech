
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { VendorSidebar } from '@/components/vendor-sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);
  
  useEffect(() => {
    if (loading) {
      return; // Wait until auth state is confirmed
    }

    if (!user) {
      // Not logged in, redirect to login
      router.push('/login');
      return;
    }
    
    if (user.role !== 'vendor') {
      // Not a vendor, redirect to home
      toast({
          title: "Access Denied",
          description: "You do not have permission to access the vendor dashboard.",
          variant: "destructive",
      });
      router.push('/');
      return;
    }
    
    if (user.status !== 'active') {
        // Vendor is not active, sign them out and show message
        signOut(auth).then(() => {
           toast({
              title: "Approval Pending",
              description: "Your vendor account has not been approved yet. You have been logged out.",
              variant: "destructive",
              duration: 5000,
           });
           router.push('/login');
        });
    }
  }, [user, loading, router, toast, auth]);


  if (loading || !user || user.role !== 'vendor' || user.status !== 'active') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Verifying vendor access...</p>
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
