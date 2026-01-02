

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
import { ChevronLeft, Truck, Package, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, writeBatch, increment, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PurchaseOrder, PurchaseOrderItem } from '@/types';
import { useFirebase } from '@/firebase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ItemQc extends PurchaseOrderItem {
    accepted: number;
    rejected: number;
}

export default function AdminPurchaseOrderDetailsPage() {
  const params = useParams();
  const purchaseOrderId = params.purchaseOrderId as string;
  const router = useRouter();
  const { toast } = useToast();
  const { db } = useFirebase();

  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [qcItems, setQcItems] = useState<ItemQc[]>([]);
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
                const initialQcItems = orderData.items.map(item => ({ ...item, accepted: item.quantity, rejected: 0 }));
                setQcItems(initialQcItems);
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

  const handleQcChange = (sku: string, field: 'accepted' | 'rejected', value: number) => {
      setQcItems(prevItems => prevItems.map(item => {
          if (item.sku === sku) {
              if (field === 'accepted') {
                  const rejected = item.quantity - value;
                  return { ...item, accepted: value, rejected: rejected < 0 ? 0 : rejected };
              } else {
                  const accepted = item.quantity - value;
                   return { ...item, rejected: value, accepted: accepted < 0 ? 0 : accepted };
              }
          }
          return item;
      }));
  }

  const handleUpdateStatus = async () => {
    if (!order || newStatus === order.status) return;

    const totalAccepted = qcItems.reduce((acc, item) => acc + item.accepted, 0);

    if (newStatus === 'Received & Closed' && totalAccepted === 0) {
      toast({ title: "No Items Accepted", description: "Please accept at least one item before closing the order.", variant: "destructive" });
      return;
    }

    setIsUpdating(true);
    const batch = writeBatch(db);
    const orderRef = doc(db, 'purchaseOrders', order.id);

    try {
        batch.update(orderRef, { status: newStatus });
        
        if (newStatus === 'Received & Closed' && order.status !== 'Received & Closed') {
             for (const item of qcItems) {
                if (item.accepted > 0) {
                    const productRef = doc(db, 'products', item.productId);
                    batch.update(productRef, { "inventory.stock": increment(item.accepted) });
                }
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
                            <TableHead className="text-center">Quantity Ordered</TableHead>
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
                <CardTitle>Receive & QC</CardTitle>
                <CardDescription>Update order status and stock upon receiving items.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-center">Ordered</TableHead>
                            <TableHead className="w-28 text-center">Accepted</TableHead>
                            <TableHead className="w-28 text-center">Rejected</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {qcItems.map(item => (
                            <TableRow key={item.sku}>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell>
                                    <Input type="number" value={item.accepted} onChange={e => handleQcChange(item.sku, 'accepted', Number(e.target.value))} max={item.quantity} min={0} />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" value={item.rejected} readOnly className="bg-secondary" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
                 <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="w-[180px]">
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
                    {isUpdating ? 'Saving...' : 'Save & Update Stock'}
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
