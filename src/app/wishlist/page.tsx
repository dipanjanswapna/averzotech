
"use client"

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, Home } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { useToast } from "@/hooks/use-toast";
import { useWishlist, WishlistItem } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/hooks/use-cart';
import { StockIndicator } from '@/components/stock-indicator';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();
  const { toast } = useToast();

  const handleRemoveItem = (id: string) => {
    removeFromWishlist(id);
    toast({
      title: "Item Removed",
      description: "The item has been removed from your wishlist.",
    });
  };

  const handleAddToCart = (item: WishlistItem) => {
     if (item.inventory?.availability !== 'in-stock') {
        toast({
            title: "Out of Stock",
            description: "This item is currently unavailable.",
            variant: "destructive"
        });
        return;
    }
    // A real app would need to handle variant selection (size, color)
    const productToAdd: Omit<Product, 'quantity'> = {
        ...item,
        selectedSize: item.variants?.sizes?.[0] || 'M', // Default or fetch available
        selectedColor: item.variants?.colors?.[0]?.name || 'Default', // Default or fetch available
    };

    addToCart(productToAdd as any);
    setIsCartOpen(true);
  };
  
  const handleClearWishlist = () => {
    clearWishlist();
  };

  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
            <h1 className="text-3xl font-headline font-bold mb-1">My Wishlist</h1>
            <p className="text-muted-foreground">You have {wishlist.length} item(s) in your wishlist.</p>
        </div>

        {wishlist.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {wishlist.map(item => (
                <div key={item.id} className="group block">
                    <div className="relative overflow-hidden rounded-lg bg-background shadow-sm border">
                        <Link href={`/product/${item.id}`}>
                            <Image
                                src={item.images[0] || 'https://placehold.co/400x500.png'}
                                alt={item.name}
                                width={400}
                                height={500}
                                className="h-auto w-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={item.dataAiHint || 'product image'}
                            />
                        </Link>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent flex justify-end">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white" onClick={() => handleRemoveItem(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </div>
                    <div className="pt-2 px-1">
                        <h3 className="text-sm font-bold text-foreground truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{item.brand}</p>
                         <div className="mt-2">
                             <StockIndicator 
                                stock={item.inventory.stock} 
                                initialStock={item.inventory.initialStock}
                                availability={item.inventory.availability}
                            />
                         </div>
                        <p className="text-sm font-semibold mt-1 text-foreground">
                            ৳{item.pricing.price}{' '}
                            {item.pricing.comparePrice && <span className="text-xs text-muted-foreground line-through">৳{item.pricing.comparePrice}</span> }
                        </p>
                        <Button 
                           variant="outline" 
                           size="sm" 
                           className="w-full mt-2"
                           onClick={() => handleAddToCart(item)}
                           disabled={item.inventory?.availability !== 'in-stock'}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" /> Move to Cart
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
    </div>
  );
}
