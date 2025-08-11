
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

export default function ElectronicsPage() {
    const mainCarouselImages = [
        { src: 'https://placehold.co/1200x400.png', alt: 'Latest Gadgets Banner', dataAiHint: 'latest gadgets' },
        { src: 'https://placehold.co/1200x400.png', alt: 'Smart Home Offer Banner', dataAiHint: 'smart home devices' },
    ];

    const trendingCategories = [
        { name: "Smartphones", src: 'https://placehold.co/300x400.png', dataAiHint: 'smartphones' },
        { name: "Laptops", src: 'https://placehold.co/300x400.png', dataAiHint: 'laptops' },
        { name: "Headphones", src: 'https://placehold.co/300x400.png', dataAiHint: 'headphones' },
        { name: "Smartwatches", src: 'https://placehold.co/300x400.png', dataAiHint: 'smartwatches' },
        { name: "Cameras", src: 'https://placehold.co/300x400.png', dataAiHint: 'cameras' },
    ];

    const crazyDeals = [
        { name: 'Power Banks', discount: 'MIN. 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'power bank' },
        { name: 'Bluetooth Speakers', discount: 'MIN. 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'bluetooth speaker' },
        { name: 'Gaming Mouse', discount: 'UP TO 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'gaming mouse' },
        { name: 'Televisions', discount: 'UP TO 30% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'television' },
        { name: 'Tablets', discount: 'TRENDING', src: 'https://placehold.co/300x400.png', dataAiHint: 'tablet' },
    ];

    const shopByCategory = [
      { name: 'Mobiles & Tablets', discount: 'UP TO 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'mobile phone' },
      { name: 'Laptops & Computers', discount: 'UP TO 30% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'laptop' },
      { name: 'Televisions', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'smart tv' },
      { name: 'Headphones & Earphones', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'wireless headphones' },
      { name: 'Cameras', discount: 'UP TO 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'dslr camera' },
      { name: 'Gaming', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'gaming console' },
      { name: 'Smart Home', discount: 'UP TO 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'smart speaker' },
      { name: 'Computer Accessories', discount: 'UP TO 80% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'keyboard mouse' },
      { name: 'Home Appliances', discount: 'UP TO 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'refrigerator' },
      { name: 'Storage Devices', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'external hard drive' },
      { name: 'Personal Care Appliances', discount: 'UP TO 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'electric shaver' },
      { name: 'Wearable Technology', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'fitness tracker' },
    ];


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow">
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-4">Electronics</h1>
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
                    alt="Tech Fest Banner"
                    width={1200}
                    height={200}
                    className="w-full h-auto rounded-lg"
                    data-ai-hint="electronics sale banner"
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
            
            <section className="bg-gray-100/50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6" style={{color: '#535766'}}>SHOP BY CATEGORY</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                     {shopByCategory.map((category) => (
                        <Link href="#" key={category.name} className="group">
                            <div className="bg-gray-200/50 rounded-lg overflow-hidden">
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
                                <p className="text-xs text-gray-700 font-bold">{category.discount}</p>
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
