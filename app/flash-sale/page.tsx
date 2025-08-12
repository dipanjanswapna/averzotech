

'use client';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Filter, Bell, X } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, query, where, Timestamp, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
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
        sold?: number;
    };
    organization: {
        category: string;
    }
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

const LoadingSkeleton = () => (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-8">
        <Skeleton className="h-40 md:h-32 w-full rounded-lg mb-8" />
        <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="hidden md:block md:col-span-1">
                 <Skeleton className="h-96 w-full" />
            </div>
            <div className="md:col-span-3">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                    {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="space-y-2">
                             <Skeleton className="w-full aspect-[4/5]" />
                             <Skeleton className="h-4 w-3/4" />
                             <Skeleton className="h-4 w-1/2" />
                             <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </main>
      <SiteFooter />
    </div>
);


export default function FlashSalePage() {
  const [isFilterOpen, setIsFilterOpen] = React.useState(true);
  const [loading, setLoading] = useState(true);
  const [flashSale, setFlashSale] = useState<Campaign | null>(null);
  const [allFlashSaleItems, setAllFlashSaleItems] = useState<Product[]>([]);
  const [displayedItems, setDisplayedItems] = React.useState<Product[]>([]);
  const [sortOption, setSortOption] = React.useState("featured");
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedBrand, setSelectedBrand] = React.useState("all");
  const [priceRange, setPriceRange] = React.useState([0, 120000]);

  useEffect(() => {
    const fetchFlashSaleData = async () => {
        setLoading(true);
        try {
            const campaignsRef = collection(db, 'campaigns');
            const q = query(campaignsRef, where("type", "==", "Flash Sale"), where("status", "==", "Active"));
            const campaignSnap = await getDocs(q);
            
            const activeCampaigns = campaignSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Campaign))
                .filter(campaign => campaign.endDate.toDate() > new Date());

            if (activeCampaigns.length > 0) {
                const campaignData = activeCampaigns[0]; // Take the first active flash sale
                setFlashSale(campaignData);

                if(campaignData.products && campaignData.products.length > 0) {
                    const productPromises = campaignData.products.map(id => getDoc(doc(db, "products", id)));
                    const productDocs = await Promise.all(productPromises);
                    const productList = productDocs.map(doc => ({ id: doc.id, ...doc.data() } as Product)).filter(p => p.id);
                    setAllFlashSaleItems(productList);
                    setDisplayedItems(productList);
                }
            }
        } catch (error) {
            console.error("Error fetching flash sale data:", error);
            toast({ title: "Error", description: "Could not fetch flash sale details.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };
    fetchFlashSaleData();
  }, [toast]);

  const brands = [...new Set(allFlashSaleItems.map(item => item.brand))];
  const categories = [...new Set(allFlashSaleItems.map(item => item.organization.category))];

  const applyFilters = React.useCallback(() => {
    let items = [...allFlashSaleItems];

    if (selectedCategory !== 'all') items = items.filter(item => item.organization.category === selectedCategory);
    if (selectedBrand !== 'all') items = items.filter(item => item.brand === selectedBrand);
    items = items.filter(item => item.pricing.price >= priceRange[0] && item.pricing.price <= priceRange[1]);

    switch (sortOption) {
      case 'price-asc':
        items.sort((a, b) => a.pricing.price - b.pricing.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.pricing.price - a.pricing.price);
        break;
      case 'discount':
        items.sort((a, b) => (b.pricing.discount || 0) - (a.pricing.discount || 0));
        break;
    }
    setDisplayedItems(items);
  }, [selectedCategory, selectedBrand, priceRange, sortOption, allFlashSaleItems]);
  
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setPriceRange([0, 120000]);
  };
  
  if (loading) return <LoadingSkeleton />;
  
  if(!flashSale) {
      return (
          <div className="flex min-h-screen flex-col bg-background">
              <SiteHeader />
              <main className="flex-grow container py-8 text-center">
                  <h1 className="text-3xl font-bold">No Active Flash Sale</h1>
                  <p className="text-muted-foreground mt-4">Check back later for exciting deals!</p>
                   <Button asChild className="mt-6"><Link href="/">Go Home</Link></Button>
              </main>
              <SiteFooter />
          </div>
      )
  }

  const filterControls = (
      <FilterControls 
        brands={brands}
        categories={categories}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onApply={applyFilters}
        onReset={handleResetFilters}
      />
  );
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-8">
        <section className="bg-primary/5 p-6 rounded-lg mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-6">
                <div className='text-center md:text-left'>
                    <h1 className="font-headline text-3xl font-bold uppercase tracking-wider md:text-5xl text-foreground">
                        {flashSale.name}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">Hurry, these deals won't last long!</p>
                </div>
                <FlashSaleTimer endTime={flashSale.endDate.toDate()} />
            </div>
        </section>

        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">All Items ({displayedItems.length})</h3>
             <div className="flex items-center gap-4">
                 <div className="md:hidden">
                    <Sheet>
                      <SheetTrigger asChild>
                         <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                          <SheetDescription>
                            Refine your search for the best deals.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                           {filterControls}
                        </div>
                      </SheetContent>
                    </Sheet>
                 </div>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by: Featured" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="discount">Discount</SelectItem>
                    </SelectContent>
                  </Select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="hidden md:block md:col-span-1">
                 <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <CollapsibleTrigger className="flex justify-between items-center w-full font-semibold text-lg mb-4">
                      Filters <Filter className="w-5 h-5" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                       {filterControls}
                    </CollapsibleContent>
                </Collapsible>
            </div>

            <div className="md:col-span-3">
              {displayedItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                    {displayedItems.map((deal) => (
                        <Link href={`/product/${deal.id}`} key={deal.id} className="group block border p-2 rounded-lg hover:shadow-lg transition-shadow duration-300">
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
                            <div className="pt-2 px-1">
                                <h3 className="text-sm font-bold text-foreground">{deal.brand}</h3>
                                <p className="text-xs text-muted-foreground truncate">{deal.name}</p>
                                <p className="text-sm font-semibold mt-1 text-foreground">
                                    ৳{deal.pricing.price}{' '}
                                    {deal.pricing.comparePrice && <span className="text-xs text-muted-foreground line-through">৳{deal.pricing.comparePrice}</span> }
                                    {deal.pricing.discount && <span className="text-xs text-orange-400 font-bold">({deal.pricing.discount}% OFF)</span> }
                                </p>
                                 <div className='mt-2'>
                                    <Progress value={((deal.inventory.stock - (deal.inventory.sold || 0)) / deal.inventory.stock) * 100} className="h-2" />
                                    <p className="text-xs text-muted-foreground mt-1">Only a few left!</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
              ) : (
                <div className="text-center py-16 col-span-full">
                    <h2 className="text-2xl font-bold mb-2">No Products Found</h2>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters to find what you're looking for.</p>
                    <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
                </div>
              )}
            </div>
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
    const [timeLeft, setTimeLeft] = React.useState({ days:0, hours: 0, minutes: 0, seconds: 0 });

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
            <Clock className="w-10 h-10 text-primary" />
            <div>
                 <p className="text-sm text-muted-foreground uppercase">
                    Ending in
                 </p>
                 <div className="flex items-center gap-2 font-mono text-2xl md:text-3xl font-bold text-foreground">
                    {timeLeft.days > 0 && (
                        <>
                        <div className="flex flex-col items-center">
                            <span className="p-2 bg-secondary rounded-md min-w-[48px]">{formatTime(timeLeft.days)}</span>
                        </div>
                        <span className="text-2xl">:</span>
                        </>
                    )}
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

interface FilterControlsProps {
    brands: string[];
    categories: string[];
    priceRange: number[];
    onPriceChange: (value: number[]) => void;
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    selectedBrand: string;
    onBrandChange: (value: string) => void;
    onApply: () => void;
    onReset: () => void;
}

function FilterControls({ 
    brands, 
    categories, 
    priceRange, 
    onPriceChange,
    selectedCategory,
    onCategoryChange,
    selectedBrand,
    onBrandChange,
    onApply,
    onReset
}: FilterControlsProps) {

    return (
        <div className="space-y-6">
            <div>
                <Label className="font-semibold">Category</Label>
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div>
                <Label className="font-semibold">Brand</Label>
                 <Select value={selectedBrand} onValueChange={onBrandChange}>
                    <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="all">All Brands</SelectItem>
                         {brands.map(brand => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div>
                <Label htmlFor="price-range" className="font-semibold">Price Range</Label>
                <Slider
                    id="price-range"
                    min={0}
                    max={120000}
                    step={100}
                    value={priceRange}
                    onValueChange={onPriceChange}
                    className="mt-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>৳{priceRange[0]}</span>
                    <span>৳{priceRange[1]}</span>
                </div>
            </div>
             <div className="flex justify-between gap-2">
                <Button variant="secondary" className="flex-1" onClick={onReset}>Reset</Button>
                <Button className="flex-1" onClick={onApply}>Apply Filters</Button>
            </div>
        </div>
    )
}
