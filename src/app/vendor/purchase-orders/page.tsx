
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
import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { cn } from '@/lib/utils';
import { PurchaseOrder } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function VendorPurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, db } = useFirebase();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid || !db) return;
      setLoading(true);
      try {
        const poCollection = collection(db, 'purchaseOrders');
        const q = query(poCollection, where("vendorId", "==", user.uid), orderBy('createdAt', 'desc'));
        const poSnapshot = await getDocs(q);
        const poList = poSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as PurchaseOrder));
        setOrders(poList);
      } catch (error) {
        console.error("Error fetching purchase orders: ", error);
        toast({ title: "Error", description: "Could not fetch your purchase orders.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, db, toast]);
  
  const { pendingOrders, otherOrders } = useMemo(() => {
    const pending = orders.filter(o => o.status === 'Pending');
    const others = orders.filter(o => o.status !== 'Pending');
    return { pendingOrders: pending, otherOrders: others };
  }, [orders]);


  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <p>Loading your purchase orders from Averzo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">
            Manage purchase orders received from Averzo for stock replenishment.
          </p>
        </div>
      </div>

       <Tabs defaultValue="pending" className="w-full">
        <TabsList>
            <TabsTrigger value="pending">
                New Orders ({pendingOrders.length})
                {pendingOrders.length > 0 && <span className="ml-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
            </TabsTrigger>
            <TabsTrigger value="history">Order History ({otherOrders.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
            <OrderTable title="New Purchase Orders" description="These orders require your confirmation." orders={pendingOrders} />
        </TabsContent>
        <TabsContent value="history">
             <OrderTable title="Order History" description="A list of all your past and in-progress purchase orders." orders={otherOrders} />
        </TabsContent>
        </Tabs>
    </div>
  );
}

function OrderTable({ title, description, orders }: { title: string, description: string, orders: PurchaseOrder[]}) {
    
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
        case 'Received': return 'bg-green-100 text-green-800';
        case 'Shipped':
        case 'Confirmed': return 'bg-blue-100 text-blue-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800 animate-pulse';
        default: return '';
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp || !timestamp.seconds) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    };

    return (
         <Card>
            <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>PO ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Quantity</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {orders.length > 0 ? orders.map((order) => (
                    <TableRow key={order.id} className={order.status === 'Pending' ? 'bg-yellow-50/50' : ''}>
                    <TableCell className="font-medium">{order.id.substring(0, 7)}...</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={cn(getStatusBadgeClass(order.status))}>
                           {order.status === 'Pending' && <span className="mr-2 h-2 w-2 rounded-full bg-red-500 animate-ping absolute"></span>}
                           {order.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{order.items.length}</TableCell>
                    <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                    <TableCell className="text-right">
                        ৳{order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                            <Link href={`/vendor/purchase-orders/${order.id}`}>View Details</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center h-24">
                            No orders found in this category.
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    )
}
