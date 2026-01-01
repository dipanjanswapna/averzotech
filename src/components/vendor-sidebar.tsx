
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, Settings, LogOut, FileText, BarChart3, Boxes } from 'lucide-react';
import { Logo } from './logo';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useFirebase } from '@/firebase';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function VendorSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const { auth } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/');
    } catch (error) {
      console.error("Logout Error:", error);
      toast({
        title: "Logout Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { href: '/vendor/dashboard', label: 'Dashboard', icon: Home },
    { href: '/vendor/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/vendor/invoices', label: 'Invoices', icon: FileText },
    { href: '/vendor/reports', label: 'Reports', icon: BarChart3 },
  ];
  
  const productManagementItems = [
      { href: '/vendor/products', label: 'All Products', icon: Package },
      { href: '/vendor/products/stock', label: 'Stock', icon: Boxes },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className='flex items-center gap-2'>
            <Logo />
            <div className="flex-1 group-data-[state=expanded]:block hidden">
                <span className="text-lg font-bold">Vendor Panel</span>
            </div>
            <SidebarTrigger className='group-data-[state=expanded]:block hidden' />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
                <Link href={item.href}>
                    <SidebarMenuButton 
                        isActive={pathname.startsWith(item.href)}
                        tooltip={{ children: item.label }}
                    >
                        <item.icon />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          ))}
          <Accordion type="single" collapsible className="w-full group-data-[state=collapsed]:hidden" defaultValue='products'>
             <AccordionItem value="products" className="border-none">
                <AccordionTrigger className="p-2 text-sm rounded-md hover:bg-secondary hover:no-underline font-normal justify-start gap-3 text-foreground data-[state=closed]:text-foreground data-[state=open]:text-primary data-[state=open]:font-semibold">
                    <Package />
                    <span>Products</span>
                </AccordionTrigger>
                <AccordionContent className="pb-0 pl-5">
                    <SidebarMenu>
                       {productManagementItems.map((item) => (
                            <SidebarMenuItem key={item.label}>
                                <Link href={item.href}>
                                    <SidebarMenuButton 
                                        isActive={pathname === item.href}
                                        tooltip={{ children: item.label }}
                                        size="sm"
                                    >
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="hidden group-data-[state=collapsed]:block">
                 <SidebarMenuItem>
                    <Link href="/vendor/products">
                        <SidebarMenuButton 
                            isActive={pathname.startsWith('/vendor/products')}
                            tooltip={{ children: 'Products' }}
                        >
                            <Package />
                        </SidebarMenuButton>
                    </Link>
                 </SidebarMenuItem>
            </div>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-secondary">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.photoURL} alt={user?.fullName} />
                        <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 group-data-[state=expanded]:block hidden">
                        <p className="text-sm font-semibold">{user?.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56 mb-2">
                <DropdownMenuLabel>{user?.fullName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/">Back to Site</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                    <LogOut className='mr-2 h-4 w-4' />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
