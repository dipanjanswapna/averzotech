
'use client';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import React from 'react';
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
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const allProducts = [
    // Men's Products
    { id: 'm-tshirt-1', name: 'Graphic Print T-Shirt', brand: 'H&M', price: 1299, category: 'Men', group: 'Topwear', subcategory: 'T-Shirts', src: 'https://placehold.co/400x500.png', dataAiHint: 'men graphic t-shirt' },
    { id: 'm-shirt-1', name: 'Linen Casual Shirt', brand: 'Zara', price: 2999, category: 'Men', group: 'Topwear', subcategory: 'Casual Shirts', src: 'https://placehold.co/400x500.png', dataAiHint: 'men linen shirt' },
    { id: 'm-jeans-1', name: 'Slim Fit Jeans', brand: 'Levis', price: 3999, category: 'Men', group: 'Bottomwear', subcategory: 'Jeans', src: 'https://placehold.co/400x500.png', dataAiHint: 'men slim jeans' },
    { id: 'm-shoes-1', name: 'Running Shoes', brand: 'Nike', price: 7999, category: 'Men', group: 'Footwear', subcategory: 'Sports Shoes', src: 'https://placehold.co/400x500.png', dataAiHint: 'men running shoes' },
    { id: 'm-watch-1', name: 'Chronograph Watch', brand: 'Fossil', price: 9999, category: 'Men', group: 'Accessories', subcategory: 'Watches', src: 'https://placehold.co/400x500.png', dataAiHint: 'men chronograph watch' },
    { id: 'm-trousers-1', name: 'Chino Trousers', brand: 'Celio', price: 2499, category: 'Men', group: 'Bottomwear', subcategory: 'Casual Trousers', src: 'https://placehold.co/400x500.png', dataAiHint: 'men chino trousers' },

    // Women's Products
    { id: 'w-kurta-1', name: 'Embroidered Kurta', brand: 'Biba', price: 2499, category: 'Women', group: 'Indian & Fusion Wear', subcategory: 'Kurtas & Suits', src: 'https://placehold.co/400x500.png', dataAiHint: 'woman ethnic wear' },
    { id: 'w-dress-1', name: 'Floral Maxi Dress', brand: 'Zara', price: 4999, category: 'Women', group: 'Western Wear', subcategory: 'Dresses', src: 'https://placehold.co/400x500.png', dataAiHint: 'woman floral dress' },
    { id: 'w-jeans-1', name: 'High-Waist Jeans', brand: 'Vero Moda', price: 3499, category: 'Women', group: 'Western Wear', subcategory: 'Jeans', src: 'https://placehold.co/400x500.png', dataAiHint: 'woman high-waist jeans' },
    { id: 'w-heels-1', name: 'Stiletto Heels', brand: 'Catwalk', price: 2999, category: 'Women', group: 'Footwear', subcategory: 'Heels', src: 'https://placehold.co/400x500.png', dataAiHint: 'stiletto heels' },
    { id: 'w-bag-1', name: 'Leather Handbag', brand: 'Caprese', price: 3999, category: 'Women', group: 'Jewellery & Accessories', subcategory: 'Handbags', src: 'https://placehold.co/400x500.png', dataAiHint: 'leather handbag' },
    { id: 'w-saree-1', name: 'Silk Saree', brand: 'Manyavar', price: 7999, category: 'Women', group: 'Indian & Fusion Wear', subcategory: 'Sarees', src: 'https://placehold.co/400x500.png', dataAiHint: 'woman in saree' },

    // Kids' Products
    { id: 'k-tshirt-1', name: 'Dino Print T-Shirt', brand: "Gini & Jony", price: 799, category: 'Kids', group: 'Boys Clothing', subcategory: 'T-Shirts', src: 'https://placehold.co/400x500.png', dataAiHint: 'dinosaur t-shirt' },
    { id: 'k-dress-1', name: 'Princess Dress', brand: 'Barbie', price: 1999, category: 'Kids', group: 'Girls Clothing', subcategory: 'Dresses', src: 'https://placehold.co/400x500.png', dataAiHint: 'girl princess dress' },
    { id: 'k-toy-1', name: 'Remote Control Car', brand: 'Hot Wheels', price: 1499, category: 'Kids', group: 'Toys & Games', subcategory: 'Action Figures', src: 'https://placehold.co/400x500.png', dataAiHint: 'remote control car' },
    
    // Home & Living Products
    { id: 'h-bedsheet-1', name: 'Cotton Bedsheet', brand: 'Spaces', price: 1999, category: 'Home & Living', group: 'Bed & Bath', subcategory: 'Bedsheets', src: 'https://placehold.co/400x500.png', dataAiHint: 'cotton bedsheet' },
    { id: 'h-decor-1', name: 'Ceramic Vase', brand: 'Home Centre', price: 999, category: 'Home & Living', group: 'Decor', subcategory: 'Vases', src: 'https://placehold.co/400x500.png', dataAiHint: 'ceramic vase' },

    // Beauty Products
    { id: 'b-lipstick-1', name: 'Matte Lipstick', brand: 'MAC', price: 1799, category: 'Beauty', group: 'Makeup', subcategory: 'Lipstick', src: 'https://placehold.co/400x500.png', dataAiHint: 'matte lipstick' },
    { id: 'b-sunscreen-1', name: 'SPF 50 Sunscreen', brand: 'Neutrogena', price: 899, category: 'Beauty', group: 'Skincare', subcategory: 'Sunscreen', src: 'https://placehold.co/400x500.png', dataAiHint: 'sunscreen bottle' },

    // Electronics Products
    { id: 'e-phone-1', name: 'Smartphone Pro', brand: 'Samsung', price: 79999, category: 'Electronics', group: 'Mobiles & Wearables', subcategory: 'Smartphones', src: 'https://placehold.co/400x500.png', dataAiHint: 'smartphone' },
    { id: 'e-laptop-1', name: 'Ultrabook Laptop', brand: 'Dell', price: 99999, category: 'Electronics', group: 'Laptops & Computers', subcategory: 'Laptops', src: 'https://placehold.co/400x500.png', dataAiHint: 'ultrabook laptop' },
    
    // Sports Products
    { id: 's-bat-1', name: 'Cricket Bat', brand: 'MRF', price: 4999, category: 'Sports', group: 'Cricket', subcategory: 'Bats', src: 'https://placehold.co/400x500.png', dataAiHint: 'cricket bat' },
    { id: 's-shoes-1', name: 'Football Boots', brand: 'Adidas', price: 6999, category: 'Sports', group: 'Football', subcategory: 'Boots', src: 'https://placehold.co/400x500.png', dataAiHint: 'football boots' },
    
    // Books Products
    { id: 'bk-fiction-1', name: 'Mystery Novel', brand: 'Penguin', price: 499, category: 'Books', group: 'Fiction', subcategory: 'Mystery', src: 'https://placehold.co/400x500.png', dataAiHint: 'mystery book' },
    { id: 'bk-nonfic-1', name: 'Historical Biography', brand: 'HarperCollins', price: 799, category: 'Books', group: 'Non-Fiction', subcategory: 'Biography', src: 'https://placehold.co/400x500.png', dataAiHint: 'history book' },
];

