
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
import { Label } from '@/components/ui/label';
import { Trash2, GripVertical, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, app } from '@/lib/firebase';
import Image from 'next/image';

interface ContentItem {
  file?: File;
  preview: string;
  alt: string;
  dataAiHint: string;
  url?: string;
  link?: string;
  name?: string;
  discount?: string;
}

export default function MenPageManager() {
  const { toast } = useToast();
  const storage = getStorage(app);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [heroImages, setHeroImages] = useState<ContentItem[]>([]);
  const [banner, setBanner] = useState<ContentItem | null>(null);
  const [trendingCategories, setTrendingCategories] = useState<ContentItem[]>([]);
  const [crazyDeals, setCrazyDeals] = useState<ContentItem[]>([]);
  const [shopByCategory, setShopByCategory] = useState<ContentItem[]>([]);

  // Fetch content from Firestore
  useEffect(() => {
    const fetchMenPageContent = async () => {
      setIsFetching(true);
      const docRef = doc(db, 'site_content', 'men_page');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroImages(data.heroImages?.map((img: any) => ({ ...img, preview: img.url })) || []);
        if (data.banner) {
          setBanner({ ...data.banner, preview: data.banner.url });
        }
        setTrendingCategories(data.trendingCategories?.map((item: any) => ({ ...item, preview: item.url })) || []);
        setCrazyDeals(data.crazyDeals?.map((item: any) => ({ ...item, preview: item.url })) || []);
        setShopByCategory(data.shopByCategory?.map((item: any) => ({ ...item, preview: item.url })) || []);
      }
      setIsFetching(false);
    };

    fetchMenPageContent();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, stateSetter: React.Dispatch<React.SetStateAction<any[]>>, stateArray: any[]) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newArray = [...stateArray];
      newArray[index].file = file;
      newArray[index].preview = URL.createObjectURL(file);
      stateSetter(newArray);
    }
  };

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>, stateSetter: React.Dispatch<React.SetStateAction<any>>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        stateSetter((prev: any) => ({
            ...(prev || {}),
            file: file,
            preview: URL.createObjectURL(file)
        }));
    }
  };

  const handleTextChange = (index: number, field: string, value: string, stateSetter: React.Dispatch<React.SetStateAction<any[]>>, stateArray: any[]) => {
    const newArray = [...stateArray];
    newArray[index][field] = value;
    stateSetter(newArray);
  };

  const handleSingleTextChange = (field: string, value: string, stateSetter: React.Dispatch<React.SetStateAction<any>>) => {
    stateSetter((prev: any) => ({
        ...(prev || {}),
        [field]: value
    }));
  };

  const handleAddItem = (stateSetter: React.Dispatch<React.SetStateAction<any[]>>, newItem: any) => {
    stateSetter(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (index: number, stateSetter: React.Dispatch<React.SetStateAction<any[]>>) => {
    stateSetter(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const uploadImage = async (item: any, path: string) => {
        if (!item) return null;
        if (item.file) {
          const storageRef = ref(storage, `site_content/men_page/${path}/${Date.now()}_${item.file.name}`);
          await uploadBytes(storageRef, item.file);
          return getDownloadURL(storageRef);
        }
        return item.url || item.preview;
      };

      const processItems = async (items: ContentItem[], path: string) => {
          return Promise.all(
              items.map(async (item) => {
                  const url = await uploadImage(item, path);
                  const { file, preview, ...rest } = item;
                  return { ...rest, url };
              })
          );
      };

      const updatedHeroImages = await processItems(heroImages, 'hero');
      const updatedTrending = await processItems(trendingCategories, 'trending');
      const updatedDeals = await processItems(crazyDeals, 'deals');
      const updatedCategories = await processItems(shopByCategory, 'categories');
      const updatedBannerUrl = await uploadImage(banner, 'banner');
      const updatedBanner = banner ? { url: updatedBannerUrl, alt: banner.alt, dataAiHint: banner.dataAiHint } : null;


      const menPageContent = {
        heroImages: updatedHeroImages,
        banner: updatedBanner,
        trendingCategories: updatedTrending,
        crazyDeals: updatedDeals,
        shopByCategory: updatedCategories,
      };

      await setDoc(doc(db, 'site_content', 'men_page'), menPageContent, { merge: true });

      toast({
        title: 'Success!',
        description: "Men's Fashion page content has been updated.",
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
        <h1 className="text-3xl font-bold">Men's Fashion Page Management</h1>
        <p className="text-muted-foreground">
          Manage the content for the public-facing Men's Fashion page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section Carousel</CardTitle>
          <CardDescription>Manage the main image carousel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {heroImages.map((image, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-secondary/50">
              <div className="relative w-48 h-24">
                <Image src={image.preview} alt="Hero preview" fill className="object-cover rounded-md" />
              </div>
              <div className="flex-1 space-y-2">
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
           {banner && (
             <div className="flex items-start gap-4 p-4 border rounded-lg bg-secondary/50">
                <div className="relative w-96 h-16">
                    <Image src={banner.preview} alt="Banner preview" fill className="object-cover rounded-md" />
                </div>
                <div className="flex-1 space-y-2">
                    <Input placeholder="Alt Text" value={banner.alt || ''} onChange={(e) => handleSingleTextChange('alt', e.target.value, setBanner)} />
                    <Input placeholder="AI Hint" value={banner.dataAiHint || ''} onChange={(e) => handleSingleTextChange('dataAiHint', e.target.value, setBanner)} />
                    <Input type="file" className="text-xs" onChange={(e) => handleSingleFileChange(e, setBanner)} />
                </div>
            </div>
           )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trending Now</CardTitle>
          <CardDescription>Manage the "Trending Now" category cards.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {trendingCategories.map((item, index) => (
              <div key={index} className="p-2 border rounded-lg space-y-2">
                <Image src={item.preview} alt="Preview" width={300} height={400} className="object-cover rounded-md mx-auto aspect-[3/4]" />
                <Input placeholder="Category Name" value={item.name || ''} onChange={(e) => handleTextChange(index, 'name', e.target.value, setTrendingCategories, trendingCategories)} />
                <Input placeholder="AI Hint" value={item.dataAiHint || ''} onChange={(e) => handleTextChange(index, 'dataAiHint', e.target.value, setTrendingCategories, trendingCategories)} />
                <Input type="file" className="text-xs" onChange={(e) => handleFileChange(e, index, setTrendingCategories, trendingCategories)} />
                <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={() => handleRemoveItem(index, setTrendingCategories)}><Trash2 className="h-4 w-4 mr-2" /> Remove</Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4" onClick={() => handleAddItem(setTrendingCategories, { preview: 'https://placehold.co/300x400.png', name: '', dataAiHint: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Trending Item
          </Button>
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
              <div key={index} className="p-2 border rounded-lg space-y-2">
                <Image src={item.preview} alt="Preview" width={300} height={400} className="object-cover rounded-md mx-auto aspect-[3/4]" />
                <Input placeholder="Deal Name (e.g. Innerwear)" value={item.name || ''} onChange={(e) => handleTextChange(index, 'name', e.target.value, setCrazyDeals, crazyDeals)} />
                <Input placeholder="Discount Text (e.g. MIN. 50% OFF)" value={item.discount || ''} onChange={(e) => handleTextChange(index, 'discount', e.target.value, setCrazyDeals, crazyDeals)} />
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
              <div key={index} className="p-2 border rounded-lg space-y-2">
                <Image src={item.preview} alt="Preview" width={200} height={250} className="object-cover rounded-md mx-auto aspect-[4/5]" />
                <Input placeholder="Category Name (e.g. T-Shirts)" value={item.name || ''} onChange={(e) => handleTextChange(index, 'name', e.target.value, setShopByCategory, shopByCategory)} />
                <Input placeholder="Discount Text (e.g. 40-80% OFF)" value={item.discount || ''} onChange={(e) => handleTextChange(index, 'discount', e.target.value, setShopByCategory, shopByCategory)} />
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
          {isLoading ? 'Saving...' : "Save Men's Page Changes"}
        </Button>
      </div>
    </div>
  );
}
