
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, CreditCard, Landmark, Truck, Info } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"


export default function PaymentPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { cart, clearCart } = useCart();
    const { toast } = useToast();
    const [paymentMethod, setPaymentMethod] = React.useState('card');
    const [loading, setLoading] = React.useState(false);
    
    // In a real app, this would come from the shipping page selection
    const [shippingInfo, setShippingInfo] = React.useState({
        name: 'Kamal Hasan',
        email: 'kamal@example.com',
        phone: '+8801712345678',
        fullAddress: 'House 123, Road 4, Block F, Banani, Dhaka - 1213',
        method: 'Express Shipping (1-3 Days)'
    });

    const subtotal = cart.reduce((acc, item) => acc + item.pricing.price * item.quantity, 0);
    const shippingFee = subtotal > 2000 ? 0 : 60;
    const taxes = subtotal * 0.05; // 5% tax
    const total = subtotal + shippingFee + taxes;

    const handlePlaceOrder = async () => {
        if (!user || cart.length === 0) {
            toast({
                title: "Error",
                description: "You must be logged in and have items in your cart to place an order.",
                variant: "destructive"
            })
            return;
        }
        setLoading(true);

        const orderData = {
            userId: user.uid,
            customerName: shippingInfo.name,
            createdAt: serverTimestamp(),
            status: 'Pending',
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                image: item.images[0] || '',
                variant: `${item.selectedColor} / ${item.selectedSize}`,
                price: item.pricing.price,
                quantity: item.quantity,
                sku: item.inventory.sku
            })),
            shippingAddress: shippingInfo,
            payment: {
                method: paymentMethod,
                subtotal: subtotal,
                shipping: shippingFee,
                tax: taxes,
                total: total,
            },
            total: total
        };

        try {
            const docRef = await addDoc(collection(db, "orders"), orderData);
            toast({
                title: "Order Placed!",
                description: "Your order has been placed successfully."
            });
            clearCart();
            router.push(`/order-confirmation?orderId=${docRef.id}`);

        } catch (error) {
            console.error("Error placing order: ", error);
            toast({
                title: "Order Failed",
                description: "There was an error placing your order. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

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
                                            <div>
                                                <Label htmlFor="card-number">Card number</Label>
                                                <Input id="card-number" placeholder="1234 5678 9012 3456" />
                                            </div>
                                            <div>
                                                <Label htmlFor="card-name">Name on card</Label>
                                                <Input id="card-name" placeholder="Kamal Hasan" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="expiry-date">Expiration date (MM/YY)</Label>
                                                    <Input id="expiry-date" placeholder="MM / YY" />
                                                </div>
                                                <div>
                                                    <Label htmlFor="cvc">Security code (CVC)</Label>
                                                    <Input id="cvc" placeholder="123" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="mobile-banking">
                                     <Card>
                                        <CardContent className="p-6 text-center">
                                            <p className="text-muted-foreground mb-4">Select your mobile banking provider:</p>
                                            <div className="flex justify-center gap-4">
                                                <Button variant="outline" className="h-16 w-24 flex-col gap-2">
                                                    <Image src="https://placehold.co/40x40.png" data-ai-hint="bKash logo" alt="bKash" width={32} height={32}/>
                                                    <span>bKash</span>
                                                </Button>
                                                <Button variant="outline" className="h-16 w-24 flex-col gap-2">
                                                    <Image src="https://placehold.co/40x40.png" data-ai-hint="Nagad logo" alt="Nagad" width={32} height={32}/>
                                                    <span>Nagad</span>
                                                </Button>
                                                <Button variant="outline" className="h-16 w-24 flex-col gap-2">
                                                    <Image src="https://placehold.co/40x40.png" data-ai-hint="Rocket logo" alt="Rocket" width={32} height={32}/>
                                                    <span>Rocket</span>
                                                </Button>
                                            </div>
                                        </CardContent>
                                     </Card>
                                </TabsContent>
                                 <TabsContent value="cod">
                                     <Card>
                                        <CardContent className="p-6 text-center">
                                            <Truck className="w-12 h-12 mx-auto text-muted-foreground mb-4"/>
                                            <h3 className="text-lg font-semibold">Cash on Delivery</h3>
                                            <p className="text-muted-foreground mt-2">You can pay in cash to our courier when you receive the goods at your doorstep.</p>
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
                               {loading ? 'Placing Order...' : `Pay ৳${total.toFixed(2)}`}
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-1 lg:order-2 order-1 lg:sticky lg:top-24 self-start">
                      <div className="bg-secondary p-8 rounded-lg">
                          <h2 className="text-2xl font-headline mb-6">Order Summary</h2>
                          <div className="space-y-4">
                              {cart.map((item) => (
                              <div key={item.id} className="flex items-center gap-4">
                                  <div className="relative">
                                      <Image src={item.images[0] || 'https://placehold.co/64x64.png'} alt={item.name} width={64} height={64} className="rounded-md" data-ai-hint={item.name} />
                                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                                  </div>
                                  <div className="flex-grow">
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">{item.selectedSize} / {item.selectedColor}</p>
                                  </div>
                                  <p className="font-semibold">৳{item.pricing.price.toFixed(2)}</p>
                              </div>
                              ))}
                          </div>

                          <Separator className="my-6" />

                          <div className="flex gap-2 mb-6">
                              <Input placeholder="Discount code" />
                              <Button variant="secondary">Apply</Button>
                          </div>

                          <div className="space-y-2">
                              <div className="flex justify-between">
                                  <p className="text-muted-foreground">Subtotal</p>
                                  <p className="font-semibold">৳{subtotal.toFixed(2)}</p>
                              </div>
                              <div className="flex justify-between">
                                  <p className="text-muted-foreground">Shipping</p>
                                  <p className="font-semibold">৳{shippingFee.toFixed(2)}</p>
                              </div>
                              <div className="flex justify-between">
                                  <p className="flex items-center gap-1 text-muted-foreground">
                                      Estimated taxes
                                      <TooltipProvider>
                                          <Tooltip>
                                              <TooltipTrigger asChild>
                                                  <Info className="h-4 w-4" />
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                  <p>Taxes are calculated based on your shipping address.</p>
                                              </TooltipContent>
                                          </Tooltip>
                                      </TooltipProvider>
                                  </p>
                                  <p className="font-semibold">৳{taxes.toFixed(2)}</p>
                              </div>
                          </div>

                          <Separator className="my-6" />

                          <div className="flex justify-between text-xl font-bold">
                              <p>Total</p>
                              <p>৳{total.toFixed(2)}</p>
                          </div>
                      </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
