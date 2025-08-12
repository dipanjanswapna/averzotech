
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
import { MoreHorizontal, FileText, XCircle } from 'lucide-react';
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
import { collection, getDocs, query, orderBy, where, doc, writeBatch, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

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

    const fetchOrders = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const ordersCollection = collection(db, 'orders');
            const q = query(ordersCollection, where("userId", "==", user.uid), orderBy('createdAt', 'desc'));
            const orderSnapshot = await getDocs(q);
            const orderList = orderSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Order));
            setOrders(orderList);
        } catch (error) {
            console.error("Error fetching orders: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const handleCancelOrder = async (order: Order) => {
        if (order.status !== 'Pending') {
            toast({ title: "Cancellation Failed", description: "This order can no longer be cancelled.", variant: "destructive" });
            return;
        }

        const batch = writeBatch(db);
        const orderRef = doc(db, 'orders', order.id);
        
        try {
             batch.update(orderRef, { status: 'Cancelled' });

            // Restock products
            for (const item of order.items) {
                const productRef = doc(db, 'products', item.id);
                batch.update(productRef, { "inventory.stock": increment(item.quantity) });
            }

            await batch.commit();
            toast({ title: "Order Cancelled", description: "Your order has been successfully cancelled." });
            fetchOrders(); // Refresh orders
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
            default:
                return '';
        }
    };
    
    const formatDate = (timestamp: any) => {
        if (!timestamp || !timestamp.seconds) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    };

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
                         {order.status === 'Pending' && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">Cancel</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently cancel your order.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>No</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleCancelOrder(order)}>Yes, Cancel Order</AlertDialogAction>
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
