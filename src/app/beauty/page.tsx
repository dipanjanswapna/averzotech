
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

export default function BeautyPage() {
    const mainCarouselImages = [
        { src: 'https://placehold.co/1200x400.png', alt: 'Makeup Sale Banner', dataAiHint: 'makeup sale' },
        { src: 'https://placehold.co/1200x400.png', alt: 'Skincare Offer Banner', dataAiHint: 'skincare products' },
    ];

    const trendingCategories = [
        { name: "Lipsticks", src: 'https://placehold.co/300x400.png', dataAiHint: 'lipstick collection' },
        { name: "Moisturizers", src: 'https://placehold.co/300x400.png', dataAiHint: 'face moisturizer' },
        { name: "Perfumes", src: 'https://placehold.co/300x400.png', dataAiHint: 'perfume bottle' },
        { name: "Sunscreens", src: 'https://placehold.co/300x400.png', dataAiHint: 'sunscreen' },
        { name: "Shampoos", src: 'https://placehold.co/300x400.png', dataAiHint: 'shampoo bottle' },
    ];

    const crazyDeals = [
        { name: 'Makeup Kits', discount: 'MIN. 30% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'makeup kit' },
        { name: 'Skincare Combos', discount: 'MIN. 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'skincare set' },
        { name: 'Luxury Perfumes', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'luxury perfume' },
        { name: 'Haircare', discount: 'UP TO 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'haircare products' },
        { name: 'Grooming Tools', discount: 'TRENDING', src: 'https://placehold.co/300x400.png', dataAiHint: 'grooming tools' },
    ];

    const shopByCategory = [
      { name: 'Makeup', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'makeup products' },
      { name: 'Skincare', discount: 'UP TO 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'skincare routine' },
      { name: 'Premium Beauty', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'luxury cosmetics' },
      { name: 'Lipsticks', discount: '40-60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'lipstick shades' },
      { name: 'Fragrances', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'perfumes' },
      { name: "Men's Grooming", discount: '30-60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'men grooming kit' },
      { name: 'Haircare', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'hair products' },
      { name: 'Tools & Appliances', discount: 'UP TO 80% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'hair dryer' },
      { name: 'Bath & Body', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'body lotion' },
      { name: 'Natural Skincare', discount: '40-70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'natural skincare' },
      { name: 'K-Beauty', discount: 'UP TO 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'korean beauty products' },
      { name: 'Gift Sets', discount: 'UP TO 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'beauty gift set' },
    ];


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow">
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-4">Beauty & Personal Care</h1>
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
                    alt="Grand Beauty Sale Banner"
                    width={1200}
                    height={200}
                    className="w-full h-auto rounded-lg"
                    data-ai-hint="beauty sale banner"
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
            
            <section className="bg-red-100/50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6" style={{color: '#535766'}}>SHOP BY CATEGORY</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                     {shopByCategory.map((category) => (
                        <Link href="#" key={category.name} className="group">
                            <div className="bg-red-200/50 rounded-lg overflow-hidden">
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
                                <p className="text-xs text-red-700 font-bold">{category.discount}</p>
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
