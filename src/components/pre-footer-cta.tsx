
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';

interface CtaItem {
    url: string;
    link: string;
    title: string;
    subtitle: string;
    dataAiHint: string;
    layout: 'full' | 'half';
}

export function PreFooterCta() {
    const [ctaItems, setCtaItems] = useState<CtaItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCtaContent = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'site_content', 'homepage');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCtaItems(docSnap.data().ctaImages || []);
                }
            } catch (error) {
                console.error("Error fetching CTA content:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCtaContent();
    }, []);

    if (loading) {
        return (
            <section className="container py-8 md:py-12">
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="col-span-2 aspect-[2.4/1] w-full rounded-lg" />
                    <Skeleton className="col-span-1 aspect-[1/1] w-full rounded-lg" />
                    <Skeleton className="col-span-1 aspect-[1/1] w-full rounded-lg" />
                </div>
            </section>
        );
    }

    if (ctaItems.length === 0) {
        return null;
    }
    
    const fullWidthItem = ctaItems.find(item => item.layout === 'full');
    const halfWidthItems = ctaItems.filter(item => item.layout === 'half');


    return (
        <section className="container py-8 md:py-12">
            <div className="grid grid-cols-2 gap-4">
                {fullWidthItem && (
                     <div className="col-span-2">
                        <Link href={fullWidthItem.link || '#'}>
                            <div className="relative aspect-[2.4/1] w-full overflow-hidden rounded-lg group">
                                <Image src={fullWidthItem.url} alt={fullWidthItem.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint={fullWidthItem.dataAiHint}/>
                                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-4 text-center">
                                    <h3 className="text-2xl font-bold">{fullWidthItem.title}</h3>
                                    <p className="text-sm">{fullWidthItem.subtitle}</p>
                                    <span className="mt-2 text-xs font-bold underline">SHOP NOW</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
               
                {halfWidthItems.slice(0, 2).map((item, index) => (
                     <div key={index} className="col-span-1">
                        <Link href={item.link || '#'}>
                            <div className="relative aspect-[1/1] w-full overflow-hidden rounded-lg group">
                                <Image src={item.url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint={item.dataAiHint}/>
                                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-4 text-center">
                                    <h3 className="text-2xl font-bold">{item.title}</h3>
                                    <p className="text-sm">{item.subtitle}</p>
                                    <span className="mt-2 text-xs font-bold underline">SHOP NOW</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
