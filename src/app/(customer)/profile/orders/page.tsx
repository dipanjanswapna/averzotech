
'use client';

import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where, doc, writeBatch, increment, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Order {
    id: string;
    createdAt: any;
    status: 'Fulfilled' | 'Processing' | 'Cancelled' | 'Pending';
    total: number;
    items: { id: string, name: string, image: string, quantity: number }[];
}

export default function MyOrdersPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellationReason, setCancellationReason] = useState('');

    const fetchOrders = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const ordersCollection = collection(db, 'orders');
            const q = query(ordersCollection, where("userId", "==", user.uid));
            const orderSnapshot = await getDocs(q);
            const orderList = orderSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Order));
            
            orderList.sort((a, b) => {
                const dateA = a.createdAt?.seconds || 0;
                const dateB = b.createdAt?.seconds || 0;
                return dateB - dateA;
            });

            setOrders(orderList);
        } catch (error) {
            console.error("Error fetching orders: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const handleCancelOrder = async (order: Order) => {
        if (!canCancel(order)) {
            toast({ title: "Cancellation Failed", description: "This order can no longer be cancelled.", variant: "destructive" });
            return;
        }

        if (!cancellationReason) {
            toast({ title: "Reason Required", description: "Please select a reason for cancellation.", variant: "destructive" });
            return;
        }

        const batch = writeBatch(db);
        const orderRef = doc(db, 'orders', order.id);
        const notesRef = collection(db, 'orders', order.id, 'notes');
        
        try {
             batch.update(orderRef, { status: 'Cancelled' });
             
             const newNoteRef = doc(notesRef);
             batch.set(newNoteRef, {
                 note: `Order cancelled by customer. Reason: ${cancellationReason}`,
                 author: user?.fullName || 'Customer',
                 date: serverTimestamp()
             });

            for (const item of order.items) {
                const productRef = doc(db, 'products', item.id);
                batch.update(productRef, { "inventory.stock": increment(item.quantity) });
            }

            await batch.commit();
            toast({ title: "Order Cancelled", description: "Your order has been successfully cancelled." });
            fetchOrders(); 
        } catch (error) {
             console.error("Error cancelling order: ", error);
             toast({ title: "Error", description: "Failed to cancel the order.", variant: "destructive" });
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Fulfilled':
                return 'default';
            case 'Processing':
                return 'secondary';
            case 'Cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Fulfilled':
                return 'bg-green-100 text-green-800';
            case 'Processing':
                return 'bg-blue-100 text-blue-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return '';
        }
    };
    
    const formatDate = (timestamp: any) => {
        if (!timestamp || !timestamp.seconds) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    };

    const canCancel = (order: Order) => {
        if (order.status !== 'Pending') return false;
        if (!order.createdAt?.seconds) return false;
        const orderTime = new Date(order.createdAt.seconds * 1000);
        const now = new Date();
        const timeDiff = now.getTime() - orderTime.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        return hoursDiff <= 1; // Allow cancellation within 1 hour
    }

    if (loading) {
        return <p>Loading your orders...</p>
    }

  return (
    <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>
            View your order history and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0,7)}...</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(order.status)}
                      className={getStatusBadgeClass(order.status)}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ৳{order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                         <Button variant="outline" size="sm" asChild>
                            <Link href={`/order-confirmation?orderId=${order.id}`}>View Details</Link>
                        </Button>
                         {canCancel(order) && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">Cancel</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Please select a reason for cancellation. This action cannot be undone.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="my-4">
                                        <Label htmlFor="cancellation-reason">Reason for Cancellation</Label>
                                        <Select onValueChange={setCancellationReason} defaultValue="">
                                            <SelectTrigger id="cancellation-reason" className="w-full">
                                                <SelectValue placeholder="Select a reason..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Ordered by mistake">Ordered by mistake</SelectItem>
                                                <SelectItem value="Found a better price">Found a better price</SelectItem>
                                                <SelectItem value="Delivery time is too long">Delivery time is too long</SelectItem>
                                                <SelectItem value="Changed my mind">Changed my mind</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>No</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleCancelOrder(order)} disabled={!cancellationReason}>
                                        Yes, Cancel Order
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                         )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
}
