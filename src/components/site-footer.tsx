
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Image from 'next/image';
import { Logo } from './logo';

export function SiteFooter() {
  return (
    <footer className="bg-white text-foreground">
      <div className="container py-8 md:py-12">
        <div className="mb-8">
            <Logo className="text-4xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className='col-span-1'>
                 <h3 className="mb-4 font-bold text-xs tracking-widest uppercase">ONLINE SHOPPING</h3>
                <ul className="space-y-2">
                    <li><Link href="/men" className="text-sm text-muted-foreground hover:text-primary">Men</Link></li>
                    <li><Link href="/women" className="text-sm text-muted-foreground hover:text-primary">Women</Link></li>
                    <li><Link href="/kids" className="text-sm text-muted-foreground hover:text-primary">Kids</Link></li>
                    <li><Link href="/home-living" className="text-sm text-muted-foreground hover:text-primary">Home & Living</Link></li>
                    <li><Link href="/beauty" className="text-sm text-muted-foreground hover:text-primary">Beauty</Link></li>
                    <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary">Genz</Link></li>
                    <li><Link href="/gift-cards" className="text-sm text-muted-foreground hover:text-primary">Gift Cards</Link></li>
                </ul>
                 <h3 className="mt-6 mb-4 font-bold text-xs tracking-widest uppercase">USEFUL LINKS</h3>
                <ul className="space-y-2">
                    <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
                    <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Careers</Link></li>
                    <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Site Map</Link></li>
                    <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Corporate Information</Link></li>
                </ul>
            </div>
             <div className='col-span-1'>
                <h3 className="mb-4 font-bold text-xs tracking-widest uppercase">CUSTOMER POLICIES</h3>
                <ul className="space-y-2">
                    <li><Link href="/contact-us" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link></li>
                    <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
                    <li><Link href="/terms-and-conditions" className="text-sm text-muted-foreground hover:text-primary">T&amp;C</Link></li>
                    <li><Link href="/terms-and-conditions" className="text-sm text-muted-foreground hover:text-primary">Terms Of Use</Link></li>
                    <li><Link href="/profile/orders" className="text-sm text-muted-foreground hover:text-primary">Track Orders</Link></li>
                    <li><Link href="/shipping-policy" className="text-sm text-muted-foreground hover:text-primary">Shipping</Link></li>
                    <li><Link href="/cancellation-policy" className="text-sm text-muted-foreground hover:text-primary">Cancellation</Link></li>
                    <li><Link href="/returns-policy" className="text-sm text-muted-foreground hover:text-primary">Returns</Link></li>
                    <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy policy</Link></li>
                    <li><Link href="/grievance-redressal" className="text-sm text-muted-foreground hover:text-primary">Grievance Redressal</Link></li>
                </ul>
            </div>
             <div className='col-span-2 lg:col-span-1'>
                <h3 className="mb-4 font-bold text-xs tracking-widest uppercase">EXPERIENCE AVERZO APP ON MOBILE</h3>
                 <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-2">
                    <Link href="#"><Image src="https://placehold.co/136x40.png" width={136} height={40} alt="Get it on Google Play" data-ai-hint="Google Play store button"/></Link>
                    <Link href="#"><Image src="https://placehold.co/136x40.png" width={136} height={40} alt="Download on the App Store" data-ai-hint="Apple App store button"/></Link>
                </div>
                <h3 className="mt-6 mb-4 font-bold text-xs tracking-widest uppercase">KEEP IN TOUCH</h3>
                <div className="flex space-x-4">
                    <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><Youtube /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
                 </div>
            </div>
            <div className="col-span-2 lg:col-span-2">
                <div className="flex items-start gap-4 mb-6">
                    <Image src="https://i.postimg.cc/63X9JhjJ/Screenshot-2025-08-14-014934.png" width={48} height={48} alt="Original Guarantee" data-ai-hint="original guarantee badge"/>
                    <div>
                        <p className="font-bold">100% ORIGINAL</p>
                        <p className="text-sm text-muted-foreground">guarantee for all products at averzo.com</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Image src="https://i.postimg.cc/KvwhhNjq/Screenshot-2025-08-14-015302.png" width={48} height={48} alt="Return within 14 days" data-ai-hint="return policy badge"/>
                    <div>
                        <p className="font-bold">Return within 14days</p>
                        <p className="text-sm text-muted-foreground">of receiving your order</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
       <div className="border-t border-border">
        <div className="container py-4 text-center text-xs text-muted-foreground">
           <div className="mb-2">
                <Image src="https://i.postimg.cc/mD8FwWwN/Prangon-s-Ecosystem-Logo-removebg-preview.png" width={120} height={40} alt="Prangon's Ecosystem" className="mx-auto" />
                <p className="mt-1">AVERZO a partner of PRANGONS ECOSYSTEM.</p>
           </div>
           <div className="flex justify-center mb-2">
                <Image src="https://i.postimg.cc/28T0N850/photo-2025-08-14-01-23-50-removebg-preview.png" width={100} height={21} alt="Payment methods" />
            </div>
          <p>© {new Date().getFullYear()} www.averzo.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
