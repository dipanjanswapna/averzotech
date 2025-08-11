
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FlashSalePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-8">
        <h1 className="text-4xl font-bold mb-4">Flash Sale</h1>
        <p className="text-muted-foreground mb-8">
          This is the dedicated flash sale page. All flash sale items will be listed here.
        </p>
        
        <div className="text-center">
            <Button asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
        {/* Add products, filters, and timer here */}
      </main>
      <SiteFooter />
    </div>
  );
}
