"use client";

import Link from 'next/link';
import { Menu, Search, ShoppingCart, User, Heart, ChevronDown } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';
import { Input } from './ui/input';

export function SiteHeader() {
  const categories = [
    { 
      name: 'Men',
      href: '/men',
      description: 'Find the latest trends for men.',
      subCategories: ['T-shirts', 'Jeans', 'Jackets', 'Shoes']
    },
    { 
      name: 'Women', 
      href: '/women',
      description: 'Shop stylish apparel for women.', 
      subCategories: ['Dresses', 'Tops', 'Skirts', 'Handbags'] 
    },
    { 
      name: 'Kids',
      href: '/kids', 
      description: 'Adorable outfits for the little ones.', 
      subCategories: ['Boys', 'Girls', 'Infants', 'Toys'] 
    },
    { 
      name: 'Home & Living', 
      href: '/home-living',
      description: 'Decorate your space with style.', 
      subCategories: ['Furniture', 'Decor', 'Bedding', 'Kitchen'] 
    },
    { 
      name: 'Beauty', 
      href: '/beauty',
      description: 'Discover your new favorite products.', 
      subCategories: ['Makeup', 'Skincare', 'Fragrance', 'Haircare'] 
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
             {categories.map((category) => (
                <NavMenuItem key={category.name} category={category} />
              ))}
          </nav>


          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-md border border-input p-1 pl-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="h-auto w-48 border-none bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0" />
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                      <span className="sr-only">User Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Orders</DropdownMenuItem>
                    <DropdownMenuItem>Wishlist</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/register">Sign Up</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <nav className="flex h-full flex-col p-6">
                    <Link href="/" className="mb-8">
                      <Logo />
                    </Link>
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search..." className="pl-9" />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {categories.map((category) => (
                         <DropdownMenu key={category.name}>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" className="justify-between w-full">
                                  <Link href={category.href} className='flex-1 text-left'>{category.name}</Link>
                                  <ChevronDown className="h-4 w-4" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" sideOffset={10}>
                               <DropdownMenuLabel className="flex items-center gap-2">
                                  <div>
                                     <p className="font-bold">{category.name}</p>
                                     <p className="text-xs font-normal text-muted-foreground">{category.description}</p>
                                  </div>
                               </DropdownMenuLabel>
                               <DropdownMenuSeparator />
                               <DropdownMenuGroup>
                                  {category.subCategories.map((sub) => (
                                    <DropdownMenuItem key={sub}>
                                      <span>{sub}</span>
                                    </DropdownMenuItem>
                                  ))}
                               </DropdownMenuGroup>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      ))}
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <Button variant="outline" asChild><Link href="/login">Login</Link></Button>
                      <Button asChild><Link href="/register">Sign Up</Link></Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


function NavMenuItem({ category }: { category: any }) {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleOpen = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setOpen(true);
  };

  const handleClose = () => {
    timerRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild onMouseEnter={handleOpen} onMouseLeave={handleClose}>
        <Button variant="ghost" className="p-0" asChild>
          <Link href={category.href}>
            {category.name}
          </Link>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64" 
        sideOffset={10} 
        onMouseEnter={handleOpen} 
        onMouseLeave={handleClose}
      >
        <DropdownMenuLabel className="flex items-start gap-4 p-2">
          <div className="mt-1">
            <Logo />
          </div>
          <div>
            <p className="font-bold text-base">{category.name}</p>
            <p className="text-xs font-normal text-muted-foreground">{category.description}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {category.subCategories.map((sub: string) => (
            <DropdownMenuItem key={sub}>
              <span>{sub}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
