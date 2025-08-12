'use client';

import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/hooks/use-cart';
import { WishlistProvider } from '@/hooks/use-wishlist';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { PromotionalPopup } from '@/components/promotional-popup';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
        <WishlistProvider>
            <PromotionalPopup />
            <div className="pb-16 md:pb-0">
            {children}
            </div>
            <MobileBottomNav />
            <Toaster />
        </WishlistProvider>
        </CartProvider>
    );
}