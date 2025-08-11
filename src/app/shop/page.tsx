
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const allProducts = [
  // Men
  { id: 'men-1', brand: 'BrandX', name: "Men's Jeans", price: 1999, originalPrice: 3999, discount: 50, category: 'Men', src: 'https://placehold.co/300x400.png', dataAiHint: 'men jeans' },
  { id: 'men-2', brand: 'BrandY', name: "Casual Shirts", price: 1299, originalPrice: 2599, discount: 50, category: 'Men', src: 'https://placehold.co/300x400.png', dataAiHint: 'men casual shirt' },
  { id: 'men-3', brand: 'BrandZ', name: "Activewear", price: 2499, originalPrice: 4999, discount: 50, category: 'Men', src: 'https://placehold.co/300x400.png', dataAiHint: 'men activewear' },
  { id: 'men-4', brand: 'BrandX', name: "Sports Shoes", price: 2999, originalPrice: 5999, discount: 50, category: 'Men', src: 'https://placehold.co/300x400.png', dataAiHint: 'men sport shoes' },
  { id: 'men-5', brand: 'BrandA', name: "Personal Care", price: 499, originalPrice: 999, discount: 50, category: 'Men', src: 'https://placehold.co/300x400.png', dataAiHint: 'men grooming' },
  { id: 'men-6', brand: 'BrandB', name: 'Innerwear', price: 399, originalPrice: 799, discount: 50, category: 'Men', src: 'https://placehold.co/300x400.png', dataAiHint: 'men innerwear' },
  { id: 'men-7', brand: 'BrandY', name: 'T-Shirts', price: 799, originalPrice: 1599, discount: 50, category: 'Men', src: 'https://placehold.co/300x400.png', dataAiHint: 'men t-shirt' },
  // Women
  { id: 'women-1', brand: 'BrandA', name: "Sarees & Kurtis", price: 2499, originalPrice: 4999, discount: 50, category: 'Women', src: 'https://placehold.co/300x400.png', dataAiHint: 'saree kurti' },
  { id: 'women-2', brand: 'BrandC', name: "Dresses", price: 1899, originalPrice: 3799, discount: 50, category: 'Women', src: 'https://placehold.co/300x400.png', dataAiHint: 'woman dress' },
  { id: 'women-3', brand: 'BrandD', name: "Handbags", price: 1599, originalPrice: 3199, discount: 50, category: 'Women', src: 'https://placehold.co/300x400.png', dataAiHint: 'handbag' },
  // Kids
  { id: 'kids-1', brand: 'KidsBrandA', name: "Boys' Clothing", price: 999, originalPrice: 1999, discount: 50, category: 'Kids', src: 'https://placehold.co/300x400.png', dataAiHint: 'boy clothing' },
  { id: 'kids-2', brand: 'KidsBrandB', name: "Girls' Clothing", price: 1199, originalPrice: 2399, discount: 50, category: 'Kids', src: 'https://placehold.co/300x400.png', dataAiHint: 'girl clothing' },
  // Home & Living
  { id: 'home-1', brand: 'HomeBrandA', name: "Bedsheets", price: 1999, originalPrice: 3999, discount: 50, category: 'Home & Living', src: 'https://placehold.co/300x400.png', dataAiHint: 'bedsheets' },
  { id: 'home-2', brand: 'HomeBrandB', name: "Dinnerware", price: 2999, originalPrice: 5999, discount: 50, category: 'Home & Living', src: 'https://placehold.co/300x400.png', dataAiHint: 'dinnerware set' },
  // Beauty
  { id: 'beauty-1', brand: 'BeautyBrandA', name: "Lipsticks", price: 899, originalPrice: 1799, discount: 50, category: 'Beauty', src: 'https://placehold.co/300x400.png', dataAiHint: 'lipstick collection' },
  { id: 'beauty-2', brand: 'BeautyBrandB', name: "Perfumes", price: 2499, originalPrice: 4999, discount: 50, category: 'Beauty', src: 'https://placehold.co/300x400.png', dataAiHint: 'perfume bottle' },
  // Electronics
  { id: 'electronics-1', brand: 'TechBrandA', name: "Smartphones", price: 15000, originalPrice: 20000, discount: 25, category: 'Electronics', src: 'https://placehold.co/300x400.png', dataAiHint: 'smartphones' },
  { id: 'electronics-2', brand: 'TechBrandB', name: "Laptops", price: 50000, originalPrice: 65000, discount: 23, category: 'Electronics', src: 'https://placehold.co/300x400.png', dataAiHint: 'laptops' },
  // Sports
  { id: 'sports-1', brand: 'SportBrandA', name: "Running Shoes", price: 3500, originalPrice: 5000, discount: 30, category: 'Sports', src: 'https://placehold.co/300x400.png', dataAiHint: 'running shoes' },
  { id: 'sports-2', brand: 'SportBrandB', name: "Cricket Bats", price: 2500, originalPrice: 4000, discount: 37, category: 'Sports', src: 'https://placehold.co/300x400.png', dataAiHint: 'cricket bat' },
  // Books
  { id: 'books-1', brand: 'PublisherA', name: "Fiction", price: 500, originalPrice: 800, discount: 37, category: 'Books', src: 'https://placehold.co/300x400.png', dataAiHint: 'fiction books' },
  { id: 'books-2', brand: 'PublisherB', name: "Children's Books", price: 300, originalPrice: 500, discount: 40, category: 'Books', src: 'https://placehold.co/300x400.png', dataAiHint: 'childrens books' },
];

export default function ShopPage() {
    const [isFilterOpen, setIsFilterOpen] = React.useState(true);
    const [displayedItems, setDisplayedItems] = React.useState(allProducts);
    const [sortOption, setSortOption] = React.useState("featured");
  
    const [selectedCategory, setSelectedCategory] = React.useState("all");
    const [selectedBrand, setSelectedBrand] = React.useState("all");
    const [priceRange, setPriceRange] = React.useState([0, 50000]);

    const brands = [...new Set(allProducts.map(item => item.brand))];
    const categories = [...new Set(allProducts.map(item => item.category))];

    const applyFilters = React.useCallback(() => {
        let items = [...allProducts];

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
        setPriceRange([0, 50000]);
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
        <section className="mb-8">
            <h1 className="font-headline text-3xl font-bold uppercase tracking-wider md:text-5xl text-foreground">
                Shop All
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Browse through our entire collection of products.</p>
        </section>

        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">All Products ({displayedItems.length})</h3>
             <div className="flex items-center gap-4">
                 <div className="md:hidden">
                    <Sheet>
                      <SheetTrigger asChild>
                         <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
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
      </main>
      <SiteFooter />
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
                    max={50000}
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

    