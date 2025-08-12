
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Printer, ShoppingBag, Truck, ShieldCheck, Gift } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Logo } from "@/components/logo"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useCart } from "@/hooks/use-cart"


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
    trackingId?: string;
}

function ConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { clearCart } = useCart();

    const [orderDetails, setOrderDetails] = React.useState<Order | null>(null);
    const [loading, setLoading] = React.useState(true);
    
    React.useEffect(() => {
        if (!orderId) {
            // Redirect if no orderId is present
            router.push('/');
            return;
        }

        // Clear the cart on successful order confirmation
        clearCart();

        const fetchOrder = async () => {
            setLoading(true);
            const orderRef = doc(db, 'orders', orderId);
            const orderSnap = await getDoc(orderRef);
            if (orderSnap.exists()) {
                setOrderDetails({ id: orderSnap.id, ...orderSnap.data() } as Order);
            } else {
                console.error("Order not found!");
                router.push('/');
            }
            setLoading(false);
        };

        fetchOrder();
    }, [orderId, router, clearCart]);


    const handlePrint = () => {
        window.print();
    };
    
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading order confirmation...</div>
    }
    
    if (!orderDetails) {
        return <div className="flex justify-center items-center min-h-screen">Could not load order details.</div>
    }
    
    const orderDate = orderDetails.createdAt ? new Date(orderDetails.createdAt.seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';

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
                                <p className="text-muted-foreground text-sm">{orderDetails.payment.method}</p>
                            </div>
                             <div className="md:col-span-2 lg:col-span-2">
                                <h3 className="font-semibold mb-2 flex items-center"><Truck className="mr-2 h-5 w-5 text-primary"/>Order Tracking</h3>
                                <p className="text-muted-foreground text-sm">
                                    Your tracking ID is: <span className="font-medium text-foreground">{orderDetails.trackingId || 'Pending'}</span>.
                                    {orderDetails.trackingId && <Link href="#" className="text-primary hover:underline ml-1">Track your shipment here</Link>}
                                </p>
                            </div>
                            <div className="lg:col-span-1">
                                <h3 className="font-semibold mb-2 flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/>Refund Policy</h3>
                                <p className="text-muted-foreground text-sm">
                                    We offer a 7-day return policy. <Link href="#" className="text-primary hover:underline">Learn More</Link>
                                </p>
                            </div>
                        </div>

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
                                    <p>Grand Total</p>
                                    <p>৳{orderDetails.payment.total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-8" />
                        
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-muted-foreground text-center sm:text-left">Need help? Contact our <Link href="#" className="text-primary hover:underline">Customer Support</Link>.</p>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handlePrint}>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print / Download PDF
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
            <SiteFooter />
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
