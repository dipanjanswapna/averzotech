
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { Separator } from "./ui/separator";
import { Home, Store } from 'lucide-react';

export const OrderSummary: React.FC = () => {
    const { subTotal, appliedCoupon, appliedGiftCard, shippingFee, taxes, total, shippingInfo } = useCart();

    const giftCardDiscount = appliedGiftCard ? Math.min(appliedGiftCard.balance, subTotal - (appliedCoupon?.discountAmount || 0)) : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="space-y-2">
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Subtotal</p>
                        <p className="font-semibold">৳{subTotal.toFixed(2)}</p>
                    </div>
                    {appliedCoupon && (
                        <div className="flex justify-between text-green-600">
                            <p>Discount ({appliedCoupon.code})</p>
                            <p className="font-semibold">- ৳{appliedCoupon.discountAmount.toFixed(2)}</p>
                        </div>
                    )}
                    {appliedGiftCard && (
                        <div className="flex justify-between text-green-600">
                            <p>Gift Card ({appliedGiftCard.code.substring(0,9)}...)</p>
                            <p className="font-semibold">- ৳{giftCardDiscount.toFixed(2)}</p>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Shipping</p>
                        <p className="font-semibold">{shippingInfo ? `৳${shippingFee.toFixed(2)}` : 'Select method'}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Taxes</p>
                        <p className="font-semibold">৳{taxes.toFixed(2)}</p>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-xl font-bold">
                        <p>Total</p>
                        <p>৳{total.toFixed(2)}</p>
                    </div>

                    {shippingInfo && (
                        <>
                            <Separator className="my-2" />
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-3">
                                    {shippingInfo.method === 'Pickup from Store' ? <Store className="h-4 w-4 mt-1 text-muted-foreground" /> : <Home className="h-4 w-4 mt-1 text-muted-foreground" />}
                                    <div>
                                        <p className="text-muted-foreground font-semibold">
                                            {shippingInfo.method === 'Pickup from Store' ? 'Pickup From' : 'Ship to'}
                                        </p>
                                        <p className="text-xs">{shippingInfo.fullAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

    
