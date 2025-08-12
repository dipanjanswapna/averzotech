
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

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
    if (isLoading || !config || !config.enabled) {
      return;
    }

    const sessionKey = 'promoPopupShown';
    const hasBeenShown = sessionStorage.getItem(sessionKey);

    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem(sessionKey, 'true');
      }, 2000); // Delay pop-up by 2 seconds
      return () => clearTimeout(timer);
    }
  }, [config, isLoading]);

  if (!isOpen || !config) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-2xl w-full">
        <div className="relative">
          <Link href={config.link} onClick={() => setIsOpen(false)}>
            <Image
              src={config.imageUrl}
              alt="Promotional Offer"
              width={800}
              height={800}
              className="w-full h-auto object-contain rounded-lg"
            />
          </Link>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 bg-background rounded-full h-8 w-8"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
