
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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PromoBarContent {
  enabled: boolean;
  text: string;
  link: string;
  bgColorStart: string;
  bgColorEnd: string;
}

export default function PromoBarManager() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [enabled, setEnabled] = useState(false);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [bgColorStart, setBgColorStart] = useState('#ff5f6d');
  const [bgColorEnd, setBgColorEnd] = useState('#ffc371');

  useEffect(() => {
    const fetchPromoBarContent = async () => {
      setIsFetching(true);
      const docRef = doc(db, 'site_content', 'promo_bar');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as PromoBarContent;
        setEnabled(data.enabled || false);
        setText(data.text || '');
        setLink(data.link || '');
        setBgColorStart(data.bgColorStart || '#ff5f6d');
        setBgColorEnd(data.bgColorEnd || '#ffc371');
      }
      setIsFetching(false);
    };

    fetchPromoBarContent();
  }, []);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const promoBarContent: PromoBarContent = {
        enabled,
        text,
        link,
        bgColorStart,
        bgColorEnd,
      };

      await setDoc(doc(db, 'site_content', 'promo_bar'), promoBarContent, { merge: true });

      toast({
        title: 'Success!',
        description: "Promotional bar settings have been updated.",
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
    return <p>Loading promo bar settings...</p>;
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Promo Bar Management</h1>
        <p className="text-muted-foreground">
          Control the promotional bar displayed just above the footer.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promo Bar Settings</CardTitle>
          <CardDescription>
            Configure the content and appearance of the promo bar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="promo-enabled" className="font-semibold">Enable Promo Bar</Label>
              <p className="text-xs text-muted-foreground">
                Turn this on to show the bar on the site.
              </p>
            </div>
            <Switch
              id="promo-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo-text">Display Text</Label>
            <Input
              id="promo-text"
              placeholder="e.g., Free shipping on orders over ৳2000!"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="promo-link">Target Link</Label>
            <Input
              id="promo-link"
              placeholder="e.g., /shop/new-arrivals"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bg-start">Background Start Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="bg-start"
                  value={bgColorStart}
                  onChange={(e) => setBgColorStart(e.target.value)}
                  disabled={isLoading}
                />
                <Input type="color" value={bgColorStart} onChange={(e) => setBgColorStart(e.target.value)} className="w-10 h-10 p-1"/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bg-end">Background End Color</Label>
              <div className="flex items-center gap-2">
                 <Input
                  id="bg-end"
                  value={bgColorEnd}
                  onChange={(e) => setBgColorEnd(e.target.value)}
                  disabled={isLoading}
                />
                <Input type="color" value={bgColorEnd} onChange={(e) => setBgColorEnd(e.target.value)} className="w-10 h-10 p-1"/>
              </div>
            </div>
          </div>
           <div className="mt-4">
            <Label>Live Preview</Label>
            <div className="mt-2 p-4 rounded-md text-white font-semibold text-center" style={{background: `linear-gradient(to right, ${bgColorStart}, ${bgColorEnd})`}}>
                {text || "Sample Promo Text"}
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
