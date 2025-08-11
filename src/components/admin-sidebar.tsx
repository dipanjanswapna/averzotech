
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Package, ShoppingCart, Settings, LogOut, ChevronRight } from 'lucide-react';
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
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const auth = getAuth(app);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
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
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-background text-foreground p-4 flex flex-col justify-between border-r">
      <div>
        <div className="px-4 mb-8">
            <Link href="/admin/dashboard">
                <Logo />
            </Link>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-secondary',
                pathname === item.href && 'bg-secondary text-primary font-semibold'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <div className="mt-auto flex items-center gap-4 cursor-pointer p-2 rounded-lg hover:bg-secondary">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.photoURL} alt={user?.fullName} />
                    <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="text-sm font-semibold">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-56">
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
    </aside>
  );
}
