

'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin-sidebar';
import { AdminSidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // A simplified user object since auth is removed
  const mockUser = {
      fullName: "Admin",
      email: "admin@averzo.com"
  }

  return (
    <AdminSidebarProvider>
      <AdminSidebar user={mockUser}/>
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-[var(--sidebar-width-icon)] group-data-[state=expanded]:lg:ml-[var(--sidebar-width)] transition-[margin-left] ease-in-out duration-300">
            {children}
            <Toaster />
        </main>
    </AdminSidebarProvider>
  );
}
