
import Link from 'next/link';
import { Logo } from './logo';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function SiteFooter() {
    return (
        <footer className="bg-secondary text-secondary-foreground">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Logo />
                        <p className="text-sm text-muted-foreground mt-4">
                            Averzo is your one-stop shop for the latest fashion trends, electronics, and home goods.
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                            <Link href="#" className="hover:text-primary"><Facebook className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-primary"><Instagram className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-primary"><Twitter className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-primary"><Youtube className="h-5 w-5" /></Link>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <h3 className="font-semibold">Shop</h3>
                        <ul className="space-y-2 mt-4 text-sm">
                            <li><Link href="/men" className="text-muted-foreground hover:text-primary">Men</Link></li>
                            <li><Link href="/women" className="text-muted-foreground hover:text-primary">Women</Link></li>
                            <li><Link href="/kids" className="text-muted-foreground hover:text-primary">Kids</Link></li>
                            <li><Link href="/home-living" className="text-muted-foreground hover:text-primary">Home & Living</Link></li>
                            <li><Link href="/electronics" className="text-muted-foreground hover:text-primary">Electronics</Link></li>
                        </ul>
                    </div>

                     <div className="col-span-1">
                        <h3 className="font-semibold">Customer Service</h3>
                        <ul className="space-y-2 mt-4 text-sm">
                            <li><Link href="/contact-us" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
                            <li><Link href="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
                            <li><Link href="/returns-policy" className="text-muted-foreground hover:text-primary">Returns & Exchanges</Link></li>
                             <li><Link href="/shipping-policy" className="text-muted-foreground hover:text-primary">Shipping Policy</Link></li>
                             <li><Link href="/cancellation-policy" className="text-muted-foreground hover:text-primary">Cancellation Policy</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h3 className="font-semibold">Newsletter</h3>
                        <p className="text-sm text-muted-foreground mt-4">Subscribe to get the latest on sales, new releases and more.</p>
                        <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
                            <Input type="email" placeholder="Email" />
                            <Button type="submit">Subscribe</Button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Averzo. All Rights Reserved.</p>
                     <div className="flex gap-4 mt-4 md:mt-0">
                        <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms-and-conditions" className="hover:text-primary">Terms &amp; Conditions</Link>
                        <Link href="/site-map" className="hover:text-primary">Site Map</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
