
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Printer, ShoppingBag, Truck, ShieldCheck, Gift, AlertTriangle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Logo } from "@/components/logo"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useFirebase } from "@/firebase"

interface Order {
    id: string;
    createdAt: any;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Fulfilled' | 'Cancelled';
    total: number;
    shippingAddress: {
        name: string;
        email: string;
        phone: string;
        fullAddress: string;
    };
    items: {
        id: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
        dataAiHint: string;
        variant: string;
        giftDescription?: string;
    }[];
    payment: {
        method: string;
        subtotal: number;
        shipping: number;
        tax: number;
        coupon?: {
            code: string;
            discountAmount: number;
        } | null;
        giftCard?: {
            code: string;
            usedAmount: number;
        } | null;
        total: number;
    };
    paymentDetails?: {
        method?: string;
        status?: string;
        tran_id?: string;
    },
    trackingId?: string;
}

interface TrackingUpdate {
  message_en: string;
  message_bn: string;
  time: string;
}

function ConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { db } = useFirebase();
    const orderId = searchParams.get('orderId');
    const transactionId = searchParams.get('tran_id');
    const { clearCart, cart } = useCart();
    const { toast } = useToast();

    const [orderDetails, setOrderDetails] = React.useState<Order | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [trackingInfo, setTrackingInfo] = React.useState<TrackingUpdate[]>([]);
    const [isTrackingLoading, setIsTrackingLoading] = React.useState(false);
    
    React.useEffect(() => {
        if (!db) return;
        const fetchOrder = async () => {
            setLoading(true);
            let orderData: Order | null = null;
            try {
                if (orderId) {
                    const orderRef = doc(db, 'orders', orderId);
                    const orderSnap = await getDoc(orderRef);
                    if (orderSnap.exists()) {
                        orderData = { id: orderSnap.id, ...orderSnap.data() } as Order;
                    }
                } else if (transactionId) {
                    // Fallback to find order by transaction ID if orderId is not in URL (e.g., from IPN success)
                    const ordersRef = collection(db, 'orders');
                    const q = query(ordersRef, where('paymentDetails.tran_id', '==', transactionId));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const orderDoc = querySnapshot.docs[0];
                        orderData = { id: orderDoc.id, ...orderDoc.data() } as Order;
                    }
                }
                
                if (orderData) {
                    setOrderDetails(orderData);
                    // Clear cart only if it's not already empty to prevent repeated clearing on page refresh
                    if (cart.length > 0) {
                        clearCart();
                    }
                } else {
                     console.error("Order not found!");
                     toast({
                         title: "Order Not Found",
                         description: "We couldn't find the details for this order. Please check your profile.",
                         variant: "destructive",
                     });
                     router.push('/profile/orders');
                }
            } catch (err) {
                 console.error("Failed to fetch order details:", err);
                 toast({
                     title: "Error",
                     description: "Could not load order details.",
                     variant: "destructive",
                 });
                 router.push('/');
            } finally {
                setLoading(false);
            }
        };

        if (orderId || transactionId) {
             fetchOrder();
        } else {
            router.push('/');
        }
    }, [orderId, transactionId, router, toast, clearCart, cart.length, db]);


    const handlePrint = () => {
        window.print();
    };

    const handleTrackPackage = async (trackingId: string) => {
        if (!trackingId) {
            toast({ title: 'No Tracking ID', description: 'This order does not have a tracking ID yet.', variant: 'destructive'});
            return;
        }
        setIsTrackingLoading(true);
        setTrackingInfo([]);
        try {
            const response = await fetch(`/api/track/redx/${trackingId}`);
            const data = await response.json();
            if (response.ok) {
                setTrackingInfo(data.tracking);
            } else {
                toast({ title: 'Tracking Failed', description: data.error || 'Could not fetch tracking information.', variant: 'destructive'});
            }
        } catch (error) {
            console.error("Error fetching tracking info:", error);
            toast({ title: 'Error', description: 'An error occurred while tracking the package.', variant: 'destructive'});
        } finally {
            setIsTrackingLoading(false);
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading order confirmation...</div>
    }
    
    if (!orderDetails) {
        return <div className="flex justify-center items-center min-h-screen">Could not load order details.</div>
    }
    
    const orderDate = orderDetails.createdAt ? new Date(orderDetails.createdAt.seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
    const paymentMethodDisplay = orderDetails.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment';

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader className="bg-secondary/50 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                                <CardTitle className="text-2xl md:text-3xl font-headline">Thank you for your order!</CardTitle>
                                <CardDescription className="mt-2 text-md">Your order has been placed successfully. A confirmation email has been sent to {orderDetails.shippingAddress.email}.</CardDescription>
                            </div>
                            <div className="text-left md:text-right">
                               <Logo />
                                <p className="text-sm text-muted-foreground mt-2">Invoice #{orderDetails.id.substring(0,7)}...</p>
                                <p className="text-sm text-muted-foreground">Date: {orderDate}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                         {orderDetails.payment.method === 'cod' && (
                            <Alert variant="default" className="mb-8 bg-yellow-50 border-yellow-200 text-yellow-800 [&>svg]:text-yellow-500">
                                <AlertTriangle className="h-4 w-4"/>
                                <AlertTitle>Cash on Delivery</AlertTitle>
                                <AlertDescription>
                                    Your order is pending confirmation. Please keep the exact amount ready. You will pay the courier when you receive your order.
                                </AlertDescription>
                            </Alert>
                         )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                            <div className="lg:col-span-1">
                                <h3 className="font-semibold mb-2">Shipping Address</h3>
                                <address className="not-italic text-muted-foreground text-sm">
                                    {orderDetails.shippingAddress.name}<br/>
                                    {orderDetails.shippingAddress.fullAddress}
                                </address>
                            </div>
                             <div className="lg:col-span-1">
                                <h3 className="font-semibold mb-2">Billing Address</h3>
                                <address className="not-italic text-muted-foreground text-sm">
                                    {orderDetails.shippingAddress.name}<br/>
                                     {orderDetails.shippingAddress.fullAddress}
                                </address>
                            </div>
                             <div className="lg:col-span-1">
                                <h3 className="font-semibold mb-2">Payment Method</h3>
                                <p className="text-muted-foreground text-sm">{paymentMethodDisplay}</p>
                            </div>
                        </div>

                         {orderDetails.trackingId && (
                            <div className="my-8">
                                <h3 className="font-semibold mb-2 flex items-center"><Truck className="mr-2 h-5 w-5 text-primary"/>Order Tracking</h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    Your tracking ID is: <span className="font-medium text-foreground">{orderDetails.trackingId}</span>.
                                </p>
                                <Button onClick={() => handleTrackPackage(orderDetails.trackingId!)} disabled={isTrackingLoading}>
                                  {isTrackingLoading ? "Tracking..." : "Track Package"}
                                </Button>
                                {trackingInfo.length > 0 && (
                                <div className="mt-4 space-y-4">
                                    {trackingInfo.map((update, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center ring-4 ring-primary/20">
                                            <Truck className="h-3 w-3 text-white" />
                                        </div>
                                        {index < trackingInfo.length - 1 && (
                                            <div className="w-px flex-1 bg-border" />
                                        )}
                                        </div>
                                        <div>
                                        <p className="font-semibold">{update.message_bn}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(update.time).toLocaleString()}
                                        </p>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                                )}
                            </div>
                        )}

                        <h3 className="font-semibold mb-4 text-lg">Order Summary</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-20 hidden md:table-cell">Image</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center">Quantity</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderDetails.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="hidden md:table-cell">
                                                <Image src={item.image || 'https://placehold.co/64x64.png'} alt={item.name} width={64} height={64} className="rounded-md" data-ai-hint={item.dataAiHint} />
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">{item.variant}</p>
                                                {item.giftDescription && (
                                                    <p className="text-xs text-pink-600 font-semibold flex items-center gap-1">
                                                        <Gift className="w-3 h-3" /> + FREE: {item.giftDescription}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-right font-medium">৳{(item.price * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                            <div className="w-full max-w-sm space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Subtotal</p>
                                    <p className="font-semibold">৳{orderDetails.payment.subtotal.toFixed(2)}</p>
                                </div>
                                {orderDetails.payment.coupon && (
                                    <div className="flex justify-between text-green-600">
                                        <p>Discount ({orderDetails.payment.coupon.code})</p>
                                        <p className="font-semibold">- ৳{orderDetails.payment.coupon.discountAmount.toFixed(2)}</p>
                                    </div>
                                )}
                                 {orderDetails.payment.giftCard && (
                                    <div className="flex justify-between text-green-600">
                                        <p>Gift Card ({orderDetails.payment.giftCard.code.substring(0,9)}...)</p>
                                        <p className="font-semibold">- ৳{orderDetails.payment.giftCard.usedAmount.toFixed(2)}</p>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Shipping Fee</p>
                                    <p className="font-semibold">৳{orderDetails.payment.shipping.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Taxes</p>
                                    <p className="font-semibold">৳{orderDetails.payment.tax.toFixed(2)}</p>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold text-lg">
                                    <p>Total</p>
                                    <p>৳{orderDetails.payment.total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-8" />
                        
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-muted-foreground text-center sm:text-left">Need help? Contact our <Link href="/contact-us" className="text-primary hover:underline">Customer Support</Link>.</p>
                            <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                   <Link href={`/invoice/${orderDetails.id}`} target='_blank'><Printer className="mr-2 h-4 w-4" /> Invoice</Link>
                                </Button>
                                <Button onClick={() => router.push('/')}>
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

export default function OrderConfirmationPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <ConfirmationContent />
        </React.Suspense>
    )
}