const filterCategories = [
    { 
      name: 'Men',
      groups: [
        { name: 'Topwear', subcategories: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Sweatshirts', 'Jackets'] },
        { name: 'Bottomwear', subcategories: ['Jeans', 'Casual Trousers', 'Formal Trousers', 'Shorts', 'Track Pants'] },
        { name: 'Footwear', subcategories: ['Casual Shoes', 'Sports Shoes', 'Formal Shoes', 'Sneakers', 'Sandals'] },
        { name: 'Accessories', subcategories: ['Watches', 'Wallets', 'Belts', 'Sunglasses', 'Bags'] }
      ]
    },
    { 
      name: 'Women', 
      groups: [
        { name: 'Indian & Fusion Wear', subcategories: ['Kurtas & Suits', 'Sarees', 'Lehengas', 'Ethnic Gowns'] },
        { name: 'Western Wear', subcategories: ['Dresses', 'Tops', 'T-Shirts', 'Jeans', 'Skirts'] },
        { name: 'Footwear', subcategories: ['Flats', 'Heels', 'Boots', 'Sports Shoes'] },
        { name: 'Jewellery & Accessories', subcategories: ['Earrings', 'Necklaces', 'Handbags', 'Watches'] }
      ]
    },
    { name: 'Kids', groups: [
        { name: 'Boys Clothing', subcategories: ['T-Shirts', 'Shirts', 'Jeans', 'Shorts'] },
        { name: 'Girls Clothing', subcategories: ['Dresses', 'Tops', 'Skirts', 'T-shirts'] },
        { name: 'Infants', subcategories: ['Rompers', 'Bodysuits', 'Sleepwear'] },
        { name: 'Toys & Games', subcategories: ['Action Figures', 'Dolls', 'Board Games', 'Puzzles'] }
    ]},
    { name: 'Home & Living', groups: [
        { name: 'Bed & Bath', subcategories: ['Bedsheets', 'Pillows', 'Towels', 'Bathrobes'] },
        { name: 'Decor', subcategories: ['Vases', 'Photo Frames', 'Wall Art', 'Candles'] },
        { name: 'Kitchen & Dining', subcategories: ['Dinnerware', 'Cookware', 'Storage', 'Cutlery'] }
    ]},
    { name: 'Beauty', groups: [
        { name: 'Makeup', subcategories: ['Lipstick', 'Foundation', 'Mascara', 'Eyeshadow'] },
        { name: 'Skincare', subcategories: ['Moisturizer', 'Cleanser', 'Sunscreen', 'Face Masks'] },
        { name: 'Fragrance', subcategories: ['Perfumes', 'Deodorants', 'Body Mists'] },
        { name: 'Haircare', subcategories: ['Shampoo', 'Conditioner', 'Hair Oil', 'Styling Tools'] }
    ]},
    { name: 'Electronics', groups: [
        { name: 'Mobiles & Wearables', subcategories: ['Smartphones', 'Smartwatches', 'Headphones', 'Speakers']},
        { name: 'Laptops & Computers', subcategories: ['Laptops', 'Desktops', 'Monitors', 'Keyboards', 'Mouse']},
        { name: 'Cameras & Drones', subcategories: ['DSLRs', 'Mirrorless Cameras', 'Drones', 'Action Cameras']},
    ]},
    { name: 'Sports', groups: [
        { name: 'Cricket', subcategories: ['Bats', 'Balls', 'Pads', 'Gloves']},
        { name: 'Football', subcategories: ['Footballs', 'Jerseys', 'Boots', 'Shin Guards']},
        { name: 'Fitness', subcategories: ['Dumbbells', 'Yoga Mats', 'Resistance Bands', 'Trackers']},
    ]},
    { name: 'Books', groups: [
        { name: 'Fiction', subcategories: ['Mystery', 'Thriller', 'Sci-Fi', 'Fantasy', 'Romance']},
        { name: 'Non-Fiction', subcategories: ['Biography', 'History', 'Self-Help', 'Business']},
        { name: "Children's Books", subcategories: ['Picture Books', 'Story Books', 'Young Adult']},
    ]},
];

export default function ShopPage() {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = React.useState(false);
  const [displayedItems, setDisplayedItems] = React.useState(allProducts);
  
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedGroup, setSelectedGroup] = React.useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string>("all");
  const [selectedBrand, setSelectedBrand] = React.useState<string>("all");
  const [priceRange, setPriceRange] = React.useState([0, 100000]);
  const [sortOption, setSortOption] = React.useState("featured");

  const availableBrands = React.useMemo(() => {
    let brands = allProducts;
    if (selectedCategory !== 'all') {
      brands = brands.filter(p => p.category === selectedCategory);
    }
    return [...new Set(brands.map(item => item.brand))];
  }, [selectedCategory]);

  const availableGroups = React.useMemo(() => {
    if (selectedCategory === 'all') return [];
    const category = filterCategories.find(c => c.name === selectedCategory);
    return category ? category.groups : [];
  }, [selectedCategory]);

  const availableSubcategories = React.useMemo(() => {
    if (selectedGroup === 'all' || !availableGroups.length) return [];
    const group = availableGroups.find(g => g.name === selectedGroup);
    return group ? group.subcategories : [];
  }, [selectedGroup, availableGroups]);

  const applyFilters = React.useCallback(() => {
    let items = [...allProducts];

    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }
    if (selectedGroup !== 'all') {
      items = items.filter(item => item.group === selectedGroup);
    }
    if (selectedSubcategory !== 'all') {
        items = items.filter(item => item.subcategory === selectedSubcategory);
    }
    if (selectedBrand !== 'all') {
      items = items.filter(item => item.brand === selectedBrand);
    }

    items = items.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);
    
    switch (sortOption) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming higher ID is newer. Replace with actual date logic if available.
        items.sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]));
        break;
      case 'featured':
      default:
        break;
    }

    setDisplayedItems(items);
    setIsFilterSheetOpen(false); // Close sheet on mobile after applying
  }, [selectedCategory, selectedGroup, selectedSubcategory, selectedBrand, priceRange, sortOption]);
  
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedGroup("all");
    setSelectedSubcategory("all");
    setSelectedBrand("all");
    setPriceRange([0, 100000]);
    setSortOption("featured");
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedGroup("all");
    setSelectedSubcategory("all");
    setSelectedBrand("all"); // Reset brand when category changes
  };
  
  const handleGroupChange = (value: string) => {
      setSelectedGroup(value);
      setSelectedSubcategory("all");
  };

  const filterControls = (
      <FilterControls 
        onApply={applyFilters}
        onReset={handleResetFilters}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        
        availableGroups={availableGroups}
        selectedGroup={selectedGroup}
        onGroupChange={handleGroupChange}
        
        availableSubcategories={availableSubcategories}
        selectedSubcategory={selectedSubcategory}
        onSubcategoryChange={setSelectedSubcategory}
        
        availableBrands={availableBrands}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
      />
  );
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-8">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-headline font-bold">Shop</h1>
             <div className="flex items-center gap-4">
                 <div className="md:hidden">
                    <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                      <SheetTrigger asChild>
                         <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                      </SheetTrigger>
                      <SheetContent className="w-[300px]">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                          <SheetDescription>
                            Refine your search for the best products.
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
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="hidden md:block md:col-span-1">
                 <div className="sticky top-24">
                     <h2 className="text-xl font-semibold mb-4">Filters</h2>
                     {filterControls}
                 </div>
            </aside>

            <div className="md:col-span-3">
              {displayedItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                    {displayedItems.map((item) => (
                        <Link href={`/product/${item.id}`} key={item.id} className="group block border p-2 rounded-lg hover:shadow-lg transition-shadow duration-300">
                            <div className="relative overflow-hidden rounded-lg">
                                <Image
                                    src={item.src}
                                    alt={item.name}
                                    width={400}
                                    height={500}
                                    className="h-auto w-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={item.dataAiHint}
                                />
                            </div>
                            <div className="pt-2 px-1">
                                <h3 className="text-sm font-bold text-foreground">{item.brand}</h3>
                                <p className="text-xs text-muted-foreground truncate">{item.name}</p>
                                <p className="text-sm font-semibold mt-1 text-foreground">
                                    ৳{item.price}
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
    onApply: () => void;
    onReset: () => void;
    priceRange: number[];
    onPriceChange: (value: number[]) => void;
    
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    
    availableGroups: { name: string; subcategories: string[] }[];
    selectedGroup: string;
    onGroupChange: (value: string) => void;

    availableSubcategories: string[];
    selectedSubcategory: string;
    onSubcategoryChange: (value: string) => void;

    availableBrands: string[];
    selectedBrand: string;
    onBrandChange: (value: string) => void;
}

function FilterControls({ 
    onApply,
    onReset,
    priceRange,
    onPriceChange,
    selectedCategory,
    onCategoryChange,
    availableGroups,
    selectedGroup,
    onGroupChange,
    availableSubcategories,
    selectedSubcategory,
    onSubcategoryChange,
    availableBrands,
    selectedBrand,
    onBrandChange
}: FilterControlsProps) {

    return (
        <Card className="p-4">
            <Accordion type="multiple" defaultValue={['category', 'brand', 'price']} className="w-full">
                <AccordionItem value="category">
                    <AccordionTrigger className="font-semibold">Category</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <div>
                            <Label>Mother Category</Label>
                            <Select value={selectedCategory} onValueChange={onCategoryChange}>
                                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {filterCategories.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedCategory !== 'all' && availableGroups.length > 0 && (
                            <div>
                                <Label>Group</Label>
                                <Select value={selectedGroup} onValueChange={onGroupChange}>
                                    <SelectTrigger><SelectValue placeholder="Select Group" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Groups</SelectItem>
                                        {availableGroups.map(g => <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {selectedGroup !== 'all' && availableSubcategories.length > 0 && (
                            <div>
                                <Label>Subcategory</Label>
                                <Select value={selectedSubcategory} onValueChange={onSubcategoryChange}>
                                    <SelectTrigger><SelectValue placeholder="Select Subcategory" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Subcategories</SelectItem>
                                        {availableSubcategories.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="brand">
                    <AccordionTrigger className="font-semibold">Brand</AccordionTrigger>
                    <AccordionContent>
                        <Select value={selectedBrand} onValueChange={onBrandChange} disabled={!availableBrands.length}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Brand" />
                            </SelectTrigger>
                            <SelectContent>
                               <SelectItem value="all">All Brands</SelectItem>
                                 {availableBrands.map(brand => (
                                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="price">
                    <AccordionTrigger className="font-semibold">Price Range</AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <Slider
                            min={0}
                            max={100000}
                            step={1000}
                            value={priceRange}
                            onValueChange={onPriceChange}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>৳{priceRange[0]}</span>
                            <span>৳{priceRange[1]}</span>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <div className="flex justify-between gap-2 mt-6">
                <Button variant="ghost" className="flex-1" onClick={onReset}>Reset</Button>
                <Button className="flex-1 md:hidden" onClick={onApply}>Apply</Button>
            </div>
        </Card>
    )
}
