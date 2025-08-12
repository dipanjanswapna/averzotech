'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

interface PopupContent {
  isEnabled: boolean;
  imageUrl: string;
  linkUrl: string;
  displayFrequency: 'session' | 'daily' | 'always';
}

const POPUP_STORAGE_KEY = 'promotionalPopupShown';

export function PromotionalPopup() {
  const [content, setContent] = useState<PopupContent | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPopupContent = async () => {
      const docRef = doc(db, 'site_content', 'promotional_popup');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as PopupContent;
        if (data.isEnabled) {
          setContent(data);
          
          let shouldShow = true;
          if (data.displayFrequency === 'session') {
            const sessionShown = sessionStorage.getItem(POPUP_STORAGE_KEY);
            if (sessionShown) {
              shouldShow = false;
            }
          } else if (data.displayFrequency === 'daily') {
            const dailyShownTimestamp = localStorage.getItem(POPUP_STORAGE_KEY);
            if (dailyShownTimestamp) {
              const oneDay = 24 * 60 * 60 * 1000;
              if (new Date().getTime() - Number(dailyShownTimestamp) < oneDay) {
                shouldShow = false;
              }
            }
          }
          
          if (shouldShow) {
            setIsOpen(true);
          }
        }
      }
    };
    
    // We delay the fetch slightly to avoid interfering with initial page load
    const timer = setTimeout(fetchPopupContent, 1000);
    return () => clearTimeout(timer);

  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      // Mark as shown
      if (content?.displayFrequency === 'session') {
        sessionStorage.setItem(POPUP_STORAGE_KEY, 'true');
      } else if (content?.displayFrequency === 'daily') {
        localStorage.setItem(POPUP_STORAGE_KEY, String(new Date().getTime()));
      }
    }
  }
  
  if (!isOpen || !content) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-lg w-full">
        <Link href={content.linkUrl || '#'} onClick={() => handleOpenChange(false)}>
            <Image
              src={content.imageUrl}
              alt="Promotional Offer"
              width={500}
              height={500}
              className="w-full h-auto object-contain rounded-lg"
            />
        </Link>
      </DialogContent>
    </Dialog>
  );
}