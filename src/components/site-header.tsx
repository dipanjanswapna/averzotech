
"use client";

import Link from 'next/link';
import { Menu, Search, ShoppingCart, User, Heart } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';
import { Input } from './ui/input';
import { MegaMenu } from './mega-menu';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

export function SiteHeader() {
  const categories = [
    { 
      name: 'Men',
      href: '/men',
      description: 'Find the latest trends for men.',
      subCategories: [
        {
          group: 'Topwear',
          items: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Sweatshirts', 'Jackets']
        },
        {
          group: 'Bottomwear',
          items: ['Jeans', 'Casual Trousers', 'Formal Trousers', 'Shorts', 'Track Pants']
        },
        {
          group: 'Footwear',
          items: ['Casual Shoes', 'Sports Shoes', 'Formal Shoes', 'Sneakers', 'Sandals']
        },
        {
          group: 'Accessories',
          items: ['Watches', 'Wallets', 'Belts', 'Sunglasses', 'Bags']
        }
      ]
    },
    { 
      name: 'Women', 
      href: '/women',
      description: 'Shop stylish apparel for women.', 
      subCategories: [
        {
          group: 'Indian & Fusion Wear',
          items: ['Kurtas & Suits', 'Sarees', 'Lehengas', 'Ethnic Gowns']
        },
        {
          group: 'Western Wear',
          items: ['Dresses', 'Tops', 'T-Shirts', 'Jeans', 'Skirts']
        },
        {
          group: 'Footwear',
          items: ['Flats', 'Heels', 'Boots', 'Sports Shoes']
        },
        {
          group: 'Jewellery & Accessories',
          items: ['Earrings', 'Necklaces', 'Handbags', 'Watches']
        }
      ]
    },
    { 
      name: 'Kids',
      href: '/kids', 
      description: 'Adorable outfits for the little ones.', 
      subCategories: [
         {
          group: 'Boys Clothing',
          items: ['T-Shirts', 'Shirts', 'Jeans', 'Shorts']
        },
        {
          group: 'Girls Clothing',
          items: ['Dresses', 'Tops', 'Skirts', 'T-shirts']
        },
        {
          group: 'Infants',
          items: ['Rompers', 'Bodysuits', 'Sleepwear']
        },
        {
          group: 'Toys & Games',
          items: ['Action Figures', 'Dolls', 'Board Games', 'Puzzles']
        }
      ] 
    },
    { 
      name: 'Home & Living', 
      href: '/home-living',
      description: 'Decorate your space with style.', 
      subCategories: [
        {
          group: 'Bed & Bath',
          items: ['Bedsheets', 'Pillows', 'Towels', 'Bathrobes']
        },
        {
          group: 'Decor',
          items: ['Vases', 'Photo Frames', 'Wall Art', 'Candles']
        },
        {
          group: 'Kitchen & Dining',
          items: ['Dinnerware', 'Cookware', 'Storage', 'Cutlery']
        }
      ] 
    },
    { 
      name: 'Beauty', 
      href: '/beauty',
      description: 'Discover your new favorite products.', 
      subCategories: [
        {
          group: 'Makeup',
          items: ['Lipstick', 'Foundation', 'Mascara', 'Eyeshadow']
        },
        {
          group: 'Skincare',
          items: ['Moisturizer', 'Cleanser', 'Sunscreen', 'Face Masks']
        },
        {
          group: 'Fragrance',
          items: ['Perfumes', 'Deodorants', 'Body Mists']
        },
        {
          group: 'Haircare',
          items: ['Shampoo', 'Conditioner', 'Hair Oil', 'Styling Tools']
        }
      ] 
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-md border border-input p-1 pl-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="h-auto w-48 border-none bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0" />
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Wishlist</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Cart</span>
                </Link>
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
                    <DropdownMenuItem>
                      <Link href="/wishlist">Wishlist</Link>
                    </DropdownMenuItem>
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
                <SheetContent side="left" className="w-[300px] p-0">
                  <nav className="flex h-full flex-col">
                    <SheetHeader className="p-6 pb-0">
                        <SheetTitle>
                           <Link href="/" className="self-start mb-8">
                              <Logo />
                           </Link>
                        </SheetTitle>
                        <div className="mb-6">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Search..." className="pl-9" />
                          </div>
                        </div>
                    </SheetHeader>
                    <ScrollArea className="flex-1 px-6">
                        <div className="flex flex-col space-y-2 py-4">
                          {categories.map((category) => (
                             <MegaMenu key={category.name} category={category} isMobile={true} />
                          ))}
                        </div>
                    </ScrollArea>
                    <div className="mt-auto flex flex-col gap-2 p-6 border-t">
                       <Button variant="outline" asChild><Link href="/wishlist">Wishlist</Link></Button>
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
       <div className="hidden md:flex h-10 items-center border-t">
          <div className="container">
            <nav className="flex items-center gap-6 text-sm font-medium">
              {categories.map((category) => (
                <MegaMenu key={category.name} category={category} />
              ))}
            </nav>
          </div>
       </div>
       <div className="md:hidden border-t">
          <ScrollArea className="w-full whitespace-nowrap">
             <div className="container flex h-10 items-center -px-4">
                 <nav className="flex items-center gap-6 text-sm font-medium px-4">
                  {categories.map((category) => (
                    <Link key={category.name} href={category.href} className="block hover:text-primary">{category.name}</Link>
                  ))}
                </nav>
             </div>
             <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
       </div>
    </header>
  );
}
