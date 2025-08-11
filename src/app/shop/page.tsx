
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const allProducts = [
  // Men
  { id: 'men-1', brand: 'BrandX', name: "Men's Jeans", price: 1999, originalPrice: 3999, discount: 50, category: 'Men', group: 'Bottomwear', subcategory: 'Jeans', src: 'https://placehold.co/300x400.png', dataAiHint: 'men jeans' },
  { id: 'men-2', brand: 'BrandY', name: "Casual Shirts", price: 1299, originalPrice: 2599, discount: 50, category: 'Men', group: 'Topwear', subcategory: 'Casual Shirts', src: 'https://placehold.co/300x400.png', dataAiHint: 'men casual shirt' },
  { id: 'men-3', brand: 'BrandZ', name: "Activewear Top", price: 2499, originalPrice: 4999, discount: 50, category: 'Men', group: 'Activewear', subcategory: 'T-Shirts', src: 'https://placehold.co/300x400.png', dataAiHint: 'men activewear' },
  { id: 'men-4', brand: 'BrandX', name: "Sports Shoes", price: 2999, originalPrice: 5999, discount: 50, category: 'Men', group: 'Footwear', subcategory: 'Sports Shoes', src: 'https://placehold.co/300x400.png', dataAiHint: 'men sport shoes' },
  { id: 'men-5', brand: 'BrandA', name: "Grooming Kit", price: 499, originalPrice: 999, discount: 50, category: 'Men', group: 'Accessories', subcategory: 'Personal Care', src: 'https://placehold.co/300x400.png', dataAiHint: 'men grooming' },
  { id: 'men-6', brand: 'BrandB', name: 'Innerwear Set', price: 399, originalPrice: 799, discount: 50, category: 'Men', group: 'Innerwear', subcategory: 'Innerwear', src: 'https://placehold.co/300x400.png', dataAiHint: 'men innerwear' },
  { id: 'men-7', brand: 'BrandY', name: 'Graphic T-Shirts', price: 799, originalPrice: 1599, discount: 50, category: 'Men', group: 'Topwear', subcategory: 'T-Shirts', src: 'https://placehold.co/300x400.png', dataAiHint: 'men t-shirt' },
  // Women
  { id: 'women-1', brand: 'BrandA', name: "Designer Saree", price: 2499, originalPrice: 4999, discount: 50, category: 'Women', group: 'Indian & Fusion Wear', subcategory: 'Sarees', src: 'https://placehold.co/300x400.png', dataAiHint: 'saree kurti' },
  { id: 'women-2', brand: 'BrandC', name: "Summer Dress", price: 1899, originalPrice: 3799, discount: 50, category: 'Women', group: 'Western Wear', subcategory: 'Dresses', src: 'https://placehold.co/300x400.png', dataAiHint: 'woman dress' },
  { id: 'women-3', brand: 'BrandD', name: "Leather Handbag", price: 1599, originalPrice: 3199, discount: 50, category: 'Women', group: 'Jewellery & Accessories', subcategory: 'Handbags', src: 'https://placehold.co/300x400.png', dataAiHint: 'handbag' },
  // Kids
  { id: 'kids-1', brand: 'KidsBrandA', name: "Boys' T-Shirt", price: 999, originalPrice: 1999, discount: 50, category: 'Kids', group: "Boys Clothing", subcategory: "T-Shirts", src: 'https://placehold.co/300x400.png', dataAiHint: 'boy clothing' },
  { id: 'kids-2', brand: 'KidsBrandB', name: "Girls' Frock", price: 1199, originalPrice: 2399, discount: 50, category: 'Kids', group: "Girls Clothing", subcategory: "Dresses", src: 'https://placehold.co/300x400.png', dataAiHint: 'girl clothing' },
  // Home & Living
  { id: 'home-1', brand: 'HomeBrandA', name: "Cotton Bedsheets", price: 1999, originalPrice: 3999, discount: 50, category: 'Home & Living', group: 'Bed & Bath', subcategory: 'Bedsheets', src: 'https://placehold.co/300x400.png', dataAiHint: 'bedsheets' },
  { id: 'home-2', brand: 'HomeBrandB', name: "Ceramic Dinnerware", price: 2999, originalPrice: 5999, discount: 50, category: 'Home & Living', group: 'Kitchen & Dining', subcategory: 'Dinnerware', src: 'https://placehold.co/300x400.png', dataAiHint: 'dinnerware set' },
  // Beauty
  { id: 'beauty-1', brand: 'BeautyBrandA', name: "Matte Lipstick", price: 899, originalPrice: 1799, discount: 50, category: 'Beauty', group: 'Makeup', subcategory: 'Lipstick', src: 'https://placehold.co/300x400.png', dataAiHint: 'lipstick collection' },
  { id: 'beauty-2', brand: 'BeautyBrandB', name: "Luxury Perfume", price: 2499, originalPrice: 4999, discount: 50, category: 'Beauty', group: 'Fragrance', subcategory: 'Perfumes', src: 'https://placehold.co/300x400.png', dataAiHint: 'perfume bottle' },
  // Electronics
  { id: 'electronics-1', brand: 'TechBrandA', name: "Smartphone Pro", price: 15000, originalPrice: 20000, discount: 25, category: 'Electronics', group: 'Mobiles & Wearables', subcategory: 'Smartphones', src: 'https://placehold.co/300x400.png', dataAiHint: 'smartphones' },
  { id: 'electronics-2', brand: 'TechBrandB', name: "Gaming Laptop", price: 50000, originalPrice: 65000, discount: 23, category: 'Electronics', group: 'Laptops & Computers', subcategory: 'Laptops', src: 'https://placehold.co/300x400.png', dataAiHint: 'laptops' },
  // Sports
  { id: 'sports-1', brand: 'SportBrandA', name: "Pro Running Shoes", price: 3500, originalPrice: 5000, discount: 30, category: 'Sports', group: 'Running', subcategory: 'Running Shoes', src: 'https://placehold.co/300x400.png', dataAiHint: 'running shoes' },
  { id: 'sports-2', brand: 'SportBrandB', name: "Professional Cricket Bat", price: 2500, originalPrice: 4000, discount: 37, category: 'Sports', group: 'Cricket', subcategory: 'Cricket Bats', src: 'https://placehold.co/300x400.png', dataAiHint: 'cricket bat' },
  // Books
  { id: 'books-1', brand: 'PublisherA', name: "Mystery Novel", price: 500, originalPrice: 800, discount: 37, category: 'Books', group: 'Fiction', subcategory: 'Mystery', src: 'https://placehold.co/300x400.png', dataAiHint: 'fiction books' },
  { id: 'books-2', brand: 'PublisherB', name: "Illustrated Children's Book", price: 300, originalPrice: 500, discount: 40, category: 'Books', group: "Children's Books", subcategory: 'Picture Books', src: 'https://placehold.co/300x400.png', dataAiHint: 'childrens books' },
];

