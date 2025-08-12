
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, User, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: LayoutGrid },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
];

export function MobileBottomNav() {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const { user } = useAuth();

    const accountHref = user ? '/profile' : '/login';

    const allNavItems = [...navItems, { href: accountHref, label: 'Account', icon: User }];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
            <div className="grid h-full grid-cols-4">
                {allNavItems.map(item => {
                    const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
                    
                    return (
                        <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center text-center">
                            <div className="relative">
                                {item.href === accountHref && user ? (
                                     <Avatar className="h-6 w-6">
                                        <AvatarImage src={user.photoURL || ''} alt={user.fullName} />
                                        <AvatarFallback>{user.fullName?.[0]}</AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <item.icon className={cn("h-6 w-6", isActive ? 'text-primary' : 'text-muted-foreground')} />
                                )}
                                {item.href === '/cart' && cartCount > 0 && (
                                    <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className={cn("text-xs mt-1", isActive ? 'text-primary font-semibold' : 'text-muted-foreground')}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
