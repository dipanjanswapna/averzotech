

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Metadata } from 'next';
import { ProductDetails } from '@/components/product-details';
import React from 'react';


export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
  try {
    const productRef = doc(db, 'products', params.productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      const product = productSnap.data();
      return {
        title: `${product.name} by ${product.brand} | AVERZO`,
        description: product.description,
      };
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

  return {
    title: 'Product Not Found | AVERZO',
  };
}

export default function ProductDetailsPage() {
    return (
        <React.Suspense fallback={<div className="flex h-screen items-center justify-center">Loading product details...</div>}>
            <div className="flex min-h-screen flex-col bg-background">
                <SiteHeader />
                <ProductDetails />
                <SiteFooter />
            </div>
        </React.Suspense>
    )
}
