'use client';

import Link from 'next/link';
import { Menu, Search, ShoppingCart, User, Heart, LogOut } from 'lucide-react';
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


interface AppUser {
    uid: string;
    email: string | null;
    fullName: string;
    role: 'customer' | 'vendor';
    photoURL?: string | null;
}

export function SiteHeader() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                fullName: userData.fullName,
                role: userData.role,
                photoURL: firebaseUser.photoURL,
            });
        } else {
             setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                fullName: firebaseUser.displayName || 'User',
                role: 'customer',
                photoURL: firebaseUser.photoURL,
            });
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

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
                     <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.photoURL || ''} alt={user?.fullName || ''} />
                            <AvatarFallback>{user ? user.fullName.charAt(0) : <User className='h-5 w-5' />}</AvatarFallback>
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
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Orders</DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/wishlist">Wishlist</Link>
                            </DropdownMenuItem>
                            {user.role === 'vendor' && <DropdownMenuItem>Dashboard</DropdownMenuItem>}
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

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                           <Link href="/" className="self-start mb-8" onClick={() => setIsSheetOpen(false)}>
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
                           <Link href="/shop" className="font-semibold text-base py-2.5" onClick={() => setIsSheetOpen(false)}>Shop</Link>
                          {categories.map((category) => (
                             <MegaMenu key={category.name} category={category} isMobile={true} />
                          ))}
                        </div>
                    </ScrollArea>
                     <div className="mt-auto flex flex-col gap-2 p-6 border-t">
                        {user ? (
                           <>
                             <p className='text-sm font-semibold'>{user.fullName}</p>
                             <Button variant="outline" asChild onClick={() => setIsSheetOpen(false)}><Link href="/wishlist">Wishlist</Link></Button>
                             <Button variant="destructive" onClick={() => { handleLogout(); setIsSheetOpen(false); }}>Logout</Button>
                           </>
                        ) : (
                           <>
                             <Button variant="outline" asChild onClick={() => setIsSheetOpen(false)}><Link href="/login">Login</Link></Button>
                             <Button asChild onClick={() => setIsSheetOpen(false)}><Link href="/register">Sign Up</Link></Button>
                           </>
                        )}
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
               <Link href="/shop" className="hover:text-primary">Shop</Link>
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
                  <Link href="/shop" className="block hover:text-primary">Shop</Link>
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