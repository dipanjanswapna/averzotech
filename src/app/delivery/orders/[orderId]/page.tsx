
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

interface Order {
    id: string;
    createdAt: any;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Fulfilled' | 'Cancelled' | 'In-house Delivery';
    total: number;
    shippingAddress: {
        name: string;
        email: string;
        phone: string;
        fullAddress: string;
    };
    items: {
        id: string;
        name: string;
        image: string;
        sku: string;
        price: number;
        quantity: number;
    }[];
    payment: {
        method: string;
    };
}


export default function DeliveryOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { toast } = useToast();
  const { user } = useAuth();
  const db = getFirestore(app);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    if (orderId) {
        const fetchOrder = async () => {
            const orderRef = doc(db, 'orders', orderId);
            const docSnap = await getDoc(orderRef);
            if (docSnap.exists()) {
                 const orderData = { id: docSnap.id, ...docSnap.data() } as Order;
                setOrder(orderData);
                setNewStatus(orderData.status);
            } else {
                toast({title: "Error", description: "Order not found.", variant: "destructive"});
                router.push('/delivery/dashboard');
            }
            setLoading(false);
        }
        fetchOrder();
    }
  }, [orderId, toast, router, db]);

  const handleUpdateStatus = async () => {
      if (!order || !newStatus || newStatus === order.status) return;
      setIsUpdating(true);
      const orderRef = doc(db, 'orders', order.id);
      try {
           await updateDoc(orderRef, {
                status: newStatus,
                updatedAt: serverTimestamp()
            });
           toast({ title: "Order Updated", description: `Order status changed to ${newStatus}.` });
           setOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
      } catch (error) {
           console.error("Error updating status: ", error);
          toast({ title: "Error", description: "Failed to update order status.", variant: "destructive" });
      } finally {
          setIsUpdating(false);
      }
  };
  
  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found.</p>;

  const paymentMethodDisplay = order.payment.method === 'cod' ? 'Cash on Delivery' : 'Prepaid';

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/delivery/dashboard">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
            <h1 className="text-2xl font-bold">Delivery for Order {order.id.substring(0,7)}...</h1>
            <p className="text-muted-foreground text-sm">Status: <Badge variant={order.status === 'Fulfilled' ? 'default' : 'secondary'}>{order.status}</Badge></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Items to Deliver</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                         <Image
                            alt={item.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={item.image || 'https://placehold.co/64x64.png'}
                            width="64"
                            />
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                      </TableCell>
                      <TableCell>x {item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Customer & Delivery Info</CardTitle>
                    <User className="h-5 w-5 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold">{order.shippingAddress.name}</p>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress.email}</p>
                    <Separator className="my-4"/>
                    <h4 className="font-semibold mb-2">Delivery Address</h4>
                    <address className="text-sm not-italic text-muted-foreground">
                        {order.shippingAddress.fullAddress}
                    </address>
                </CardContent>
            </Card>
             <Card>
                 <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Amount to Collect</span>
                        <span>৳{paymentMethodDisplay === 'Cash on Delivery' ? order.total.toFixed(2) : '0.00'}</span>
                    </div>
                     <Badge variant={paymentMethodDisplay === 'Prepaid' ? 'default' : 'destructive'}>{paymentMethodDisplay}</Badge>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Update Status</CardTitle>
                </CardHeader>
                <CardContent>
                     <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In-house Delivery">Out for Delivery</SelectItem>
                        <SelectItem value="Fulfilled">Delivered</SelectItem>
                        <SelectItem value="Delivery Failed">Delivery Failed</SelectItem>
                        <SelectItem value="Returning to Warehouse">Returning</SelectItem>
                      </SelectContent>
                    </Select>
                </CardContent>
                 <CardFooter>
                    <Button className="w-full" onClick={handleUpdateStatus} disabled={isUpdating}>
                        {isUpdating ? 'Updating...' : 'Update Order Status'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
