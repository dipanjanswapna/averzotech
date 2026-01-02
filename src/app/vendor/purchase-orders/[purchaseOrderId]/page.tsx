

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
import { ChevronLeft, Printer, AlertTriangle, MapPin, Package } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDays, format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


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
  const [inboundMethod, setInboundMethod] = useState<'self-dropoff' | 'averzo-pickup'>('self-dropoff');
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
                setInboundMethod(orderData.inboundMethod || 'self-dropoff');
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
              inboundMethod,
              notes,
              confirmedAt: serverTimestamp()
          });
          setOrder(prev => prev ? {...prev, status: 'Confirmed', estimatedDelivery, notes, inboundMethod } : null);
          toast({ title: "Order Confirmed", description: "Averzo has been notified about your confirmation." });
      } catch (error) {
          console.error("Error confirming order:", error);
          toast({ title: "Error", description: "Failed to confirm the order.", variant: "destructive" });
      } finally {
        setIsUpdating(false);
      }
  }

  const handleCreateInvoice = () => {
      if (!order) return;
      // Store PO data in local storage for the new invoice page to pick up
      localStorage.setItem('poForInvoice', JSON.stringify(order));
      router.push('/vendor/invoices/new');
  };

   const handlePrintPackingList = () => {
        router.push(`/vendor/purchase-orders/${purchaseOrderId}/packing-list`);
    };

  if (loading) return <p className="p-8">Loading purchase order details...</p>;
  if (!order) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-GB');
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Received & Closed': return 'bg-green-100 text-green-800';
      case 'In-Transit':
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
                    <CardDescription>Please confirm the order and select your inbound method.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                        <Label>Inbound Method *</Label>
                        <RadioGroup value={inboundMethod} onValueChange={(value) => setInboundMethod(value as any)} className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                           <Label htmlFor="self-dropoff" className="flex items-start gap-4 border p-4 rounded-lg cursor-pointer hover:bg-accent/50 has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
                               <RadioGroupItem value="self-dropoff" id="self-dropoff" className="mt-1"/>
                               <div>
                                   <p className="font-semibold">Self Drop-off</p>
                                   <p className="text-xs text-muted-foreground">You will deliver the products to the Averzo warehouse yourself.</p>
                               </div>
                           </Label>
                           <Label htmlFor="averzo-pickup" className="flex items-start gap-4 border p-4 rounded-lg cursor-pointer hover:bg-accent/50 has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
                               <RadioGroupItem value="averzo-pickup" id="averzo-pickup" className="mt-1"/>
                               <div>
                                   <p className="font-semibold">Averzo Pickup</p>
                                   <p className="text-xs text-muted-foreground">An Averzo rider will collect the products from your location.</p>
                               </div>
                           </Label>
                        </RadioGroup>
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
        
        {order.status === 'Confirmed' && (
            <Card>
                <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                    <CardDescription>Your order is confirmed. Please prepare the items for delivery.</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800">Your Confirmed Details</h4>
                        <p className="text-sm text-blue-700">Estimated Warehouse Delivery: <span className="font-bold">{order.estimatedDelivery ? format(new Date(order.estimatedDelivery), 'dd MMM, yyyy') : 'Not set'}</span></p>
                        <p className="text-sm text-blue-700">Inbound Method: <span className="font-bold capitalize">{order.inboundMethod?.replace('-', ' ')}</span></p>
                    </div>
                     <div>
                        <h4 className="font-semibold">1. Prepare Your Shipment</h4>
                        <p className="text-sm text-muted-foreground">Please pack all items securely according to our packaging guidelines.</p>
                    </div>
                     <div>
                        <h4 className="font-semibold">2. Print Documents</h4>
                        <p className="text-sm text-muted-foreground">Print the Packing List and the Invoice. Include the Invoice inside the package and attach the Shipping Label outside.</p>
                         <div className="flex gap-2 mt-2">
                             <Button variant="outline" onClick={handlePrintPackingList}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print Packing List & Label
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`/vendor/purchase-orders/${order.id}/invoice`} target="_blank">
                                    <Printer className="mr-2 h-4 w-4" />
                                    Generate & Print Invoice
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold">3. Packaging Guidelines</h4>
                        <p className="text-sm text-muted-foreground">Ensure products are packed securely to prevent damage during transit.</p>
                        <ul className="text-xs list-disc pl-5 mt-2 text-muted-foreground">
                            <li>Use sturdy boxes that can withstand handling.</li>
                            <li>Wrap fragile items individually with bubble wrap.</li>
                            <li>Fill any empty space in the box to prevent items from moving.</li>
                            <li>Seal the package securely with strong tape.</li>
                        </ul>
                    </div>
                     {order.inboundMethod === 'self-dropoff' && (
                          <div>
                            <h4 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" />4. Drop-off at Warehouse</h4>
                            <p className="text-sm text-muted-foreground">Please deliver the shipment to the following address before your committed delivery date:</p>
                             <address className="text-sm not-italic mt-2 p-2 bg-secondary rounded-md">
                                <strong>Averzo Central Warehouse</strong><br/>
                                123 Logistics Way, Gazipur, Dhaka
                            </address>
                            <div className="mt-4 aspect-video w-full rounded-lg overflow-hidden border">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3643.511397579893!2d90.3204983154032!3d24.04838698444253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755da5f1d454df7%3A0x1d6245c33838c644!2sGazipur!5e0!3m2!1sen!2sbd!4v1676458535123!5m2!1sen!2sbd" 
                                    width="100%" 
                                    height="100%" 
                                    style={{border:0}} 
                                    allowFullScreen
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade">
                                </iframe>
                            </div>
                        </div>
                     )}
                      {order.inboundMethod === 'averzo-pickup' && (
                          <div>
                            <h4 className="font-semibold flex items-center gap-2"><Package className="h-4 w-4" />4. Prepare for Pickup</h4>
                            <p className="text-sm text-muted-foreground">An Averzo rider will be assigned to collect the package from your registered address within your committed lead time. Please keep the package ready.</p>
                        </div>
                     )}
                 </CardContent>
            </Card>
        )}

        {order.status !== 'Pending' && order.status !== 'Confirmed' && (
             <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handlePrintPackingList}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Packing List & Label
                </Button>
                <Button asChild>
                   <Link href={`/vendor/purchase-orders/${order.id}/invoice`} target="_blank">
                     Generate Invoice
                   </Link>
                </Button>
            </div>
        )}
    </div>
  );
}
