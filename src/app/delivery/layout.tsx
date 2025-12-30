
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signOut } from 'firebase/auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DeliverySidebar } from '@/components/delivery-sidebar';

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, app } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    if (loading) {
      return; 
    }

    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'delivery' && user.role !== 'admin') {
      toast({
          title: "Access Denied",
          description: "You do not have permission to access this page.",
          variant: "destructive",
      });
      router.push('/');
      return;
    }
    
    if (user.role === 'delivery' && user.status !== 'active') {
        const auth = getAuth(app!);
        signOut(auth).then(() => {
           toast({
              title: "Account Not Active",
              description: "Your delivery account is not active. You have been logged out.",
              variant: "destructive",
              duration: 5000,
           });
           router.push('/login');
        });
    }
  }, [user, loading, router, toast, app]);


  if (loading || !user || (user.role !== 'delivery' && user.role !== 'admin')) {
    return <LoadingSpinner />;
  }

  return (
    <AdminSidebarProvider>
      <DeliverySidebar user={user}/>
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-[var(--sidebar-width-icon)] group-data-[state=expanded]:lg:ml-[var(--sidebar-width)] transition-[margin-left] ease-in-out duration-300">
            {children}
            <Toaster />
        </main>
    </AdminSidebarProvider>
  );
}
