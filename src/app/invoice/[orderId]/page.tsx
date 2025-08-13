
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Printer } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';

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
        sku: string;
        price: number;
        quantity: number;
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
        total: number;
    };
    paymentDetails?: {
        method?: string;
        status?: string;
    };
}

export default function InvoicePage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (orderId) {
        const fetchOrder = async () => {
            setLoading(true);
            const orderRef = doc(db, 'orders', orderId);
            const docSnap = await getDoc(orderRef);
            if (docSnap.exists()) {
                setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
            } else {
                toast({ title: "Error", description: "Order not found.", variant: "destructive" });
            }
            setLoading(false);
        }
        fetchOrder();
    }
  }, [orderId, toast]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-8">Loading invoice...</div>;
  if (!order) return <div className="p-8">Could not load invoice details.</div>;

  const orderDate = new Date(order.createdAt?.seconds * 1000).toLocaleDateString('en-GB');

  return (
    <div className="bg-background min-h-screen">
       <div className="max-w-4xl mx-auto p-4 sm:p-8 print:p-0">
          <Card className="shadow-none border-none sm:shadow-lg sm:border">
            <CardHeader className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <Logo />
                        <p className="text-sm text-muted-foreground mt-2">Averzo Inc.<br/>123 Fashion Street, Dhaka</p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-3xl font-bold text-primary">INVOICE</h1>
                        <p className="text-muted-foreground"># {order.id.substring(0, 7)}</p>
                    </div>
                </div>
                <div className="flex justify-between items-end mt-8">
                     <div>
                        <h2 className="font-semibold text-muted-foreground">BILL TO</h2>
                        <p className="font-bold">{order.shippingAddress.name}</p>
                        <p className="text-sm">{order.shippingAddress.fullAddress}</p>
                        <p className="text-sm">{order.shippingAddress.email}</p>
                         <p className="text-sm">{order.shippingAddress.phone}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-muted-foreground">Invoice Date: <span className="font-medium text-foreground">{orderDate}</span></p>
                         <p className="text-muted-foreground">Payment Method: <span className="font-medium text-foreground">{order.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span></p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60%]">Description</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.items.map(item => (
                             <TableRow key={item.id}>
                                <TableCell>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                                </TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right">৳{item.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">৳{(item.price * item.quantity).toFixed(2)}</TableCell>
                             </TableRow>
                        ))}
                    </TableBody>
                </Table>

                 <div className="flex justify-end mt-6">
                    <div className="w-full max-w-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">৳{order.payment.subtotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="font-medium">৳{order.payment.shipping.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax</span>
                            <span className="font-medium">৳{order.payment.tax.toFixed(2)}</span>
                        </div>
                        {order.payment.coupon && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Discount ({order.payment.coupon.code})</span>
                                <span className="font-medium">- ৳{order.payment.coupon.discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Grand Total</span>
                            <span>৳{order.payment.total.toFixed(2)}</span>
                        </div>
                    </div>
                 </div>
            </CardContent>
            <CardFooter className="p-6 border-t flex-col items-start gap-4">
                <h3 className="font-semibold">Thank you for your business!</h3>
                <p className="text-xs text-muted-foreground">If you have any questions about this invoice, please contact us at support@averzo.com.</p>
                <div className="w-full flex justify-end print:hidden">
                    <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print Invoice</Button>
                </div>
            </CardFooter>
          </Card>
       </div>
       <style jsx global>{`
        @media print {
            body {
                background-color: white;
            }
            .print\\:p-0 {
                padding: 0 !important;
            }
            .print\\:hidden {
                display: none !important;
            }
            @page {
                size: auto;
                margin: 0.5in;
            }
        }
       `}</style>
    </div>
  );
}
