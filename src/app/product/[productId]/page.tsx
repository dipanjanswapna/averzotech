

'use client';
import { SiteHeader } from '@/components/site-header';
import type { Metadata } from 'next';
import { ProductDetails } from '@/components/product-details';
import React from 'react';


export default function ProductDetailsPage({ params }: { params: { productId: string } }) {
    return (
        <React.Suspense fallback={<div className="flex h-screen items-center justify-center">Loading product details...</div>}>
            <div className="flex min-h-screen flex-col bg-background">
                <SiteHeader />
                <ProductDetails />
            </div>
        </React.Suspense>
    )
}
