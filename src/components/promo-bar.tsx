
'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface PromoBarContent {
  enabled: boolean;
  text: string;
  link: string;
  bgColorStart: string;
  bgColorEnd: string;
}

export function PromoBar() {
  const [content, setContent] = useState<PromoBarContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPromoBarContent = async () => {
      const docRef = doc(db, 'site_content', 'promo_bar');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data() as PromoBarContent);
      }
      setIsLoading(false);
    };

    fetchPromoBarContent();
  }, []);

  if (isLoading || !content || !content.enabled) {
    return null;
  }

  const promoBarStyle = {
    background: `linear-gradient(to right, ${content.bgColorStart}, ${content.bgColorEnd})`,
  };

  return (
    <div style={promoBarStyle}>
      <div className="container mx-auto px-4">
        <Link href={content.link || '#'} className="flex items-center justify-center h-12 text-white font-semibold text-center">
          <p>{content.text}</p>
        </Link>
      </div>
    </div>
  );
}
