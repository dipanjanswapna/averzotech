
"use client"

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingCart, Star, Home } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";

const initialWishlistItems = [
  {
    id: '89073456',
    name: 'Women Black Slim Fit Solid Tights',
    brand: 'SASSAFRAS',
    size: '28',
    color: 'Black',
    price: 750,
    originalPrice: 1500,
    discount: '50% OFF',
    rating: 4.3,
    image: 'https://placehold.co/200x250.png',
    dataAiHint: 'black tights fashion',
    availability: 'In Stock',
  },
  {
    id: '12345678',
    name: 'Slim Fit Jeans',
    brand: 'H&M',
    size: '32',
    color: 'Blue',
    price: 1800,
    originalPrice: 3600,
    discount: '50% OFF',
    rating: 4.8,
    image: 'https://placehold.co/200x250.png',
    dataAiHint: 'blue jeans style',
    availability: 'In Stock',
  },
  {
    id: '23456789',
    name: 'Floral Print Dress',
    brand: 'Zara',
    size: 'M',
    color: 'Red',
    price: 3000,
    originalPrice: 6000,
    discount: '50% OFF',
    rating: 4.5,
    image: 'https://placehold.co/200x250.png',
    dataAiHint: 'floral dress summer',
    availability: 'Out of Stock',
  }
];

export default function WishlistPage() {
  const [items, setItems] = React.useState(initialWishlistItems);
  const { toast } = useToast();

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your wishlist.",
    });
  };

  const handleAddToCart = (item: typeof initialWishlistItems[0]) => {
     if (item.availability !== 'In Stock') {
        toast({
            title: "Out of Stock",
            description: "This item is currently unavailable.",
            variant: "destructive"
        });
        return;
    }
    // Here you would typically add the item to the cart state/context
    console.log(`Added ${item.name} to cart`);
    toast({
      title: "Added to Cart",
      description: `${item.name} has been successfully added to your cart.`,
    });
  };
  
  const handleClearWishlist = () => {
    setItems([]);
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
            <h1 className="text-3xl font-headline font-bold mb-1">My Wishlist</h1>
            <p className="text-muted-foreground">You have {items.length} item(s) in your wishlist.</p>
        </div>

        {items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map(item => (
                <div key={item.id} className="bg-background rounded-lg border shadow-sm overflow-hidden group">
                  <div className="relative">
                    <Link href={`/product/${item.id}`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={300}
                        height={375}
                        className="w-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={item.dataAiHint}
                      />
                    </Link>
                    <Badge variant={item.availability === 'In Stock' ? "default" : "destructive"} className={`absolute top-2 left-2 ${item.availability === 'In Stock' ? 'bg-green-600/90 text-white' : 'bg-red-600/90 text-white'}`}>
                        {item.availability}
                    </Badge>
                     <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="absolute top-2 right-2 bg-white/70 hover:bg-white rounded-full">
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1 truncate">{item.brand}</h3>
                    <p className="text-muted-foreground text-xs mb-2 truncate">{item.name}</p>
                    <div className="flex items-center mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-xs font-medium">{item.rating}</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <p className="font-bold text-lg">৳{item.price}</p>
                        <p className="text-sm line-through text-muted-foreground">৳{item.originalPrice}</p>
                        <p className="text-sm text-orange-500 font-bold">{item.discount}</p>
                    </div>
                     <Button 
                        className="w-full" 
                        onClick={() => handleAddToCart(item)}
                        disabled={item.availability !== 'In Stock'}
                     >
                        <ShoppingCart className="mr-2 h-4 w-4"/>
                        Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
             <div className="flex justify-end mt-8">
                <Button variant="destructive" onClick={handleClearWishlist}>
                    Clear Wishlist
                </Button>
            </div>
          </>
        ) : (
            <div className="text-center py-24 bg-background rounded-lg border border-dashed">
                <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your wishlist yet. <br/>Start exploring and add products you love!</p>
                <Button asChild>
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" /> Start Shopping
                    </Link>
                </Button>
            </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
