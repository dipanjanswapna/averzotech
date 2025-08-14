
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Link from 'next/link';
import { filterCategories } from '@/lib/categories';

export default function SiteMapPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold">Site Map</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Find your way around Averzo.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
                <h2 className="font-bold text-lg border-b pb-2">Main Pages</h2>
                <ul className="space-y-2">
                    <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
                    <li><Link href="/shop" className="text-muted-foreground hover:text-primary">Shop All</Link></li>
                    <li><Link href="/cart" className="text-muted-foreground hover:text-primary">Shopping Cart</Link></li>
                    <li><Link href="/wishlist" className="text-muted-foreground hover:text-primary">Wishlist</Link></li>
                    <li><Link href="/profile" className="text-muted-foreground hover:text-primary">My Account</Link></li>
                </ul>
            </div>
             <div className="space-y-4">
                <h2 className="font-bold text-lg border-b pb-2">Categories</h2>
                <ul className="space-y-2">
                    {filterCategories.map(cat => (
                        <li key={cat.name}><Link href={cat.href} className="text-muted-foreground hover:text-primary">{cat.name}</Link></li>
                    ))}
                </ul>
            </div>
             <div className="space-y-4">
                <h2 className="font-bold text-lg border-b pb-2">Customer Service</h2>
                <ul className="space-y-2">
                    <li><Link href="/contact-us" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
                    <li><Link href="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
                    <li><Link href="/shipping-policy" className="text-muted-foreground hover:text-primary">Shipping Policy</Link></li>
                    <li><Link href="/returns-policy" className="text-muted-foreground hover:text-primary">Returns Policy</Link></li>
                    <li><Link href="/cancellation-policy" className="text-muted-foreground hover:text-primary">Cancellation Policy</Link></li>
                </ul>
            </div>
             <div className="space-y-4">
                <h2 className="font-bold text-lg border-b pb-2">Legal</h2>
                <ul className="space-y-2">
                     <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                    <li><Link href="/terms-and-conditions" className="text-muted-foreground hover:text-primary">Terms & Conditions</Link></li>
                     <li><Link href="/grievance-redressal" className="text-muted-foreground hover:text-primary">Grievance Redressal</Link></li>
                </ul>
            </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
