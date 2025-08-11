"use client"

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Tag, Truck, Heart, ShoppingBag, Share2, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const product = {
  id: '89073456',
  sku: 'SAS-BLK-TIGHT-28',
  brand: 'SASSAFRAS',
  name: 'Women Black Slim Fit Solid Tights',
  rating: 4.3,
  reviewsCount: 2900,
  price: 639,
  mrp: 1399,
  discount: 54,
  availability: 'In Stock',
  images: [
    { src: 'https://placehold.co/600x800.png', alt: 'Model wearing black tights front view', dataAiHint: 'woman fashion' },
    { src: 'https://placehold.co/600x800.png', alt: 'Model wearing black tights side view', dataAiHint: 'woman fashion' },
    { src: 'https://placehold.co/600x800.png', alt: 'Model wearing black tights back view', dataAiHint: 'woman fashion' },
    { src: 'https://placehold.co/600x800.png', alt: 'Model wearing black tights full outfit', dataAiHint: 'woman street style' },
    { src: 'https://placehold.co/600x800.png', alt: 'Close up of the fabric', dataAiHint: 'fabric texture' },
    { src: 'https://placehold.co/600x800.png', alt: 'Model in a different pose', dataAiHint: 'fashion pose' },
  ],
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder YouTube video
  sizes: ['28', '30', '32', '34', '36'],
  colors: [
    { name: 'Black', hex: '#000000', active: true },
    { name: 'Beige', hex: '#F5F5DC', active: false },
    { name: 'Navy', hex: '#000080', active: false },
  ],
  delivery: {
    pincode: '110001',
    estimated: '2-3 days',
    shippingCost: 'Free Shipping',
  },
  emi: 'No Cost EMI starting from ₹213/month',
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
  vendor: {
    name: 'RetailNet',
    rating: 4.5,
    totalProducts: 1204,
  },
  returnPolicy: 'Easy 7 days returns and exchanges. Please keep the item in its original condition with the brand outer box, MRP tags attached, and warranty cards.',
  reviews: [
    { id: 1, author: 'Priya S.', rating: 5, title: 'Excellent Fit!', content: 'These are the best tights I have ever owned. The fit is perfect and the material is so comfortable. Highly recommend!', date: '2023-10-15', helpful: 12, unhelpful: 0 },
    { id: 2, author: 'Anjali M.', rating: 4, title: 'Good product', content: 'The quality is good for the price. A little see-through but manageable. Overall a decent purchase.', date: '2023-10-12', helpful: 5, unhelpful: 1 },
    { id: 3, author: 'Rohan K.', rating: 3, title: 'Average Quality', content: 'The product is okay. The material could have been better. It started pilling after a few washes.', date: '2023-10-10', helpful: 2, unhelpful: 3 },
  ],
  qna: [
    { id: 1, question: 'Is the material stretchable?', answer: 'Yes, it has 5% spandex which makes it quite stretchable.' },
    { id: 2, question: 'Is this suitable for gym wear?', answer: 'Yes, it is suitable for light workouts and yoga.' },
  ],
  recommendedProducts: [
      { id: '123', name: 'Sports Bra', brand: 'Nike', price: 1299, src: 'https://placehold.co/400x500.png', dataAiHint: 'sports bra' },
      { id: '456', name: 'Running Shoes', brand: 'Adidas', price: 3499, src: 'https://placehold.co/400x500.png', dataAiHint: 'running shoes' },
      { id: '789', name: 'Yoga Mat', brand: 'Decathlon', price: 899, src: 'https://placehold.co/400x500.png', dataAiHint: 'yoga mat' },
      { id: '101', name: 'Track Jacket', brand: 'Puma', price: 2199, src: 'https://placehold.co/400x500.png', dataAiHint: 'track jacket' }
  ]
};

const ratingDistribution = [
    { star: 5, percentage: 60, count: 1740 },
    { star: 4, percentage: 25, count: 725 },
    { star: 3, percentage: 8, count: 232 },
    { star: 2, percentage: 3, count: 87 },
    { star: 1, percentage: 4, count: 116 },
]

