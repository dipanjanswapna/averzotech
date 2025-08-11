
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Printer, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Logo } from "@/components/logo"

const orderDetails = {
    orderId: 'AVZ-2024-12345',
    orderDate: new Date().toLocaleDateString('en-GB'),
    paymentMethod: 'Credit Card',
    shippingAddress: 'House 123, Road 4, Block F, Banani, Dhaka - 1213',
    billingAddress: 'House 123, Road 4, Block F, Banani, Dhaka - 1213',
    customer: {
        name: 'Kamal Hasan',
        email: 'kamal.hasan@example.com'
    },
    items: [
      {
        id: '1',
        name: 'Men Top Black Puffed Jacket',
        variant: 'Men\'s Black',
        price: 1200.00,
        quantity: 1,
        image: 'https://placehold.co/80x80.png',
        dataAiHint: 'puffed jacket',
      },
      {
        id: '2',
        name: 'Women Jacket',
        variant: 'Women top',
        price: 1500.00,
        quantity: 1,
        image: 'https://placehold.co/80x80.png',
        dataAiHint: 'women jacket',
      },
    ],
    subtotal: 2700.00,
    shippingFee: 120.00,
    taxes: 50.00,
    discount: 0.00,
    total: 2870.00,
};


export default function OrderConfirmationPage() {
    const router = useRouter();

    const handlePrint = () => {
        window.print();
    };

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
                                <CardDescription className="mt-2 text-md">Your order has been placed successfully. A confirmation email has been sent to {orderDetails.customer.email}.</CardDescription>
                            </div>
                            <div className="text-left md:text-right">
                               <Logo />
                                <p className="text-sm text-muted-foreground mt-2">Invoice #{orderDetails.orderId}</p>
                                <p className="text-sm text-muted-foreground">Date: {orderDetails.orderDate}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="font-semibold mb-2">Shipping Address</h3>
                                <address className="not-italic text-muted-foreground text-sm">
                                    {orderDetails.customer.name}<br/>
                                    {orderDetails.shippingAddress}
                                </address>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">Billing Address</h3>
                                <address className="not-italic text-muted-foreground text-sm">
                                    {orderDetails.customer.name}<br/>
                                    {orderDetails.billingAddress}
                                </address>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">Payment Method</h3>
                                <p className="text-muted-foreground text-sm">{orderDetails.paymentMethod}</p>
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
                                    {orderDetails.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="hidden md:table-cell">
                                                <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md" data-ai-hint={item.dataAiHint} />
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">{item.variant}</p>
                                            </TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-right font-medium">৳{item.price.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                            <div className="w-full max-w-sm space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Subtotal</p>
                                    <p className="font-semibold">৳{orderDetails.subtotal.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Shipping Fee</p>
                                    <p className="font-semibold">৳{orderDetails.shippingFee.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Taxes</p>
                                    <p className="font-semibold">৳{orderDetails.taxes.toFixed(2)}</p>
                                </div>
                                {orderDetails.discount > 0 && (
                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground">Discount</p>
                                        <p className="font-semibold">- ৳{orderDetails.discount.toFixed(2)}</p>
                                    </div>
                                )}
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold text-lg">
                                    <p>Grand Total</p>
                                    <p>৳{orderDetails.total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-8" />
                        
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-muted-foreground text-center sm:text-left">Need help? Contact our <Link href="#" className="text-primary hover:underline">Customer Support</Link>.</p>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handlePrint}>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Invoice
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
