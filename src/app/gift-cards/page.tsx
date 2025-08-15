
'use client';

import { SiteHeader } from '@/components/site-header';
import { Gift } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gift Cards | AVERZO',
  description: 'The perfect gift for any occasion. Give the gift of endless choices with an AVERZO gift card.',
};

export default function GiftCardsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow">
        <section className="relative h-64 md:h-80 bg-primary/10 flex items-center justify-center text-center p-4">
           <div className="z-10">
              <Gift className="mx-auto h-16 w-16 text-primary mb-6" />
              <h1 className="text-4xl md:text-5xl font-headline font-bold">Averzo Gift Cards</h1>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                The perfect gift for any occasion. Give the gift of endless choices.
              </p>
           </div>
        </section>
        
        <section className="container py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-4">Why Choose an Averzo Gift Card?</h2>
                    <ul className="space-y-4 text-muted-foreground">
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                            <span><span className="font-semibold text-foreground">Instant Delivery:</span> Sent directly to the recipient's email, perfect for last-minute gifts.</span>
                        </li>
                         <li className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                            <span><span className="font-semibold text-foreground">Endless Choices:</span> Redeemable on thousands of products across all categories on Averzo.</span>
                        </li>
                         <li className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                            <span><span className="font-semibold text-foreground">Personalized Message:</span> Add a custom message to make your gift extra special.</span>
                        </li>
                         <li className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                            <span><span className="font-semibold text-foreground">No Hidden Fees:</span> The full value of the card is available for shopping. No expiry dates.</span>
                        </li>
                    </ul>
                     <Button size="lg" className="mt-8" asChild>
                        <Link href="/admin/gift-cards/new">Purchase a Gift Card</Link>
                    </Button>
                </div>
                <div className="relative aspect-square">
                    <Image src="https://i.postimg.cc/9QG7cHJ1/gift-card-template.png" alt="Averzo Gift Card" fill className="object-contain" data-ai-hint="gift card design"/>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}

// Dummy CheckCircle component for type-checking. It won't be used as lucide-react has it.
const CheckCircle = (props: any) => <svg {...props} />;
