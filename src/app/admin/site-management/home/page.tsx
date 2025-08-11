
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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, app } from '@/lib/firebase';
import Image from 'next/image';

interface HeroImage {
  file?: File;
  preview: string;
  alt: string;
  dataAiHint: string;
  url?: string;
}

export default function HomePageManager() {
  const { toast } = useToast();
  const storage = getStorage(app);
  const [isLoading, setIsLoading] = useState(false);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);

  useEffect(() => {
    const fetchHomepageContent = async () => {
      const docRef = doc(db, 'site_content', 'homepage');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroImages(data.heroImages.map((img: any) => ({ ...img, preview: img.url })) || []);
      }
    };
    fetchHomepageContent();
  }, []);

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newHeroImages = [...heroImages];
      newHeroImages[index].file = file;
      newHeroImages[index].preview = URL.createObjectURL(file);
      setHeroImages(newHeroImages);
    }
  };

  const handleAddHeroImage = () => {
    setHeroImages([...heroImages, { preview: 'https://placehold.co/800x450.png', alt: '', dataAiHint: '' }]);
  };

  const handleRemoveHeroImage = (index: number) => {
    setHeroImages(heroImages.filter((_, i) => i !== index));
  };
    
  const handleHeroTextChange = (index: number, field: 'alt' | 'dataAiHint', value: string) => {
    const newHeroImages = [...heroImages];
    newHeroImages[index][field] = value;
    setHeroImages(newHeroImages);
  }

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // Upload new images to storage
      const updatedHeroImages = await Promise.all(
        heroImages.map(async (image) => {
          if (image.file) {
            const storageRef = ref(storage, `site_content/homepage/hero_${Date.now()}_${image.file.name}`);
            await uploadBytes(storageRef, image.file);
            const downloadURL = await getDownloadURL(storageRef);
            return {
              url: downloadURL,
              alt: image.alt,
              dataAiHint: image.dataAiHint,
            };
          }
          // If no new file, it means it's an existing image, so keep the old URL
          return {
            url: image.url || image.preview,
            alt: image.alt,
            dataAiHint: image.dataAiHint,
          };
        })
      );

      // Save the URLs and other content to Firestore
      const homepageContent = {
        heroImages: updatedHeroImages,
        // Add other sections here in the future
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
        <h1 className="text-3xl font-bold">Site Management</h1>
        <p className="text-muted-foreground">
          Manage the content for your public-facing pages.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Content</CardTitle>
          <CardDescription>
            Manage the hero section, featured products, and other content on the main landing page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Hero Section Manager */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hero Section Carousel</h3>
            <div className="space-y-4">
              {heroImages.map((image, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-secondary/50">
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-8 cursor-grab" />
                  <div className="relative w-48 h-24">
                    <Image src={image.preview} alt="Hero preview" fill className="object-cover rounded-md" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <Label htmlFor={`hero-alt-${index}`}>Alt Text</Label>
                      <Input id={`hero-alt-${index}`} placeholder="e.g. Fashion sale banner" value={image.alt} onChange={(e) => handleHeroTextChange(index, 'alt', e.target.value)} />
                    </div>
                     <div>
                      <Label htmlFor={`hero-ai-hint-${index}`}>AI Hint</Label>
                      <Input id={`hero-ai-hint-${index}`} placeholder="e.g. fashion sale" value={image.dataAiHint} onChange={(e) => handleHeroTextChange(index, 'dataAiHint', e.target.value)} />
                    </div>
                     <div>
                      <Label htmlFor={`hero-file-${index}`}>Replace Image</Label>
                      <Input id={`hero-file-${index}`} type="file" className="text-xs" onChange={(e) => handleHeroImageChange(e, index)} />
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveHeroImage(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4" onClick={handleAddHeroImage}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Image
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save All Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
