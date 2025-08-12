
'use client';

import Link from 'next/link';
import { Menu, Search, ShoppingCart, User, Heart, LogOut, MoreVertical } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { Separator } from './ui/separator';


interface AppUser {
    uid: string;
    email: string | null;
    fullName: string;
    role: 'customer' | 'vendor' | 'admin';
    photoURL?: string | null;
}

export function SiteHeader() {
  const { user, loading } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
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

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'vendor':
        return '/vendor/dashboard';
      default:
        return '/profile';
    }
  }

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
    {
      name: 'Electronics',
      href: '/electronics',
      description: 'Get the latest gadgets.',
      subCategories: [
        {
          group: 'Mobiles & Wearables',
          items: ['Smartphones', 'Smartwatches', 'Headphones', 'Speakers'],
        },
        {
          group: 'Laptops & Computers',
          items: ['Laptops', 'Desktops', 'Monitors', 'Keyboards', 'Mouse'],
        },
        {
          group: 'Cameras & Drones',
          items: ['DSLRs', 'Mirrorless Cameras', 'Drones', 'Action Cameras'],
        },
      ],
    },
    {
      name: 'Sports',
      href: '/sports',
      description: 'Gear up for your favorite sports.',
      subCategories: [
        {
          group: 'Cricket',
          items: ['Bats', 'Balls', 'Pads', 'Gloves'],
        },
        {
          group: 'Football',
          items: ['Footballs', 'Jerseys', 'Boots', 'Shin Guards'],
        },
        {
          group: 'Fitness',
          items: ['Dumbbells', 'Yoga Mats', 'Resistance Bands', 'Trackers'],
        },
      ],
    },
    {
      name: 'Books',
      href: '/books',
      description: 'Explore a world of stories.',
      subCategories: [
        {
          group: 'Fiction',
          items: ['Mystery', 'Thriller', 'Sci-Fi', 'Fantasy', 'Romance'],
        },
        {
          group: 'Non-Fiction',
          items: ['Biography', 'History', 'Self-Help', 'Business'],
        },
        {
          group: "Children's Books",
          items: ['Picture Books', 'Story Books', 'Young Adult'],
        },
      ],
    },
  ];

  const dashboardLink = getDashboardLink();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">

        {/* Mobile Header */}
        <div className="md:hidden flex flex-1 items-center justify-between gap-4">
            <Link href="/">
              <Logo />
            </Link>
             <div className="flex-1 flex justify-center">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search..." className="h-9 pl-9" />
                </div>
            </div>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] flex flex-col">
                    <SheetHeader>
                         {user ? (
                            <div className="flex items-center gap-3">
                                 <Avatar className="h-12 w-12">
                                    <AvatarImage src={user.photoURL || ''} alt={user.fullName} />
                                    <AvatarFallback>{user.fullName?.[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">{user.fullName}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                         ) : (
                            <SheetTitle>Welcome Guest</SheetTitle>
                         )}
                    </SheetHeader>
                    <Separator className="my-4" />
                    <ScrollArea className="flex-1 -mx-6">
                      <div className="px-6">
                        <nav className="flex flex-col space-y-2">
                          {user ? (
                            <>
                                <Link href="/profile" className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary" onClick={() => setIsSheetOpen(false)}><User className="mr-2 h-5 w-5" />Profile</Link>
                                <Link href="/wishlist" className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary" onClick={() => setIsSheetOpen(false)}><Heart className="mr-2 h-5 w-5" />Wishlist</Link>
                                <Link href="/cart" className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary" onClick={() => setIsSheetOpen(false)}><ShoppingCart className="mr-2 h-5 w-5" />Cart</Link>
                                <Separator className="my-2" />
                                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-500" onClick={() => {handleLogout(); setIsSheetOpen(false);}}>
                                    <LogOut className="mr-2 h-5 w-5" /> Logout
                                </Button>
                            </>
                          ) : (
                            <>
                              <Button asChild onClick={() => setIsSheetOpen(false)}><Link href="/login">Login</Link></Button>
                              <Button variant="outline" asChild onClick={() => setIsSheetOpen(false)}><Link href="/register">Sign Up</Link></Button>
                            </>
                          )}
                        </nav>
                        <Separator className="my-4" />
                        <div className="flex flex-col space-y-1">
                          {categories.map((category) => (
                            <MegaMenu key={category.name} category={category} isMobile={true} />
                          ))}
                        </div>
                      </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>


        {/* Desktop Header */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-md border border-input p-1 pl-3 flex-1 sm:flex-none">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="h-auto w-full sm:w-48 border-none bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0" />
            </div>

            <div className="flex items-center gap-2">
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
                     <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.photoURL || ''} alt={user?.fullName || ''} />
                            <AvatarFallback>{user ? user.fullName.charAt(0).toUpperCase() : <User className='h-5 w-5' />}</AvatarFallback>
                        </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user ? (
                        <>
                            <DropdownMenuLabel>
                                <p className='font-bold'>{user.fullName}</p>
                                <p className='text-xs text-muted-foreground font-normal'>{user.email}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/profile/orders">Orders</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/wishlist">Wishlist</Link>
                            </DropdownMenuItem>
                            {dashboardLink && (user.role !== 'customer') && (
                              <DropdownMenuItem asChild>
                                <Link href={dashboardLink}>Dashboard</Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                                <LogOut className='mr-2 h-4 w-4' />
                                Logout
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href="/login">Login</Link>
                            </DropdownMenuItem>
                             <DropdownMenuItem asChild>
                              <Link href="/register">Sign Up</Link>
                            </DropdownMenuItem>
                        </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
       <div className="h-10 items-center border-t flex">
          <div className="container">
            <ScrollArea className="md:hidden -mx-4">
              <nav className="flex items-center gap-6 text-sm font-medium px-4">
                 {categories.map((category) => (
                    <Link key={category.name} href={category.href} className="hover:text-primary py-2 flex-shrink-0">{category.name}</Link>
                ))}
              </nav>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {categories.map((category) => (
                <MegaMenu key={category.name} category={category} />
              ))}
            </nav>
          </div>
       </div>
    </header>
  );
}
