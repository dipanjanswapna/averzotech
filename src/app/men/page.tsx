
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

export default function MenPage() {
    const mainCarouselImages = [
        { src: 'https://placehold.co/1200x400.png', alt: 'Fashion Sale Banner', dataAiHint: 'fashion sale men' },
        { src: 'https://placehold.co/1200x400.png', alt: 'Footwear Offer Banner', dataAiHint: 'mens shoes' },
    ];

    const trendingCategories = [
        { name: "Men's Jeans", src: 'https://placehold.co/300x400.png', dataAiHint: 'men jeans' },
        { name: "Casual Shirts", src: 'https://placehold.co/300x400.png', dataAiHint: 'men casual shirt' },
        { name: "Activewear", src: 'https://placehold.co/300x400.png', dataAiHint: 'men activewear' },
        { name: "Sports Shoes", src: 'https://placehold.co/300x400.png', dataAiHint: 'men sport shoes' },
        { name: "Personal Care", src: 'https://placehold.co/300x400.png', dataAiHint: 'men grooming' },
    ];

    const crazyDeals = [
        { name: 'Innerwear', discount: 'MIN. 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'men innerwear' },
        { name: 'T-Shirts', discount: 'MIN. 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'men t-shirt' },
        { name: 'Formal Shirts', discount: 'MIN. 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'men formal shirt' },
        { name: 'Watches', discount: 'UP TO 80% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'men watch' },
        { name: 'Accessories', discount: 'TRENDING', src: 'https://placehold.co/300x400.png', dataAiHint: 'men accessories' },
    ];

    const shopByCategory = [
      { name: 'T-Shirts', discount: '40-80% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'man wearing t-shirt' },
      { name: 'Shirts', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'man wearing shirt' },
      { name: 'Jeans', discount: '50-80% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'man wearing jeans' },
      { name: 'Shorts & Trousers', discount: '40-60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'man wearing shorts' },
      { name: 'Ethnic Wear', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'man ethnic wear' },
      { name: 'Casual Shoes', discount: '30-60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'men casual shoes' },
      { name: 'Sports Shoes', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'men sport shoes' },
      { name: 'Watches', discount: 'UP TO 80% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'wristwatch' },
      { name: 'Grooming', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'men grooming kit' },
      { name: 'Accessories', discount: '40-70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'men belt wallet' },
      { name: 'Innerwear', discount: 'UP TO 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'men innerwear' },
      { name: 'Personal Care', discount: 'UP TO 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'men perfume' },
    ];


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow">
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-4">Men's Fashion</h1>
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
            
            <section className="bg-green-100/50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6" style={{color: '#535766'}}>SHOP BY CATEGORY</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                     {shopByCategory.map((category) => (
                        <Link href="#" key={category.name} className="group">
                            <div className="bg-purple-200/50 rounded-lg overflow-hidden">
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
                                <p className="text-xs text-purple-700 font-bold">{category.discount}</p>
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
