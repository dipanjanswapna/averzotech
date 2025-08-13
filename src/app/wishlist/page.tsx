
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
import { useWishlist, WishlistItem } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';
import { Product } from '@/hooks/use-cart';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
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
        shipping: item.shipping || { estimatedDelivery: '3-5 days' }, // Default or fetch
        inventory: item.inventory || { sku: 'DEFAULT-SKU', availability: 'in-stock' }
    };

    addToCart(productToAdd as any);
    toast({
      title: "Added to Cart",
      description: `${item.name} has been successfully added to your cart.`,
    });
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
                    <div className="relative overflow-hidden rounded-lg bg-background shadow-sm">
                        <Link href={`/product/${item.id}`}>
                            <Image
                                src={item.images[0] || 'https://placehold.co/400x500.png'}
                                alt={item.name}
                                width={400}
                                height={500}
                                className="h-auto w-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint="product image"
                            />
                        </Link>
                         <Badge variant={item.inventory?.availability === 'in-stock' ? "default" : "destructive"} className={`absolute top-2 left-2 ${item.inventory?.availability === 'in-stock' ? 'bg-green-600/90 text-white' : 'bg-red-600/90 text-white'}`}>
                            {item.inventory?.availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                           <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full text-xs" 
                                onClick={() => handleAddToCart(item)}
                                disabled={item.inventory?.availability !== 'in-stock'}
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
                        <p className="text-sm font-semibold mt-1 text-foreground">
                            ৳{item.pricing.price}{' '}
                            {item.pricing.comparePrice && <span className="text-xs text-muted-foreground line-through">৳{item.pricing.comparePrice}</span> }
                            {item.pricing.discount && <span className="text-xs text-orange-400 font-bold">({item.pricing.discount}% OFF)</span>}
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