const filterHierarchy = {
    "Men": {
        "Topwear": ["T-Shirts", "Casual Shirts", "Formal Shirts", "Sweatshirts", "Jackets"],
        "Bottomwear": ["Jeans", "Casual Trousers", "Formal Trousers", "Shorts", "Track Pants"],
        "Footwear": ["Casual Shoes", "Sports Shoes", "Formal Shoes", "Sneakers", "Sandals"],
        "Accessories": ["Watches", "Wallets", "Belts", "Sunglasses", "Bags", "Personal Care"],
        "Innerwear": ["Innerwear"],
        "Activewear": ["T-Shirts", "Track Pants"]
    },
    "Women": {
        "Indian & Fusion Wear": ["Kurtas & Suits", "Sarees", "Lehengas", "Ethnic Gowns"],
        "Western Wear": ["Dresses", "Tops", "T-Shirts", "Jeans", "Skirts"],
        "Footwear": ["Flats", "Heels", "Boots", "Sports Shoes"],
        "Jewellery & Accessories": ["Earrings", "Necklaces", "Handbags", "Watches"]
    },
    "Kids": {
        "Boys Clothing": ["T-Shirts", "Shirts", "Jeans", "Shorts"],
        "Girls Clothing": ["Dresses", "Tops", "Skirts", "T-shirts"],
        "Infants": ["Rompers", "Bodysuits", "Sleepwear"],
        "Toys & Games": ["Action Figures", "Dolls", "Board Games", "Puzzles"]
    },
    "Home & Living": {
        "Bed & Bath": ["Bedsheets", "Pillows", "Towels", "Bathrobes"],
        "Decor": ["Vases", "Photo Frames", "Wall Art", "Candles"],
        "Kitchen & Dining": ["Dinnerware", "Cookware", "Storage", "Cutlery"]
    },
    "Beauty": {
        "Makeup": ["Lipstick", "Foundation", "Mascara", "Eyeshadow"],
        "Skincare": ["Moisturizer", "Cleanser", "Sunscreen", "Face Masks"],
        "Fragrance": ["Perfumes", "Deodorants", "Body Mists"],
        "Haircare": ["Shampoo", "Conditioner", "Hair Oil", "Styling Tools"]
    },
    "Electronics": {
        "Mobiles & Wearables": ["Smartphones", "Smartwatches", "Headphones", "Speakers"],
        "Laptops & Computers": ["Laptops", "Desktops", "Monitors", "Keyboards", "Mouse"],
        "Cameras & Drones": ["DSLRs", "Mirrorless Cameras", "Drones", "Action Cameras"]
    },
    "Sports": {
        "Cricket": ["Cricket Bats", "Balls", "Pads", "Gloves"],
        "Football": ["Footballs", "Jerseys", "Boots", "Shin Guards"],
        "Fitness": ["Dumbbells", "Yoga Mats", "Resistance Bands", "Trackers"],
        "Running": ["Running Shoes"]
    },
    "Books": {
        "Fiction": ["Mystery", "Thriller", "Sci-Fi", "Fantasy", "Romance"],
        "Non-Fiction": ["Biography", "History", "Self-Help", "Business"],
        "Children's Books": ["Picture Books", "Story Books", "Young Adult"]
    }
};

