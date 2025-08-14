
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { Separator } from "./ui/separator";

export const OrderSummary: React.FC<{ shippingMethod?: string }> = ({ shippingMethod }) => {
    const { subTotal, appliedCoupon, appliedGiftCard, shippingFee, taxes, total, shippingInfo } = useCart();

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
                            <p className="font-semibold">- ৳{Math.min(appliedGiftCard.balance, subTotal - (appliedCoupon?.discountAmount || 0)).toFixed(2)}</p>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Shipping</p>
                        <p className="font-semibold">{shippingInfo?.method || shippingMethod ? `৳${shippingFee.toFixed(2)}` : 'Select method'}</p>
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
                </div>
            </CardContent>
        </Card>
    )
}
