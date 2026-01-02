
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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { cn } from '@/lib/utils';
import { PurchaseOrder } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function AdminPurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = useFirebase();
  const { toast } = useToast();

  useEffect(() => {
    if (!db) return;

    setLoading(true);
    const poQuery = query(
      collection(db, 'purchaseOrders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(poQuery, (snapshot) => {
        const poList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as PurchaseOrder));
        setOrders(poList);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching purchase orders: ", error);
        toast({ title: "Error", description: "Could not fetch purchase orders.", variant: "destructive" });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [db, toast]);
  
  const { pendingOrders, confirmedOrders, inTransitOrders, receivedOrders } = useMemo(() => {
    return {
      pendingOrders: orders.filter(o => o.status === 'Pending'),
      confirmedOrders: orders.filter(o => o.status === 'Confirmed'),
      inTransitOrders: orders.filter(o => o.status === 'In-Transit'),
      receivedOrders: orders.filter(o => o.status === 'Received & Closed'),
    };
  }, [orders]);


  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <p>Loading purchase orders from vendors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">
            Create and manage purchase orders for your vendors.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/purchase-orders/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create PO
          </Link>
        </Button>
      </div>

       <Tabs defaultValue="pending" className="w-full">
        <TabsList>
            <TabsTrigger value="pending">
                Pending ({pendingOrders.length})
                {pendingOrders.length > 0 && <span className="relative flex h-3 w-3 ml-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span></span>}
            </TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed ({confirmedOrders.length})</TabsTrigger>
            <TabsTrigger value="in-transit">In-Transit ({inTransitOrders.length})</TabsTrigger>
            <TabsTrigger value="history">History ({receivedOrders.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
            <OrderTable title="Pending Vendor Confirmation" description="These orders are awaiting confirmation from the vendor." orders={pendingOrders} />
        </TabsContent>
        <TabsContent value="confirmed">
             <OrderTable title="Confirmed by Vendor" description="Vendors have confirmed these orders and are preparing for delivery." orders={confirmedOrders} />
        </TabsContent>
         <TabsContent value="in-transit">
             <OrderTable title="In-Transit to Warehouse" description="These orders are on their way to the Averzo warehouse." orders={inTransitOrders} />
        </TabsContent>
        <TabsContent value="history">
             <OrderTable title="Order History" description="A list of all completed or cancelled purchase orders." orders={receivedOrders} />
        </TabsContent>
        </Tabs>
    </div>
  );
}

function OrderTable({ title, description, orders }: { title: string, description: string, orders: PurchaseOrder[]}) {
    
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
                    <TableHead>Vendor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {orders.length > 0 ? orders.map((order) => (
                    <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0, 7)}...</TableCell>
                    <TableCell>{order.vendorName}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={cn("capitalize", getStatusBadgeClass(order.status))}>
                           {order.status}
                        </Badge>
                    </TableCell>
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
                            <Link href={`/admin/purchase-orders/${order.id}`}>View Details</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
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
