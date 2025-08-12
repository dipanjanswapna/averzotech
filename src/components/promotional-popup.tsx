
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface PopupContent {
  enabled: boolean;
  imageUrl: string;
  link: string;
  displayFrequency: 'session' | 'daily' | 'always';
}

export function PromotionalPopup() {
  const [config, setConfig] = useState<PopupContent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
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
    if (isLoading || !config || !config.enabled || !config.imageUrl) {
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
  

  if (isLoading || !config || !isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none w-full max-w-xl">
        <div className="relative aspect-[4/3] w-full">
            <Link href={config.link || '#'} onClick={() => setIsOpen(false)}>
                <Image
                src={config.imageUrl}
                alt="Promotional Offer"
                fill
                className="object-contain rounded-lg"
                />
            </Link>
        </div>
        <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 bg-black/50 text-white hover:bg-black/70 rounded-full h-8 w-8"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
