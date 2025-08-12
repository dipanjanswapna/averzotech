
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Package, Truck, User, FileText, Gift } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Stepper, Step } from '@/components/ui/stepper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, writeBatch, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';


interface Order {
    id: string;
    createdAt: any;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Fulfilled' | 'Cancelled';
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
        dataAiHint: string;
        giftDescription?: string;
    }[];
    payment: {
        method: string;
        subtotal: number;
        shipping: number;
        tax: number;
        coupon?: {
            code: string;
            discountAmount: number;
        } | null;
        total: number;
    };
    notes: { id: string; author: string; date: any; note: string; }[];
    trackingId?: string;
}

const orderSteps = [
    { label: 'Pending', date: null },
    { label: 'Processing', date: null },
    { label: 'Shipped', date: null },
    { label: 'Fulfilled', date: null }
];

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [trackingId, setTrackingId] = useState('');

  useEffect(() => {
    if (orderId) {
        const fetchOrder = async () => {
            setLoading(true);
            const orderRef = doc(db, 'orders', orderId);
            const orderSnap = await getDoc(orderRef);
            if (orderSnap.exists()) {
                const orderData = { id: orderSnap.id, ...orderSnap.data() } as Order;
                setOrder(orderData);
                setNewStatus(orderData.status);
                setTrackingId(orderData.trackingId || '');
            } else {
                console.error("No such order!");
            }
            setLoading(false);
        };
        fetchOrder();
    }
  }, [orderId]);

  const handleUpdateStatus = async () => {
      if (!order || !newStatus || newStatus === order.status) return;

      const batch = writeBatch(db);
      const orderRef = doc(db, 'orders', order.id);

      try {
          batch.update(orderRef, { status: newStatus });
          const noteContent = `Order status changed from ${order.status} to ${newStatus}.`;
          
          const notesCollectionRef = collection(db, 'orders', order.id, 'notes');
          const newNoteRef = doc(notesCollectionRef);
          batch.set(newNoteRef, { note: noteContent, author: 'System', date: serverTimestamp() });

          // If order is cancelled, restock products
          if (newStatus === 'Cancelled' && order.status !== 'Cancelled') {
              for (const item of order.items) {
                  const productRef = doc(db, 'products', item.id);
                  batch.update(productRef, { "inventory.stock": increment(item.quantity) });
              }
          }

          await batch.commit();
          
          setOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
          toast({
              title: "Order Updated",
              description: `Order status has been changed to ${newStatus}.`
          });
      } catch (error) {
          console.error("Error updating status: ", error);
          toast({ title: "Error", description: "Failed to update order status.", variant: "destructive" });
      }
  };

  const handleUpdateTracking = async () => {
      if (!order) return;
      const orderRef = doc(db, 'orders', order.id);
      try {
          await updateDoc(orderRef, { trackingId: trackingId });
          const noteContent = `Tracking ID updated to ${trackingId}.`;
          await handleAddNote(noteContent, 'System');
          setOrder(prev => prev ? { ...prev, trackingId: trackingId } : null);
          toast({
              title: "Tracking Updated",
              description: `The tracking ID has been saved.`
          });
      } catch (error) {
          console.error("Error updating tracking ID: ", error);
          toast({ title: "Error", description: "Failed to save tracking ID.", variant: "destructive" });
      }
  };
  
  const handleAddNote = async (noteContent: string, author = 'Admin') => {
    if (!order || !noteContent.trim()) return;
    const notesCollection = collection(db, 'orders', order.id, 'notes');
    try {
        const newNoteDoc = {
            note: noteContent,
            author: author,
            date: serverTimestamp()
        };
        await addDoc(notesCollection, newNoteDoc);
        setNewNote('');
        // Optimistically update UI
        setOrder(prev => prev ? { ...prev, notes: [...prev.notes, { ...newNoteDoc, id: 'temp', date: new Date() }] } : null);
         toast({
              title: "Note Added",
              description: "The note has been successfully added to the order."
          });
    } catch(error) {
        console.error("Error adding note: ", error);
        toast({ title: "Error", description: "Failed to add note.", variant: "destructive" });
    }
  };
  
  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found.</p>;
  
  const currentStatusIndex = orderSteps.findIndex(step => step.label === order.status) + 1;
  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return new Date().toLocaleString();
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/orders">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
            <h1 className="text-2xl font-bold">Order {order.id.substring(0,7)}...</h1>
            <p className="text-muted-foreground text-sm">Date: {formatDate(order.createdAt)}</p>
        </div>
      </div>
        <div className="mx-auto w-full max-w-5xl">
            <Stepper initialStep={0} activeStep={currentStatusIndex} steps={orderSteps.map(s => ({label: s.label, description: s.date ? formatDate(s.date) : ''}))} />
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
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
                            data-ai-hint={item.dataAiHint || 'product image'}
                            />
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                         {item.giftDescription && (
                            <p className="text-xs text-pink-600 font-semibold flex items-center gap-1 mt-1">
                                <Gift className="w-3 h-3" /> + FREE: {item.giftDescription}
                            </p>
                        )}
                      </TableCell>
                      <TableCell>x {item.quantity}</TableCell>
                      <TableCell className="text-right">৳{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">৳{(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
             <CardContent>
                 <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>৳{order.payment.subtotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>৳{order.payment.shipping.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>৳{order.payment.tax.toFixed(2)}</span>
                    </div>
                    {order.payment.coupon && (
                         <div className="flex justify-between text-green-600">
                            <span>Discount ({order.payment.coupon.code})</span>
                            <span className='font-semibold'>- ৳{order.payment.coupon.discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                     <Separator />
                     <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>৳{order.payment.total.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className='font-semibold'>{order.payment.method}</span>
                    </div>
                 </div>
             </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Customer</CardTitle>
                    <Button variant="ghost" size="icon" asChild><Link href="#"><User className="h-4 w-4"/></Link></Button>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold">{order.shippingAddress.name}</p>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress.email}</p>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
                    <Separator className="my-4"/>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <address className="text-sm not-italic text-muted-foreground">
                        {order.shippingAddress.fullAddress}
                    </address>
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
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                </CardContent>
                 <CardFooter>
                    <Button className="w-full" onClick={handleUpdateStatus}>Update Order</Button>
                </CardFooter>
            </Card>
             <Card>
                 <CardHeader>
                    <CardTitle>Tracking Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input placeholder="Enter tracking ID" value={trackingId} onChange={e => setTrackingId(e.target.value)} />
                </CardContent>
                 <CardFooter>
                    <Button className="w-full" variant="secondary" onClick={handleUpdateTracking}>Save Tracking ID</Button>
                </CardFooter>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-3 max-h-48 overflow-y-auto">
                        {order.notes.map(note => (
                            <div key={note.id} className="text-xs">
                                <p className="text-muted-foreground">{formatDate(note.date)} by <span className="font-semibold text-foreground">{note.author}</span></p>
                                <p>{note.note}</p>
                            </div>
                        ))}
                     </div>
                     <Textarea placeholder="Add a note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                     <Button size="sm" onClick={() => handleAddNote(newNote)}>Add Note</Button>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                    <Button variant="outline"><FileText className="mr-2 h-4 w-4"/> Invoice</Button>
                    <Button variant="outline"><Truck className="mr-2 h-4 w-4"/> Track</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
