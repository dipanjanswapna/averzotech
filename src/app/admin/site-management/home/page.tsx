
'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { Trash2, GripVertical, PlusCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db, app } from '@/lib/firebase';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

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
  title?: string;
  subtitle?: string;
  layout?: 'full' | 'half';
}

interface DealProduct {
    id: string;
    name: string;
    brand: string;
    image: string;
}

interface ProductForSelection {
    id: string;
    name: string;
    brand: string;
    images: string[];
}

interface CarouselSettings {
    autoplay: boolean;
    autoplaySpeed: number;
}


export default function HomePageManager() {
  const { toast } = useToast();
  const storage = getStorage(app);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductForSelection[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');


  const [heroImages, setHeroImages] = useState<ContentItem[]>([]);
  const [carouselSettings, setCarouselSettings] = useState<CarouselSettings>({ autoplay: true, autoplaySpeed: 4000 });
  const [brands, setBrands] = useState<ContentItem[]>([]);
  const [deals, setDeals] = useState<DealProduct[]>([]);
  const [categories, setCategories] = useState<ContentItem[]>([]);
  const [ctaImages, setCtaImages] = useState<ContentItem[]>([]);
  
  // Fetch all content from Firestore
  useEffect(() => {
    const fetchHomepageContent = async () => {
      setIsFetching(true);
      const docRef = doc(db, 'site_content', 'homepage');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroImages(data.heroImages?.map((img: any) => ({ ...img, preview: img.url, id: Math.random().toString() })) || []);
        setCarouselSettings(data.carouselSettings || { autoplay: true, autoplaySpeed: 4000 });
        setBrands(data.brands?.map((brand: any) => ({ ...brand, preview: brand.url, id: Math.random().toString() })) || []);
        setDeals(data.deals || []);
        setCategories(data.categories?.map((cat: any) => ({ ...cat, preview: cat.url, id: Math.random().toString() })) || []);
        setCtaImages(data.ctaImages?.map((cta: any) => ({...cta, preview: cta.url, id: Math.random().toString() })) || []);
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

    fetchHomepageContent();
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => 
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(productSearchTerm.toLowerCase())
    );
  }, [allProducts, productSearchTerm]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, stateSetter: React.Dispatch<React.SetStateAction<any[]>>, stateArray: any[]) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const newArray = [...stateArray];
          newArray[index].file = file;
          newArray[index].preview = URL.createObjectURL(file);
          newArray[index].url = ''; // Clear existing URL if a file is chosen
          stateSetter(newArray);
      }
  };

  const handleUrlChange = (index: number, value: string, stateSetter: React.Dispatch<React.SetStateAction<any[]>>, stateArray: any[]) => {
      const newArray = [...stateArray];
      newArray[index].url = value;
      newArray[index].preview = value;
      newArray[index].file = undefined; // Clear existing file if a URL is provided
      stateSetter(newArray);
  }

  const handleTextChange = (index: number, field: string, value: string, stateSetter: React.Dispatch<React.SetStateAction<any[]>>, stateArray: any[]) => {
      const newArray = [...stateArray];
      newArray[index][field] = value;
      stateSetter(newArray);
  };

  const handleAddItem = (stateSetter: React.Dispatch<React.SetStateAction<any[]>>, newItem: any) => {
      stateSetter(prev => [...prev, {...newItem, id: Date.now().toString() }]);
  };
  
  const handleRemoveItem = (index: number, stateSetter: React.Dispatch<React.SetStateAction<any[]>>) => {
    stateSetter(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleToggleDeal = (product: ProductForSelection) => {
      setDeals(prevDeals => {
          const isExisting = prevDeals.some(d => d.id === product.id);
          if (isExisting) {
              return prevDeals.filter(d => d.id !== product.id);
          } else {
              return [...prevDeals, { id: product.id, name: product.name, brand: product.brand, image: product.images[0] }];
          }
      });
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const uploadImage = async (item: ContentItem, path: string) => {
        if (item.file) {
          const storageRef = ref(storage, `${path}/${Date.now()}_${item.file.name}`);
          await uploadBytes(storageRef, item.file);
          return await getDownloadURL(storageRef);
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
      }

      const homepageContent = {
        heroImages: await processItems(heroImages, 'site_content/homepage/hero'),
        carouselSettings,
        brands: await processItems(brands, 'site_content/homepage/brands'),
        deals,
        categories: await processItems(categories, 'site_content/homepage/categories'),
        ctaImages: await processItems(ctaImages, 'site_content/homepage/cta'),
      };

      await setDoc(doc(db, 'site_content', 'homepage'), homepageContent, { merge: true });

      toast({
        title: 'Success!',
        description: 'Homepage content has been updated successfully.',
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
        <h1 className="text-3xl font-bold">Homepage Management</h1>
        <p className="text-muted-foreground">
          Manage the content for your public-facing homepage.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section Carousel</CardTitle>
          <CardDescription>
            Manage the main image carousel at the top of the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="border p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="autoplay-switch" className="font-semibold">Enable Autoplay</Label>
                    <Switch id="autoplay-switch" checked={carouselSettings.autoplay} onCheckedChange={(checked) => setCarouselSettings(s => ({ ...s, autoplay: checked }))} />
                </div>
                {carouselSettings.autoplay && (
                    <div className="space-y-2">
                        <Label htmlFor="autoplay-speed">Autoplay Delay (in seconds)</Label>
                        <Input 
                            id="autoplay-speed" 
                            type="number" 
                            value={carouselSettings.autoplaySpeed / 1000} 
                            onChange={(e) => setCarouselSettings(s => ({ ...s, autoplaySpeed: Number(e.target.value) * 1000 }))}
                            placeholder="e.g. 4"
                        />
                    </div>
                )}
            </div>
            {heroImages.map((image, index) => (
              <div key={image.id} className="flex items-start gap-4 p-4 border rounded-lg bg-secondary/50">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-8 cursor-grab" />
                <div className="relative w-48 h-24">
                  <Image src={image.preview || 'https://placehold.co/800x450.png'} alt="Hero preview" fill className="object-cover rounded-md" />
                </div>
                <div className="flex-1 space-y-2">
                  <Input placeholder="Image URL" value={image.url || ''} onChange={(e) => handleUrlChange(index, e.target.value, setHeroImages, heroImages)} />
                  <Input placeholder="Alt Text" value={image.alt} onChange={(e) => handleTextChange(index, 'alt', e.target.value, setHeroImages, heroImages)} />
                  <Input placeholder="AI Hint" value={image.dataAiHint} onChange={(e) => handleTextChange(index, 'dataAiHint', e.target.value, setHeroImages, heroImages)} />
                  <Input type="file" className="text-xs" onChange={(e) => handleFileChange(e, index, setHeroImages, heroImages)} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index, setHeroImages)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          <Button variant="outline" className="mt-4" onClick={() => handleAddItem(setHeroImages, { preview: 'https://placehold.co/800x450.png', alt: '', dataAiHint: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Hero Image
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Medal-Worthy Brands</CardTitle>
            <CardDescription>Manage the brand logos section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brands.map((brand, index) => (
                <div key={brand.id} className="p-2 border rounded-lg space-y-2">
                    <Image src={brand.preview || 'https://placehold.co/200x200.png'} alt="Brand preview" width={100} height={100} className="object-contain rounded-md mx-auto aspect-square" />
                    <Input placeholder="Image URL" value={brand.url || ''} onChange={(e) => handleUrlChange(index, e.target.value, setBrands, brands)} />
                    <Input placeholder="Alt text" value={brand.alt} onChange={(e) => handleTextChange(index, 'alt', e.target.value, setBrands, brands)}/>
                    <Input placeholder="AI Hint" value={brand.dataAiHint} onChange={(e) => handleTextChange(index, 'dataAiHint', e.target.value, setBrands, brands)}/>
                    <Input type="file" className="text-xs" onChange={(e) => handleFileChange(e, index, setBrands, brands)}/>
                    <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={() => handleRemoveItem(index, setBrands)}>
                        <Trash2 className="h-4 w-4 mr-2"/> Remove
                    </Button>
                </div>
            ))}
            </div>
            <Button variant="outline" className="mt-4" onClick={() => handleAddItem(setBrands, { preview: 'https://placehold.co/200x200.png', alt: '', dataAiHint: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Brand
            </Button>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>Deals of the Day</CardTitle>
              <CardDescription>Select which products to feature in this section.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {deals.map(deal => (
                      <div key={deal.id} className="border rounded-lg p-2 text-center relative group">
                          <Image src={deal.image} alt={deal.name} width={100} height={100} className="object-cover rounded-md mx-auto aspect-square"/>
                          <p className="text-xs font-semibold mt-1 truncate">{deal.name}</p>
                          <p className="text-xs text-muted-foreground">{deal.brand}</p>
                          <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleToggleDeal({id: deal.id, name: deal.name, brand: deal.brand, images: [deal.image]})}>
                              <Trash2 className="h-3 w-3" />
                          </Button>
                      </div>
                  ))}
              </div>
               <Dialog open={isProductSelectorOpen} onOpenChange={setIsProductSelectorOpen}>
                  <DialogTrigger asChild>
                      <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Select Products for Deals</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                      <DialogHeader>
                          <DialogTitle>Select "Deals of the Day" Products</DialogTitle>
                      </DialogHeader>
                      <div className="p-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name or brand..." 
                                className="pl-9 mb-4" 
                                value={productSearchTerm}
                                onChange={(e) => setProductSearchTerm(e.target.value)}
                            />
                          </div>
                      </div>
                      <ScrollArea className="h-96 border-t">
                          <div className="grid grid-cols-3 gap-4 p-4">
                              {filteredProducts.map(product => {
                                  const isSelected = deals.some(d => d.id === product.id);
                                  return (
                                      <div key={product.id} className={`border rounded-lg p-2 text-center cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`} onClick={() => handleToggleDeal(product)}>
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
            <CardTitle>Shop By Category Section</CardTitle>
            <CardDescription>Manage the category cards on the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
                <div key={category.id} className="p-4 border rounded-lg space-y-2">
                    <Image src={category.preview || 'https://placehold.co/400x500.png'} alt={category.name || ''} width={400} height={500} className="object-cover rounded-md mx-auto aspect-[4/5]" />
                    <Input placeholder="Image URL" value={category.url || ''} onChange={(e) => handleUrlChange(index, e.target.value, setCategories, categories)} />
                    <Input placeholder="Category Name (e.g. T-Shirts)" value={category.name || ''} onChange={(e) => handleTextChange(index, 'name', e.target.value, setCategories, categories)}/>
                    <Input placeholder="Discount Text (e.g. 40-80% OFF)" value={category.discount || ''} onChange={(e) => handleTextChange(index, 'discount', e.target.value, setCategories, categories)}/>
                    <Input placeholder="Link (e.g. /shop?category=Men)" value={category.link || ''} onChange={(e) => handleTextChange(index, 'link', e.target.value, setCategories, categories)}/>
                    <Input placeholder="AI Hint" value={category.dataAiHint || ''} onChange={(e) => handleTextChange(index, 'dataAiHint', e.target.value, setCategories, categories)}/>
                    <Input type="file" className="text-xs" onChange={(e) => handleFileChange(e, index, setCategories, categories)}/>
                    <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={() => handleRemoveItem(index, setCategories)}>
                        <Trash2 className="h-4 w-4 mr-2"/> Remove
                    </Button>
                </div>
            ))}
            </div>
            <Button variant="outline" className="mt-4" onClick={() => handleAddItem(setCategories, { preview: 'https://placehold.co/400x500.png', name: '', discount: '', link: '', dataAiHint: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Category Card
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Pre-Footer CTA</CardTitle>
            <CardDescription>Manage the three-image call-to-action section above the footer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {ctaImages.map((cta, index) => (
                <div key={cta.id} className="p-4 border rounded-lg space-y-2 bg-secondary/50">
                     <Image src={cta.preview || 'https://placehold.co/800x400.png'} alt={cta.title || ''} width={400} height={200} className="object-cover rounded-md mx-auto aspect-video" />
                     <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Title (e.g. Snug & Fun)" value={cta.title || ''} onChange={(e) => handleTextChange(index, 'title', e.target.value, setCtaImages, ctaImages)}/>
                        <Input placeholder="Subtitle (e.g. Kid, live, play)" value={cta.subtitle || ''} onChange={(e) => handleTextChange(index, 'subtitle', e.target.value, setCtaImages, ctaImages)}/>
                        <Input placeholder="Image URL" value={cta.url || ''} className="col-span-2" onChange={(e) => handleUrlChange(index, e.target.value, setCtaImages, ctaImages)} />
                        <Input placeholder="Link URL" value={cta.link || ''} className="col-span-2" onChange={(e) => handleTextChange(index, 'link', e.target.value, setCtaImages, ctaImages)}/>
                        <Input placeholder="AI Hint" value={cta.dataAiHint || ''} onChange={(e) => handleTextChange(index, 'dataAiHint', e.target.value, setCtaImages, ctaImages)}/>
                        <Select value={cta.layout} onValueChange={(value) => handleTextChange(index, 'layout', value, setCtaImages, ctaImages)}>
                            <SelectTrigger><SelectValue placeholder="Select Layout" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full">Full Width</SelectItem>
                                <SelectItem value="half">Half Width</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input type="file" className="text-xs col-span-2" onChange={(e) => handleFileChange(e, index, setCtaImages, ctaImages)}/>
                     </div>
                    <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={() => handleRemoveItem(index, setCtaImages)}>
                        <Trash2 className="h-4 w-4 mr-2"/> Remove Item
                    </Button>
                </div>
            ))}
            <Button variant="outline" className="mt-4" onClick={() => handleAddItem(setCtaImages, { preview: 'https://placehold.co/800x400.png', title: '', subtitle: '', link: '', dataAiHint: '', layout: 'half' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add CTA Item
            </Button>
        </CardContent>
      </Card>


      <div className="flex justify-end sticky bottom-4">
          <Button onClick={handleSaveChanges} disabled={isLoading || isFetching} size="lg" className="shadow-lg">
            {isLoading ? 'Saving...' : 'Save All Homepage Changes'}
          </Button>
      </div>
    </div>
  );
}
