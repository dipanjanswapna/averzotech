import Link from 'next/link';
import { Menu, Search, ShoppingCart, Truck, ChevronRight, ChevronDown } from 'lucide-react';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';

export function SiteHeader() {
  const categories = [
    { 
      name: 'Stationery',
      description: 'View all products in the stationery category.',
      subCategories: ['New Group', 'kkkkkkkkkkkkkkkk', 'kkkkklllll', 'iiiiiiiiii']
    },
    { name: 'Electronics', description: 'Gadgets and gizmos.', subCategories: ['Phones', 'Laptops', 'Tablets'] },
    { name: 'Apparel', description: 'Clothing for all seasons.', subCategories: ['T-shirts', 'Jeans', 'Jackets'] },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-primary text-primary-foreground">
              <nav className="flex h-full flex-col p-6">
                <Link href="/" className="mb-8">
                  <Logo />
                </Link>
                <div className="flex flex-col space-y-4">
                  {categories.map((category) => (
                     <DropdownMenu key={category.name}>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" className="justify-between">
                              <span>{category.name}</span>
                              <ChevronDown className="h-4 w-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" sideOffset={10}>
                           <DropdownMenuLabel className="flex items-center gap-4">
                             <Logo />
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
                                  {sub === 'New Group' && <ChevronRight className="ml-auto h-4 w-4" />}
                                </DropdownMenuItem>
                              ))}
                           </DropdownMenuGroup>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  ))}
                </div>
              </nav>
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
            <Button variant="ghost" className="text-sm font-medium">
              My Orders
            </Button>
            <Button variant="ghost" size="icon">
              <Truck className="h-5 w-5" />
              <span className="sr-only">Shipping</span>
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40.png" alt="User profile" data-ai-hint="man portrait" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      {/* Secondary Nav */}
      <div className="hidden md:flex bg-secondary text-secondary-foreground border-t border-b border-border">
          <div className="container flex items-center h-12">
            <nav className="flex items-center gap-2">
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
              {categories.map((category, index) => (
                <DropdownMenu key={category.name}>
                  <DropdownMenuTrigger asChild>
                    <Button variant={index === 0 ? "accent" : "ghost"} className="gap-2">
                      <span>{category.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" sideOffset={10}>
                     <DropdownMenuLabel className="flex items-start gap-4 p-2">
                        <Logo className="h-10 w-10 mt-1" />
                        <div>
                           <p className="font-bold text-base">{category.name}</p>
                           <p className="text-xs font-normal text-muted-foreground">{category.description}</p>
                        </div>
                     </DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuGroup>
                        {category.subCategories.map((sub) => (
                          <DropdownMenuItem key={sub}>
                            <div className="flex justify-between w-full items-center">
                              <span>{sub}</span>
                              {sub === 'New Group' && <span className="text-pink-500 text-xs">New Group &rarr;</span>}
                            </div>
                          </DropdownMenuItem>
                        ))}
                     </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </nav>
          </div>
      </div>
    </header>
  );
}