export default function ProductPage({ params }: { params: { productId: string } }) {
  const [quantity, setQuantity] = React.useState(1);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-muted-foreground mb-4">
          <Link href="/">Home</Link> / <Link href="/women">Clothing</Link> / <Link href="/women/tights">Tights</Link> / <span className="text-foreground">{product.brand} Tights</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery and Video */}
          <div>
              <div className="grid gap-4">
                  <div className="group relative">
                      <Carousel
                          className="w-full"
                          opts={{
                              loop: true,
                          }}
                      >
                          <CarouselContent>
                              {product.images.map((image, index) => (
                                  <CarouselItem key={index}>
                                      <div className="aspect-[3/4] overflow-hidden rounded-lg">
                                          <Image
                                              src={image.src}
                                              alt={image.alt}
                                              width={600}
                                              height={800}
                                              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
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

                  {/* Product Video */}
                  {product.videoUrl && (
                    <div className="aspect-video overflow-hidden rounded-lg">
                        <iframe
                            width="100%"
                            height="100%"
                            src={product.videoUrl}
                            title="Product Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                  )}
              </div>
          </div>


          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{product.brand}</h1>
                <h2 className="text-xl text-muted-foreground">{product.name}</h2>
              </div>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center mt-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-bold">{product.rating}</span>
              <Separator orientation="vertical" className="h-4 mx-2" />
              <span className="text-muted-foreground">{product.reviewsCount.toLocaleString()} Ratings</span>
            </div>

            <Separator className="my-4" />

            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">₹{product.price}</span>
                <span className="text-muted-foreground line-through">MRP ₹{product.mrp}</span>
                <span className="text-orange-500 font-bold">({product.discount}% OFF)</span>
            </div>
            <p className="text-sm text-green-600 font-semibold">inclusive of all taxes</p>
            <Badge variant="outline" className="mt-2">{product.availability}</Badge>
            <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>

            
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">COLOR</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                   <Button key={color.name} variant="outline" size="icon" className={`rounded-full border-2 ${color.active ? 'border-primary' : 'border-border'}`}>
                     <span className="block w-6 h-6 rounded-full" style={{ backgroundColor: color.hex }} />
                   </Button>
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
            
            <div className="mt-6 flex items-center gap-4">
              <h3 className="text-sm font-semibold text-foreground">QUANTITY</h3>
              <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q-1))}><span className='text-xl'>-</span></Button>
                  <Input type="number" value={quantity} readOnly className="w-12 h-8 text-center border-none focus-visible:ring-0" />
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q+1)}><span className='text-xl'>+</span></Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                <ShoppingBag className="mr-2 h-5 w-5" /> ADD TO CART
              </Button>
              <Button size="lg" variant="secondary" className="flex-1">
                 BUY NOW
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
              <p className="text-xs text-muted-foreground mt-1">Please enter PIN code to check delivery time &amp; Pay on Delivery Availability</p>
            </div>
            
            <div className="text-sm mt-4 space-y-1">
                <p>Estimated Delivery: <span className="font-semibold">{product.delivery.estimated}</span></p>
                <p>Shipping: <span className="font-semibold">{product.delivery.shippingCost}</span></p>
                <p>EMI: <span className="font-semibold">{product.emi}</span></p>
            </div>

             <div className="mt-4 flex gap-4">
                <div className="text-center text-sm">
                    <img src="https://placehold.co/50x50.png" alt="100% Original" className="mx-auto" data-ai-hint="original guarantee" />
                    <p>100% Original</p>
                </div>
                 <div className="text-center text-sm">
                    <img src="https://placehold.co/50x50.png" alt="Secure Payments" className="mx-auto" data-ai-hint="secure payment" />
                    <p>Secure Payments</p>
                </div>
                 <div className="text-center text-sm">
                    <img src="https://placehold.co/50x50.png" alt="Easy Returns" className="mx-auto" data-ai-hint="return policy" />
                    <p>Easy Returns</p>
                </div>
            </div>

            <Separator className="my-6" />
            
            <Accordion type="multiple" collapsible className="w-full">
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
                    <p><span className="font-semibold">Size &amp; Fit:</span> {product.details.sizeAndFit}</p>
                    <p><span className="font-semibold">Material &amp; Care:</span> {product.details.materialAndCare}</p>
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
              <AccordionItem value="item-3">
                  <AccordionTrigger className="font-semibold uppercase text-sm">Return Policy</AccordionTrigger>
                  <AccordionContent>
                      <p className="text-sm">{product.returnPolicy}</p>
                  </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                  <AccordionTrigger className="font-semibold uppercase text-sm">Sold By</AccordionTrigger>
                  <AccordionContent>
                      <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-primary">{product.vendor.name}</h4>
                            <div className="flex items-center text-sm">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1"/> {product.vendor.rating}
                            </div>
                        </div>
                        <Link href="#" className="text-primary font-semibold text-sm">View Store</Link>
                      </div>
                  </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Customer Reviews & Q&A */}
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Ratings &amp; Reviews</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="md:col-span-1">
                     <div className="flex items-center gap-2">
                         <h3 className="text-4xl font-bold">{product.rating}</h3>
                         <Star className="w-8 h-8 text-yellow-400 fill-yellow-400"/>
                     </div>
                     <p className="text-muted-foreground mt-1">{product.reviewsCount.toLocaleString()} Ratings</p>
                     <div className="mt-4 space-y-1">
                         {ratingDistribution.map(item => (
                             <div key={item.star} className="flex items-center gap-2 text-sm">
                                 <span>{item.star} <Star className="w-3 h-3 inline-block align-baseline text-muted-foreground" /></span>
                                 <Progress value={item.percentage} className="w-full h-2"/>
                                 <span className="text-muted-foreground w-12 text-right">{item.count}</span>
                             </div>
                         ))}
                     </div>
                 </div>
                 <div className="md:col-span-2">
                    {product.reviews.map(review => (
                        <div key={review.id} className="border-b py-4">
                            <div className="flex items-center mb-1">
                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}/>)}
                                <h4 className="font-semibold ml-2">{review.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">By {review.author} on {review.date}</p>
                            <p className="text-sm">{review.content}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <button className="flex items-center gap-1 hover:text-primary"><ThumbsUp className="w-3 h-3"/> Helpful ({review.helpful})</button>
                                <button className="flex items-center gap-1 hover:text-primary"><ThumbsDown className="w-3 h-3"/> Unhelpful ({review.unhelpful})</button>
                            </div>
                        </div>
                    ))}
                 </div>
             </div>
        </div>
        
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Questions &amp; Answers</h2>
            {product.qna.map(item => (
                <div key={item.id} className="border-b py-4 text-sm">
                    <p className="font-semibold">Q: {item.question}</p>
                    <p className="mt-1 text-muted-foreground">A: {item.answer}</p>
                </div>
            ))}
            <div className="mt-4">
                <h3 className="font-semibold mb-2">Have a question?</h3>
                <Textarea placeholder="Type your question here..."/>
                <Button className="mt-2">Post Question</Button>
            </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                {product.recommendedProducts.map(item => (
                    <Link href={`/product/${item.id}`} key={item.id} className="group block">
                        <div className="relative overflow-hidden rounded-lg">
                            <Image
                                src={item.src}
                                alt={item.name}
                                width={400}
                                height={500}
                                className="h-auto w-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={item.dataAiHint}
                            />
                        </div>
                        <div className="pt-2">
                            <h3 className="text-sm font-bold text-foreground">{item.brand}</h3>
                            <p className="text-xs text-muted-foreground truncate">{item.name}</p>
                            <p className="text-sm font-semibold mt-1 text-foreground">
                                Rs. {item.price}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>


        {/* Live Chat */}
        <div className="fixed bottom-6 right-6">
            <Button className="rounded-full h-14 w-14 shadow-lg">
                <MessageCircle className="h-7 w-7" />
            </Button>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}
