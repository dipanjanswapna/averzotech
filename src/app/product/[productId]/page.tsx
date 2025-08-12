
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
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useWishlist, WishlistItem } from '@/hooks/use-wishlist';
import { useParams } from 'next/navigation';


interface Product {
    id: string;
    name: string;
    brand: string;
    description: string;
    videoUrl?: string;
    offers?: string;
    returnPolicy?: string;
    vendor?: string;
    pricing: {
      price: number;
      comparePrice?: number;
      discount?: number;
      tax?: number;
    };
    inventory: {
        sku: string;
        stock: number;
        availability: string;
    };
    organization: {
        category: string;
        group: string;
        subcategory: string;
        tags: string[];
    };
    variants: {
        colors: { name: string; hex: string }[];
        sizes: string[];
    };
    specifications: { label: string; value: string }[];
    shipping: {
        deliveryFee: number;
        estimatedDelivery: string;
    };
    images: string[];
    createdAt: any;
    updatedAt: any;
    // The following properties are not in the DB yet, so we'll make them optional
    rating?: number;
    reviewsCount?: number;
    reviews?: any[];
    qna?: any[];
    recommendedProducts?: any[];
  }


export default function ProductPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState<string>('');
  const [selectedColor, setSelectedColor] = React.useState<{name: string, hex: string} | null>(null);
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const isInWishlist = product ? wishlist.some(item => item.id === product.id) : false;

  React.useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const docRef = doc(db, 'products', productId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const productData = { id: docSnap.id, ...docSnap.data() } as Product;
            setProduct(productData);
            if (productData.variants.sizes.length > 0) {
              setSelectedSize(productData.variants.sizes[0]);
            }
            if (productData.variants.colors.length > 0) {
              setSelectedColor(productData.variants.colors[0]);
            }
          } else {
            setError('Product not found.');
          }
        } catch (err) {
          setError('Failed to fetch product.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId]);
  
  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize && product.variants.sizes.length > 0) {
        toast({
            title: "Selection required",
            description: "Please select a size.",
            variant: "destructive"
        });
        return;
    }
     if (!selectedColor && product.variants.colors.length > 0) {
        toast({
            title: "Selection required",
            description: "Please select a color.",
            variant: "destructive"
        });
        return;
    }
    const productToAdd = {
        ...product,
        selectedSize: selectedSize || 'N/A',
        selectedColor: selectedColor?.name || 'N/A',
    };
    addToCart(productToAdd, quantity);
    toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`
    })
  }

  const handleWishlistToggle = () => {
      if (!product) return;

       const productForWishlist: WishlistItem = {
            id: product.id,
            name: product.name,
            brand: product.brand,
            pricing: product.pricing,
            images: product.images,
            inventory: { availability: product.inventory.availability }
       };

      if (isInWishlist) {
          removeFromWishlist(product.id);
          toast({ title: "Removed from Wishlist" });
      } else {
          addToWishlist(productForWishlist);
          toast({ title: "Added to Wishlist" });
      }
  }
  
  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        });
        toast({
          title: "Shared successfully!",
        });
      } catch (error) {
        console.error("Share failed:", error);
        toast({
          title: "Share failed",
          description: "Could not share the product.",
          variant: "destructive",
        });
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "Product link copied to clipboard.",
        });
      } catch (err) {
        console.error("Failed to copy:", err);
        toast({
          title: "Failed to copy link",
          variant: "destructive",
        });
      }
    }
  };


  if (loading) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div>
                        <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                         <div className="grid grid-cols-5 gap-2 mt-4">
                            <Skeleton className="w-full aspect-square rounded-lg" />
                            <Skeleton className="w-full aspect-square rounded-lg" />
                            <Skeleton className="w-full aspect-square rounded-lg" />
                            <Skeleton className="w-full aspect-square rounded-lg" />
                            <Skeleton className="w-full aspect-square rounded-lg" />
                         </div>
                    </div>
                     <div>
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-1/4 mb-4" />
                        <Skeleton className="h-10 w-1/3 mb-4" />
                        <div className="flex gap-4 mt-6">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                     </div>
                 </div>
            </main>
            <SiteFooter />
        </div>
    )
  }

  if (error) {
     return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Error</h2>
                    <p className="text-muted-foreground mt-2">{error}</p>
                    <Button asChild className="mt-4"><Link href="/">Back to Home</Link></Button>
                </div>
            </main>
            <SiteFooter />
        </div>
     )
  }
  
  if (!product) {
      return null;
  }

  // Use mock data for parts not in DB yet
  const displayProduct = {
      ...product,
      images: product.images.map(img => ({ src: img, alt: product.name, dataAiHint: 'product image'})),
      offers: product.offers ? product.offers.split('\n') : [],
      rating: product.rating || 4.5,
      reviewsCount: product.reviewsCount || 123,
      reviews: product.reviews || [],
      qna: product.qna || [],
      recommendedProducts: product.recommendedProducts || [],
  };

  const ratingDistribution = [
    { star: 5, percentage: 60, count: 1740 },
    { star: 4, percentage: 25, count: 725 },
    { star: 3, percentage: 8, count: 232 },
    { star: 2, percentage: 3, count: 87 },
    { star: 1, percentage: 4, count: 116 },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-muted-foreground mb-4">
          <Link href="/">Home</Link> / <Link href={`/shop?category=${product.organization.category}`}>{product.organization.category}</Link> / <span className="text-foreground">{displayProduct.brand} {product.organization.subcategory}</span>
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
                              {displayProduct.images.map((image, index) => (
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
                  {displayProduct.videoUrl && (
                    <div className="aspect-video overflow-hidden rounded-lg">
                        <iframe
                            width="100%"
                            height="100%"
                            src={displayProduct.videoUrl.replace("watch?v=", "embed/")}
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
                <h1 className="text-2xl font-bold text-foreground">{displayProduct.brand}</h1>
                <h2 className="text-xl text-muted-foreground">{displayProduct.name}</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center mt-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-bold">{displayProduct.rating}</span>
              <Separator orientation="vertical" className="h-4 mx-2" />
              <span className="text-muted-foreground">{displayProduct.reviewsCount.toLocaleString()} Ratings</span>
            </div>

            <Separator className="my-4" />

            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">৳{displayProduct.pricing.price}</span>
                {displayProduct.pricing.comparePrice && <span className="text-muted-foreground line-through">MRP ৳{displayProduct.pricing.comparePrice}</span>}
                {displayProduct.pricing.discount && <span className="text-orange-500 font-bold">({displayProduct.pricing.discount}% OFF)</span>}
            </div>
            <p className="text-sm text-green-600 font-semibold">inclusive of all taxes</p>
            <Badge variant="outline" className="mt-2">{displayProduct.inventory.availability}</Badge>
            <p className="text-sm text-muted-foreground mt-1">SKU: {displayProduct.inventory.sku}</p>

            
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">COLOR</h3>
              <div className="flex flex-wrap gap-2">
                {displayProduct.variants.colors.map((color) => (
                   <Button key={color.name} variant="outline" size="icon" className={`rounded-full border-2 ${selectedColor?.name === color.name ? 'border-primary' : 'border-border'}`} onClick={() => setSelectedColor(color)}>
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
                {displayProduct.variants.sizes.map((size) => (
                  <Button key={size} variant={selectedSize === size ? "default" : "outline"} className="rounded-full w-14 h-14 border-2" onClick={() => setSelectedSize(size)}>
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
              <Button size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddToCart}>
                <ShoppingBag className="mr-2 h-5 w-5" /> ADD TO CART
              </Button>
              <Button size="lg" variant="secondary" className="flex-1">
                 BUY NOW
              </Button>
              <Button size="lg" variant={isInWishlist ? "default" : "outline"} className="flex-1" onClick={handleWishlistToggle}>
                <Heart className={`mr-2 h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} /> WISHLIST
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
                <p>Estimated Delivery: <span className="font-semibold">{displayProduct.shipping.estimatedDelivery}</span></p>
                <p>Shipping: <span className="font-semibold">{displayProduct.shipping.deliveryFee === 0 ? 'Free Shipping' : `৳${displayProduct.shipping.deliveryFee}`}</span></p>
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
            
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold uppercase text-sm">Best Offers <Tag className="inline h-5 w-5" /></AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 text-sm space-y-2">
                      {displayProduct.offers.map((offer, index) => <li key={index}>{offer}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-semibold uppercase text-sm">Product Details</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                    <p>{displayProduct.description}</p>
                    <div>
                        <h4 className="font-semibold mb-1">Specifications:</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                            {displayProduct.specifications.map(spec => (
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
                            <h4 className="font-bold text-primary">{product.vendor}</h4>
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
                         <h3 className="text-4xl font-bold">{displayProduct.rating}</h3>
                         <Star className="w-8 h-8 text-yellow-400 fill-yellow-400"/>
                     </div>
                     <p className="text-muted-foreground mt-1">{displayProduct.reviewsCount.toLocaleString()} Ratings</p>
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
                    {displayProduct.reviews.map(review => (
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
            {displayProduct.qna.map(item => (
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
                {displayProduct.recommendedProducts.map(item => (
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
                                ৳ {item.price}
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
