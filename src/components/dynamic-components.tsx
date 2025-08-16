
'use client';

import dynamic from 'next/dynamic';

const PromotionalPopup = dynamic(() => import('@/components/promotional-popup').then(mod => mod.PromotionalPopup), { ssr: false });
const PromoBar = dynamic(() => import('@/components/promo-bar').then(mod => mod.PromoBar), { ssr: false });

export function DynamicComponents() {
    return (
        <>
            <PromotionalPopup />
            <PromoBar />
        </>
    )
}
