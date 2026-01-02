

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
import { ChevronLeft, Truck, Package } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, writeBatch, increment, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PurchaseOrder } from '@/types';
import { useFirebase } from '@/firebase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function AdminPurchaseOrderDetailsPage() {
  const params = useParams();
  const purchaseOrderId = params.purchaseOrderId as string;
  const router = useRouter();
  const { toast } = useToast();
  const { db } = useFirebase();

  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (purchaseOrderId && db) {
        setLoading(true);
        const orderRef = doc(db, 'purchaseOrders', purchaseOrderId);
        const unsubscribe = onSnapshot(orderRef, (docSnap) => {
            if (docSnap.exists()) {
                const orderData = { id: docSnap.id, ...docSnap.data() } as PurchaseOrder;
                setOrder(orderData);
                setNewStatus(orderData.status);
            } else {
                toast({ title: "Error", description: "Purchase Order not found.", variant: "destructive" });
                router.push('/admin/purchase-orders');
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching PO:", error);
            toast({ title: "Error", description: "Failed to fetch PO details.", variant: "destructive" });
            setLoading(false);
        });

        return () => unsubscribe();
    }
  }, [purchaseOrderId, toast, router, db]);

  const handleUpdateStatus = async () => {
    if (!order || newStatus === order.status) return;
    setIsUpdating(true);
    const batch = writeBatch(db);
    const orderRef = doc(db, 'purchaseOrders', order.id);

    try {
        batch.update(orderRef, { status: newStatus });
        
        if (newStatus === 'Received & Closed' && order.status !== 'Received & Closed') {
             for (const item of order.items) {
                const productRef = doc(db, 'products', item.productId);
                batch.update(productRef, { "inventory.stock": increment(item.quantity) });
            }
        }
        
        await batch.commit();
        toast({ title: "Status Updated", description: `Order status changed to ${newStatus}.` });
    } catch (error) {
        console.error("Error updating status:", error);
        toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    } finally {
        setIsUpdating(false);
    }
  };

  if (loading) return <p className="p-8">Loading purchase order details...</p>;
  if (!order) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return 'N/A';
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
                <Link href="/admin/purchase-orders">
                    <ChevronLeft className="h-4 w-4" />
                </Link>
            </Button>
            <div>
                <h1 className="text-2xl font-bold">Purchase Order #{order.id.substring(0, 7)}</h1>
                <p className="text-muted-foreground text-sm">To: {order.vendorName}</p>
            </div>
        </div>
        <Badge variant="outline" className={cn("ml-auto", getStatusBadgeClass(order.status))}>
            {order.status}
        </Badge>
      </div>

       {order.status === 'Confirmed' && (
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-blue-800">Vendor Confirmation Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold text-blue-900">Estimated Delivery to Warehouse</p>
                        <p>{order.estimatedDelivery ? format(new Date(order.estimatedDelivery), 'dd MMM, yyyy') : 'Not set'}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-blue-900">Inbound Method</p>
                        <p className="capitalize">{order.inboundMethod?.replace('-', ' ')}</p>
                    </div>
                     {order.notes && (
                        <div className="md:col-span-2">
                            <p className="font-semibold text-blue-900">Vendor Notes</p>
                            <p className="italic">"{order.notes}"</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        )}

        <Card>
            <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Date Created: {formatDate(order.createdAt)}</CardDescription>
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
        
        <Card>
            <CardHeader>
                <CardTitle>Update Order Status</CardTitle>
                <CardDescription>Update the lifecycle of this purchase order.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 items-center">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="In-Transit">In-Transit</SelectItem>
                            <SelectItem value="Received & Closed">Received & Closed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                     <Button onClick={handleUpdateStatus} disabled={isUpdating || newStatus === order.status}>
                        {isUpdating ? 'Saving...' : 'Save Status'}
                    </Button>
                </div>
                {newStatus === 'Received & Closed' && order.status !== 'Received & Closed' && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertTitle>Confirm Stock Update</AlertTitle>
                        <AlertDescription>
                            This action will add the ordered quantities to your product stock. This is irreversible. Please ensure you have physically verified all items before proceeding.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
