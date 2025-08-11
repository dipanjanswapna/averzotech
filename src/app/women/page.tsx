
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
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

export default function WomenPage() {
    const mainCarouselImages = [
        { src: 'https://placehold.co/1200x400.png', alt: 'Fashion Sale Banner', dataAiHint: 'fashion sale women' },
        { src: 'https://placehold.co/1200x400.png', alt: 'Footwear Offer Banner', dataAiHint: 'womens shoes' },
    ];

    const trendingCategories = [
        { name: "Sarees & Kurtis", src: 'https://placehold.co/300x400.png', dataAiHint: 'saree kurti' },
        { name: "Dresses", src: 'https://placehold.co/300x400.png', dataAiHint: 'woman dress' },
        { name: "Handbags", src: 'https://placehold.co/300x400.png', dataAiHint: 'handbag' },
        { name: "Heels & Flats", src: 'https://placehold.co/300x400.png', dataAiHint: 'womens heels' },
        { name: "Beauty & Makeup", src: 'https://placehold.co/300x400.png', dataAiHint: 'makeup beauty' },
    ];

    const crazyDeals = [
        { name: 'Tops & Tees', discount: 'MIN. 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'woman top' },
        { name: 'Jeans & Jeggings', discount: 'MIN. 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'woman jeans' },
        { name: 'Handbags', discount: 'MIN. 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'fashion handbag' },
        { name: 'Watches', discount: 'UP TO 80% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'woman watch' },
        { name: 'Jewellery', discount: 'TRENDING', src: 'https://placehold.co/300x400.png', dataAiHint: 'jewellery' },
    ];

    const shopByCategory = [
      { name: 'Kurtas & Suits', discount: '40-80% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'woman ethnic wear' },
      { name: 'Sarees', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'woman in saree' },
      { name: 'Dresses', discount: '50-80% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'woman wearing dress' },
      { name: 'Tops, T-Shirts & Shirts', discount: '40-60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'woman casual top' },
      { name: 'Jeans & Jeggings', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'woman wearing jeans' },
      { name: 'Handbags & Clutches', discount: '30-60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'fashion handbag' },
      { name: 'Heels & Flats', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'womens footwear' },
      { name: 'Watches', discount: 'UP TO 80% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'womens watch' },
      { name: 'Beauty & Grooming', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'cosmetics' },
      { name: 'Fashion Jewellery', discount: '40-70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'fashion jewellery' },
      { name: 'Lingerie & Sleepwear', discount: 'UP TO 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'lingerie' },
      { name: 'Sunglasses & Frames', discount: 'UP TO 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'sunglasses fashion' },
    ];


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow">
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-4">Women's Fashion</h1>
            <Carousel opts={{ loop: true }} className="mb-8">
                <CarouselContent>
                    {mainCarouselImages.map((image, index) => (
                    <CarouselItem key={index}>
                        <Link href="#">
                            <Image
                                src={image.src}
                                alt={image.alt}
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

            <section className="mb-12">
                <Image
                    src="https://placehold.co/1200x200.png"
                    alt="Parade of Savings Banner"
                    width={1200}
                    height={200}
                    className="w-full h-auto rounded-lg"
                    data-ai-hint="fashion sale banner"
                />
            </section>

             <section className="mb-12">
                <h2 className="text-2xl font-bold text-center mb-6">TRENDING NOW</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {trendingCategories.map((category) => (
                        <Link href="#" key={category.name}>
                            <Card className="overflow-hidden group">
                                <CardContent className="p-0">
                                <Image
                                    src={category.src}
                                    alt={category.name}
                                    width={300}
                                    height={400}
                                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={category.dataAiHint}
                                />
                                </CardContent>
                            </Card>
                            <p className="text-center font-semibold mt-2">{category.name}</p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">CRAZY DEALS</h2>
                    <Button variant="outline" asChild>
                        <Link href="#">View All <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                     {crazyDeals.map((deal) => (
                        <Link href="#" key={deal.name}>
                            <Card className="overflow-hidden group">
                                <CardContent className="p-0">
                                <Image
                                    src={deal.src}
                                    alt={deal.name}
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
            
            <section className="bg-pink-100/50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6" style={{color: '#535766'}}>SHOP BY CATEGORY</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                     {shopByCategory.map((category) => (
                        <Link href="#" key={category.name} className="group">
                            <div className="bg-pink-200/50 rounded-lg overflow-hidden">
                                <Image
                                    src={category.src}
                                    alt={category.name}
                                    width={200}
                                    height={250}
                                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={category.dataAiHint}
                                />
                            </div>
                            <div className="text-center mt-2">
                                <p className="font-semibold text-sm">{category.name}</p>
                                <p className="text-xs text-pink-700 font-bold">{category.discount}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
