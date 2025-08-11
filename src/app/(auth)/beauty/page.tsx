
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function BeautyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-8">
        <h1 className="text-4xl font-bold mb-4">Beauty Products</h1>
        <p>Browse our latest beauty products.</p>
        {/* Add products and filters here */}
      </main>
      <SiteFooter />
    </div>
  );
}
