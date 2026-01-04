

'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import Image from 'next/image';

export default function PackingListPage() {
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
    documentTitle: `Packing-List-${order?.id.substring(0,7)}`
  });


  if (loading) return <div className="p-8 text-center">Loading Packing List...</div>;
  if (!order) return <div className="p-8 text-center">Could not load order details.</div>;

  const orderDate = new Date(order.createdAt?.seconds * 1000).toLocaleDateString('en-GB');

  return (
    <div className="bg-background min-h-screen">
       <div className="max-w-4xl mx-auto p-4 sm:p-8 flex flex-col gap-4">
            <div className="flex justify-end gap-2 print:hidden">
                 <Button variant="outline" asChild>
                    <Link href={`/vendor/purchase-orders/${purchaseOrderId}`}>Back to PO</Link>
                </Button>
                <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
            </div>
            <div ref={printComponentRef} className="p-8 border rounded-lg bg-white text-black">
                <CardHeader className="p-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <Logo />
                            <p className="text-sm text-gray-500 mt-2 font-semibold">{order.vendorName}</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-3xl font-bold text-primary">PACKING LIST</h1>
                            <p className="text-gray-500">PO# {order.id.substring(0, 7)}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-end mt-8">
                        <div>
                            <h2 className="font-semibold text-gray-500 text-sm">SHIP TO</h2>
                            <p className="font-bold">Averzo Central Warehouse</p>
                            <p className="text-sm">123 Logistics Way, Gazipur, Dhaka</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 text-sm">Order Date: <span className="font-medium text-black">{orderDate}</span></p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 mt-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[10%]">No.</TableHead>
                                <TableHead className="w-[50%]">Product Description</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="w-[20%] text-center">Barcode</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item, index) => (
                                <TableRow key={item.productId}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-lg">{item.quantity}</TableCell>
                                    <TableCell className="text-center">
                                         {item.sku && (
                                            <Image
                                                src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${item.sku}&scale=2&includetext`}
                                                alt={`Barcode for ${item.sku}`}
                                                width={150}
                                                height={50}
                                                style={{height: 'auto', width: 'auto'}}
                                                unoptimized
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex justify-end mt-6">
                        <div className="w-full max-w-xs space-y-2 text-right">
                            <div className="flex justify-between font-bold text-lg">
                                <p>Total Quantity</p>
                                <p>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <div className="mt-8 border-t-4 border-dashed pt-8">
                    <h2 className="text-xl font-bold text-center">SHIPPING LABEL</h2>
                    <div className="border-2 border-black p-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <p className="text-xs font-bold">FROM:</p>
                                <p>{order.vendorName}</p>
                                {/* Add vendor address here if available */}
                            </div>
                             <div className="text-right">
                                <p className="text-xs font-bold">TO:</p>
                                <p className="font-bold">Averzo Central Warehouse</p>
                                <p>123 Logistics Way, Gazipur, Dhaka</p>
                            </div>
                            <div className="col-span-2 text-center border-t pt-4">
                                <p className="font-mono text-xs">PO#</p>
                                <p className="font-mono text-2xl tracking-widest">{order.id.substring(0, 12)}</p>
                            </div>
                        </div>
                    </div>
                </div>
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
