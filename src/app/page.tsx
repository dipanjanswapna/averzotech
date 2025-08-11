
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
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { doc, getDoc, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroImage {
  url: string;
  alt: string;
  dataAiHint: string;
}

interface Brand {
    url: string;
    alt: string;
    dataAiHint: string;
}

interface Deal {
    id: string;
    brand: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    image: string;
    dataAiHint?: string;
}

interface CategoryCard {
    url: string;
    name: string;
    discount: string;
    link: string;
    dataAiHint: string;
}

interface FlashSaleItem {
    id: string;
    brand: string;
    name: string;
    pricing: {
        price: number;
        comparePrice?: number;
        discount?: number;
    };
    images: string[];
    dataAiHint: string;
    inventory: {
        stock: number;
    };
}

interface Campaign {
    id: string;
    name: string;
    type: string;
    status: 'Active' | 'Finished' | 'Scheduled';
    startDate: Timestamp;
    endDate: Timestamp;
    products: string[];
}


interface HomepageContent {
  heroImages: HeroImage[];
  brands: Brand[];
  deals: Deal[];
  categories: CategoryCard[];
}

export default function Home() {
  const [content, setContent] = useState<Partial<HomepageContent>>({});
  const [flashSale, setFlashSale] = useState<Campaign | null>(null);
  const [flashSaleItems, setFlashSaleItems] = useState<FlashSaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [flashSaleLoading, setFlashSaleLoading] = useState(true);

   useEffect(() => {
    const fetchHomepageContent = async () => {
      setLoading(true);
      const docRef = doc(db, 'site_content', 'homepage');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Fetch full product details for deals
        const dealPromises = (data.deals || []).map(async (deal: any) => {
            const productRef = doc(db, 'products', deal.id);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
                const productData = productSnap.data();
                return {
                    id: productSnap.id,
                    name: productData.name,
                    brand: productData.brand,
                    price: productData.pricing.price,
                    originalPrice: productData.pricing.comparePrice,
                    discount: `${productData.pricing.discount}% OFF`,
                    image: productData.images[0],
                    dataAiHint: productData.name.toLowerCase(),
                };
            }
            return null;
        });

        const resolvedDeals = (await Promise.all(dealPromises)).filter(Boolean) as Deal[];
        
        setContent({
            heroImages: data.heroImages || [],
            brands: data.brands || [],
            deals: resolvedDeals,
            categories: data.categories || [],
        });

      } else {
        // Fallback to default images if nothing is set in Firestore
        setContent({
            heroImages: [
                { url: 'https://placehold.co/1200x600.png', alt: 'Fashion sale banner', dataAiHint: 'fashion sale' },
                { url: 'https://placehold.co/1200x600.png', alt: 'New arrivals banner', dataAiHint: 'new arrivals' },
            ],
            brands: Array(10).fill({ url: 'https://placehold.co/200x200.png', alt: 'Brand logo', dataAiHint: 'brand logo' }),
            deals: [],
            categories: Array(6).fill({ url: 'https://placehold.co/400x500.png', name: 'Category', discount: 'Up to 50% Off', link: '#', dataAiHint: 'fashion category' }),
        });
      }
      setLoading(false);
    };

    const fetchFlashSaleData = async () => {
        setFlashSaleLoading(true);
        try {
            const campaignsRef = collection(db, 'campaigns');
            const q = query(campaignsRef, where("type", "==", "Flash Sale"), where("status", "==", "Active"), where("endDate", ">", Timestamp.now()));
            const campaignSnap = await getDocs(q);
            
            if (!campaignSnap.empty) {
                const campaignDoc = campaignSnap.docs[0];
                const campaignData = { id: campaignDoc.id, ...campaignDoc.data() } as Campaign;
                setFlashSale(campaignData);

                if(campaignData.products && campaignData.products.length > 0) {
                    const productPromises = campaignData.products.map(id => getDoc(doc(db, "products", id)));
                    const productDocs = await Promise.all(productPromises);
                    const productList = productDocs.map(doc => ({ id: doc.id, ...doc.data() } as FlashSaleItem)).filter(p => p.id);
                    setFlashSaleItems(productList);
                }
            }
        } catch (error) {
            console.error("Error fetching flash sale data:", error);
        } finally {
            setFlashSaleLoading(false);
        }
    };

    fetchHomepageContent();
    fetchFlashSaleData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow">
        <section className="relative w-full">
          {loading ? (
            <Skeleton className="w-full h-[40vh] md:h-[calc(100vh-80px)]" />
          ) : (
            <Carousel
              className="w-full"
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {(content.heroImages || []).map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[40vh] md:h-[calc(100vh-80px)]">
                      <Image
                        src={image.url}
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
          )}
        </section>
        
        {flashSale && flashSaleItems.length > 0 && (
            <section className="bg-primary/5 py-8 md:py-16">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
                        <div className='text-center md:text-left'>
                            <h2 className="font-headline text-xl font-bold uppercase tracking-wider md:text-3xl text-foreground">
                                {flashSale.name}
                            </h2>
                            <p className="text-muted-foreground">Hurry, these deals won't last long!</p>
                        </div>
                        <FlashSaleTimer endTime={flashSale.endDate.toDate()} />
                    </div>
                    {flashSaleLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                            {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="w-full aspect-[4/5]" />)}
                        </div>
                    ) : (
                        <Carousel
                            opts={{ align: "start" }}
                            className="w-full"
                        >
                            <CarouselContent>
                            {flashSaleItems.map((deal, index) => (
                                <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                                    <Link href={`/product/${deal.id}`} className="group block">
                                        <div className="relative overflow-hidden rounded-lg">
                                            <Image
                                                src={deal.images[0] || 'https://placehold.co/400x500.png'}
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
                                                ৳{deal.pricing.price}{' '}
                                                {deal.pricing.comparePrice && <span className="text-xs text-muted-foreground line-through">৳{deal.pricing.comparePrice}</span>}
                                                {' '}
                                                {deal.pricing.discount && <span className="text-xs text-orange-400 font-bold">({deal.pricing.discount}% OFF)</span>}
                                            </p>
                                            <div className='mt-2'>
                                                <Progress value={(deal.inventory.stock > 0 ? (deal.inventory.stock - (deal.inventory.stock * 0.33)) / deal.inventory.stock * 100 : 0)} className="h-2" />
                                                <p className="text-xs text-muted-foreground mt-1">Only a few left!</p>
                                            </div>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex" />
                            <CarouselNext className="hidden md:flex" />
                        </Carousel>
                    )}
                    <div className="text-center mt-8">
                        <Button asChild size="lg">
                            <Link href="/flash-sale">View All Deals</Link>
                        </Button>
                    </div>
                </div>
            </section>
        )}


        <section className="py-8 md:py-16">
          <div className="container">
            <h2 className="font-headline text-center text-xl font-bold uppercase tracking-wider md:text-3xl mb-6 md:mb-8 text-foreground">
              Medal-Worthy Brands To Bag
            </h2>
            {loading ? (
                <div className="flex justify-center gap-4"><Skeleton className="w-32 h-32 rounded-full" /><Skeleton className="w-32 h-32 rounded-full" /><Skeleton className="w-32 h-32 rounded-full" /></div>
            ) : (
                <Carousel
                  opts={{
                    align: "start",
                    dragFree: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {(content.brands || []).map((brand, index) => (
                      <CarouselItem key={index} className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/8">
                        <Link href="#" className="block">
                          <Image
                            src={brand.url}
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
            )}
          </div>
        </section>

        <section className="py-8 md:py-16">
            <div className="container">
                <h2 className="font-headline text-center text-xl font-bold uppercase tracking-wider md:text-3xl mb-6 md:mb-8 text-foreground">
                    Deals Of The Day
                </h2>
                {loading ? (
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                        {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="w-full aspect-[4/5]" />)}
                     </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                        {(content.deals || []).map((deal, index) => (
                            <Link href={`/product/${deal.id}`} key={index} className="group block">
                                <div className="relative overflow-hidden rounded-lg">
                                    <Image
                                        src={deal.image}
                                        alt={deal.name}
                                        width={400}
                                        height={500}
                                        className="h-auto w-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint={deal.dataAiHint || 'product image'}
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
                                        {deal.originalPrice && <span className="text-xs text-muted-foreground line-through">৳{deal.originalPrice}</span>}
                                        {' '}
                                        {deal.discount && <span className="text-xs text-orange-400 font-bold">({deal.discount})</span>}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>

        <section className="bg-secondary py-8 md:py-16">
          <div className="container">
            <h2 className="font-headline text-center text-xl font-bold uppercase tracking-wider md:text-3xl mb-6 md:mb-8 text-secondary-foreground">
              Shop By Category
            </h2>
            {loading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 md:gap-6">
                   {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="w-full aspect-[4/5]" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 md:gap-6">
                  {(content.categories || []).map((category, index) => (
                    <Link href={category.link} key={index} className="group block text-center">
                      <div className="overflow-hidden rounded-lg">
                        <Image
                          src={category.url}
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
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}


function FlashSaleTimer({ endTime }: { endTime: Date }) {
    const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    React.useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +endTime - +new Date();
            let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
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
            <Clock className="w-8 h-8 text-primary" />
            <div>
                 <p className="text-xs text-muted-foreground uppercase">Ending in</p>
                 <div className="flex items-center gap-2 font-mono text-xl md:text-2xl font-bold text-foreground">
                    {timeLeft.days > 0 && (
                        <>
                        <div className="flex flex-col items-center">
                            <span className="p-2 bg-secondary rounded-md">{formatTime(timeLeft.days)}</span>
                        </div>
                        <span className="text-xl">:</span>
                        </>
                    )}
                    <div className="flex flex-col items-center">
                        <span className="p-2 bg-secondary rounded-md">{formatTime(timeLeft.hours)}</span>
                    </div>
                    <span className="text-xl">:</span>
                    <div className="flex flex-col items-center">
                         <span className="p-2 bg-secondary rounded-md">{formatTime(timeLeft.minutes)}</span>
                    </div>
                    <span className="text-xl">:</span>
                     <div className="flex flex-col items-center">
                         <span className="p-2 bg-secondary rounded-md">{formatTime(timeLeft.seconds)}</span>
                    </div>
                 </div>
            </div>
        </div>
    );
}
