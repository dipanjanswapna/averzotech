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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, app } from '@/lib/firebase';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface PopupContent {
  isEnabled: boolean;
  imageUrl: string;
  linkUrl: string;
  displayFrequency: 'session' | 'daily' | 'always';
  imagePath?: string;
}

interface ImageFile {
    file?: File;
    preview: string;
}

export default function PopupManager() {
  const { toast } = useToast();
  const storage = getStorage(app);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [content, setContent] = useState<Partial<PopupContent>>({});
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);

  useEffect(() => {
    const fetchPopupContent = async () => {
      setIsFetching(true);
      const docRef = doc(db, 'site_content', 'promotional_popup');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as PopupContent;
        setContent(data);
        if (data.imageUrl) {
          setImageFile({ preview: data.imageUrl });
        }
      }
      setIsFetching(false);
    };
    fetchPopupContent();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile({
        file: file,
        preview: URL.createObjectURL(file),
      });
      // Clear the URL field if a file is uploaded
      setContent(prev => ({...prev, imageUrl: ''}));
    }
  };
  
  const handleUrlChange = (url: string) => {
    setContent(prev => ({...prev, imageUrl: url}));
    if(url) {
        setImageFile({ preview: url });
    } else if (!imageFile?.file) {
        setImageFile(null);
    }
  }

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      let imageUrl = content.imageUrl || '';
      let imagePath = content.imagePath || '';

      if (imageFile?.file) {
        // If a new file is uploaded, delete the old one from storage if it exists
        if (imagePath) {
          try {
            const oldImageRef = ref(storage, imagePath);
            await deleteObject(oldImageRef);
          } catch (error: any) {
             if (error.code !== 'storage/object-not-found') {
                console.error("Could not delete old image, it might not exist.", error);
             }
          }
        }
        
        const newPath = `site_content/popup/${Date.now()}_${imageFile.file.name}`;
        const storageRef = ref(storage, newPath);
        await uploadBytes(storageRef, imageFile.file);
        imageUrl = await getDownloadURL(storageRef);
        imagePath = newPath;
      }
      
      const popupData = {
        isEnabled: content.isEnabled || false,
        imageUrl: imageUrl,
        linkUrl: content.linkUrl || '#',
        displayFrequency: content.displayFrequency || 'session',
        imagePath: imagePath,
      };
      
      await setDoc(doc(db, 'site_content', 'promotional_popup'), popupData);

      toast({
        title: 'Success!',
        description: 'Promotional pop-up settings have been updated.',
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
      return (
        <div className="space-y-8">
          <Skeleton className="h-10 w-1/3" />
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-1/2" />
            </CardContent>
          </Card>
        </div>
      )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Promotional Pop-up</h1>
        <p className="text-muted-foreground">
          Manage the pop-up that appears when a user first visits the site.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pop-up Settings</CardTitle>
          <CardDescription>
            Use this to promote special offers, app downloads, or announcements.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-popup"
              checked={content.isEnabled}
              onCheckedChange={(checked) => setContent(prev => ({...prev, isEnabled: checked}))}
            />
            <Label htmlFor="enable-popup">Enable Pop-up</Label>
          </div>

          <div className="space-y-4">
            <Label>Pop-up Image</Label>
            <div className="w-full sm:w-1/2 md:w-1/3 p-2 border rounded-md">
                 {imageFile?.preview ? (
                     <Image src={imageFile.preview} alt="Pop-up preview" width={400} height={400} className="object-contain rounded-md" />
                 ) : (
                     <div className="bg-secondary h-48 flex items-center justify-center rounded-md">
                         <p className="text-muted-foreground">No Image</p>
                     </div>
                 )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                    <Label htmlFor="image-file" className="text-xs text-muted-foreground">Upload File</Label>
                    <Input id="image-file" type="file" className="text-xs" onChange={handleFileChange} />
                </div>
                 <div>
                    <Label htmlFor="image-url" className="text-xs text-muted-foreground">Or Paste Image URL</Label>
                    <Input id="image-url" type="text" placeholder="https://..." value={content.imageUrl || ''} onChange={e => handleUrlChange(e.target.value)} />
                </div>
            </div>
          </div>

           <div className="space-y-2">
            <Label htmlFor="link-url">Target Link URL</Label>
            <Input
              id="link-url"
              placeholder="https://example.com/special-offer"
              value={content.linkUrl || ''}
              onChange={(e) => setContent(prev => ({...prev, linkUrl: e.target.value}))}
            />
          </div>
          
           <div className="space-y-2">
            <Label htmlFor="display-frequency">Display Frequency</Label>
            <Select
              value={content.displayFrequency}
              onValueChange={(value) => setContent(prev => ({...prev, displayFrequency: value as any}))}
            >
              <SelectTrigger id="display-frequency" className="w-full sm:w-1/2">
                <SelectValue placeholder="Select how often to show the pop-up" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="session">Once per session</SelectItem>
                <SelectItem value="daily">Once every 24 hours</SelectItem>
                <SelectItem value="always">Always (for testing)</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveChanges} disabled={isLoading} size="lg">
          {isLoading ? 'Saving...' : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
