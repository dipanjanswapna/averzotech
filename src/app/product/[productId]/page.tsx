

import { SiteHeader } from '@/components/site-header';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
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

      // Fetch reviews to calculate average rating
      const reviewsRef = collection(db, 'products', params.productId, 'reviews');
      const reviewsSnap = await getDocs(reviewsRef);
      const reviews = reviewsSnap.docs.map(doc => doc.data());
      const aggregateRating = reviews.length > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
        reviewCount: reviews.length,
      } : undefined;
      
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images[0],
        description: product.description,
        brand: {
          '@type': 'Brand',
          name: product.brand,
        },
        sku: product.inventory.sku,
        offers: {
          '@type': 'Offer',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${params.productId}`,
          priceCurrency: 'BDT',
          price: product.pricing.price,
          itemCondition: 'https://schema.org/NewCondition',
          availability: product.inventory.availability === 'in-stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
        ...(aggregateRating && { aggregateRating }),
      };

      return {
        title: `${product.name} by ${product.brand} | AVERZO`,
        description: product.description,
        alternates: {
          canonical: `/product/${params.productId}`,
        },
        other: {
          'script[type="application/ld+json"]': JSON.stringify(schema),
        }
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
            </div>
        </React.Suspense>
    )
}
