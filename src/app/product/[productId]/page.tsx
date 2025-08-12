
"use client"

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Tag, Truck, Heart, ShoppingBag, Share2, ThumbsUp, ThumbsDown, MessageCircle, Sparkles, Users, Gift, Send } from 'lucide-react';
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
import { doc, getDoc, collection, addDoc, getDocs, query, orderBy, serverTimestamp, runTransaction, DocumentData, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useWishlist, WishlistItem } from '@/hooks/use-wishlist';
import { VirtualTryOn } from '@/components/virtual-try-on';
import { useAuth } from '@/hooks/use-auth';
import { manageGroupBuy } from '@/ai/flows/group-buy-flow';
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
    ratingSummary: {
        average: number;
        count: number;
    };
    groupBuy?: {
        isActive: boolean;
        groupPrice: number;
        targetCount: number;
        expiresAt: any;
    };
    giftWithPurchase?: {
        isActive: boolean;
        description: string;
    }
  }

  interface Review {
      id: string;
      rating: number;
      title: string;
      comment: string;
      userName: string;
      createdAt: any;
      helpful: number;
      unhelpful: number;
  }

   interface QnaItem {
    id: string;
    question: string;
    questionBy: string;
    createdAt: any;
    answer?: string;
    answeredBy?: string;
    answeredAt?: any;
  }


