
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { X, Mail } from 'lucide-react';
import { Input } from './ui/input';

interface PopupContent {
  enabled: boolean;
  imageUrl: string;
  link: string;
  displayFrequency: 'session' | 'daily' | 'always';
  showEmailField: boolean;
  heading: string;
  subheading: string;
  buttonText: string;
}

export function PromotionalPopup() {
  const [config, setConfig] = useState<PopupContent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    const fetchPopupConfig = async () => {
      const docRef = doc(db, 'site_content', 'promotional_popup');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as PopupContent;
        setConfig(data);
      }
      setIsLoading(false);
    };
    fetchPopupConfig();
  }, []);
  
  useEffect(() => {
    if (isLoading || !config || !config.enabled) {
      return;
    }

    const sessionKey = 'promoPopupShown';
    const dailyKey = `promoPopupShown_${new Date().toISOString().split('T')[0]}`;

    let hasBeenShown = false;
    if (config.displayFrequency === 'session') {
        hasBeenShown = sessionStorage.getItem(sessionKey) === 'true';
    } else if (config.displayFrequency === 'daily') {
        hasBeenShown = localStorage.getItem(dailyKey) === 'true';
    }

    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        if(config.displayFrequency === 'session') {
            sessionStorage.setItem(sessionKey, 'true');
        } else if (config.displayFrequency === 'daily') {
            localStorage.setItem(dailyKey, 'true');
        }
      }, 2000); // Delay pop-up by 2 seconds
      return () => clearTimeout(timer);
    }
  }, [config, isLoading]);
  
  const handleSubscribe = async () => {
    if (!email) return;
    try {
        await setDoc(doc(db, "subscribers", email), {
            email: email,
            subscribedAt: new Date(),
            source: 'popup'
        });
        alert('Thank you for subscribing!');
        setIsOpen(false);
    } catch (error) {
        console.error("Subscription failed:", error);
        alert('Subscription failed. Please try again.');
    }
  }

  if (isLoading || !config) {
    return null;
  }
  
  if (!isOpen) {
      return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-background rounded-lg overflow-hidden">
          <div className="relative h-64 md:h-auto">
            <Link href={config.link} onClick={() => setIsOpen(false)}>
                <Image
                src={config.imageUrl}
                alt="Promotional Offer"
                fill
                className="object-cover"
                />
            </Link>
          </div>
          <div className="flex flex-col justify-center p-8 text-center items-center">
            <h2 className="text-2xl md:text-4xl font-bold uppercase text-primary">{config.heading}</h2>
            <p className="text-muted-foreground mt-2 text-lg">{config.subheading}</p>
            {config.showEmailField && (
                <div className="mt-6 w-full max-w-sm">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            type="email"
                            placeholder="Enter your email" 
                            className="pl-10 h-12 text-base"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <Button className="w-full mt-3 h-12 text-base" onClick={handleSubscribe}>{config.buttonText}</Button>
                </div>
            )}
             <p className="text-xs text-muted-foreground mt-4">
                By subscribing, you agree to our Terms and Conditions.
            </p>
          </div>
        </div>
        <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 rounded-full h-8 w-8"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
