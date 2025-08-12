
'use client';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Filter, X, Heart } from 'lucide-react';
import React from 'react';
import {
  Sheet,
  SheetContent,
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
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { collection, getDocs, query, where, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useWishlist, WishlistItem } from '@/hooks/use-wishlist';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  brand: string;
  pricing: {
    price: number;
    comparePrice?: number;
    discount?: number;
  };
  organization: {
    category: string;
    group: string;
    subcategory: string;
  };
  inventory: {
    availability: string;
  },
  images: string[];
  dataAiHint?: string;
}

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

function ShopPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = React.useState(false);
  const [displayedItems, setDisplayedItems] = React.useState<Product[]>([]);
  const [activeCampaign, setActiveCampaign] = React.useState<{id: string, name: string} | null>(null);

  // State initialization from URL search params
  const [selectedCategory, setSelectedCategory] = React.useState<string>(searchParams.get('category') || 'all');
  const [selectedGroup, setSelectedGroup] = React.useState<string>(searchParams.get('group') || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string>(searchParams.get('subcategory') || 'all');
  const [selectedBrand, setSelectedBrand] = React.useState<string>(searchParams.get('brand') || 'all');
  const [priceRange, setPriceRange] = React.useState<[number, number]>(() => {
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    return [min ? Number(min) : 0, max ? Number(max) : 120000];
  });
  const [sortOption, setSortOption] = React.useState<string>(searchParams.get('sort') || 'featured');

  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const campaignId = searchParams.get('campaign');
        let productList: Product[] = [];

        if (campaignId) {
            const campaignRef = doc(db, 'campaigns', campaignId);
            const campaignSnap = await getDoc(campaignRef);
            if (campaignSnap.exists()) {
                setActiveCampaign({ id: campaignId, name: campaignSnap.data().name });
                const productIds = campaignSnap.data().products;
                if (productIds && productIds.length > 0) {
                    const productPromises = productIds.map((id: string) => getDoc(doc(db, "products", id)));
                    const productDocs = await Promise.all(productPromises);
                    productList = productDocs
                      .filter(doc => doc.exists())
                      .map(doc => ({ id: doc.id, ...doc.data() } as Product));
                }
            }
        } else {
            setActiveCampaign(null);
            const productsCollection = collection(db, 'products');
            const productSnapshot = await getDocs(productsCollection);
            productList = productSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as Product));
        }
        setAllProducts(productList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const updateURL = React.useCallback((newFilters: Record<string, string | number | number[]>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && (Array.isArray(value) ? value.length > 0 : true)) {
        if(key === 'priceRange' && Array.isArray(value)) {
            params.set('minPrice', String(value[0]));
            params.set('maxPrice', String(value[1]));
        } else {
            params.set(key, String(value));
        }
      } else {
        params.delete(key);
        if (key === 'priceRange') {
            params.delete('minPrice');
            params.delete('maxPrice');
        }
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

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

   const availableBrands = React.useMemo(() => {
    let brands = allProducts;
    if (selectedCategory !== 'all') {
      brands = brands.filter(p => p.organization.category === selectedCategory);
    }
    if (selectedGroup !== 'all') {
      brands = brands.filter(p => p.organization.group === selectedGroup);
    }
    if (selectedSubcategory !== 'all') {
      brands = brands.filter(p => p.organization.subcategory === selectedSubcategory);
    }
    return [...new Set(brands.map(item => item.brand))];
  }, [allProducts, selectedCategory, selectedGroup, selectedSubcategory]);

  const applyFilters = React.useCallback(() => {
    if (loading) return;
    let items = [...allProducts];
    const currentParams = new URLSearchParams(searchParams);

    const category = currentParams.get('category') || 'all';
    const group = currentParams.get('group') || 'all';
    const subcategory = currentParams.get('subcategory') || 'all';
    const brand = currentParams.get('brand') || 'all';
    const minPrice = Number(currentParams.get('minPrice') || 0);
    const maxPrice = Number(currentParams.get('maxPrice') || 120000);
    const sort = currentParams.get('sort') || 'featured';

    if (category !== 'all') items = items.filter(item => item.organization.category === category);
    if (group !== 'all') items = items.filter(item => item.organization.group === group);
    if (subcategory !== 'all') items = items.filter(item => item.organization.subcategory === subcategory);
    if (brand !== 'all') items = items.filter(item => item.brand === brand);
    
    items = items.filter(item => item.pricing.price >= minPrice && item.pricing.price <= maxPrice);

    switch (sort) {
      case 'price-asc':
        items.sort((a, b) => a.pricing.price - b.pricing.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.pricing.price - a.pricing.price);
        break;
      case 'newest':
        // Assuming Firestore data has a timestamp, which it does ('createdAt')
        // but we are not fetching it in the Product interface yet. For now, reverse is fine.
        items.reverse();
        break;
    }
    setDisplayedItems(items);
  }, [searchParams, allProducts, loading]);

  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  
  const handleResetFilters = () => {
    router.push(pathname);
    setSelectedCategory('all');
    setSelectedGroup('all');
    setSelectedSubcategory('all');
    setSelectedBrand('all');
    setPriceRange([0, 120000]);
    setSortOption('featured');
  };

  const createFilterHandler = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, name: string) => {
    return (value: T) => {
      setter(value);
      let updatedFilters: Record<string, any> = {[name]: value};

      if (name === 'selectedCategory') {
          updatedFilters = {...updatedFilters, selectedGroup: 'all', selectedSubcategory: 'all', selectedBrand: 'all' };
          setSelectedGroup('all');
          setSelectedSubcategory('all');
          setSelectedBrand('all');
      } else if (name === 'selectedGroup') {
          updatedFilters = {...updatedFilters, selectedSubcategory: 'all' };
          setSelectedSubcategory('all');
      }
      updateURL(updatedFilters);
    };
  };

  const handlePriceChange = (value: number[]) => {
      setPriceRange(value as [number, number]);
  }

  const handlePriceCommit = (value: number[]) => {
      updateURL({ priceRange: value });
  }

  const handleSortChange = (value: string) => {
      setSortOption(value);
      updateURL({ sort: value });
  }

  const handleWishlistToggle = (item: Product) => {
      const isInWishlist = wishlist.some(w => w.id === item.id);
      if (isInWishlist) {
          removeFromWishlist(item.id);
          toast({ title: "Removed from Wishlist" });
      } else {
          addToWishlist(item as WishlistItem);
          toast({ title: "Added to Wishlist" });
      }
  }

  const filterControls = (
      <FilterControls 
        onReset={handleResetFilters}
        priceRange={priceRange}
        onPriceChange={handlePriceChange}
        onPriceCommit={handlePriceCommit}
        
        selectedCategory={selectedCategory}
        onCategoryChange={createFilterHandler(setSelectedCategory, 'category')}
        
        availableGroups={availableGroups}
        selectedGroup={selectedGroup}
        onGroupChange={createFilterHandler(setSelectedGroup, 'group')}
        
        availableSubcategories={availableSubcategories}
        selectedSubcategory={selectedSubcategory}
        onSubcategoryChange={createFilterHandler(setSelectedSubcategory, 'subcategory')}
        
        availableBrands={availableBrands}
        selectedBrand={selectedBrand}
        onBrandChange={createFilterHandler(setSelectedBrand, 'brand')}
      />
  );
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-8">
        <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-headline font-bold">Shop</h1>
              {activeCampaign && <p className="text-muted-foreground">{activeCampaign.name}</p>}
            </div>
             <div className="flex items-center gap-4">
                 <div className="md:hidden">
                    <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                      <SheetTrigger asChild>
                         <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                      </SheetTrigger>
                      <SheetContent className="w-[300px] p-0">
                        <SheetHeader className="p-4 border-b">
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="p-4 overflow-y-auto">
                           {filterControls}
                           <Button className="w-full mt-4" onClick={() => setIsFilterSheetOpen(false)}>View Results</Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                 </div>
                  <Select value={sortOption} onValueChange={handleSortChange}>
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
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Showing {displayedItems.length} of {allProducts.length} products</p>
              </div>
              {loading ? (
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
              ) : displayedItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                    {displayedItems.map((item) => {
                      const isInWishlist = wishlist.some(w => w.id === item.id);
                      return (
                       <div key={item.id} className="group block">
                            <div className="relative overflow-hidden rounded-lg">
                                <Link href={`/product/${item.id}`}>
                                  <Image
                                      src={item.images[0] || 'https://placehold.co/400x500.png'}
                                      alt={item.name}
                                      width={400}
                                      height={500}
                                      className="h-auto w-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105"
                                      data-ai-hint={item.dataAiHint || 'product image'}
                                  />
                                </Link>
                                <Button 
                                  variant="secondary" 
                                  size="icon" 
                                  className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 bg-white/80 hover:bg-white"
                                  onClick={() => handleWishlistToggle(item)}
                                >
                                    <Heart className={cn("h-4 w-4", isInWishlist ? "text-red-500 fill-red-500" : "text-foreground")} />
                                </Button>
                            </div>
                            <div className="pt-2">
                                <h3 className="text-sm font-bold text-foreground">{item.brand}</h3>
                                <p className="text-xs text-muted-foreground truncate">{item.name}</p>
                                <p className="text-sm font-semibold mt-1 text-foreground">
                                    ৳{item.pricing.price}{' '}
                                    {item.pricing.comparePrice && <span className="text-xs text-muted-foreground line-through">৳{item.pricing.comparePrice}</span>}
                                    {' '}
                                    {item.pricing.discount && <span className="text-xs text-orange-400 font-bold">({item.pricing.discount}% OFF)</span>}
                                </p>
                            </div>
                        </div>
                      )
                    })}
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

export default function ShopPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <ShopPageContent />
        </React.Suspense>
    )
}

interface FilterControlsProps {
    onReset: () => void;
    priceRange: number[];
    onPriceChange: (value: number[]) => void;
    onPriceCommit: (value: number[]) => void;
    
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
    onReset,
    priceRange,
    onPriceChange,
    onPriceCommit,
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
                    <AccordionContent className="space-y-4 pt-4">
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
                    <AccordionContent className="pt-4">
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
                            max={120000}
                            step={1000}
                            value={priceRange}
                            onValueChange={onPriceChange}
                            onValueCommit={onPriceCommit}
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
            </div>
        </Card>
    )
}
