
"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, CreditCard, Landmark, Truck } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart, ShippingInfo } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { nanoid } from "nanoid"
import { OrderSummary } from "@/components/order-summary"


export default function PaymentPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { cart, clearCart, subTotal, total, appliedCoupon, appliedGiftCard, shippingInfo } = useCart();
    const { toast } = useToast();
    const [paymentMethod, setPaymentMethod] = React.useState('card');
    const [loading, setLoading] = React.useState(false);
    
    React.useEffect(() => {
        if (!shippingInfo) {
            toast({
                title: "No Shipping Information",
                description: "Please select a shipping address first.",
                variant: "destructive"
            });
            router.push('/shipping');
        }
    }, [shippingInfo, router, toast]);

    const handlePlaceOrder = async () => {
        if (!user || cart.length === 0 || !shippingInfo) {
            toast({
                title: "Error",
                description: "You must be logged in, have items in your cart, and have provided shipping information to place an order.",
                variant: "destructive"
            })
            return;
        }

        setLoading(true);

         const itemsForOrder = cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.pricing.price,
            quantity: item.quantity,
            image: item.images[0] || '',
            sku: item.inventory.sku,
            dataAiHint: item.name,
            giftDescription: item.giftWithPurchase?.enabled ? item.giftWithPurchase.description : ''
        }));

        const orderData = {
            userId: user.uid,
            customerName: shippingInfo.name,
            total: total,
            items: itemsForOrder,
            shippingAddress: shippingInfo,
            payment: {
                method: paymentMethod,
                subtotal: subTotal,
                shipping: useCart().shippingFee,
                tax: useCart().taxes,
                coupon: appliedCoupon ? { code: appliedCoupon.code, discountAmount: appliedCoupon.discountAmount } : null,
                giftCard: appliedGiftCard ? { code: appliedGiftCard.code, usedAmount: Math.min(appliedGiftCard.balance, subTotal - (appliedCoupon?.discountAmount || 0)) } : null,
                total: total,
            },
        };

        try {
            const tran_id = nanoid();
            const response = await fetch('/api/payment/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...orderData, tran_id })
            });

            const data = await response.json();
            
            if (response.ok && data.GatewayPageURL) {
                window.location.href = data.GatewayPageURL;
            } else {
                toast({ title: "Payment Failed", description: data.details || "Could not initiate payment session.", variant: "destructive" });
            }

        } catch (error) {
            console.error("Payment initiation error:", error);
            toast({ title: "Error", description: "Could not connect to payment gateway.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (!shippingInfo) {
        return (
             <div className="flex min-h-screen flex-col bg-background">
                <SiteHeader />
                <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
                    <p>Redirecting to shipping page...</p>
                </main>
                <SiteFooter />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
                    <div className="lg:col-span-1 lg:order-1 order-2">
                        <div className="mb-6">
                            <p className="text-sm text-muted-foreground">
                                <Link href="/cart" className="hover:text-primary">Cart</Link>
                                <ChevronRight className="inline-block h-4 w-4 mx-1" />
                                <Link href="/shipping" className="hover:text-primary">Shipping</Link>
                                <ChevronRight className="inline-block h-4 w-4 mx-1" />
                                <span className="font-semibold text-primary">Payment</span>
                            </p>
                        </div>
                        
                        <Card className="mb-8">
                            <CardContent className="p-6 grid sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Contact</p>
                                    <p className="font-medium">{shippingInfo.phone}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Ship to</p>
                                    <p className="font-medium">{shippingInfo.fullAddress}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Method</p>
                                    <p className="font-medium">{shippingInfo.method}</p>
                                </div>
                                 <div className="sm:text-right">
                                    <Link href="/shipping" className="text-primary font-medium hover:underline">Change</Link>
                                </div>
                            </CardContent>
                        </Card>


                        <div className="space-y-8">
                             <h2 className="text-2xl font-headline mb-4">Payment</h2>
                             <p className="text-muted-foreground">All transactions are secure and encrypted.</p>
                             <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="card"><CreditCard className="w-4 h-4 mr-2"/> Card</TabsTrigger>
                                    <TabsTrigger value="mobile-banking"> <Landmark className="w-4 h-4 mr-2" />Mobile Banking</TabsTrigger>
                                    <TabsTrigger value="cod"><Truck className="w-4 h-4 mr-2"/>COD</TabsTrigger>
                                </TabsList>
                                <TabsContent value="card">
                                    <Card>
                                        <CardContent className="p-6 space-y-4">
                                           <div className="text-center p-4 bg-secondary rounded-lg">
                                                <p>You will be redirected to SSLCommerz's secure gateway to complete your card payment.</p>
                                           </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="mobile-banking">
                                     <Card>
                                        <CardContent className="p-6 text-center">
                                            <p className="text-muted-foreground mb-4">You will be redirected to SSLCommerz's secure gateway to complete your payment with your selected provider.</p>
                                        </CardContent>
                                     </Card>
                                </TabsContent>
                                 <TabsContent value="cod">
                                     <Card>
                                        <CardContent className="p-6 text-center">
                                            <Truck className="w-12 h-12 mx-auto text-muted-foreground mb-4"/>
                                            <h3 className="text-lg font-semibold">Cash on Delivery</h3>
                                            <p className="text-muted-foreground mt-2">You can pay in cash to our courier when you receive the goods at your doorstep.</p>
                                             <p className="text-xs text-red-500 mt-2">Note: Cash on Delivery is currently not processed through SSLCommerz in this setup.</p>
                                        </CardContent>
                                     </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                         <div className="mt-8 flex justify-between items-center">
                            <Button variant="outline" asChild>
                                <Link href="/shipping">
                                    <ChevronRight className="mr-2 h-4 w-4 transform rotate-180" /> Back to Shipping
                                </Link>
                            </Button>
                            <Button 
                                className="w-auto" 
                                size="lg"
                                onClick={handlePlaceOrder}
                                disabled={loading || cart.length === 0}
                            >
                               {loading ? 'Processing...' : `Pay ৳${total.toFixed(2)}`}
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-1 lg:order-2 order-1 lg:sticky lg:top-24 self-start">
                      <OrderSummary shippingMethod={shippingInfo.method} />
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
