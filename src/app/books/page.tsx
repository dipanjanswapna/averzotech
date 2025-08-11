
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

export default function BooksPage() {
    const mainCarouselImages = [
        { src: 'https://placehold.co/1200x400.png', alt: 'Bestsellers Banner', dataAiHint: 'bestselling books' },
        { src: 'https://placehold.co/1200x400.png', alt: 'New Arrivals Banner', dataAiHint: 'new books' },
    ];

    const trendingCategories = [
        { name: "Fiction", src: 'https://placehold.co/300x400.png', dataAiHint: 'fiction books' },
        { name: "Non-Fiction", src: 'https://placehold.co/300x400.png', dataAiHint: 'non-fiction books' },
        { name: "Children's Books", src: 'https://placehold.co/300x400.png', dataAiHint: 'childrens books' },
        { name: "Self-Help", src: 'https://placehold.co/300x400.png', dataAiHint: 'self-help books' },
        { name: "Biographies", src: 'https://placehold.co/300x400.png', dataAiHint: 'biography books' },
    ];

    const crazyDeals = [
        { name: 'Classic Novels', discount: 'MIN. 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'classic book' },
        { name: 'Business & Economics', discount: 'MIN. 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'business book' },
        { name: 'Fantasy', discount: 'UP TO 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'fantasy book' },
        { name: 'Comics & Mangas', discount: 'UP TO 30% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'manga book' },
        { name: 'Thrillers', discount: 'TRENDING', src: 'https://placehold.co/300x400.png', dataAiHint: 'thriller book' },
    ];

    const shopByCategory = [
      { name: 'Fiction', discount: '40-80% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'fantasy novel' },
      { name: 'Non-Fiction', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'history book' },
      { name: 'Biographies', discount: '50-80% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'autobiography' },
      { name: 'Self-Help', discount: '40-60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'motivational book' },
      { name: 'Children & Teens', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'kids story book' },
      { name: 'Business & Management', discount: '30-60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'management book' },
      { name: 'Sci-Fi', discount: 'UP TO 70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'science fiction book' },
      { name: 'Comics & Manga', discount: 'UP TO 50% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'comic book' },
      { name: 'Textbooks', discount: 'UP TO 30% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'school textbook' },
      { name: 'Cookbooks', discount: '40-70% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'cookbook' },
      { name: 'Poetry', discount: 'UP TO 60% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'poetry book' },
      { name: 'Travel', discount: 'UP TO 40% OFF', src: 'https://placehold.co/300x400.png', dataAiHint: 'travel guide' },
    ];


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow">
        <div className="container py-8 pt-16">
            <h1 className="text-2xl font-bold mb-4">Books</h1>
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
                    alt="Book Fair Banner"
                    width={1200}
                    height={200}
                    className="w-full h-auto rounded-lg"
                    data-ai-hint="book fair"
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
            
            <section className="bg-orange-100/50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6" style={{color: '#535766'}}>SHOP BY CATEGORY</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                     {shopByCategory.map((category) => (
                        <Link href="#" key={category.name} className="group">
                            <div className="bg-orange-200/50 rounded-lg overflow-hidden">
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
                                <p className="text-xs text-orange-700 font-bold">{category.discount}</p>
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
