
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
    id: string;
    name: string;
    images: string[];
    pricing: {
        price: number;
    };
}

interface StickyAddToCartProps {
    product: Product;
    onAddToCart: () => void;
    onBuyNow: () => void;
    isOutOfStock: boolean;
}

export function StickyAddToCart({ product, onAddToCart, onBuyNow, isOutOfStock }: StickyAddToCartProps) {
    return (
        <div className="fixed md:bottom-0 bottom-16 left-0 right-0 z-40 animate-slide-up">
            <div className="container mx-auto px-4 py-2">
                 <div className="rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="rounded-md object-cover"
                            />
                            <div className="hidden md:block">
                                <p className="font-semibold text-sm">{product.name}</p>
                                <p className="text-xs text-muted-foreground">৳{product.pricing.price}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <Button onClick={onBuyNow} variant="secondary" disabled={isOutOfStock}>
                                BUY NOW
                             </Button>
                             <Button onClick={onAddToCart} disabled={isOutOfStock}>
                                <ShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                             </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
