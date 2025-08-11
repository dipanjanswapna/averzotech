
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
    image: 'https://placehold.co/400x500.png',
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
    image: 'https://placehold.co/400x500.png',
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
    image: 'https://placehold.co/400x500.png',
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {items.map(item => (
                <div key={item.id} className="group block">
                    <div className="relative overflow-hidden rounded-lg bg-background shadow-sm">
                        <Link href={`/product/${item.id}`}>
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={400}
                                height={500}
                                className="h-auto w-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={item.dataAiHint}
                            />
                        </Link>
                         <Badge variant={item.availability === 'In Stock' ? "default" : "destructive"} className={`absolute top-2 left-2 ${item.availability === 'In Stock' ? 'bg-green-600/90 text-white' : 'bg-red-600/90 text-white'}`}>
                            {item.availability}
                        </Badge>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                           <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full text-xs" 
                                onClick={() => handleAddToCart(item)}
                                disabled={item.availability !== 'In Stock'}
                            >
                                <ShoppingCart className="mr-1 h-3 w-3" /> Add to Cart
                           </Button>
                           <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(item.id)} className="h-8 w-8 flex-shrink-0">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="pt-2">
                        <h3 className="text-sm font-bold text-foreground">{item.brand}</h3>
                        <p className="text-xs text-muted-foreground truncate">{item.name}</p>
                        <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-xs font-medium">{item.rating}</span>
                        </div>
                        <p className="text-sm font-semibold mt-1 text-foreground">
                            ৳{item.price}{' '}
                            <span className="text-xs text-muted-foreground line-through">৳{item.originalPrice}</span>{' '}
                            <span className="text-xs text-orange-400 font-bold">({item.discount})</span>
                        </p>
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