type FilterHierarchy = typeof filterHierarchy;


export default function ShopPage() {
    const [isFilterOpen, setIsFilterOpen] = React.useState(true);
    const [displayedItems, setDisplayedItems] = React.useState(allProducts);
    const [sortOption, setSortOption] = React.useState("featured");
  
    const [selectedMotherCategories, setSelectedMotherCategories] = React.useState<string[]>([]);
    const [selectedGroups, setSelectedGroups] = React.useState<string[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = React.useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
    const [priceRange, setPriceRange] = React.useState([0, 65000]);
    
    const applyFilters = React.useCallback(() => {
        let items = [...allProducts];

        if (selectedMotherCategories.length > 0) {
            items = items.filter(item => selectedMotherCategories.includes(item.category));
        }
        if (selectedGroups.length > 0) {
            items = items.filter(item => selectedGroups.includes(item.group));
        }
        if (selectedSubcategories.length > 0) {
            items = items.filter(item => selectedSubcategories.includes(item.subcategory));
        }
        if (selectedBrands.length > 0) {
            items = items.filter(item => selectedBrands.includes(item.brand));
        }

        items = items.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

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
            break;
        }

        setDisplayedItems(items);
    }, [selectedMotherCategories, selectedGroups, selectedSubcategories, selectedBrands, priceRange, sortOption]);

    React.useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const createToggleHandler = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (value: string) => {
        setter(prev => 
            prev.includes(value) 
            ? prev.filter(c => c !== value) 
            : [...prev, value]
        );
    };

    const handleMotherCategoryChange = createToggleHandler(setSelectedMotherCategories);
    const handleGroupChange = createToggleHandler(setSelectedGroups);
    const handleSubcategoryChange = createToggleHandler(setSelectedSubcategories);
    const handleBrandChange = createToggleHandler(setSelectedBrands);

    const handleResetFilters = () => {
        setSelectedMotherCategories([]);
        setSelectedGroups([]);
        setSelectedSubcategories([]);
        setSelectedBrands([]);
        setPriceRange([0, 65000]);
    };
    
  const filterControls = (
      <FilterControls
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        selectedMotherCategories={selectedMotherCategories}
        onMotherCategoryChange={handleMotherCategoryChange}
        selectedGroups={selectedGroups}
        onGroupChange={handleGroupChange}
        selectedSubcategories={selectedSubcategories}
        onSubcategoryChange={handleSubcategoryChange}
        selectedBrands={selectedBrands}
        onBrandChange={handleBrandChange}
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
                    </SelectContent>
                  </Select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="hidden md:block md:col-span-1">
                 <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="sticky top-24">
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

interface FilterCheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

function FilterCheckbox({ id, label, checked, onCheckedChange }: FilterCheckboxProps) {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox 
                id={id} 
                checked={checked}
                onCheckedChange={onCheckedChange}
            />
            <Label htmlFor={id} className="font-normal">{label}</Label>
        </div>
    );
}

interface FilterControlsProps {
    priceRange: number[];
    onPriceChange: (value: number[]) => void;
    selectedMotherCategories: string[];
    onMotherCategoryChange: (category: string) => void;
    selectedGroups: string[];
    onGroupChange: (group: string) => void;
    selectedSubcategories: string[];
    onSubcategoryChange: (subcategory: string) => void;
    selectedBrands: string[];
    onBrandChange: (brand: string) => void;
    onApply: () => void;
    onReset: () => void;
}

function FilterControls({ 
    priceRange, 
    onPriceChange,
    selectedMotherCategories,
    onMotherCategoryChange,
    selectedGroups,
    onGroupChange,
    selectedSubcategories,
    onSubcategoryChange,
    selectedBrands,
    onBrandChange,
    onApply,
    onReset
}: FilterControlsProps) {

    const motherCategories = Object.keys(filterHierarchy);
    
    const availableGroups = React.useMemo(() => {
        if (selectedMotherCategories.length === 0) return [];
        return [...new Set(selectedMotherCategories.flatMap(mc => Object.keys(filterHierarchy[mc as keyof FilterHierarchy])))];
    }, [selectedMotherCategories]);

    const availableSubcategories = React.useMemo(() => {
        if (selectedMotherCategories.length === 0 || selectedGroups.length === 0) return [];
        const subcategories = selectedMotherCategories.flatMap(mc => {
            const motherCat = filterHierarchy[mc as keyof FilterHierarchy];
            if (!motherCat) return [];
            return selectedGroups.flatMap(g => {
                const group = motherCat[g as keyof typeof motherCat] as string[];
                return group || [];
            });
        });
        return [...new Set(subcategories)];
    }, [selectedMotherCategories, selectedGroups]);
        
    const allBrands = [...new Set(allProducts.map(p => p.brand))];

    return (
        <div className="space-y-6">
             <Collapsible defaultOpen={true}>
                <CollapsibleTrigger className="font-semibold w-full text-left">MOTHER CATEGORY</CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-2">
                     {motherCategories.map(mc => (
                        <FilterCheckbox
                            key={mc}
                            id={`mc-${mc}`}
                            label={mc}
                            checked={selectedMotherCategories.includes(mc)}
                            onCheckedChange={() => onMotherCategoryChange(mc)}
                        />
                    ))}
                </CollapsibleContent>
            </Collapsible>
            
            {selectedMotherCategories.length > 0 && (
                 <Collapsible defaultOpen={true}>
                    <CollapsibleTrigger className="font-semibold w-full text-left">GROUP</CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-2">
                         {availableGroups.map(group => (
                             <FilterCheckbox
                                key={group}
                                id={`group-${group}`}
                                label={group}
                                checked={selectedGroups.includes(group)}
                                onCheckedChange={() => onGroupChange(group)}
                            />
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            )}

             {selectedGroups.length > 0 && (
                 <Collapsible defaultOpen={true}>
                    <CollapsibleTrigger className="font-semibold w-full text-left">SUB CATEGORY</CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-2">
                         {availableSubcategories.map(sub => (
                             <FilterCheckbox
                                key={sub}
                                id={`sub-${sub}`}
                                label={sub}
                                checked={selectedSubcategories.includes(sub)}
                                onCheckedChange={() => onSubcategoryChange(sub)}
                            />
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            )}

            <Collapsible defaultOpen={true}>
                <CollapsibleTrigger className="font-semibold w-full text-left">BRAND</CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-2">
                     {allBrands.map(brand => (
                        <FilterCheckbox
                            key={brand}
                            id={`brand-${brand}`}
                            label={brand}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => onBrandChange(brand)}
                         />
                    ))}
                </CollapsibleContent>
            </Collapsible>
            
             <div>
                <Label htmlFor="price-range" className="font-semibold">PRICE</Label>
                <Slider
                    id="price-range"
                    min={0}
                    max={65000}
                    step={1000}
                    value={priceRange}
                    onValueChange={onPriceChange}
                    className="mt-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>৳{priceRange[0]}</span>
                    <span>৳{priceRange[1]}</span>
                </div>
            </div>
             <div className="flex justify-between gap-2 pt-4 border-t">
                <Button variant="secondary" className="flex-1" onClick={onReset}>Clear All</Button>
                <Button className="flex-1" onClick={onApply}>Apply</Button>
            </div>
        </div>
    )
}

    