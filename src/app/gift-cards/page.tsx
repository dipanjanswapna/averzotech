
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Gift } from 'lucide-react';

export default function GiftCardsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <Gift className="mx-auto h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl font-headline font-bold">Gift Cards</h1>
          <p className="text-lg text-muted-foreground mt-4">
            The perfect gift for any occasion. Coming soon!
          </p>
          <p className="text-muted-foreground mt-2">
            Our team is working hard to bring you a seamless gift card experience. Stay tuned!
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
