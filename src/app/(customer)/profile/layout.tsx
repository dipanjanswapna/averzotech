
'use client';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Home, Menu, ShoppingCart, Heart, User, LogOut, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

function ProfileLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }
  
  return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar user={user} />
        <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                <MobileSidebar user={user} />
                 <div className="w-full flex-1">
                   {/* Add search or other header elements here if needed */}
                </div>
                 <Button variant="ghost" size="icon" className="rounded-full" asChild>
                    <Link href="/wishlist">
                        <Heart className="h-5 w-5" />
                        <span className="sr-only">Wishlist</span>
                    </Link>
                 </Button>
                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                    <Link href="/cart">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="sr-only">Cart</span>
                    </Link>
                 </Button>
            </header>
            <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
  );
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileLayoutContent>{children}</ProfileLayoutContent>
}

const navItems = [
    { href: '/profile/orders', label: 'My Orders', icon: ShoppingCart },
    { href: '/profile', label: 'My Profile', icon: User },
    { href: '/profile/addresses', label: 'Addresses', icon: MapPin },
    { href: '/wishlist', label: 'Wishlist', icon: Heart },
]

function Sidebar({ user }: { user: any }) {
    const pathname = usePathname();
    const auth = getAuth(app);
    const { toast } = useToast();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        toast({ title: "Logged Out" });
        router.push('/');
    };

    return (
         <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Home className="h-6 w-6" />
                <span>AVERZO</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {navItems.map(item => (
                     <Link
                        key={item.label}
                        href={item.href}
                        className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", {
                            "bg-muted text-primary": pathname === item.href
                        })}
                        >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto p-4 border-t">
               <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={user.photoURL} />
                        <AvatarFallback>{user.fullName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                 <Button variant="ghost" className="w-full justify-start mt-4 text-red-500 hover:text-red-500" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
            </div>
          </div>
        </div>
    )
}

function MobileSidebar({ user }: { user: any }) {
     const pathname = usePathname();
    return (
         <Sheet>
            <SheetTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
                <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
                >
                <Home className="h-6 w-6" />
                <span className="sr-only">AVERZO</span>
                </Link>
                 {navItems.map(item => (
                     <Link
                        key={item.label}
                        href={item.href}
                        className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", {
                            "bg-muted text-foreground": pathname === item.href
                        })}
                        >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>
            </SheetContent>
        </Sheet>
    )
}
