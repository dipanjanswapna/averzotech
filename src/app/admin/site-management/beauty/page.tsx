
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db, app } from '@/lib/firebase';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContentItem {
  id?: string;
  file?: File;
  preview: string;
  alt: string;
  dataAiHint: string;
  url?: string;
  link?: string;
  name?: string;
  discount?: string;
}

interface ProductForSelection {
    id: string;
    name: string;
    brand: string;
    images: string[];
}

interface TrendingProduct {
    id: string;
    name: string;
    brand: string;
    image: string;
}

export default function BeautyPageManager() {
  const { toast } = useToast();
  const storage = getStorage(app);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductForSelection[]>([]);

  const [heroImages, setHeroImages] = useState<ContentItem[]>([]);
  const [banner, setBanner] = useState<ContentItem | null>(null);
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([]);
  const [crazyDeals, setCrazyDeals] = useState<ContentItem[]>([]);
  const [shopByCategory, setShopByCategory] = useState<ContentItem[]>([]);

  // Fetch content from Firestore
  useEffect(() => {
    const fetchBeautyPageContent = async () => {
      setIsFetching(true);
      const docRef = doc(db, 'site_content', 'beauty_page');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroImages(data.heroImages?.map((img: any) => ({ ...img, preview: img.url, id: Math.random().toString() })) || []);
        if (data.banner) {
          setBanner({ ...data.banner, preview: data.banner.url });
        }
        setTrendingProducts(data.trendingProducts || []);
        setCrazyDeals(data.crazyDeals?.map((item: any) => ({ ...item, preview: item.url, id: Math.random().toString() })) || []);
        setShopByCategory(data.shopByCategory?.map((item: any) => ({ ...item, preview: item.url, id: Math.random().toString() })) || []);
      }
      setIsFetching(false);
    };

    const fetchProducts = async () => {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              brand: data.brand,
              images: data.images
            } as ProductForSelection;
        });
        setAllProducts(productList);
    }

    fetchBeautyPageContent();
    fetchProducts();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, stateSetter: React.Dispatch<React.SetStateAction<any[]>>, stateArray: any[]) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newArray = [...stateArray];
      newArray[index].file = file;
      newArray[index].preview = URL.createObjectURL(file);
      newArray[index].url = '';
      stateSetter(newArray);
    }
  };
  
  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>, stateSetter: React.Dispatch<React.SetStateAction<any>>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        stateSetter((prev: any) => ({
            ...(prev || { preview: '', alt: '', dataAiHint: '' }),
            file: file,
            preview: URL.createObjectURL(file),
            url: ''
        }));
    }
  };

  const handleUrlChange = (index: number, value: string, stateSetter: React.Dispatch<React.SetStateAction<any[]>>, stateArray: any[]) => {
      const newArray = [...stateArray];
      newArray[index].url = value;
      newArray[index].preview = value;
      newArray[index].file = undefined;
      stateSetter(newArray);
  }
  
   const handleSingleUrlChange = (value: string, stateSetter: React.Dispatch<React.SetStateAction<any>>) => {
      stateSetter((prev: any) => ({
        ...(prev || { preview: '', alt: '', dataAiHint: '' }),
        url: value,
        preview: value,
        file: undefined
      }));
  }

  const handleTextChange = (index: number, field: string, value: string, stateSetter: React.Dispatch<React.SetStateAction<any[]>>, stateArray: any[]) => {
    const newArray = [...stateArray];
    newArray[index][field] = value;
    stateSetter(newArray);
  };

  const handleSingleTextChange = (field: string, value: string, stateSetter: React.Dispatch<React.SetStateAction<any>>) => {
    stateSetter((prev: any) => ({
        ...(prev || { preview: '', alt: '', dataAiHint: '' }),
        [field]: value
    }));
  };

  const handleAddItem = (stateSetter: React.Dispatch<React.SetStateAction<any[]>>, newItem: any) => {
    stateSetter(prev => [...prev, { ...newItem, id: Date.now().toString() }]);
  };

  const handleRemoveItem = (index: number, stateSetter: React.Dispatch<React.SetStateAction<any[]>>) => {
    stateSetter(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleToggleTrendingProduct = (product: ProductForSelection) => {
      setTrendingProducts(prevProducts => {
          const isExisting = prevProducts.some(p => p.id === product.id);
          if (isExisting) {
              return prevProducts.filter(p => p.id !== product.id);
          } else {
              return [...prevProducts, { id: product.id, name: product.name, brand: product.brand, image: product.images[0] }];
          }
      });
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const uploadImage = async (item: any, path: string) => {
        if (!item) return null;
        if (item.file) {
          const storageRef = ref(storage, `site_content/beauty_page/${path}/${Date.now()}_${item.file.name}`);
          await uploadBytes(storageRef, item.file);
          return getDownloadURL(storageRef);
        }
        return item.url || item.preview;
      };

      const processItems = async (items: ContentItem[], path: string) => {
          return Promise.all(
              items.map(async (item) => {
                  const url = await uploadImage(item, path);
                  const { file, preview, id, ...rest } = item;
                  return { ...rest, url };
              })
          );
      };

      const updatedHeroImages = await processItems(heroImages, 'hero');
      const updatedDeals = await processItems(crazyDeals, 'deals');
      const updatedCategories = await processItems(shopByCategory, 'categories');
      
      const updatedBannerUrl = await uploadImage(banner, 'banner');
      const updatedBanner = banner ? { url: updatedBannerUrl, alt: banner.alt, dataAiHint: banner.dataAiHint, link: banner.link || '#' } : null;

      const beautyPageContent = {
        heroImages: updatedHeroImages,
        banner: updatedBanner,
        trendingProducts,
        crazyDeals: updatedDeals,
        shopByCategory: updatedCategories,
      };

      await setDoc(doc(db, 'site_content', 'beauty_page'), beautyPageContent, { merge: true });

      toast({
        title: 'Success!',
        description: "Beauty & Personal Care page content has been updated.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error',
        description: `Failed to save changes: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
      return <p>Loading content...</p>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Beauty & Personal Care Page Management</h1>
        <p className="text-muted-foreground">
          Manage the content for the public-facing Beauty & Personal Care page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section Carousel</CardTitle>
          <CardDescription>Manage the main image carousel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {heroImages.map((image, index) => (
            <div key={image.id} className="flex items-start gap-4 p-4 border rounded-lg bg-secondary/50">
              <div className="relative w-48 h-24">
                <Image src={image.preview} alt="Hero preview" fill className="object-cover rounded-md" />
              </div>
              <div className="flex-1 space-y-2">
                <Input placeholder="Image URL" value={image.url || ''} onChange={(e) => handleUrlChange(index, e.target.value, setHeroImages, heroImages)} />
                <Input placeholder="Link URL" value={image.link || ''} onChange={(e) => handleTextChange(index, 'link', e.target.value, setHeroImages, heroImages)} />
                <Input placeholder="Alt Text" value={image.alt || ''} onChange={(e) => handleTextChange(index, 'alt', e.target.value, setHeroImages, heroImages)} />
                <Input placeholder="AI Hint" value={image.dataAiHint || ''} onChange={(e) => handleTextChange(index, 'dataAiHint', e.target.value, setHeroImages, heroImages)} />
                <Input type="file" className="text-xs" onChange={(e) => handleFileChange(e, index, setHeroImages, heroImages)} />
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index, setHeroImages)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" className="mt-4" onClick={() => handleAddItem(setHeroImages, { preview: 'https://placehold.co/1200x400.png', alt: '', dataAiHint: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Hero Image
          </Button>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Savings Banner</CardTitle>
          <CardDescription>Manage the banner image below the carousel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {banner ? (
             <div className="flex items-start gap-4 p-4 border rounded-lg bg-secondary/50">
                <div className="relative w-96 h-24">
                    <Image src={banner.preview} alt="Banner preview" fill className="object-cover rounded-md" />
                </div>
                <div className="flex-1 space-y-2">
                    <Input placeholder="Image URL" value={banner.url || ''} onChange={(e) => handleSingleUrlChange(e.target.value, setBanner)} />
                    <Input placeholder="Link URL" value={banner.link || ''} onChange={(e) => handleSingleTextChange('link', e.target.value, setBanner)} />
                    <Input placeholder="Alt Text" value={banner.alt || ''} onChange={(e) => handleSingleTextChange('alt', e.target.value, setBanner)} />
                    <Input placeholder="AI Hint" value={banner.dataAiHint || ''} onChange={(e) => handleSingleTextChange('dataAiHint', e.target.value, setBanner)} />
                    <Input type="file" className="text-xs" onChange={(e) => handleSingleFileChange(e, setBanner)} />
                </div>
            </div>
           ) : (
            <Button variant="outline" onClick={() => setBanner({ preview: 'https://placehold.co/1200x200.png', alt: '', dataAiHint: '', link: '#' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Banner
            </Button>
           )}
        </CardContent>
      </Card>

       <Card>
          <CardHeader>
              <CardTitle>Trending Now</CardTitle>
              <CardDescription>Select which products to feature in the "Trending Now" carousel.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {trendingProducts.map(product => (
                      <div key={product.id} className="border rounded-lg p-2 text-center relative group">
                          <Image src={product.image} alt={product.name} width={100} height={100} className="object-cover rounded-md mx-auto aspect-square"/>
                          <p className="text-xs font-semibold mt-1 truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                          <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleToggleTrendingProduct({id: product.id, name: product.name, brand: product.brand, images: [product.image]})}>
                              <Trash2 className="h-3 w-3" />
                          </Button>
                      </div>
                  ))}
              </div>
               <Dialog open={isProductSelectorOpen} onOpenChange={setIsProductSelectorOpen}>
                  <DialogTrigger asChild>
                      <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Select Trending Products</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                      <DialogHeader>
                          <DialogTitle>Select "Trending Now" Products</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-96">
                          <div className="grid grid-cols-3 gap-4 p-4">
                              {allProducts.map(product => {
                                  const isSelected = trendingProducts.some(p => p.id === product.id);
                                  return (
                                      <div key={product.id} className={`border rounded-lg p-2 text-center cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`} onClick={() => handleToggleTrendingProduct(product)}>
                                          <Image src={product.images[0]} alt={product.name} width={100} height={100} className="object-cover rounded-md mx-auto aspect-square"/>
                                          <p className="text-xs font-semibold mt-1 truncate">{product.name}</p>
                                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                                      </div>
                                  )
                              })}
                          </div>
                      </ScrollArea>
                  </DialogContent>
              </Dialog>
          </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Crazy Deals</CardTitle>
          <CardDescription>Manage the "Crazy Deals" section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {crazyDeals.map((item, index) => (
              <div key={item.id} className="p-2 border rounded-lg space-y-2">
                <Image src={item.preview} alt="Preview" width={300} height={400} className="object-cover rounded-md mx-auto aspect-[3/4]" />
                <Input placeholder="Image URL" value={item.url || ''} onChange={(e) => handleUrlChange(index, e.target.value, setCrazyDeals, crazyDeals)} />
                <Input placeholder="Deal Name (e.g. Innerwear)" value={item.name || ''} onChange={(e) => handleTextChange(index, 'name', e.target.value, setCrazyDeals, crazyDeals)} />
                <Input placeholder="Discount Text (e.g. MIN. 50% OFF)" value={item.discount || ''} onChange={(e) => handleTextChange(index, 'discount', e.target.value, setCrazyDeals, crazyDeals)} />
                <Input placeholder="Link URL" value={item.link || ''} onChange={(e) => handleTextChange(index, 'link', e.target.value, setCrazyDeals, crazyDeals)} />
                <Input placeholder="AI Hint" value={item.dataAiHint || ''} onChange={(e) => handleTextChange(index, 'dataAiHint', e.target.value, setCrazyDeals, crazyDeals)} />
                <Input type="file" className="text-xs" onChange={(e) => handleFileChange(e, index, setCrazyDeals, crazyDeals)} />
                <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={() => handleRemoveItem(index, setCrazyDeals)}><Trash2 className="h-4 w-4 mr-2" /> Remove</Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4" onClick={() => handleAddItem(setCrazyDeals, { preview: 'https://placehold.co/300x400.png', name: '', discount: '', dataAiHint: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Deal
          </Button>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Shop by Category</CardTitle>
          <CardDescription>Manage the "Shop by Category" section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shopByCategory.map((item, index) => (
              <div key={item.id} className="p-2 border rounded-lg space-y-2">
                <Image src={item.preview} alt="Preview" width={200} height={250} className="object-cover rounded-md mx-auto aspect-[4/5]" />
                <Input placeholder="Image URL" value={item.url || ''} onChange={(e) => handleUrlChange(index, e.target.value, setShopByCategory, shopByCategory)} />
                <Input placeholder="Category Name (e.g. T-Shirts)" value={item.name || ''} onChange={(e) => handleTextChange(index, 'name', e.target.value, setShopByCategory, shopByCategory)} />
                <Input placeholder="Discount Text (e.g. 40-80% OFF)" value={item.discount || ''} onChange={(e) => handleTextChange(index, 'discount', e.target.value, setShopByCategory, shopByCategory)} />
                <Input placeholder="Link URL" value={item.link || ''} onChange={(e) => handleTextChange(index, 'link', e.target.value, setShopByCategory, shopByCategory)} />
                <Input placeholder="AI Hint" value={item.dataAiHint || ''} onChange={(e) => handleTextChange(index, 'dataAiHint', e.target.value, setShopByCategory, shopByCategory)} />
                <Input type="file" className="text-xs" onChange={(e) => handleFileChange(e, index, setShopByCategory, shopByCategory)} />
                <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={() => handleRemoveItem(index, setShopByCategory)}><Trash2 className="h-4 w-4 mr-2" /> Remove</Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4" onClick={() => handleAddItem(setShopByCategory, { preview: 'https://placehold.co/200x250.png', name: '', discount: '', dataAiHint: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end sticky bottom-4">
        <Button onClick={handleSaveChanges} disabled={isLoading} size="lg" className="shadow-lg">
          {isLoading ? 'Saving...' : "Save Beauty Page Changes"}
        </Button>
      </div>
    </div>
  );
}

    