
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, GripVertical, PlusCircle } from 'lucide-react';
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

interface HeroImage {
  file?: File;
  preview: string;
  alt: string;
  dataAiHint: string;
  url?: string;
}

interface Brand {
    id: string;
    file?: File;
    preview: string;
    alt: string;
    dataAiHint: string;
    url?: string;
}

interface DealProduct {
    id: string;
    name: string;
    brand: string;
    image: string;
}

interface CategoryCard {
    id: string;
    file?: File;
    preview: string;
    name: string;
    discount: string;
    link: string;
    dataAiHint: string;
    url?: string;
}

interface ProductForSelection {
    id: string;
    name: string;
    brand: string;
    images: string[];
}


export default function HomePageManager() {
  const { toast } = useToast();
  const storage = getStorage(app);
  const [isLoading, setIsLoading] = useState(false);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductForSelection[]>([]);

  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [deals, setDeals] = useState<DealProduct[]>([]);
  const [categories, setCategories] = useState<CategoryCard[]>([]);
  
  // Fetch all content from Firestore
  useEffect(() => {
    const fetchHomepageContent = async () => {
      setIsLoading(true);
      const docRef = doc(db, 'site_content', 'homepage');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroImages(data.heroImages?.map((img: any) => ({ ...img, preview: img.url })) || []);
        setBrands(data.brands?.map((brand: any) => ({ ...brand, preview: brand.url })) || []);
        setDeals(data.deals || []);
        setCategories(data.categories?.map((cat: any) => ({ ...cat, preview: cat.url })) || []);
      }
      setIsLoading(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, stateSetter: React.Dispatch<React.SetStateAction<any[]>>, stateArray: any[]) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const newArray = [...stateArray];
          newArray[index].file = file;
          newArray[index].preview = URL.createObjectURL(file);
          stateSetter(newArray);
      }
  };

  const handleTextChange = (index: number, field: string, value: string, stateSetter: React.Dispatch<React.SetStateAction<any[]>>, stateArray: any[]) => {
      const newArray = [...stateArray];
      newArray[index][field] = value;
      stateSetter(newArray);
  };

  const handleAddItem = (stateSetter: React.Dispatch<React.SetStateAction<any[]>>, newItem: any) => {
      stateSetter(prev => [...prev, newItem]);
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
      const uploadImage = async (item: any, path: string) => {
        if (item.file) {
          const storageRef = ref(storage, `${path}/${Date.now()}_${item.file.name}`);
          await uploadBytes(storageRef, item.file);
          return await getDownloadURL(storageRef);
        }
        return item.url || item.preview;
      };

      const updatedHeroImages = await Promise.all(
        heroImages.map(async (image) => ({
          url: await uploadImage(image, 'site_content/homepage/hero'),
          alt: image.alt,
          dataAiHint: image.dataAiHint,
        }))
      );

      const updatedBrands = await Promise.all(
        brands.map(async (brand) => ({
            url: await uploadImage(brand, 'site_content/homepage/brands'),
            alt: brand.alt,
            dataAiHint: brand.dataAiHint,
        }))
      );

      const updatedCategories = await Promise.all(
        categories.map(async (category) => ({
            url: await uploadImage(category, 'site_content/homepage/categories'),
            name: category.name,
            discount: category.discount,
            link: category.link,
            dataAiHint: category.dataAiHint,
        }))
      );

      const homepageContent = {
        heroImages: updatedHeroImages,
        brands: updatedBrands,
        deals, // Deals just reference product IDs, no upload needed
        categories: updatedCategories,
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
            {heroImages.map((image, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-secondary/50">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-8 cursor-grab" />
                <div className="relative w-48 h-24">
                  <Image src={image.preview} alt="Hero preview" fill className="object-cover rounded-md" />
                </div>
                <div className="flex-1 space-y-2">
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
                <div key={index} className="p-2 border rounded-lg space-y-2">
                    <Image src={brand.preview} alt="Brand preview" width={100} height={100} className="object-contain rounded-md mx-auto aspect-square" />
                    <Input placeholder="Alt text" value={brand.alt} onChange={(e) => handleTextChange(index, 'alt', e.target.value, setBrands, brands)}/>
                    <Input placeholder="AI Hint" value={brand.dataAiHint} onChange={(e) => handleTextChange(index, 'dataAiHint', e.target.value, setBrands, brands)}/>
                    <Input type="file" className="text-xs" onChange={(e) => handleFileChange(e, index, setBrands, brands)}/>
                    <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={() => handleRemoveItem(index, setBrands)}>
                        <Trash2 className="h-4 w-4 mr-2"/> Remove
                    </Button>
                </div>
            ))}
            </div>
            <Button variant="outline" className="mt-4" onClick={() => handleAddItem(setBrands, { id: Date.now().toString(), preview: 'https://placehold.co/200x200.png', alt: '', dataAiHint: '' })}>
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
                      <ScrollArea className="h-96">
                          <div className="grid grid-cols-3 gap-4 p-4">
                              {allProducts.map(product => {
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
                <div key={index} className="p-4 border rounded-lg space-y-2">
                    <Image src={category.preview} alt={category.name} width={400} height={500} className="object-cover rounded-md mx-auto aspect-[4/5]" />
                    <Input placeholder="Category Name (e.g. T-Shirts)" value={category.name} onChange={(e) => handleTextChange(index, 'name', e.target.value, setCategories, categories)}/>
                    <Input placeholder="Discount Text (e.g. 40-80% OFF)" value={category.discount} onChange={(e) => handleTextChange(index, 'discount', e.target.value, setCategories, categories)}/>
                    <Input placeholder="Link (e.g. /shop?category=Men)" value={category.link} onChange={(e) => handleTextChange(index, 'link', e.target.value, setCategories, categories)}/>
                    <Input placeholder="AI Hint" value={category.dataAiHint} onChange={(e) => handleTextChange(index, 'dataAiHint', e.target.value, setCategories, categories)}/>
                    <Input type="file" className="text-xs" onChange={(e) => handleFileChange(e, index, setCategories, categories)}/>
                    <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={() => handleRemoveItem(index, setCategories)}>
                        <Trash2 className="h-4 w-4 mr-2"/> Remove
                    </Button>
                </div>
            ))}
            </div>
            <Button variant="outline" className="mt-4" onClick={() => handleAddItem(setCategories, { id: Date.now().toString(), preview: 'https://placehold.co/400x500.png', name: '', discount: '', link: '', dataAiHint: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Category Card
            </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end sticky bottom-4">
          <Button onClick={handleSaveChanges} disabled={isLoading} size="lg" className="shadow-lg">
            {isLoading ? 'Saving...' : 'Save All Homepage Changes'}
          </Button>
      </div>
    </div>
  );
}

    