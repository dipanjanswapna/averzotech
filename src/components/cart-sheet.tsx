
'use client';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CartSheet() {
    const { 
        isCartOpen, 
        setIsCartOpen, 
        cart, 
        cartCount, 
        subTotal, 
        removeFromCart 
    } = useCart();
    const { toast } = useToast();

    const handleRemoveItem = (productId: string, size: string, color: string) => {
        removeFromCart(productId, size, color);
        toast({
            title: "Item Removed",
            description: "The item has been removed from your cart.",
        });
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="px-6">
                    <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
                </SheetHeader>
                <Separator />
                {cart.length > 0 ? (
                    <>
                        <ScrollArea className="flex-1">
                           <div className="px-6 flex flex-col gap-6 my-4">
                                {cart.map(item => (
                                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                                            <Image
                                                src={item.images[0] || 'https://placehold.co/100x100.png'}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium">
                                                    <h3>
                                                        <Link href={`/product/${item.id}`} onClick={() => setIsCartOpen(false)}>{item.name}</Link>
                                                    </h3>
                                                    <p className="ml-4 font-semibold">৳{item.pricing.price * item.quantity}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Size: {item.selectedSize}, Color: {item.selectedColor}
                                                </p>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <p className="text-gray-500">Qty {item.quantity}</p>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveItem(item.id, item.selectedSize, item.selectedColor)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                           </div>
                        </ScrollArea>
                        <Separator />
                        <SheetFooter className="p-6">
                           <div className="w-full space-y-4">
                               <div className="flex justify-between text-base font-medium">
                                    <p>Subtotal</p>
                                    <p>৳{subTotal.toFixed(2)}</p>
                                </div>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Shipping and taxes calculated at checkout.
                                </p>
                                 <div className="mt-6 flex flex-col gap-2">
                                    <Button asChild className="w-full" onClick={() => setIsCartOpen(false)}>
                                        <Link href="/cart">View Cart</Link>
                                    </Button>
                                    <Button asChild className="w-full" onClick={() => setIsCartOpen(false)}>
                                        <Link href="/shipping">Checkout</Link>
                                    </Button>
                                </div>
                           </div>
                        </SheetFooter>
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-6">
                        <div className="h-28 w-28 rounded-full bg-secondary flex items-center justify-center">
                            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg">Your cart is empty</h3>
                        <p className="text-sm text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
                        <Button asChild onClick={() => setIsCartOpen(false)}>
                            <Link href="/shop">Start Shopping</Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
