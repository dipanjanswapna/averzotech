
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Printer } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PurchaseOrder } from '@/types';
import { useFirebase } from '@/firebase';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDays, format } from 'date-fns';


export default function PurchaseOrderDetailsPage() {
  const params = useParams();
  const purchaseOrderId = params.purchaseOrderId as string;
  const router = useRouter();
  const { toast } = useToast();
  const { db } = useFirebase();

  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [leadTime, setLeadTime] = useState<string>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (purchaseOrderId && db) {
        const fetchOrder = async () => {
            setLoading(true);
            const orderRef = doc(db, 'purchaseOrders', purchaseOrderId);
            const docSnap = await getDoc(orderRef);
            if (docSnap.exists()) {
                const orderData = { id: docSnap.id, ...docSnap.data() } as PurchaseOrder;
                setOrder(orderData);
                setNotes(orderData.notes || '');
            } else {
                toast({ title: "Error", description: "Purchase Order not found.", variant: "destructive" });
                router.push('/vendor/purchase-orders');
            }
            setLoading(false);
        }
        fetchOrder();
    }
  }, [purchaseOrderId, toast, router, db]);

  const handleConfirmOrder = async () => {
      if (!order || !leadTime) {
          toast({ title: "Information Missing", description: "Please select a delivery commitment (lead time).", variant: "destructive" });
          return;
      };
      setIsUpdating(true);
      try {
          const deliveryDate = addDays(new Date(), parseInt(leadTime));
          const estimatedDelivery = format(deliveryDate, 'yyyy-MM-dd');

          const orderRef = doc(db, 'purchaseOrders', order.id);
          await updateDoc(orderRef, {
              status: 'Confirmed',
              estimatedDelivery,
              notes,
              confirmedAt: serverTimestamp()
          });
          setOrder(prev => prev ? {...prev, status: 'Confirmed', estimatedDelivery, notes } : null);
          toast({ title: "Order Confirmed", description: "Averzo has been notified about your confirmation." });
      } catch (error) {
          console.error("Error confirming order:", error);
          toast({ title: "Error", description: "Failed to confirm the order.", variant: "destructive" });
      } finally {
        setIsUpdating(false);
      }
  }

  const handleGenerateInvoice = () => {
      if (!order) return;
      // Store PO data in localStorage to pre-fill the invoice form
      localStorage.setItem('poForInvoice', JSON.stringify({
          items: order.items.map(item => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
              sku: item.sku
          })),
          total: order.total
      }));
      router.push('/vendor/invoices/new');
  };

  if (loading) return <p className="p-8">Loading purchase order details...</p>;
  if (!order) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-GB');
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Received': return 'bg-green-100 text-green-800';
      case 'Shipped':
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return '';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/vendor/purchase-orders">
                    <ChevronLeft className="h-4 w-4" />
                </Link>
            </Button>
            <div>
                <h1 className="text-2xl font-bold">Purchase Order #{order.id.substring(0, 7)}</h1>
                <p className="text-muted-foreground text-sm">From: Averzo</p>
            </div>
        </div>
        <Badge variant="outline" className={cn("ml-auto", getStatusBadgeClass(order.status))}>
            {order.status}
        </Badge>
      </div>

        <Card>
            <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Date: {formatDate(order.createdAt)}</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.items.map(item => (
                            <TableRow key={item.productId}>
                                <TableCell className="font-medium">{item.productName}</TableCell>
                                <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right">৳{item.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">৳{item.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
               </Table>
            </CardContent>
            <CardFooter className="flex justify-end bg-secondary/50 p-6">
                <div className="text-right">
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">৳{order.total.toFixed(2)}</p>
                </div>
            </CardFooter>
        </Card>
        
        {order.status === 'Pending' && (
             <Card>
                <CardHeader>
                    <CardTitle>Confirm Order</CardTitle>
                    <CardDescription>Please confirm the order and provide an estimated delivery date to Averzo's warehouse.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="lead-time">Delivery Commitment (Lead Time) *</Label>
                         <Select value={leadTime} onValueChange={setLeadTime}>
                            <SelectTrigger id="lead-time">
                                <SelectValue placeholder="Select how soon you can deliver" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Within 1 Day</SelectItem>
                                <SelectItem value="3">Within 3 Days</SelectItem>
                                <SelectItem value="7">Within 7 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea id="notes" placeholder="Any comments for the Averzo team..." value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                     <Button onClick={handleConfirmOrder} disabled={isUpdating || !leadTime}>
                        {isUpdating ? 'Confirming...' : 'Confirm & Send Update'}
                    </Button>
                </CardFooter>
             </Card>
        )}

        {(order.status === 'Confirmed' || order.status === 'Shipped' || order.status === 'Received') && (
            <div className="flex justify-end gap-2">
                 <Button variant="outline" asChild>
                    <Link href={`/vendor/purchase-orders/${order.id}/packing-list`} target="_blank">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Packing List & Label
                    </Link>
                </Button>
                <Button onClick={handleGenerateInvoice}>
                    Generate Invoice
                </Button>
            </div>
        )}
    </div>
  );
}
