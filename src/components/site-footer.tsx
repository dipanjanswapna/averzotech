import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        <div>
          <h3 className="mb-4 font-headline text-lg font-bold">ONLINE SHOPPING</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Men</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Women</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Kids</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Home & Living</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Beauty</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-headline text-lg font-bold">CUSTOMER POLICIES</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">T&C</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Use</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Shipping</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Returns</Link></li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h3 className="mb-4 font-headline text-lg font-bold">KEEP IN TOUCH</h3>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
          </div>
        </div>
        <div className="col-span-2 md:col-span-1">
            <h3 className="font-headline text-lg font-bold text-primary">averzo</h3>
            <p className="text-sm text-muted-foreground mt-2">
                Experience the best of online shopping for men, women and kids. Averzo is the ultimate destination for fashion and lifestyle, being host to a wide array of merchandise.
            </p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Averzo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
