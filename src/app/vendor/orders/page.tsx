
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
import { collection, getDocs, query, orderBy, where, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';

interface Order {
    id: string;
    customerName: string;
    createdAt: any;
    status: 'Fulfilled' | 'Processing' | 'Cancelled' | 'Pending';
    total: number;
    items: { id: string }[];
}

interface Product {
  id: string;
}

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const db = getFirestore(app);

    useEffect(() => {
        const fetchVendorOrders = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // 1. Get all product IDs for the current vendor
                const productsRef = collection(db, 'products');
                const qProducts = query(productsRef, where("vendor", "==", user.fullName));
                const productSnapshot = await getDocs(qProducts);
                const vendorProductIds = productSnapshot.docs.map(doc => doc.id);

                if (vendorProductIds.length === 0) {
                    setOrders([]);
                    setLoading(false);
                    return;
                }

                // 2. Get all orders
                const ordersCollection = collection(db, 'orders');
                const qOrders = query(ordersCollection, orderBy('createdAt', 'desc'));
                const orderSnapshot = await getDocs(qOrders);
                const allOrders = orderSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Order));

                // 3. Filter orders that contain any of the vendor's products
                const vendorOrders = allOrders.filter(order => 
                    order.items.some(item => vendorProductIds.includes(item.id))
                );
                
                setOrders(vendorOrders);

            } catch (error) {
                console.error("Error fetching vendor orders: ", error);
            } finally {
                setLoading(false);
            }
        };

        if(user) {
            fetchVendorOrders();
        }
    }, [user, db]);

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
        return (
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">My Orders</h1>
                <p>Loading your orders...</p>
            </div>
        )
    }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Orders Containing My Products</CardTitle>
          <CardDescription>
            A list of all orders that include products you sell.
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
              {orders.length > 0 ? orders.map((order) => (
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                        You have no orders yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
