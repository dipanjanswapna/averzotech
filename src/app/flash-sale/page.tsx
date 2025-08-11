
'use client';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Filter, Bell, X } from 'lucide-react';
import React from 'react';
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

const allFlashSaleItems = [
    {
      id: 'fs-1',
      brand: 'Fastrack',
      category: 'Accessories',
      name: 'Analog Watch',
      price: 1250,
      originalPrice: 2500,
      discount: 50,
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'analog watch',
      stock: 100,
      sold: 67,
    },
    {
      id: 'fs-2',
      brand: 'Boat',
      category: 'Electronics',
      name: 'Wireless Earbuds',
      price: 1500,
      originalPrice: 3000,
      discount: 50,
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'wireless earbuds',
      stock: 50,
      sold: 15,
    },
    {
      id: 'fs-3',
      brand: 'Wildcraft',
      category: 'Bags',
      name: 'Travel Backpack',
      price: 999,
      originalPrice: 1999,
      discount: 50,
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'travel backpack',
      stock: 75,
      sold: 50,
    },
    {
      id: 'fs-4',
      brand: 'Ray-Ban',
      category: 'Accessories',
      name: 'Classic Aviators',
      price: 4500,
      originalPrice: 9000,
      discount: 50,
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'aviator sunglasses',
      stock: 30,
      sold: 28,
    },
     {
      id: 'fs-5',
      brand: 'Gucci',
      category: 'Accessories',
      name: 'Leather Belt',
      price: 8000,
      originalPrice: 16000,
      discount: 50,
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'leather belt',
      stock: 20,
      sold: 5,
    },
    {
      id: 'fs-6',
      brand: 'Samsung',
      category: 'Electronics',
      name: 'Galaxy Watch 5',
      price: 15000,
      originalPrice: 30000,
      discount: 50,
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'smartwatch android',
      stock: 40,
      sold: 10,
    },
      {
      id: 'fs-7',
      brand: 'Sony',
      category: 'Electronics',
      name: 'WH-1000XM5 Headphones',
      price: 25000,
      originalPrice: 35000,
      discount: 28,
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'wireless headphones',
      stock: 25,
      sold: 10,
    },
    {
      id: 'fs-8',
      brand: 'Apple',
      category: 'Electronics',
      name: 'AirPods Pro 2',
      price: 22000,
      originalPrice: 28000,
      discount: 21,
      src: 'https://placehold.co/400x500.png',
      dataAiHint: 'apple airpods',
      stock: 60,
      sold: 45,
    },
];

const upcomingSales = [
  {
    id: 'upcoming-1',
    name: 'Tech Gadget Gala',
    startTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    image: 'https://placehold.co/500x300.png',
    dataAiHint: 'tech gadgets',
  },
  {
    id: 'upcoming-2',
    name: 'Winter Fashion Fest',
    startTime: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    image: 'https://placehold.co/500x300.png',
    dataAiHint: 'winter fashion',
  },
];

const flashSaleEndTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

export default function FlashSalePage() {
  const [isFilterOpen, setIsFilterOpen] = React.useState(true);
  const [displayedItems, setDisplayedItems] = React.useState(allFlashSaleItems);
  const [sortOption, setSortOption] = React.useState("featured");
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedBrand, setSelectedBrand] = React.useState("all");
  const [priceRange, setPriceRange] = React.useState([0, 30000]);

  const brands = [...new Set(allFlashSaleItems.map(item => item.brand))];
  const categories = [...new Set(allFlashSaleItems.map(item => item.category))];

  const applyFilters = React.useCallback(() => {
    let items = [...allFlashSaleItems];

    // Filter by category
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

    // Filter by brand
    if (selectedBrand !== 'all') {
      items = items.filter(item => item.brand === selectedBrand);
    }

    // Filter by price
    items = items.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

    // Sort items
    switch (sortOption) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        items.sort((a, b) => b.discount - a.discount);
        break;
      case 'popular':
        items.sort((a, b) => (b.sold / b.stock) - (a.sold / a.stock));
        break;
      case 'featured':
      default:
        // No specific sorting for featured, show as is or based on a default
        break;
    }

    setDisplayedItems(items);
  }, [selectedCategory, selectedBrand, priceRange, sortOption]);
  
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setPriceRange([0, 30000]);
  };

  const handleNotify = (saleName: string) => {
    toast({
      title: "Subscription Confirmed!",
      description: `We'll notify you when the "${saleName}" starts.`,
    });
  };
  
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
                        Flash Sale!
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">Hurry, these deals won't last long!</p>
                </div>
                <FlashSaleTimer endTime={flashSaleEndTime} />
            </div>
        </section>

        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">All Flash Sale Items ({displayedItems.length})</h3>
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
                      <SelectItem value="popular">Popularity</SelectItem>
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
                                    <span className="text-xs text-orange-400 font-bold">({deal.discount}% OFF)</span>
                                </p>
                                <div className='mt-2'>
                                    <Progress value={(deal.sold / deal.stock) * 100} className="h-2" />
                                    <p className="text-xs text-muted-foreground mt-1">{deal.sold} of {deal.stock} sold</p>
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

        <section className="mt-16">
            <h2 className="font-headline text-center text-xl font-bold uppercase tracking-wider md:text-3xl mb-6 md:mb-8 text-foreground">
                Upcoming Flash Sales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {upcomingSales.map(sale => (
                    <div key={sale.id} className="group relative overflow-hidden rounded-lg border">
                        <Image 
                            src={sale.image}
                            alt={sale.name}
                            width={500}
                            height={300}
                            className="w-full h-auto object-cover aspect-video transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={sale.dataAiHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                            <h3 className="text-2xl font-bold text-white font-headline">{sale.name}</h3>
                            <div className="mt-4">
                                <FlashSaleTimer endTime={sale.startTime} />
                            </div>
                            <Button className="mt-4 w-full md:w-auto" onClick={() => handleNotify(sale.name)}>
                                <Bell className="mr-2 h-4 w-4" /> Notify Me
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
        
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
                    {timeLeft.days > 0 ? "Starts in" : "Ending in"}
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
                    max={30000}
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
