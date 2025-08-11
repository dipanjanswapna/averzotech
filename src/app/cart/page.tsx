
"use client"

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, Heart, Gift, ChevronLeft } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
     toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  };

  const subTotal = cart.reduce((acc, item) => acc + (item.pricing.price * item.quantity), 0);
  // Example shipping logic, can be made more complex
  const shippingFee = subTotal > 2000 || subTotal === 0 ? 0 : 60;
  const grandTotal = subTotal + shippingFee;

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
                <div key={item.id} className="flex flex-col md:flex-row gap-4 border p-4 rounded-lg">
                  <Image
                    src={item.images[0] || 'https://placehold.co/150x200.png'}
                    alt={item.name}
                    width={100}
                    height={125}
                    className="rounded-md object-cover"
                    data-ai-hint={item.name}
                  />
                  <div className="flex-grow">
                    <Link href={`/product/${item.id}`} className="font-semibold hover:text-primary">{item.name}</Link>
                    <p className="text-sm text-muted-foreground">{item.brand}</p>
                    <p className="text-sm text-muted-foreground">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
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
                          <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}><span className='text-xl'>-</span></Button>
                          <Input type="number" value={item.quantity} readOnly className="w-12 h-8 text-center border-none focus-visible:ring-0" />
                          <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}><span className='text-xl'>+</span></Button>
                      </div>
                       <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
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
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>৳{subTotal.toFixed(2)}</span>
                  </div>
                   <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span>{shippingFee === 0 ? 'Free' : `৳${shippingFee.toFixed(2)}`}</span>
                  </div>
              </div>

               <div className="mb-4">
                    <label htmlFor="coupon" className="text-sm font-medium mb-1 block">Have a Coupon?</label>
                    <div className="flex gap-2">
                        <Input id="coupon" placeholder="Enter coupon code" />
                        <Button variant="secondary">Apply</Button>
                    </div>
              </div>

               <div className="mb-4">
                    <div className="flex items-center">
                        <input type="checkbox" id="gift" className="mr-2" />
                        <label htmlFor="gift" className="text-sm">This is a gift <Gift className="inline h-4 w-4" /></label>
                    </div>
                </div>

              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Grand Total</span>
                <span>৳{grandTotal.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href="/shipping">Continue to Shipping</Link>
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
      <SiteFooter />
    </div>
  );
}
