

import { SiteHeader } from '@/components/site-header';
import { doc, getDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
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

export default async function ProductDetailsPage({ params }: { params: { productId: string } }) {
    let initialProductData = null;
    let error = null;

    try {
        const productRef = doc(db, 'products', params.productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
            initialProductData = { id: productSnap.id, ...productSnap.data() };

            const productsRef = collection(db, "products");
            const q = query(productsRef, where('organization.category', '==', initialProductData.organization.category), limit(10));
            const comparableSnap = await getDocs(q);
            const comparableList = comparableSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter((p: any) => p.id !== params.productId);
            initialProductData.comparableProducts = comparableList;
        } else {
            error = 'Product not found.';
        }
    } catch (e) {
        console.error("Failed to fetch initial product data:", e);
        error = 'Failed to load product details.';
    }
    

    return (
        <React.Suspense fallback={<div className="flex h-screen items-center justify-center">Loading product details...</div>}>
            <div className="flex min-h-screen flex-col bg-background">
                <SiteHeader />
                <ProductDetails 
                  initialProductData={initialProductData} 
                  error={error} 
                />
            </div>
        </React.Suspense>
    )
}

