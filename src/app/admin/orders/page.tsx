
'use client';

import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Order {
    id: string;
    customerName: string;
    createdAt: any;
    status: 'Fulfilled' | 'Processing' | 'Cancelled' | 'Pending';
    total: number;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersCollection = collection(db, 'orders');
                const q = query(ordersCollection, orderBy('createdAt', 'desc'));
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

        fetchOrders();
    }, []);

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
        return <div className="space-y-8"><h1 className="text-3xl font-bold">Orders</h1><p>Loading orders...</p></div>
    }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            A list of all orders in your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0,7)}...</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(order.status)}
                      className={getStatusBadgeClass(order.status)}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ৳{order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                           <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
