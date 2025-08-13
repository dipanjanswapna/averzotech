

"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Tag, Truck, Heart, ShoppingBag, Share2, ThumbsUp, ThumbsDown, MessageCircle, Gift } from 'lucide-react';
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
import { doc, getDoc, collection, getDocs, addDoc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useWishlist, WishlistItem } from '@/hooks/use-wishlist';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';


interface Product {
    id: string;
    name: string;
    brand: string;
    description: string;
    videoUrl?: string;
    offers?: string;
    returnPolicy?: string;
    vendor?: string;
    giftWithPurchase?: {
        enabled: boolean;
        description: string;
    };
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
        estimatedDelivery: string;
    };
    images: string[];
    createdAt: any;
    updatedAt: any;
    recommendedProducts?: any[];
  }

interface Review {
    id: string;
    rating: number;
    title: string;
    comment: string;
    authorName: string;
    authorId: string;
    createdAt: any;
}

interface QnA {
    id: string;
    question: string;
    answer?: string;
    questionAuthorName: string;
    questionAuthorId: string;
    questionCreatedAt: any;
}


export function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;
  const { user } = useAuth();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [qna, setQna] = React.useState<QnA[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Product options state
  const [quantity, setQuantity] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState<string>('');
  const [selectedColor, setSelectedColor] = React.useState<{name: string, hex: string} | null>(null);
  
  // Review form state
  const [newReviewRating, setNewReviewRating] = React.useState(5);
  const [newReviewTitle, setNewReviewTitle] = React.useState("");
  const [newReviewComment, setNewReviewComment] = React.useState("");
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);

  // QnA form state
  const [newQuestion, setNewQuestion] = React.useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = React.useState(false);
  
  const { addToCart, availableShippingMethods } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const isInWishlist = product ? wishlist.some(item => item.id === product.id) : false;

  React.useEffect(() => {
    if (productId) {
      const fetchProductData = async () => {
        setLoading(true);
        try {
          const productRef = doc(db, 'products', productId);
          const reviewsRef = collection(db, 'products', productId, 'reviews');
          const qnaRef = collection(db, 'products', productId, 'qna');
          
          const productSnap = await getDoc(productRef);

          if (productSnap.exists()) {
            const productData = { id: productSnap.id, ...productSnap.data() } as Product;
            setProduct(productData);
            if (productData.variants.sizes.length > 0) setSelectedSize(productData.variants.sizes[0]);
            if (productData.variants.colors.length > 0) setSelectedColor(productData.variants.colors[0]);

            const reviewsQuery = query(reviewsRef, orderBy('createdAt', 'desc'));
            const reviewsSnap = await getDocs(reviewsQuery);
            setReviews(reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
            
            const qnaQuery = query(qnaRef, orderBy('questionCreatedAt', 'desc'));
            const qnaSnap = await getDocs(qnaQuery);
            setQna(qnaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as QnA)));

          } else {
            setError('Product not found.');
          }
        } catch (err) {
          setError('Failed to fetch product data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProductData();
    }
  }, [productId]);
  
  const handleAddToCart = (buyNow: boolean = false) => {
    if (!product) return;
    if (!selectedSize && product.variants.sizes.length > 0) {
        toast({ title: "Selection required", description: "Please select a size.", variant: "destructive" });
        return;
    }
     if (!selectedColor && product.variants.colors.length > 0) {
        toast({ title: "Selection required", description: "Please select a color.", variant: "destructive" });
        return;
    }
    const productToAdd = {
        ...product,
        selectedSize: selectedSize || 'N/A',
        selectedColor: selectedColor?.name || 'N/A',
    };
    addToCart(productToAdd, quantity);
    
    if (buyNow) {
        router.push('/shipping');
    } else {
        toast({ title: "Added to Cart", description: `${product.name} has been added to your cart.` })
    }
  }

  const handleWishlistToggle = () => {
      if (!product) return;
       const productForWishlist: WishlistItem = {
            id: product.id, name: product.name, brand: product.brand,
            pricing: product.pricing, images: product.images,
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
        } catch (error: any) {
           if (error.name !== 'AbortError') {
             console.error('Share failed:', error);
             navigator.clipboard.writeText(window.location.href);
             toast({ title: "Link Copied!", description: "Share failed, but the link is on your clipboard." });
           }
        }
      } else {
          navigator.clipboard.writeText(window.location.href);
          toast({ title: "Link Copied!", description: "Product link copied to clipboard." });
      }
  };

  const hasPurchasedProduct = async (userId: string, productId: string): Promise<boolean> => {
    if (!userId || !productId) return false;
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      where("status", "==", "Fulfilled")
    );

    const querySnapshot = await getDocs(q);
    for (const doc of querySnapshot.docs) {
      const orderItems = doc.data().items as { id: string }[];
      if (orderItems.some(item => item.id === productId)) {
        return true;
      }
    }
    return false;
  };

  const handleReviewSubmit = async () => {
      if (!user) {
          toast({ title: "Login Required", description: "Please log in to submit a review.", variant: "destructive" });
          return;
      }
      if (!newReviewTitle.trim() || !newReviewComment.trim()) {
          toast({ title: "Incomplete Review", description: "Please provide a title and a comment.", variant: "destructive" });
          return;
      }
      
      setIsSubmittingReview(true);
      try {
          const hasPurchased = await hasPurchasedProduct(user.uid, productId);
          if (!hasPurchased) {
              toast({
                  title: "Purchase Required",
                  description: "You can only review products you have purchased and received.",
                  variant: "destructive"
              });
              setIsSubmittingReview(false);
              return;
          }

          const reviewsRef = collection(db, 'products', productId, 'reviews');
          await addDoc(reviewsRef, {
              rating: newReviewRating,
              title: newReviewTitle,
              comment: newReviewComment,
              authorId: user.uid,
              authorName: user.fullName,
              createdAt: serverTimestamp()
          });

          // Refresh reviews
          const reviewsQuery = query(reviewsRef, orderBy('createdAt', 'desc'));
          const reviewsSnap = await getDocs(reviewsQuery);
          setReviews(reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));

          toast({ title: "Review Submitted!", description: "Thank you for your feedback." });
          setNewReviewTitle("");
          setNewReviewComment("");
          setNewReviewRating(5);
      } catch (error) {
           toast({ title: "Submission Failed", description: "Could not submit your review.", variant: "destructive" });
      } finally {
          setIsSubmittingReview(false);
      }
  }

  const handleQuestionSubmit = async () => {
    if (!user) {
          toast({ title: "Login Required", description: "Please log in to ask a question.", variant: "destructive" });
          return;
      }
      if (!newQuestion.trim()) {
          toast({ title: "Question Required", description: "Please type your question.", variant: "destructive" });
          return;
      }
      setIsSubmittingQuestion(true);
      try {
          const qnaRef = collection(db, 'products', productId, 'qna');
          await addDoc(qnaRef, {
              question: newQuestion,
              questionAuthorId: user.uid,
              questionAuthorName: user.fullName,
              questionCreatedAt: serverTimestamp(),
              answer: ""
          });
          const qnaQuery = query(qnaRef, orderBy('questionCreatedAt', 'desc'));
          const qnaSnap = await getDocs(qnaQuery);
          setQna(qnaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as QnA)));
          setNewQuestion("");
          toast({ title: "Question Submitted!", description: "Your question has been posted." });

      } catch (error) {
          toast({ title: "Submission Failed", description: "Could not post your question.", variant: "destructive" });
      } finally {
          setIsSubmittingQuestion(false);
      }
  }
  
  if (loading) {
    return (
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
    )
  }

  if (error) {
     return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Error</h2>
                <p className="text-muted-foreground mt-2">{error}</p>
                <Button asChild className="mt-4"><Link href="/">Back to Home</Link></Button>
            </div>
        </main>
     )
  }
  
  if (!product) {
      return null;
  }

  const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
  const ratingDistribution = [1, 2, 3, 4, 5].map(star => {
      const count = reviews.filter(r => r.rating === star).length;
      return { star, count, percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0 };
  }).reverse();

  return (
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-muted-foreground mb-4">
          <Link href="/">Home</Link> / <Link href={`/shop?category=${product.organization.category}`}>{product.organization.category}</Link> / <span className="text-foreground">{product.brand} {product.organization.subcategory}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery and Video */}
          <div>
              <div className="grid gap-4">
                  <div className="group relative">
                      <Carousel className="w-full" opts={{ loop: true, }}>
                          <CarouselContent>
                              {product.images.map((image, index) => (
                                  <CarouselItem key={index}>
                                      <div className="aspect-[3/4] overflow-hidden rounded-lg">
                                          <Image src={image} alt={product.name} width={600} height={800} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" data-ai-hint={'product image'} priority={index === 0}/>
                                      </div>
                                  </CarouselItem>
                              ))}
                          </CarouselContent>
                          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
                          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
                      </Carousel>
                       {product.giftWithPurchase?.enabled && (
                          <Badge className="absolute top-4 left-4 bg-pink-500 text-white border-pink-500 text-sm py-1 px-3">
                              <Gift className="w-4 h-4 mr-2"/> FREE GIFT
                          </Badge>
                      )}
                  </div>
                  {product.videoUrl && (
                    <div className="aspect-video overflow-hidden rounded-lg">
                        <iframe width="100%" height="100%" src={product.videoUrl.replace("watch?v=", "embed/")} title="Product Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
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
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center mt-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-bold">{averageRating.toFixed(1)}</span>
              <Separator orientation="vertical" className="h-4 mx-2" />
              <span className="text-muted-foreground">{reviews.length} Ratings</span>
            </div>

            <Separator className="my-4" />

            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">৳{product.pricing.price}</span>
                {product.pricing.comparePrice && <span className="text-muted-foreground line-through">MRP ৳{product.pricing.comparePrice}</span>}
                {product.pricing.discount && <span className="text-orange-500 font-bold">({product.pricing.discount}% OFF)</span>}
            </div>
            <p className="text-sm text-green-600 font-semibold">inclusive of all taxes</p>
             {product.giftWithPurchase?.enabled && (
                <p className="text-sm text-pink-600 font-semibold mt-1">+ FREE GIFT: {product.giftWithPurchase.description}</p>
             )}
            <Badge variant="outline" className="mt-2">{product.inventory.availability}</Badge>
            <p className="text-sm text-muted-foreground mt-1">SKU: {product.inventory.sku}</p>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">COLOR</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.colors.map((color) => (
                   <Button key={color.name} variant="outline" size="icon" className={cn("rounded-full border-2", selectedColor?.name === color.name ? 'border-primary' : 'border-border')} onClick={() => setSelectedColor(color)}>
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
                {product.variants.sizes.map((size) => (
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
              <Button size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleAddToCart(false)}>
                <ShoppingBag className="mr-2 h-5 w-5" /> ADD TO CART
              </Button>
              <Button size="lg" variant="secondary" className="flex-1" onClick={() => handleAddToCart(true)}>
                 BUY NOW
              </Button>
              <Button size="lg" variant={isInWishlist ? "default" : "outline"} className="flex-1" onClick={handleWishlistToggle}>
                <Heart className={`mr-2 h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} /> WISHLIST
              </Button>
            </div>

            <Separator className="my-6" />
            
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2 uppercase">Delivery Options <Truck className="inline h-5 w-5" /></h3 >
               <p className="text-xs text-muted-foreground mt-1">Estimated Delivery: {product.shipping.estimatedDelivery}</p>
                <div className="mt-2 text-sm space-y-1">
                    {availableShippingMethods.length > 0 ? (
                         availableShippingMethods.map(method => (
                           <p key={method.name}>• {method.name}: <span className="font-semibold">৳{method.fee}</span></p>
                        ))
                    ) : (
                        <p>Loading shipping options...</p>
                    )}
                </div>
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
                      {(product.offers || "").split('\n').map((offer, index) => offer.trim() && <li key={index}>{offer}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-semibold uppercase text-sm">Product Details</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                    <p>{product.description}</p>
                    <div>
                        <h4 className="font-semibold mb-1">Specifications:</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                            {product.specifications.map(spec => (
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
                         <h3 className="text-4xl font-bold">{averageRating.toFixed(1)}</h3>
                         <Star className="w-8 h-8 text-yellow-400 fill-yellow-400"/>
                     </div>
                     <p className="text-muted-foreground mt-1">{reviews.length} Ratings</p>
                     <div className="mt-4 space-y-1">
                         {ratingDistribution.map(item => (
                             <div key={item.star} className="flex items-center gap-2 text-sm">
                                 <span>{item.star} <Star className="w-3 h-3 inline-block align-baseline text-muted-foreground" /></span>
                                 <Progress value={item.percentage} className="w-full h-2"/>
                                 <span className="text-muted-foreground w-12 text-right">{item.count}</span>
                             </div>
                         ))}
                     </div>
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Write a Review</h3>
                        <div className="flex mb-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className={`w-6 h-6 cursor-pointer ${star <= newReviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} onClick={() => setNewReviewRating(star)} />
                            ))}
                        </div>
                        <Input placeholder="Review Title" value={newReviewTitle} onChange={e => setNewReviewTitle(e.target.value)} className="mb-2" />
                        <Textarea placeholder="Your detailed review..." value={newReviewComment} onChange={e => setNewReviewComment(e.target.value)} />
                        <Button className="mt-2" onClick={handleReviewSubmit} disabled={isSubmittingReview}>
                            {isSubmittingReview ? "Submitting..." : "Submit Review"}
                        </Button>
                    </div>
                 </div>
                 <div className="md:col-span-2">
                    {reviews.length > 0 ? reviews.map(review => (
                        <div key={review.id} className="border-b py-4">
                            <div className="flex items-center mb-1">
                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}/>)}
                                <h4 className="font-semibold ml-2">{review.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">By {review.authorName} on {new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                            <p className="text-sm">{review.comment}</p>
                        </div>
                    )) : <p className="text-muted-foreground">No reviews yet. Be the first one to review!</p>}
                 </div>
             </div>
        </div>
        
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Questions &amp; Answers</h2>
            {qna.length > 0 ? qna.map(item => (
                <div key={item.id} className="border-b py-4 text-sm">
                    <p className="font-semibold">Q: {item.question}</p>
                    {item.answer ? <p className="mt-1 text-muted-foreground">A: {item.answer}</p> : <p className="mt-1 text-muted-foreground text-xs">A: Answer pending.</p>}
                </div>
            )) : <p className="text-muted-foreground">No questions have been asked yet.</p>}
            <div className="mt-4">
                <h3 className="font-semibold mb-2">Have a question?</h3>
                <Textarea placeholder="Type your question here..." value={newQuestion} onChange={e => setNewQuestion(e.target.value)} />
                <Button className="mt-2" onClick={handleQuestionSubmit} disabled={isSubmittingQuestion}>
                  {isSubmittingQuestion ? "Posting..." : "Post Question"}
                </Button>
            </div>
        </div>

        {product.recommendedProducts && product.recommendedProducts.length > 0 && (
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                    {product.recommendedProducts.map((item: any) => (
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
        )}

      </main>
      );
}
