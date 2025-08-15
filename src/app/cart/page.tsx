
"use client"

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, Heart, Gift, ChevronLeft, X } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { useToast } from '@/hooks/use-toast';
import { useCart, AppliedCoupon } from '@/hooks/use-cart';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { OrderSummary } from '@/components/order-summary';
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart | AVERZO',
  description: 'Review the items in your shopping cart and proceed to checkout.',
};

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, subTotal, appliedCoupon, applyCoupon, removeCoupon, appliedGiftCard, applyGiftCard, removeGiftCard, shippingInfo } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [couponCode, setCouponCode] = React.useState('');
  const [giftCardCode, setGiftCardCode] = React.useState('');
  const [isCheckingCoupon, setIsCheckingCoupon] = React.useState(false);
  const [isCheckingGiftCard, setIsCheckingGiftCard] = React.useState(false);

  const handleRemoveItem = (productId: string, size: string, color: string) => {
    removeFromCart(productId, size, color);
     toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
        toast({ title: "Coupon Code Required", description: "Please enter a coupon code.", variant: "destructive" });
        return;
    }
    setIsCheckingCoupon(true);
    try {
        const couponsRef = collection(db, 'coupons');
        const q = query(couponsRef, where("code", "==", couponCode.toUpperCase()));
        const couponSnap = await getDocs(q);

        if (couponSnap.empty) {
            toast({ title: "Invalid Coupon", description: "The coupon code you entered is not valid.", variant: "destructive"});
            setIsCheckingCoupon(false);
            return;
        }

        const couponDoc = couponSnap.docs[0];
        const couponData = couponDoc.data();
        const now = new Date();
        
        if (couponData.status && couponData.status === 'Disabled') {
             toast({ title: "Coupon Disabled", description: "This coupon is currently disabled.", variant: "destructive"});
            setIsCheckingCoupon(false);
            return;
        }

        if (new Date(couponData.endDate) < now) {
            toast({ title: "Coupon Expired", description: "This coupon has expired.", variant: "destructive"});
            setIsCheckingCoupon(false);
            return;
        }
        if (new Date(couponData.startDate) > now) {
            toast({ title: "Coupon Not Active", description: "This coupon is not active yet.", variant: "destructive"});
            setIsCheckingCoupon(false);
            return;
        }
        if (couponData.limit !== null && (couponData.used || 0) >= couponData.limit) {
            toast({ title: "Coupon Limit Reached", description: "This coupon has reached its usage limit.", variant: "destructive"});
            setIsCheckingCoupon(false);
            return;
        }
        
        const applicableItems = couponData.applicability?.type === 'products'
            ? cart.filter(item => couponData.applicability.ids.includes(item.id))
            : cart;

        if (applicableItems.length === 0) {
            toast({ title: "Coupon Not Applicable", description: "This coupon is not valid for any items in your cart.", variant: "destructive"});
            setIsCheckingCoupon(false);
            return;
        }

        const applicableSubtotal = applicableItems.reduce((acc, item) => acc + item.pricing.price * item.quantity, 0);

        if (couponData.minPurchase > applicableSubtotal) {
            toast({ title: "Minimum Purchase Not Met", description: `You need to spend at least ৳${couponData.minPurchase.toFixed(2)} on applicable items to use this coupon.`, variant: "destructive"});
            setIsCheckingCoupon(false);
            return;
        }

        let discountAmount = 0;
        if (couponData.type === 'percentage') {
            discountAmount = applicableSubtotal * (couponData.value / 100);
        } else {
            discountAmount = couponData.value;
        }

        const couponToApply: AppliedCoupon = {
            code: couponData.code,
            type: couponData.type,
            value: couponData.value,
            discountAmount: discountAmount,
            applicability: couponData.applicability,
            minPurchase: couponData.minPurchase
        };
        
        applyCoupon(couponToApply);
        setCouponCode('');
        toast({ title: "Coupon Applied!", description: `You've got a discount of ৳${discountAmount.toFixed(2)}.` });

    } catch(error) {
        console.error("Error applying coupon: ", error);
        toast({ title: "Error", description: "There was a problem applying the coupon.", variant: "destructive"});
    } finally {
        setIsCheckingCoupon(false);
    }
  }

  const handleApplyGiftCard = async () => {
    if (!giftCardCode.trim()) {
        toast({ title: "Gift Card Code Required", description: "Please enter a gift card code.", variant: "destructive" });
        return;
    }
    setIsCheckingGiftCard(true);
    try {
        const giftCardsRef = collection(db, 'giftCards');
        const q = query(giftCardsRef, where("code", "==", giftCardCode));
        const giftCardSnap = await getDocs(q);

        if (giftCardSnap.empty) {
            toast({ title: "Invalid Gift Card", description: "The gift card code you entered is not valid.", variant: "destructive" });
            return;
        }

        const giftCardDoc = giftCardSnap.docs[0];
        const giftCardData = giftCardDoc.data();
        
        const expiryDate = new Date(giftCardData.expiryDate);
        expiryDate.setHours(23, 59, 59, 999);

        if (expiryDate < new Date()) {
             toast({ title: "Gift Card Expired", description: "This gift card has expired.", variant: "destructive" });
            return;
        }
        
        if (giftCardData.status !== 'Active' || giftCardData.currentBalance <= 0) {
            toast({ title: "Gift Card Not Usable", description: "This gift card is either used or inactive.", variant: "destructive" });
            return;
        }

        applyGiftCard({ code: giftCardData.code, balance: giftCardData.currentBalance });
        setGiftCardCode('');
        toast({ title: "Gift Card Applied!", description: `৳${giftCardData.currentBalance.toFixed(2)} has been applied to your order.` });

    } catch (error) {
        console.error("Error applying gift card:", error);
        toast({ title: "Error", description: "Could not apply gift card.", variant: "destructive" });
    } finally {
        setIsCheckingGiftCard(false);
    }
  }
  
  const handleRemoveCoupon = () => {
      removeCoupon();
      setCouponCode('');
      toast({ title: "Coupon Removed" });
  }

  const handleRemoveGiftCard = () => {
    removeGiftCard();
    setGiftCardCode('');
    toast({ title: "Gift Card Removed" });
  }

  const handleContinueToShipping = () => {
    if (cart.length === 0) {
        toast({title: "Your cart is empty!", variant: "destructive"});
        return;
    }
    router.push('/shipping');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-8">
        <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">You have {cart.length} items in your cart.</p>
        </div>

        {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map(item => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex flex-col md:flex-row gap-4 border p-4 rounded-lg">
                  <Image
                    src={item.images[0] || 'https://placehold.co/150x200.png'}
                    alt={item.name}
                    width={100}
                    height={125}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <Link href={`/product/${item.id}`} className="font-semibold hover:text-primary">{item.name}</Link>
                    <p className="text-sm text-muted-foreground">{item.brand}</p>
                    <p className="text-sm text-muted-foreground">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                    {item.giftWithPurchase?.enabled && (
                        <p className="text-xs text-pink-600 font-semibold mt-1 flex items-center gap-1">
                            <Gift className="w-3 h-3" /> + FREE: {item.giftWithPurchase.description}
                        </p>
                    )}
                     <p className="text-sm text-muted-foreground mt-1">Delivery by: {item.shipping.estimatedDelivery}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end justify-between">
                     <div className="flex items-center gap-2">
                          <p className="font-bold">৳{item.pricing.price}</p>
                          {item.pricing.comparePrice && <p className="text-sm line-through text-muted-foreground">৳{item.pricing.comparePrice}</p>}
                          {item.pricing.discount && <p className="text-sm text-orange-500 font-bold">{item.pricing.discount}% OFF</p>}
                      </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border rounded-md">
                          <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}><span className='text-xl'>-</span></Button>
                          <Input type="number" value={item.quantity} readOnly className="w-12 h-8 text-center border-none focus-visible:ring-0" />
                          <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}><span className='text-xl'>+</span></Button>
                      </div>
                       <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id, item.selectedSize, item.selectedColor)}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
             <div className="flex justify-between items-center mt-6">
                <Button variant="outline" asChild>
                    <Link href="/">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Continue Shopping
                    </Link>
                </Button>
                <Button variant="destructive" onClick={clearCart}>
                    Clear Cart
                </Button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="border p-4 rounded-lg sticky top-24">
              <OrderSummary />
              
              <div className="my-4 space-y-4">
                    <div>
                        <label htmlFor="coupon" className="text-sm font-medium mb-1 block">Have a Coupon?</label>
                        {appliedCoupon ? (
                            <div className="flex items-center justify-between p-2 bg-secondary rounded-md">
                                <p className="text-sm font-semibold text-green-600">Applied: {appliedCoupon.code}</p>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRemoveCoupon}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Input id="coupon" placeholder="Enter coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value)} disabled={isCheckingCoupon} />
                                <Button variant="secondary" onClick={handleApplyCoupon} disabled={isCheckingCoupon}>
                                    {isCheckingCoupon ? 'Applying...' : 'Apply'}
                                </Button>
                            </div>
                        )}
                    </div>
                    <div>
                         <label htmlFor="gift-card" className="text-sm font-medium mb-1 block">Apply Gift Card</label>
                        {appliedGiftCard ? (
                             <div className="flex items-center justify-between p-2 bg-secondary rounded-md">
                                <p className="text-sm font-semibold text-green-600">Applied: {appliedGiftCard.code.substring(0, 9)}...</p>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRemoveGiftCard}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                             <div className="flex gap-2">
                                <Input id="gift-card" placeholder="Enter gift card code" value={giftCardCode} onChange={e => setGiftCardCode(e.target.value)} disabled={isCheckingGiftCard} />
                                <Button variant="secondary" onClick={handleApplyGiftCard} disabled={isCheckingGiftCard}>
                                    {isCheckingGiftCard ? 'Applying...' : 'Apply'}
                                </Button>
                            </div>
                        )}
                    </div>
              </div>

              <Separator className="my-4" />

              <Button className="w-full" size="lg" onClick={handleContinueToShipping}>
                Continue to Shipping
              </Button>
            </div>
          </div>
        </div>
        ) : (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-4">Looks like you haven't added anything to your cart yet.</p>
                <Button asChild>
                    <Link href="/">Start Shopping</Link>
                </Button>
            </div>
        )}
      </main>
    </div>
  );
}
