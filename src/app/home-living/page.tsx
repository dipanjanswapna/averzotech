
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { doc, getDoc, collection, getDocs, where, query, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home & Living',
    description: 'Elevate your living space with our collection of home decor, bed & bath, and kitchenware. Find everything you need to make your house a home.',
    alternates: {
        canonical: '/home-living',
    },
};

interface ContentItem {
  url: string;
  alt: string;
  dataAiHint: string;
  link?: string;
  name?: string;
  discount?: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  images: string[];
  pricing: {
      price: number;
      comparePrice?: number;
      discount?: number;
  }
}

interface HomeLivingPageContent {
  heroImages: ContentItem[];
  banner: ContentItem;
  trendingProducts: { id: string }[];
  crazyDeals: ContentItem[];
  shopByCategory: ContentItem[];
}

export default function HomeLivingPage() {
    const [content, setContent] = useState<Partial<HomeLivingPageContent>>({});
    const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchHomeLivingPageContent = async () => {
            setLoading(true);
            const docRef = doc(db, 'site_content', 'home-living_page');
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data() as HomeLivingPageContent;
                setContent(data);

                if (data.trendingProducts && data.trendingProducts.length > 0) {
                    const productIds = data.trendingProducts.map(p => p.id);
                    const productsRef = collection(db, 'products');
                    const q = query(productsRef, where(documentId(), 'in', productIds));
                    const productSnap = await getDocs(q);
                    const productList = productSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                    
                    const orderedProducts = productIds.map(id => productList.find(p => p.id === id)).filter(Boolean) as Product[];
                    setTrendingProducts(orderedProducts);
                }
            }
            setLoading(false);
        };
        fetchHomeLivingPageContent();
    }, []);

    if (loading) {
        return (
             <div className="flex min-h-screen flex-col bg-background">
                <SiteHeader />
                <main className="flex-grow container py-8 space-y-12">
                    <Skeleton className="w-full h-[40vh] rounded-lg" />
                    <Skeleton className="w-full h-[20vh] rounded-lg" />
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-1/4 mx-auto" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="w-full aspect-[3/4]" />)}
                        </div>
                    </div>
                </main>
            </div>
        )
    }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow">
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-4">Home & Living</h1>
            <Carousel opts={{ loop: true }} className="mb-8">
                <CarouselContent>
                    {(content.heroImages || []).map((image, index) => (
                    <CarouselItem key={index}>
                        <Link href={image.link || '#'}>
                            <Image
                                src={image.url || 'https://placehold.co/1200x400.png'}
                                alt={image.alt || 'Home & Living Banner'}
                                width={1200}
                                height={400}
                                className="w-full h-auto rounded-lg object-cover"
                                data-ai-hint={image.dataAiHint}
                            />
                        </Link>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            </Carousel>

            {content.banner && (
                <section className="mb-12">
                     <Link href={content.banner.link || '#'}>
                        <Image
                            src={content.banner.url || 'https://placehold.co/1200x200.png'}
                            alt={content.banner.alt || 'Sale banner'}
                            width={1200}
                            height={200}
                            className="w-full h-auto rounded-lg"
                            data-ai-hint={content.banner.dataAiHint}
                        />
                    </Link>
                </section>
            )}

            {trendingProducts.length > 0 && (
                 <section className="mb-12">
                    <h2 className="text-2xl font-bold text-center mb-6">TRENDING NOW</h2>
                    <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent>
                            {trendingProducts.map((product, index) => (
                                <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                                    <Link href={`/product/${product.id}`} className="group block">
                                        <Card className="overflow-hidden group">
                                            <CardContent className="p-0">
                                            <Image
                                                src={product.images[0] || 'https://placehold.co/300x400.png'}
                                                alt={product.name}
                                                width={300}
                                                height={400}
                                                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 aspect-[4/5]"
                                                data-ai-hint={product.name.toLowerCase()}
                                            />
                                            </CardContent>
                                        </Card>
                                        <div className="pt-2">
                                            <p className="text-sm font-semibold truncate">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">{product.brand}</p>
                                            <p className="text-sm font-bold text-primary mt-1">৳{product.pricing.price}</p>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex" />
                        <CarouselNext className="hidden md:flex" />
                    </Carousel>
                </section>
            )}

            <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">CRAZY DEALS</h2>
                    <Button variant="outline" asChild>
                        <Link href="#">View All <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                     {(content.crazyDeals || []).map((deal, index) => (
                        <Link href={deal.link || '#'} key={index}>
                            <Card className="overflow-hidden group">
                                <CardContent className="p-0">
                                <Image
                                    src={deal.url || 'https://placehold.co/300x400.png'}
                                    alt={deal.name || 'Deal'}
                                    width={300}
                                    height={400}
                                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={deal.dataAiHint}
                                />
                                </CardContent>
                            </Card>
                             <div className="text-center mt-2">
                                <p className="font-semibold">{deal.name}</p>
                                <p className="text-sm text-primary font-bold">{deal.discount}</p>
                             </div>
                        </Link>
                    ))}
                </div>
            </section>
            
            <section className="bg-yellow-100/50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6" style={{color: '#535766'}}>SHOP BY CATEGORY</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                     {(content.shopByCategory || []).map((category, index) => (
                        <Link href={category.link || '#'} key={index} className="group">
                            <div className="bg-yellow-200/50 rounded-lg overflow-hidden">
                                <Image
                                    src={category.url || 'https://placehold.co/200x250.png'}
                                    alt={category.name || 'Category'}
                                    width={200}
                                    height={250}
                                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={category.dataAiHint}
                                />
                            </div>
                            <div className="text-center mt-2">
                                <p className="font-semibold text-sm">{category.name}</p>
                                <p className="text-xs text-yellow-700 font-bold">{category.discount}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

        </div>
      </main>
    </div>
  );
}
