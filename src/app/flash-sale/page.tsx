
'use client';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import React from 'react';

const flashSaleItems = [
    {
      id: 'fs-1',
      brand: 'Fastrack',
      name: 'Analog Watch',
      price: 1250,
      originalPrice: 2500,
      discount: '50% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'analog watch',
      stock: 100,
      sold: 67,
    },
    {
      id: 'fs-2',
      brand: 'Boat',
      name: 'Wireless Earbuds',
      price: 1500,
      originalPrice: 3000,
      discount: '50% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'wireless earbuds',
      stock: 50,
      sold: 15,
    },
    {
      id: 'fs-3',
      brand: 'Wildcraft',
      name: 'Travel Backpack',
      price: 999,
      originalPrice: 1999,
      discount: '50% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'travel backpack',
      stock: 75,
      sold: 50,
    },
    {
      id: 'fs-4',
      brand: 'Ray-Ban',
      name: 'Classic Aviators',
      price: 4500,
      originalPrice: 9000,
      discount: '50% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'aviator sunglasses',
      stock: 30,
      sold: 28,
    },
     {
      id: 'fs-5',
      brand: 'Gucci',
      name: 'Leather Belt',
      price: 8000,
      originalPrice: 16000,
      discount: '50% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'leather belt',
      stock: 20,
      sold: 5,
    },
    {
      id: 'fs-6',
      brand: 'Samsung',
      name: 'Galaxy Watch 5',
      price: 15000,
      originalPrice: 30000,
      discount: '50% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'smartwatch android',
      stock: 40,
      sold: 10,
    },
      {
      id: 'fs-7',
      brand: 'Sony',
      name: 'WH-1000XM5 Headphones',
      price: 25000,
      originalPrice: 35000,
      discount: '28% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'wireless headphones',
      stock: 25,
      sold: 10,
    },
    {
      id: 'fs-8',
      brand: 'Apple',
      name: 'AirPods Pro 2',
      price: 22000,
      originalPrice: 28000,
      discount: '21% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'apple airpods',
      stock: 60,
      sold: 45,
    },
];

// Set flash sale end time to 24 hours from now
const flashSaleEndTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);


export default function FlashSalePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-8">
        <section className="bg-primary/5 p-6 rounded-lg mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-6">
                <div className='text-center md:text-left'>
                    <h1 className="font-headline text-3xl font-bold uppercase tracking-wider md:text-5xl text-foreground">
                        Flash Sale!
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">Hurry, these deals won't last long!</p>
                </div>
                <FlashSaleTimer endTime={flashSaleEndTime} />
            </div>
        </section>

        {/* Filters and Sorting placeholder */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 p-4 border rounded-lg bg-secondary/50">
            <h3 className="text-lg font-semibold">All Flash Sale Items ({flashSaleItems.length})</h3>
            <div className="flex items-center gap-4">
                 {/* TODO: Add filtering and sorting controls here */}
                 <Button variant="outline">Filter</Button>
                 <Button variant="outline">Sort By</Button>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
            {flashSaleItems.map((deal) => (
                <Link href={`/product/${deal.id}`} key={deal.id} className="group block border p-2 rounded-lg hover:shadow-lg transition-shadow duration-300">
                    <div className="relative overflow-hidden rounded-lg">
                        <Image
                            src={deal.src}
                            alt={deal.name}
                            width={400}
                            height={500}
                            className="h-auto w-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={deal.dataAiHint}
                        />
                         <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button variant="secondary" size="sm" className="w-full text-xs">
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                    <div className="pt-2 px-1">
                        <h3 className="text-sm font-bold text-foreground">{deal.brand}</h3>
                        <p className="text-xs text-muted-foreground truncate">{deal.name}</p>
                        <p className="text-sm font-semibold mt-1 text-foreground">
                            ৳{deal.price}{' '}
                            <span className="text-xs text-muted-foreground line-through">৳{deal.originalPrice}</span>{' '}
                            <span className="text-xs text-orange-400 font-bold">({deal.discount})</span>
                        </p>
                        <div className='mt-2'>
                            <Progress value={(deal.sold / deal.stock) * 100} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">{deal.sold} of {deal.stock} sold</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
        
        <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}


function FlashSaleTimer({ endTime }: { endTime: Date }) {
    const [timeLeft, setTimeLeft] = React.useState({ hours: 0, minutes: 0, seconds: 0 });

    React.useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +endTime - +new Date();
            let timeLeft = { hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                timeLeft = {
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }
            return timeLeft;
        }

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Set initial time
        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, [endTime]);

    const formatTime = (time: number) => time.toString().padStart(2, '0');

    return (
        <div className="flex items-center gap-2 text-center">
            <Clock className="w-10 h-10 text-primary" />
            <div>
                 <p className="text-sm text-muted-foreground uppercase">Ending in</p>
                 <div className="flex items-center gap-2 font-mono text-2xl md:text-3xl font-bold text-foreground">
                    <div className="flex flex-col items-center">
                        <span className="p-2 bg-secondary rounded-md min-w-[48px]">{formatTime(timeLeft.hours)}</span>
                    </div>
                    <span className="text-2xl">:</span>
                    <div className="flex flex-col items-center">
                         <span className="p-2 bg-secondary rounded-md min-w-[48px]">{formatTime(timeLeft.minutes)}</span>
                    </div>
                     <span className="text-2xl">:</span>
                     <div className="flex flex-col items-center">
                         <span className="p-2 bg-secondary rounded-md min-w-[48px]">{formatTime(timeLeft.seconds)}</span>
                    </div>
                 </div>
            </div>
        </div>
    );
}