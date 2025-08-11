import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Logo } from './logo';

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-8 md:py-12">
        <div className="md:col-span-4 text-center md:text-left">
            <Logo />
        </div>
        <div>
          <h3 className="mb-4 font-headline text-lg font-bold">ONLINE SHOPPING</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Men</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Women</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Kids</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Home & Living</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Beauty</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-headline text-lg font-bold">CUSTOMER POLICIES</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Contact Us</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">FAQ</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">T&C</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Terms of Use</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Shipping</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Returns</Link></li>
          </ul>
        </div>
        <div className="sm:col-span-2 md:col-span-1">
          <h3 className="mb-4 font-headline text-lg font-bold">KEEP IN TOUCH</h3>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary-foreground"><Facebook /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary-foreground"><Twitter /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary-foreground"><Instagram /></Link>
          </div>
        </div>
        <div className="sm:col-span-2 md:col-span-1">
            <h3 className="font-headline text-lg font-bold">OUR PROMISE</h3>
            <p className="text-sm text-muted-foreground mt-2">
                Experience the best of online shopping for men, women and kids. Averzo is the ultimate destination for fashion and lifestyle, being host to a wide array of merchandise.
            </p>
        </div>
      </div>
      <div className="border-t border-border bg-secondary">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} RDC STORE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
