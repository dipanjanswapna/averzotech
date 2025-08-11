
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Tag, Truck, Heart, ShoppingBag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import * as React from 'react';

const product = {
  id: '89073456',
  brand: 'SASSAFRAS',
  name: 'Women Black Slim Fit Solid Tights',
  rating: 4.3,
  reviews: 2900,
  price: 639,
  mrp: 1399,
  discount: 54,
  images: [
    { src: 'https://placehold.co/600x800.png', alt: 'Model wearing black tights front view', dataAiHint: 'woman fashion' },
    { src: 'https://placehold.co/600x800.png', alt: 'Model wearing black tights side view', dataAiHint: 'woman fashion' },
    { src: 'https://placehold.co/600x800.png', alt: 'Model wearing black tights back view', dataAiHint: 'woman fashion' },
    { src: 'https://placehold.co/600x800.png', alt: 'Model wearing black tights full outfit', dataAiHint: 'woman street style' },
    { src: 'https://placehold.co/600x800.png', alt: 'Close up of the fabric', dataAiHint: 'fabric texture' },
    { src: 'https://placehold.co/600x800.png', alt: 'Model in a different pose', dataAiHint: 'fashion pose' },
  ],
  sizes: ['28', '30', '32', '34', '36'],
  colors: [
    { name: 'Beige', src: 'https://placehold.co/100x120.png', dataAiHint: 'beige fabric' }
  ],
  delivery: {
    pincode: '110001',
    estimated: '2-3 days',
  },
  offers: [
    'Applicable on: Orders above Rs. 500 (only on first purchase)',
    'Coupon code: MYNTRAFIRST',
    'Coupon Discount: 10% off (Your total saving: Rs. 101)',
  ],
  details: {
    description: 'Black solid full-length leggings, has an elasticated waistband with slip-on closure',
    sizeAndFit: 'The model (height 5\'8") is wearing a size 28',
    materialAndCare: '95% polyester, 5% spandex, Dry-clean',
    specifications: [
      { label: 'Fabric', value: 'Polyester' },
      { label: 'Pattern', value: 'Solid' },
      { label: 'Fit', value: 'Slim Fit' },
      { label: 'Waist Rise', value: 'High-Rise' },
      { label: 'Length', value: 'Full Length' },
    ],
  },
};

export default function ProductPage({ params }: { params: { productId: string } }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-muted-foreground mb-4">
          <Link href="/">Home</Link> / <Link href="/women">Clothing</Link> / <Link href="/women">Women Clothing</Link> / <span className="text-foreground">Sassafras Jeggings</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="lg:col-span-1">
            <Carousel
              className="w-full"
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-w-3 aspect-h-4">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={600}
                        height={800}
                        className="object-cover w-full h-full rounded-lg"
                        data-ai-hint={image.dataAiHint}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            </Carousel>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{product.brand}</h1>
            <h2 className="text-xl text-muted-foreground">{product.name}</h2>
            
            <div className="flex items-center mt-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-bold">{product.rating}</span>
              <Separator orientation="vertical" className="h-4 mx-2" />
              <span className="text-muted-foreground">{product.reviews.toLocaleString()} Ratings</span>
            </div>

            <Separator className="my-4" />

            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">₹{product.price}</span>
                <span className="text-muted-foreground line-through">MRP ₹{product.mrp}</span>
                <span className="text-orange-500 font-bold">({product.discount}% OFF)</span>
            </div>
            <p className="text-sm text-green-600 font-semibold">inclusive of all taxes</p>
            
            <div className="mt-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">MORE COLORS</h3>
                <div className="flex gap-2">
                    {product.colors.map(color => (
                        <Link href="#" key={color.name}>
                            <Image src={color.src} alt={color.name} width={50} height={60} className="rounded-md border-2 border-primary" data-ai-hint={color.dataAiHint} />
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-foreground">SELECT SIZE</h3>
                <Link href="#" className="text-sm font-semibold text-primary">SIZE CHART &gt;</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button key={size} variant="outline" className="rounded-full w-14 h-14 border-2 focus:border-primary focus:bg-primary/10">
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                <ShoppingBag className="mr-2 h-5 w-5" /> ADD TO BAG
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                <Heart className="mr-2 h-5 w-5" /> WISHLIST
              </Button>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2 uppercase">Delivery Options <Truck className="inline h-5 w-5" /></h3>
              <div className="flex items-center border rounded-md p-1 max-w-sm">
                  <input type="text" placeholder="Enter pincode" className="flex-grow p-1 outline-none text-sm bg-transparent" />
                  <Button variant="link" className="text-primary">Check</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Please enter PIN code to check delivery time & Pay on Delivery Availability</p>
            </div>
            
            <div className="text-sm mt-4 space-y-1">
                <p>100% Original Products</p>
                <p>Pay on delivery might be available</p>
                <p>Easy 7 days returns and exchanges</p>
            </div>

            <Separator className="my-6" />
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold uppercase text-sm">Best Offers <Tag className="inline h-5 w-5" /></AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 text-sm space-y-2">
                      {product.offers.map((offer, index) => <li key={index}>{offer}</li>)}
                  </ul>
                  <Link href="#" className="text-primary font-semibold text-sm mt-2 block">View Eligible Products</Link>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-semibold uppercase text-sm">Product Details</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                    <p>{product.details.description}</p>
                    <p><span className="font-semibold">Size & Fit:</span> {product.details.sizeAndFit}</p>
                    <p><span className="font-semibold">Material & Care:</span> {product.details.materialAndCare}</p>
                    <div>
                        <h4 className="font-semibold mb-1">Specifications:</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                            {product.details.specifications.map(spec => (
                                <React.Fragment key={spec.label}>
                                    <div className="text-muted-foreground">{spec.label}</div>
                                    <div>{spec.value}</div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