export default function ProductPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = React.useState<Product | null>(null);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [qna, setQna] = React.useState<QnaItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState<string>('');
  const [selectedColor, setSelectedColor] = React.useState<{name: string, hex: string} | null>(null);
  const [isTryOnOpen, setIsTryOnOpen] = React.useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const [isGroupCreating, setIsGroupCreating] = React.useState(false);
  
  // Review form state
  const [reviewRating, setReviewRating] = React.useState(0);
  const [reviewTitle, setReviewTitle] = React.useState('');
  const [reviewComment, setReviewComment] = React.useState('');
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);
  const [canUserReview, setCanUserReview] = React.useState(false);
  const [checkingPurchase, setCheckingPurchase] = React.useState(true);
  
  // Q&A form state
  const [newQuestion, setNewQuestion] = React.useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = React.useState(false);


  const isInWishlist = product ? wishlist.some(item => item.id === product.id) : false;

  React.useEffect(() => {
    if (productId) {
      const fetchProductData = async () => {
        setLoading(true);
        try {
          const productRef = doc(db, 'products', productId);
          const reviewsRef = collection(productRef, 'reviews');
          const qnaRef = collection(productRef, 'qna');

          const productSnap = await getDoc(productRef);
          
          if (!productSnap.exists()) {
             setError('Product not found.');
             return;
          }
          
          const data = productSnap.data();
          const productData = { 
              id: productSnap.id, 
              ...data,
              ratingSummary: data.ratingSummary || { average: 0, count: 0 }
          } as Product;

          setProduct(productData);
          if (productData.variants.sizes.length > 0) setSelectedSize(productData.variants.sizes[0]);
          if (productData.variants.colors.length > 0) setSelectedColor(productData.variants.colors[0]);

          const reviewsQuery = query(reviewsRef, orderBy('createdAt', 'desc'));
          const reviewsSnap = await getDocs(reviewsQuery);
          setReviews(reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
          
          const qnaQuery = query(qnaRef, orderBy('createdAt', 'desc'));
          const qnaSnap = await getDocs(qnaQuery);
          setQna(qnaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as QnaItem)));

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
  
    React.useEffect(() => {
        const checkPurchase = async () => {
            if (!user || !product) {
                setCheckingPurchase(false);
                return;
            }
            try {
                const ordersRef = collection(db, 'orders');
                const q = query(
                    ordersRef, 
                    where("userId", "==", user.uid), 
                    where("status", "==", "Fulfilled")
                );
                const querySnapshot = await getDocs(q);
                
                let hasPurchased = false;
                querySnapshot.forEach((doc) => {
                    const order = doc.data();
                    if (order.items.some((item: any) => item.id === product.id)) {
                        hasPurchased = true;
                    }
                });
                
                setCanUserReview(hasPurchased);
            } catch (err) {
                console.error("Error checking purchase history:", err);
            } finally {
                setCheckingPurchase(false);
            }
        };

        if(!loading) {
            checkPurchase();
        }
    }, [user, product, loading]);

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
    if (!product) return;
    const shareData = {
      title: product.name,
      text: `Check out this product: ${product.name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copied", description: "Product link copied to clipboard!" });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({ title: "Error", description: "Could not share the product.", variant: 'destructive' });
    }
  };

  const handleStartGroupBuy = async () => {
      if(!user) {
          toast({ title: "Login Required", description: "Please log in to start a group buy.", variant: "destructive"});
          return;
      }
      if(!product) return;
      setIsGroupCreating(true);
      try {
          await manageGroupBuy({ action: 'create', productId: product.id, userId: user.uid });
          toast({
              title: "Group Started!",
              description: "You've successfully started a new group buy. Share it with your friends!",
          });
      } catch (error: any) {
          console.error("Failed to start group buy:", error);
          toast({ title: "Error", description: error.message || "Could not start the group buy.", variant: "destructive"});
      } finally {
          setIsGroupCreating(false);
      }
  }

  const handleReviewSubmit = async () => {
      if (!user) { toast({ title: "Please log in to submit a review.", variant: "destructive"}); return; }
      if (!product) return;
      if (!canUserReview) { toast({ title: "Purchase Required", description: "You must purchase this item to leave a review.", variant: "destructive"}); return;}
      if (reviewRating === 0 || !reviewComment) { toast({ title: "Please provide a rating and a comment.", variant: "destructive"}); return; }
      
      setIsSubmittingReview(true);
      const productRef = doc(db, 'products', product.id);
      const reviewsRef = collection(productRef, 'reviews');
      
      try {
          await runTransaction(db, async (transaction) => {
              const productDoc = await transaction.get(productRef);
              if (!productDoc.exists()) { throw "Product does not exist!"; }
              
              const currentSummary = productDoc.data().ratingSummary || { average: 0, count: 0 };
              const newCount = currentSummary.count + 1;
              const newAverage = ((currentSummary.average * currentSummary.count) + reviewRating) / newCount;

              transaction.update(productRef, {
                  ratingSummary: {
                      average: parseFloat(newAverage.toFixed(2)),
                      count: newCount
                  }
              });

              const newReviewRef = doc(reviewsRef);
              transaction.set(newReviewRef, {
                userId: user.uid,
                userName: user.fullName,
                rating: reviewRating,
                title: reviewTitle,
                comment: reviewComment,
                createdAt: serverTimestamp(),
                helpful: 0,
                unhelpful: 0
              });
          });

          toast({ title: "Review Submitted!", description: "Thank you for your feedback." });
          // Optimistically update UI
          setReviews(prev => [{
              id: 'new', rating: reviewRating, title: reviewTitle, comment: reviewComment,
              userName: user.fullName, createdAt: new Date(), helpful: 0, unhelpful: 0
          }, ...prev]);
          setReviewRating(0); setReviewTitle(''); setReviewComment('');

      } catch (e) {
          console.error("Review submission failed: ", e);
          toast({ title: "Submission Failed", description: "There was an error submitting your review.", variant: "destructive"});
      } finally {
          setIsSubmittingReview(false);
      }
  }

  const handleQuestionSubmit = async () => {
      if (!user) { toast({ title: "Please log in to ask a question.", variant: "destructive"}); return; }
      if (!product || !newQuestion.trim()) { toast({ title: "Please type a question.", variant: "destructive"}); return; }

      setIsSubmittingQuestion(true);
      const qnaRef = collection(db, 'products', product.id, 'qna');
      try {
        await addDoc(qnaRef, {
            question: newQuestion,
            questionBy: user.fullName,
            userId: user.uid,
            createdAt: serverTimestamp(),
            answer: null,
        });
        setQna(prev => [{
            id: 'new-q', question: newQuestion, questionBy: user.fullName, createdAt: new Date()
        }, ...prev]);
        setNewQuestion('');
        toast({ title: "Question Posted!", description: "Your question has been submitted."});
      } catch (e) {
        console.error("Question submission failed: ", e);
        toast({ title: "Failed to post question.", variant: "destructive"});
      } finally {
        setIsSubmittingQuestion(false);
      }
  }

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
          <Link href="/">Home</Link> / <Link href={`/shop?category=${product.organization.category}`}>{product.organization.category}</Link> / <span className="text-foreground">{product.brand} {product.organization.subcategory}</span>
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
                                              src={image}
                                              alt={product.name}
                                              width={600}
                                              height={800}
                                              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                              data-ai-hint={'product image'}
                                          />
                                      </div>
                                  </CarouselItem>
                              ))}
                          </CarouselContent>
                          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
                          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
                      </Carousel>
                  </div>

                  {product.videoUrl && (
                    <div className="aspect-video overflow-hidden rounded-lg">
                        <iframe
                            width="100%"
                            height="100%"
                            src={product.videoUrl.replace("watch?v=", "embed/")}
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
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center mt-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-bold">{product.ratingSummary?.average || 0}</span>
              <Separator orientation="vertical" className="h-4 mx-2" />
              <span className="text-muted-foreground">{(product.ratingSummary?.count || 0).toLocaleString()} Ratings</span>
            </div>

            <Separator className="my-4" />

            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">৳{product.pricing.price}</span>
                {product.pricing.comparePrice && <span className="text-muted-foreground line-through">MRP ৳{product.pricing.comparePrice}</span>}
                {product.pricing.discount && <span className="text-orange-500 font-bold">({product.pricing.discount}% OFF)</span>}
            </div>
            <p className="text-sm text-green-600 font-semibold">inclusive of all taxes</p>
            <Badge variant="outline" className="mt-2">{product.inventory.availability}</Badge>
            <p className="text-sm text-muted-foreground mt-1">SKU: {product.inventory.sku}</p>

            {product.giftWithPurchase?.isActive && (
                 <div className="mt-4 p-2 rounded-lg bg-green-100 border border-green-200">
                    <p className="font-semibold text-green-800 flex items-center gap-2 text-sm">
                        <Gift className="w-4 h-4" /> + FREE GIFT: {product.giftWithPurchase.description}
                    </p>
                </div>
            )}

            {product.groupBuy?.isActive && (
                 <div className="mt-4 p-4 rounded-lg bg-teal-50 border border-teal-200">
                    <h3 className="font-bold text-teal-800 flex items-center gap-2"><Users /> Group Buy Available!</h3>
                    <p className="text-teal-700 text-sm mt-1">
                        Buy with friends and get this for only <span className="font-bold text-lg">৳{product.groupBuy.groupPrice}</span>!
                        Requires {product.groupBuy.targetCount} people.
                    </p>
                    <div className='flex gap-2 mt-2'>
                        <Button size="sm" variant="secondary" className="bg-teal-600 text-white hover:bg-teal-700" onClick={handleStartGroupBuy} disabled={isGroupCreating}>
                           {isGroupCreating ? 'Starting...' : 'Start a Group'}
                        </Button>
                    </div>
                </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">COLOR</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.colors.map((color) => (
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
              <Button size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddToCart}>
                <ShoppingBag className="mr-2 h-5 w-5" /> ADD TO CART
              </Button>
              <Button size="lg" variant="secondary" className="flex-1" onClick={() => setIsTryOnOpen(true)}>
                 <Sparkles className="mr-2 h-5 w-5" /> Virtual Try-On
              </Button>
              <Button size="lg" variant={isInWishlist ? "default" : "outline"} className="flex-1" onClick={handleWishlistToggle}>
                <Heart className={`mr-2 h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} /> WISHLIST
              </Button>
            </div>
            
            <VirtualTryOn 
                isOpen={isTryOnOpen}
                onOpenChange={setIsTryOnOpen}
                productImage={product.images[0]}
                productName={product.name}
             />

            <Separator className="my-6" />
            
            <Accordion type="multiple" className="w-full" defaultValue={['item-1']}>
              {product.offers && <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold uppercase text-sm">Best Offers <Tag className="inline h-5 w-5" /></AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 text-sm space-y-2">
                      {(product.offers || '').split('\n').map((offer, index) => <li key={index}>{offer}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>}
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-semibold uppercase text-sm">Product Details</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm pt-4">
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
                         <h3 className="text-4xl font-bold">{product.ratingSummary?.average || 0}</h3>
                         <Star className="w-8 h-8 text-yellow-400 fill-yellow-400"/>
                     </div>
                     <p className="text-muted-foreground mt-1">{(product.ratingSummary?.count || 0).toLocaleString()} Ratings</p>
                     
                     <div className="border p-4 rounded-lg mt-6">
                        <h3 className="font-semibold mb-2">Write a review</h3>
                        <fieldset disabled={!canUserReview || isSubmittingReview || checkingPurchase}>
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} className={`w-6 h-6 cursor-pointer ${reviewRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} onClick={() => setReviewRating(star)} />
                                ))}
                            </div>
                            <Input placeholder="Review Title (optional)" className="mb-2" value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} />
                            <Textarea placeholder="Share your thoughts..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} />
                            <Button className="mt-2 w-full" onClick={handleReviewSubmit} disabled={isSubmittingReview || checkingPurchase}>
                                {isSubmittingReview ? "Submitting..." : "Submit Review"}
                            </Button>
                        </fieldset>
                        {!checkingPurchase && !canUserReview && (
                            <p className="text-xs text-center text-muted-foreground mt-2">You must purchase this item to leave a review.</p>
                        )}
                        {checkingPurchase && (
                             <p className="text-xs text-center text-muted-foreground mt-2">Checking your purchase history...</p>
                        )}
                     </div>
                 </div>
                 <div className="md:col-span-2">
                    {reviews.map(review => (
                        <div key={review.id} className="border-b py-4">
                            <div className="flex items-center mb-1">
                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}/>)}
                                <h4 className="font-semibold ml-2">{review.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">By {review.userName} on {new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                            <p className="text-sm">{review.comment}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <button className="flex items-center gap-1 hover:text-primary"><ThumbsUp className="w-3 h-3"/> Helpful ({review.helpful})</button>
                                <button className="flex items-center gap-1 hover:text-primary"><ThumbsDown className="w-3 h-3"/> Unhelpful ({review.unhelpful})</button>
                            </div>
                        </div>
                    ))}
                    {reviews.length === 0 && <p className="text-muted-foreground">No reviews yet. Be the first one!</p>}
                 </div>
             </div>
        </div>
        
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Questions &amp; Answers</h2>
            <div className="border p-4 rounded-lg">
                 <h3 className="font-semibold mb-2">Ask a question</h3>
                 <div className="flex gap-2">
                    <Input placeholder="Type your question here..." value={newQuestion} onChange={e => setNewQuestion(e.target.value)} />
                    <Button onClick={handleQuestionSubmit} disabled={isSubmittingQuestion}>
                        <Send className="w-4 h-4" />
                    </Button>
                 </div>
            </div>
            <div className="mt-4 space-y-4">
                {qna.map(item => (
                    <div key={item.id} className="border-b pb-4 text-sm">
                        <p><span className="font-semibold">Q:</span> {item.question} <span className="text-xs text-muted-foreground">- {item.questionBy}</span></p>
                        {item.answer ? (
                             <p className="mt-1 text-muted-foreground pl-5"><span className="font-semibold text-foreground">A:</span> {item.answer}</p>
                        ) : (
                             <p className="mt-1 text-muted-foreground text-xs pl-5">Awaiting answer...</p>
                        )}
                    </div>
                ))}
                 {qna.length === 0 && <p className="text-muted-foreground mt-4">No questions have been asked yet.</p>}
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

    
