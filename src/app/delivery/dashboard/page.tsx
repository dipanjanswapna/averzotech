
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
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, Package, User } from 'lucide-react';
import { PurchaseOrder } from '@/types';


interface DeliveryOrder {
  id: string;
  customerName: string;
  shippingAddress: {
    fullAddress: string;
  };
  total: number;
}

interface PickupOrder extends PurchaseOrder {
    // Inherits from PurchaseOrder, no extra fields needed for this view
}


export default function DeliveryDashboardPage() {
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
  const [pickupOrders, setPickupOrders] = useState<PickupOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, db } = useFirebase();

  useEffect(() => {
    if (!user || !db) return;
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // Fetch orders for delivery to customers
        const deliveryQuery = query(collection(db, 'orders'), where("status", "==", "In-house Delivery"));
        const deliverySnapshot = await getDocs(deliveryQuery);
        const assignedDeliveries = deliverySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as DeliveryOrder));
        setDeliveryOrders(assignedDeliveries);

        // Fetch purchase orders for pickup from vendors
        const pickupQuery = query(collection(db, 'purchaseOrders'), where("status", "==", "Confirmed"), where("inboundMethod", "==", "averzo-pickup"), orderBy('createdAt', 'desc'));
        const pickupSnapshot = await getDocs(pickupQuery);
        const assignedPickups = pickupSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as PickupOrder));
        setPickupOrders(assignedPickups);

      } catch (error) {
        console.error("Error fetching tasks: ", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchTasks();
    }
  }, [user, db]);

  if (loading) {
    return <p>Loading assigned tasks...</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Tasks</h1>
      <p className="text-muted-foreground">A summary of your delivery and pickup assignments.</p>

        <Tabs defaultValue="deliveries" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deliveries">
                    <Truck className="mr-2 h-4 w-4"/>
                    Deliveries to Customer ({deliveryOrders.length})
                </TabsTrigger>
                <TabsTrigger value="pickups">
                     <Package className="mr-2 h-4 w-4"/>
                    Pickups from Vendor ({pickupOrders.length})
                </TabsTrigger>
            </TabsList>
            <TabsContent value="deliveries">
                 <Card>
                    <CardHeader>
                    <CardTitle>Assigned Customer Deliveries</CardTitle>
                    <CardDescription>
                        List of orders to be delivered to customers.
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
                        {deliveryOrders.length > 0 ? deliveryOrders.map((order) => (
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
                                    No delivery tasks at the moment.
                                </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="pickups">
                 <Card>
                    <CardHeader>
                    <CardTitle>Assigned Vendor Pickups</CardTitle>
                    <CardDescription>
                        List of purchase orders to be picked up from vendors.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PO ID</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Est. Delivery to Warehouse</TableHead>
                                <TableHead>
                                <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pickupOrders.length > 0 ? pickupOrders.map((po) => (
                                <TableRow key={po.id}>
                                    <TableCell className="font-medium">{po.id.substring(0, 7)}...</TableCell>
                                    <TableCell>{po.vendorName}</TableCell>
                                     <TableCell>{new Date(po.estimatedDelivery || '').toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/vendor/purchase-orders/${po.id}`}>
                                                View Details
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                 <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        No pickup tasks at the moment.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                     </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
