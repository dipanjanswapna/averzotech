
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, app } from '@/lib/firebase';
import Image from 'next/image';
import { UploadCloud } from 'lucide-react';

interface PopupContent {
  enabled: boolean;
  imageUrl: string;
  link: string;
  displayFrequency: 'session' | 'daily' | 'always';
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

  const [enabled, setEnabled] = useState(false);
  const [link, setLink] = useState('');
  const [displayFrequency, setDisplayFrequency] = useState('session');
  const [image, setImage] = useState<ImageFile | null>(null);

  useEffect(() => {
    const fetchPopupContent = async () => {
      setIsFetching(true);
      const docRef = doc(db, 'site_content', 'promotional_popup');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as PopupContent;
        setEnabled(data.enabled);
        setLink(data.link);
        setDisplayFrequency(data.displayFrequency || 'session');
        if (data.imageUrl) {
          setImage({ preview: data.imageUrl });
        }
      }
      setIsFetching(false);
    };

    fetchPopupContent();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage({
        file: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
       setImage({
        preview: url,
      });
  }

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      let imageUrl = image?.preview || '';
      if (image?.file) {
        const storageRef = ref(storage, `site_content/popup/${Date.now()}_${image.file.name}`);
        await uploadBytes(storageRef, image.file);
        imageUrl = await getDownloadURL(storageRef);
      }

      const popupContent: PopupContent = {
        enabled,
        imageUrl,
        link,
        displayFrequency,
      };

      await setDoc(doc(db, 'site_content', 'promotional_popup'), popupContent, { merge: true });

      toast({
        title: 'Success!',
        description: "Promotional pop-up settings have been updated.",
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
      return <p>Loading pop-up settings...</p>
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Promotional Pop-up</h1>
        <p className="text-muted-foreground">
          Control the site-wide promotional pop-up that appears for users.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pop-up Settings</CardTitle>
          <CardDescription>
            Configure the pop-up content and behavior.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="popup-enabled" className="font-semibold">Enable Pop-up</Label>
              <p className="text-xs text-muted-foreground">
                Turn this on to show the pop-up to users.
              </p>
            </div>
            <Switch
              id="popup-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="popup-link">Target Link</Label>
            <Input
              id="popup-link"
              placeholder="e.g., /shop/new-arrivals"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              The URL users will be taken to when they click the pop-up image.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Pop-up Image</Label>
            <div className='flex items-center gap-4'>
                {image && (
                    <div className="w-48 h-48 border rounded-md overflow-hidden bg-secondary flex-shrink-0">
                        <Image src={image.preview} alt="Pop-up Preview" width={192} height={192} className="object-contain w-full h-full" />
                    </div>
                )}
                <div className="flex-1 space-y-2">
                    <Input id="image-url" placeholder="Or paste image URL" onChange={handleUrlChange} disabled={isLoading} />
                    <div className="text-center text-xs text-muted-foreground">OR</div>
                    <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-4 text-center">
                        <input type="file" id="image-upload" onChange={handleFileChange} className="hidden" disabled={isLoading} />
                        <Label htmlFor="image-upload" className="cursor-pointer">
                            <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                            <span className="font-semibold text-primary">Click to upload a file</span>
                            </p>
                        </Label>
                    </div>
                </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
