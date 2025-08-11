
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Heart, Clock } from 'lucide-react';
import React from 'react';
import { Progress } from '@/components/ui/progress';

export default function Home() {
  const heroImages = [
    { src: 'https://placehold.co/800x450.png', alt: 'Fashion sale banner', dataAiHint: 'fashion sale' },
    { src: 'https://placehold.co/800x450.png', alt: 'New arrivals banner', dataAiHint: 'new arrivals' },
    { src: 'https://placehold.co/800x450.png', alt: 'Ethnic wear banner', dataAiHint: 'ethnic wear' },
  ];

  const brands = [
    { src: 'https://placehold.co/200x200.png', alt: 'Brand 1', dataAiHint: 'fashion logo' },
    { src: 'https://placehold.co/200x200.png', alt: 'Brand 2', dataAiHint: 'clothing brand' },
    { src: 'https://placehold.co/200x200.png', alt: 'Brand 3', dataAiHint: 'luxury logo' },
    { src: 'https://placehold.co/200x200.png', alt: 'Brand 4', dataAiHint: 'shoe brand' },
    { src: 'https://placehold.co/200x200.png', alt: 'Brand 5', dataAiHint: 'watch brand' },
    { src: 'https://placehold.co/200x200.png', alt: 'Brand 6', dataAiHint: 'cosmetics logo' },
    { src: 'https://placehold.co/200x200.png', alt: 'Brand 7', dataAiHint: 'sports brand' },
    { src: 'https://placehold.co/200x200.png', alt: 'Brand 8', dataAiHint: 'eyewear logo' },
    { src: 'https://placehold.co/200x200.png', alt: 'Brand 9', dataAiHint: 'handbag brand' },
    { src: 'https://placehold.co/200x200.png', alt: 'Brand 10', dataAiHint: 'jewelry logo' },
  ];

  const categories = [
    { name: 'T-Shirts', src: 'https://placehold.co/400x500.png', dataAiHint: 'man wearing t-shirt', discount: '40-80% OFF' },
    { name: 'Sports Shoes', src: 'https://placehold.co/400x500.png', dataAiHint: 'stylish shoes', discount: '40-80% OFF' },
    { name: 'Shirts', src: 'https://placehold.co/400x500.png', dataAiHint: 'man wearing shirt', discount: '40-80% OFF' },
    { name: 'Jeans', src: 'https://placehold.co/400x500.png', dataAiHint: 'woman wearing jeans', discount: '40-80% OFF' },
    { name: 'Kurtas & Sets', src: 'https://placehold.co/400x500.png', dataAiHint: 'ethnic wear', discount: '50-80% OFF' },
    { name: 'Trousers', src: 'https://placehold.co/400x500.png', dataAiHint: 'man wearing trousers', discount: '40-80% OFF' },
  ];

  const deals = [
    {
      id: '89073456',
      brand: 'Tokyo Talkies',
      name: 'Women Cropped Shirt',
      size: 'S',
      price: '750',
      originalPrice: '1500',
      discount: '50% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'woman white shirt'
    },
    {
      id: '12345678',
      brand: 'H&M',
      name: 'Slim Fit Jeans',
      size: '32',
      price: '1800',
      originalPrice: '3600',
      discount: '50% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'blue jeans'
    },
    {
      id: '23456789',
      brand: 'Zara',
      name: 'Floral Print Dress',
      size: 'M',
      price: '3000',
      originalPrice: '6000',
      discount: '50% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'summer dress'
    },
    {
      id: '34567890',
      brand: 'Nike',
      name: 'Air Max Sneakers',
      size: '9',
      price: '8295',
      originalPrice: '10295',
      discount: '20% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'running shoes'
    },
    {
      id: '45678901',
      brand: 'Levis',
      name: '511 Slim Fit Jeans',
      size: '34',
      price: '2500',
      originalPrice: '4000',
      discount: '37.5% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'dark jeans'
    },
    {
      id: '56789012',
      brand: 'Puma',
      name: 'Running Shoes',
      size: '10',
      price: '2499',
      originalPrice: '4999',
      discount: '50% OFF',
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'athletic shoes'
    },
  ];

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
  ];

  // Set flash sale end time to 24 hours from now
  const flashSaleEndTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow">
        <section className="relative w-full">
          <Carousel
            className="w-full"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {heroImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[40vh] md:h-[calc(100vh-80px)]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      data-ai-hint={image.dataAiHint}
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
          </Carousel>
        </section>

        <section className="bg-primary/5 py-8 md:py-16">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
                    <div className='text-center md:text-left'>
                        <h2 className="font-headline text-xl font-bold uppercase tracking-wider md:text-3xl text-foreground">
                            Flash Sale!
                        </h2>
                        <p className="text-muted-foreground">Hurry, these deals won't last long!</p>
                    </div>
                    <FlashSaleTimer endTime={flashSaleEndTime} />
                </div>
                 <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                    >
                    <CarouselContent>
                    {flashSaleItems.map((deal, index) => (
                        <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                            <Link href={`/product/${deal.id}`} className="group block">
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
                                <div className="pt-2">
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
                         </CarouselItem>
                    ))}
                    </CarouselContent>
                     <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
                 <div className="text-center mt-8">
                    <Button asChild size="lg">
                        <Link href="/flash-sale">View All Deals</Link>
                    </Button>
                </div>
            </div>
        </section>


        <section className="py-8 md:py-16">
          <div className="container">
            <h2 className="font-headline text-center text-xl font-bold uppercase tracking-wider md:text-3xl mb-6 md:mb-8 text-foreground">
              Medal-Worthy Brands To Bag
            </h2>
            <Carousel
              opts={{
                align: "start",
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {brands.map((brand, index) => (
                  <CarouselItem key={index} className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/8">
                    <Link href="#" className="block">
                      <Image
                        src={brand.src}
                        alt={brand.alt}
                        width={200}
                        height={200}
                        className="aspect-square h-auto w-full rounded-full object-cover"
                        data-ai-hint={brand.dataAiHint}
                      />
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </section>

        <section className="py-8 md:py-16">
            <div className="container">
                <h2 className="font-headline text-center text-xl font-bold uppercase tracking-wider md:text-3xl mb-6 md:mb-8 text-foreground">
                    Deals Of The Day
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                    {deals.map((deal, index) => (
                        <Link href={`/product/${deal.id}`} key={index} className="group block">
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
                                   <Button variant="outline" size="sm" className="w-full bg-white hover:bg-gray-200 border-gray-300 text-xs text-black">
                                      <Heart className="mr-1 h-3 w-3" /> Wishlist
                                   </Button>
                                </div>
                            </div>
                            <div className="pt-2">
                                <h3 className="text-sm font-bold text-foreground">{deal.brand}</h3>
                                <p className="text-xs text-muted-foreground truncate">{deal.name}</p>
                                <p className="text-sm font-semibold mt-1 text-foreground">
                                    ৳{deal.price}{' '}
                                    <span className="text-xs text-muted-foreground line-through">৳{deal.originalPrice}</span>{' '}
                                    <span className="text-xs text-orange-400 font-bold">({deal.discount})</span>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>

        <section className="bg-secondary py-8 md:py-16">
          <div className="container">
            <h2 className="font-headline text-center text-xl font-bold uppercase tracking-wider md:text-3xl mb-6 md:mb-8 text-secondary-foreground">
              Shop By Category
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 md:gap-6">
              {categories.map((category, index) => (
                <Link href="#" key={index} className="group block text-center">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={category.src}
                      alt={category.name}
                      width={400}
                      height={500}
                      className="h-auto w-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={category.dataAiHint}
                    />
                  </div>
                  <div className="bg-primary/80 text-primary-foreground p-4 -mt-16 relative z-10 mx-4 rounded-lg backdrop-blur-sm">
                      <h3 className="font-bold text-md">{category.name}</h3>
                      <p className="text-sm font-semibold text-orange-300">{category.discount}</p>
                      <p className="text-xs mt-1 hover:underline">Shop Now</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
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

        return () => clearInterval(timer);
    }, [endTime]);

    const formatTime = (time: number) => time.toString().padStart(2, '0');

    return (
        <div className="flex items-center gap-2 text-center">
            <Clock className="w-8 h-8 text-primary" />
            <div>
                 <p className="text-xs text-muted-foreground uppercase">Ending in</p>
                 <div className="flex items-center gap-2 font-mono text-xl md:text-2xl font-bold text-foreground">
                    <div className="flex flex-col items-center">
                        <span className="p-2 bg-secondary rounded-md">{formatTime(timeLeft.hours)}</span>
                    </div>
                    <span>:</span>
                    <div className="flex flex-col items-center">
                         <span className="p-2 bg-secondary rounded-md">{formatTime(timeLeft.minutes)}</span>
                    </div>
                    <span>:</span>
                     <div className="flex flex-col items-center">
                         <span className="p-2 bg-secondary rounded-md">{formatTime(timeLeft.seconds)}</span>
                    </div>
                 </div>
            </div>
        </div>
    );
}
