
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
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, getFirestore } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';

interface Order {
  id: string;
  customerName: string;
  shippingAddress: {
    fullAddress: string;
  };
  total: number;
}

export default function DeliveryDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, db } = useFirebase();

  useEffect(() => {
    if (!user || !db) return;
    const fetchAssignedOrders = async () => {
      setLoading(true);
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where("status", "==", "In-house Delivery"));
        // In a real app, you would also filter by assigned delivery person ID
        // e.g., where("deliveryAgentId", "==", user.uid)
        const querySnapshot = await getDocs(q);
        const assignedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Order));
        setOrders(assignedOrders);
      } catch (error) {
        console.error("Error fetching assigned orders: ", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchAssignedOrders();
    }
  }, [user, db]);

  if (loading) {
    return <p>Loading assigned orders...</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Delivery Tasks</h1>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Orders</CardTitle>
          <CardDescription>
            List of orders assigned to you for delivery.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Amount to Collect</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0, 7)}...</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.shippingAddress.fullAddress}</TableCell>
                  <TableCell className="text-right">
                    ৳{order.total.toFixed(2)}
                  </TableCell>
                   <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/delivery/orders/${order.id}`}>
                            View Details
                        </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                 <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        No orders assigned to you at the moment.
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
