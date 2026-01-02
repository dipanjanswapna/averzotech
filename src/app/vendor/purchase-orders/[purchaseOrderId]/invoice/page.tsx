
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
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
import { useEffect, useState, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { useFirebase } from '@/firebase';
import { PurchaseOrder } from '@/types';
import { useReactToPrint } from 'react-to-print';
import Link from 'next/link';

export default function InvoicePage() {
  const params = useParams();
  const purchaseOrderId = params.purchaseOrderId as string;
  const { toast } = useToast();
  const { db } = useFirebase();
  const printComponentRef = useRef(null);

  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (purchaseOrderId && db) {
        const fetchOrder = async () => {
            setLoading(true);
            const orderRef = doc(db, 'purchaseOrders', purchaseOrderId);
            const docSnap = await getDoc(orderRef);
            if (docSnap.exists()) {
                setOrder({ id: docSnap.id, ...docSnap.data() } as PurchaseOrder);
            } else {
                toast({ title: "Error", description: "Purchase Order not found.", variant: "destructive" });
            }
            setLoading(false);
        }
        fetchOrder();
    }
  }, [purchaseOrderId, toast, db]);

  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    documentTitle: `Invoice-PO-${order?.id.substring(0,7)}`
  });


  if (loading) return <div className="p-8 text-center">Loading Invoice...</div>;
  if (!order) return <div className="p-8 text-center">Could not load order details.</div>;

  const orderDate = new Date(order.createdAt?.seconds * 1000).toLocaleDateString('en-GB');

  return (
    <div className="bg-background min-h-screen">
       <div className="max-w-4xl mx-auto p-4 sm:p-8 flex flex-col gap-4">
            <div className="flex justify-between items-center print:hidden">
                <Button variant="outline" asChild>
                    <Link href={`/vendor/purchase-orders/${purchaseOrderId}`}>Back to PO</Link>
                </Button>
                <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print / Save PDF</Button>
            </div>
            <div ref={printComponentRef} className="p-8 border rounded-lg bg-white">
                 <CardHeader className="p-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <Logo />
                            <p className="text-sm text-gray-500 mt-2">Averzo Inc.<br/>123 Fashion Street, Dhaka<br/>BIN: 00123456789</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-3xl font-bold text-primary">INVOICE</h1>
                            <p className="text-gray-500">PO# {order.id.substring(0, 7)}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-end mt-8">
                         <div>
                            <h2 className="font-semibold text-gray-500 text-sm">INVOICE TO</h2>
                            <p className="font-bold">{order.vendorName}</p>
                            {/* In a real app, vendor address would be here */}
                        </div>
                        <div className="text-right">
                             <p className="text-gray-500 text-sm">Invoice Date: <span className="font-medium text-black">{orderDate}</span></p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 mt-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[10%]">No.</TableHead>
                                <TableHead className="w-[45%]">Product Description</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead className="text-center">Qty</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item, index) => (
                                <TableRow key={item.productId}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{item.productName}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">৳{item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">৳{item.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                     <div className="flex justify-end mt-6">
                        <div className="w-full max-w-xs space-y-2">
                             <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <p>Grand Total</p>
                                <p>৳{order.total.toFixed(2)}</p>
                            </div>
                        </div>
                     </div>
                      <div className="mt-8 text-xs text-gray-500">
                        <p className="font-bold">Terms & Conditions:</p>
                        <p>Payment will be processed within 15-30 business days after goods are received and verified at Averzo warehouse.</p>
                      </div>
                </CardContent>
            </div>
       </div>
       <style jsx global>{`
        @media print {
            body {
                background-color: white;
            }
            .print\\:hidden {
                display: none !important;
            }
            @page {
                size: A4;
                margin: 0;
            }
        }
       `}</style>
    </div>
  );
}
