
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Package, ShoppingCart, Settings, LogOut, Megaphone, TicketPercent, Gift, LayoutDashboard, Shirt, PersonStanding, ToyBrick, Armchair, Sparkles, Laptop, Trophy, BookOpen, MessageSquare } from 'lucide-react';
import { Logo } from './logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
    { href: '/admin/coupons', label: 'Coupons', icon: TicketPercent },
    { href: '/admin/gift-cards', label: 'Gift Cards', icon: Gift },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const siteManagementItems = [
      { href: '/admin/site-management/home', label: 'Home Page', icon: Home },
      { href: '/admin/site-management/popup', label: 'Promotional Popup', icon: MessageSquare },
      { href: '/admin/site-management/men', label: 'Men Page', icon: Shirt },
      { href: '/admin/site-management/women', label: 'Women Page', icon: PersonStanding },
      { href: '/admin/site-management/kids', label: 'Kids Page', icon: ToyBrick },
      { href: '/admin/site-management/home-living', label: 'Home & Living Page', icon: Armchair },
      { href: '/admin/site-management/beauty', label: 'Beauty Page', icon: Sparkles },
      { href: '/admin/site-management/electronics', label: 'Electronics Page', icon: Laptop },
      { href: '/admin/site-management/sports', label: 'Sports Page', icon: Trophy },
      { href: '/admin/site-management/books', label: 'Books Page', icon: BookOpen },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className='flex items-center gap-2'>
            <Logo />
            <div className="flex-1 group-data-[collapsible=icon]:hidden">
                <span className="text-lg font-bold">Admin</span>
            </div>
            <SidebarTrigger className='group-data-[collapsible=icon]:hidden' />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
                <Link href={item.href}>
                    <SidebarMenuButton 
                        isActive={pathname.startsWith(item.href) && (item.href !== '/admin/dashboard' && item.href !== '/admin/settings') ? true : pathname === item.href}
                        tooltip={{ children: item.label }}
                    >
                        <item.icon />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          ))}
           <Accordion type="single" collapsible defaultValue="site-management" className="w-full group-data-[collapsible=icon]:hidden">
            <AccordionItem value="site-management" className="border-none">
                <AccordionTrigger className="p-2 text-sm rounded-md hover:bg-secondary hover:no-underline font-normal justify-start gap-3 text-foreground data-[state=closed]:text-foreground data-[state=open]:text-primary data-[state=open]:font-semibold">
                    <LayoutDashboard />
                    <span>Site Management</span>
                </AccordionTrigger>
                <AccordionContent className="pb-0 pl-5">
                    <SidebarMenu>
                       {siteManagementItems.map((item) => (
                            <SidebarMenuItem key={item.label}>
                                <Link href={item.href}>
                                    <SidebarMenuButton 
                                        isActive={pathname.startsWith(item.href)}
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
           <div className="hidden group-data-[collapsible=icon]:block">
                 <SidebarMenuItem>
                    <Link href="/admin/site-management/home">
                        <SidebarMenuButton 
                            isActive={pathname.startsWith('/admin/site-management')}
                            tooltip={{ children: 'Site Management' }}
                        >
                            <LayoutDashboard />
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
                    <div className="flex-1 group-data-[collapsible=icon]:hidden">
                        <p className="text-sm font-semibold">{user?.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56 mb-2">
                <DropdownMenuLabel>{user?.fullName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href="/">Back to Site</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 focus:text-red-500">
                    <LogOut className='mr-2 h-4 w-4' />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
