
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

export default function SportsPage() {
    const mainCarouselImages = [
        { src: 'https://placehold.co/1200x400.png', alt: 'Sports Gear Banner', dataAiHint: 'sports equipment' },
        { src: 'https://placehold.co/1200x400.png', alt: 'Activewear Offer Banner', dataAiHint: 'activewear sale' },
    ];

    const trendingCategories = [
        { name: "Running Shoes", src: 'https://placehold.co/300x400.png', dataAiHint: 'running shoes' },
        { name: "Jerseys & T-Shirts", src: 'https://placehold.co/300x400.png', dataAiHint: 'sports jersey' },
        { name: "Gym Equipment", src: 'https://placehold.co/300x400.png', dataAiHint: 'gym equipment' },
        { name: "Cricket Bats", src: 'https://placehold.co/300x400.png', dataAiHint: 'cricket bat' },
        { name: "Badminton Racquets", src: 'https://placehold.co/300x400.png', dataAiHint: 'badminton racquet' },
    ];

    const crazyDeals = [
        { name: 'Fitness Trackers', discount: 'MIN. 30% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'fitness tracker' },
        { name: 'Dumbbells', discount: 'MIN. 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'dumbbells' },
        { name: 'Yoga Mats', discount: 'UP TO 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'yoga mat' },
        { name: 'Sports Bags', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'gym bag' },
        { name: 'Football', discount: 'TRENDING', src: 'https://placehold.co/300x400.png', dataAiHint: 'football' },
    ];

    const shopByCategory = [
      { name: 'Cricket', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'cricket gear' },
      { name: 'Badminton', discount: 'UP TO 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'badminton equipment' },
      { name: 'Football', discount: 'UP TO 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'football boots' },
      { name: 'Running', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'running gear' },
      { name: 'Fitness & Gym', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'gym accessories' },
      { name: 'Tennis', discount: '30-60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'tennis racquet' },
      { name: 'Basketball', discount: 'UP TO 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'basketball' },
      { name: 'Swimming', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'swimming costume' },
      { name: 'Cycling', discount: 'UP TO 30% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'cycling helmet' },
      { name: 'Outdoor & Hiking', discount: 'UP TO 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'hiking boots' },
      { name: 'Skating', discount: 'UP TO 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'skates' },
      { name: 'Other Sports', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'sports equipment' },
    ];


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow">
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-4">Sports & Activewear</h1>
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
                    alt="Sports Fest Banner"
                    width={1200}
                    height={200}
                    className="w-full h-auto rounded-lg"
                    data-ai-hint="sports fest"
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
                            <div className="bg-green-200/50 rounded-lg overflow-hidden">
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
                                <p className="text-xs text-green-700 font-bold">{category.discount}</p>
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
