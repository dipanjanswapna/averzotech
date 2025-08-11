
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function WomenPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container pt-8">
        <h1 className="text-4xl font-bold mb-4">Women's Collection</h1>
        <p>Browse our latest collection for women.</p>
        {/* Add products and filters here */}
      </main>
      <SiteFooter />
    </div>
  );
}
