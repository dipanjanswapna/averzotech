import Link from 'next/link';
import { Menu, Search, ShoppingBag, Heart, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function SiteHeader() {
  const navItems = [
    { name: 'Men', href: '#' },
    { name: 'Women', href: '#' },
    { name: 'Kids', href: '#' },
    { name: 'Home & Living', href: '#' },
    { name: 'Beauty', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center">
            <h1 className="font-headline text-2xl font-bold text-primary">averzo</h1>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-bold uppercase tracking-wide text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <nav className="flex h-full flex-col p-6">
                        <Link href="/" className="mb-8">
                            <h1 className="font-headline text-3xl font-bold text-primary">averzo</h1>
                        </Link>
                        <div className="flex flex-col space-y-6">
                            {navItems.map((item) => (
                                <Link key={item.name} href={item.href} className="text-lg font-bold uppercase tracking-wide text-foreground/80 transition-colors hover:text-primary">
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>
            <Link href="/" className="ml-4 md:hidden">
              <h1 className="font-headline text-xl font-bold text-primary">averzo</h1>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden w-full flex-1 sm:max-w-xs lg:block">
            <form>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full rounded-md bg-secondary pl-9"
                />
              </div>
            </form>
          </div>
          <nav className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Bag</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
