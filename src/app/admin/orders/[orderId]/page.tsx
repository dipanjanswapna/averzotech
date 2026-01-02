
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
import { ChevronLeft, Package, Truck, User, FileText, Gift, AlertTriangle, Undo2 } from 'lucide-react';
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
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, writeBatch, increment, query, orderBy, onSnapshot, getDocs, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { useFirebase } from '@/firebase';


interface Order {
    id: string;
    createdAt: any;
    status: 'Pending' | 'Processing' | 'In-Transit' | 'Shipped' | 'Fulfilled' | 'Cancelled' | 'In-house Delivery' | 'Returning to Warehouse' | 'Received & Closed';
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
        giftCard?: {
            code: string;
            usedAmount: number;
        } | null;
        total: number;
    };
    paymentDetails?: {
        method?: string;
        status?: string;
        paymentID?: string;
        trxID?: string;
    },
    notes: { id: string; author: string; date: any; note: string; }[];
    trackingId?: string;
}

interface TrackingUpdate {
  message_en: string;
  message_bn: string;
  time: string;
}

const orderSteps = [
    { label: 'Pending' },
    { label: 'Processing' },
    { label: 'Shipped' },
    { label: 'Fulfilled' }
];

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { toast } = useToast();
  const { user, db } = useFirebase();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [isCreatingParcel, setIsCreatingParcel] = useState(false);


  // Refund state
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);

  // RedX Tracking state
  const [trackingInfo, setTrackingInfo] = useState<TrackingUpdate[]>([]);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);


  useEffect(() => {
    if (orderId && db) {
        const orderRef = doc(db, 'orders', orderId);
        const notesRef = collection(db, 'orders', orderId, 'notes');
        const qNotes = query(notesRef, orderBy('date', 'asc'));

        const unsubscribeOrder = onSnapshot(orderRef, (docSnap) => {
            if (docSnap.exists()) {
                 const orderData = { id: docSnap.id, ...docSnap.data() } as Order;
                setOrder(prevOrder => ({...prevOrder, ...orderData}));
                setNewStatus(orderData.status);
                setTrackingId(orderData.trackingId || '');
            } else {
                console.error("No such order!");
                toast({title: "Error", description: "Order not found.", variant: "destructive"});
            }
            setLoading(false);
        });
        
         const unsubscribeNotes = onSnapshot(qNotes, (snapshot) => {
            const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as {id: string, author: string, date: any, note: string}));
            setOrder(prevOrder => prevOrder ? { ...prevOrder, notes: notesData } : null);
        });

        return () => {
            unsubscribeOrder();
            unsubscribeNotes();
        }
    }
  }, [orderId, toast, db]);

  const handleUpdateStatus = async () => {
      if (!order || !newStatus || newStatus === order.status || !db) return;

      const batch = writeBatch(db);
      const orderRef = doc(db, 'orders', order.id);

      try {
          batch.update(orderRef, { status: newStatus, updatedAt: serverTimestamp() });
          const noteContent = `Order status changed from ${order.status} to ${newStatus}.`;
          
          const notesCollectionRef = collection(db, 'orders', order.id, 'notes');
          const newNoteRef = doc(notesCollectionRef);
          batch.set(newNoteRef, { note: noteContent, author: user?.fullName || 'System', date: serverTimestamp() });

          if (newStatus === 'Cancelled') {
              if (order.status !== 'Cancelled') {
                for (const item of order.items) {
                    const productRef = doc(db, 'products', item.id);
                    batch.update(productRef, { "inventory.stock": increment(item.quantity) });
                }
              }
          }

          await batch.commit();
          
          toast({
              title: "Order Updated",
              description: `Order status has been changed to ${newStatus}.`
          });
      } catch (error) {
          console.error("Error updating status: ", error);
          toast({ title: "Error", description: "Failed to update order status.", variant: "destructive" });
      }
  };

  const handleCreateParcel = async () => {
      if (!order) return;
      setIsCreatingParcel(true);
      try {
          const response = await fetch('/api/shipping/create-parcel', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: order.id }),
          });
          const result = await response.json();
          if (response.ok) {
              setTrackingId(result.trackingId);
              toast({ title: "Parcel Created", description: `RedX parcel created with Tracking ID: ${result.trackingId}` });
          } else {
              throw new Error(result.error || "Failed to create parcel.");
          }
      } catch (error: any) {
          toast({ title: "Parcel Creation Failed", description: error.message, variant: "destructive" });
      } finally {
          setIsCreatingParcel(false);
      }
  };
  
  const handleAddNote = async (noteContent: string, author: string) => {
    if (!order || !noteContent.trim() || !db) return;
    const notesCollection = collection(db, 'orders', order.id, 'notes');
    try {
        const newNoteDoc = {
            note: noteContent,
            author: author,
            date: serverTimestamp()
        };
        await addDoc(notesCollection, newNoteDoc);
        setNewNote('');
         toast({
              title: "Note Added",
              description: "The note has been successfully added to the order."
          });
    } catch(error) {
        console.error("Error adding note: ", error);
        toast({ title: "Error", description: "Failed to add note.", variant: "destructive" });
    }
  };

  const handleRefund = async () => {
    if (!order || !refundAmount || !refundReason) {
      toast({ title: "Missing Information", description: "Please enter a refund amount and reason.", variant: "destructive" });
      return;
    }
    if (parseFloat(refundAmount) > order.payment.total) {
        toast({ title: "Invalid Amount", description: "Refund amount cannot be greater than the order total.", variant: "destructive" });
        return;
    }

    setIsRefunding(true);
    try {
        const response = await fetch('/api/payment/bkash/refund', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentId: order.paymentDetails?.paymentID,
                trxId: order.paymentDetails?.trxID,
                amount: refundAmount,
                reason: refundReason,
                sku: `order-${order.id}`
            })
        });

        const result = await response.json();
        if (response.ok) {
            toast({ title: "Refund Successful", description: `Refund of ৳${result.refundAmount} processed. TrxID: ${result.refundTrxId}` });
            // The API now automatically adds a note, so we don't need to do it here.
            setRefundAmount('');
            setRefundReason('');
        } else {
            toast({ title: "Refund Failed", description: result.errorMessage || "An unknown error occurred.", variant: "destructive" });
        }

    } catch (error: any) {
        toast({ title: "Error", description: "Failed to process refund request.", variant: "destructive" });
    } finally {
        setIsRefunding(false);
    }
  }

  const handleTrackPackage = async () => {
    if (!trackingId) {
        toast({ title: 'No Tracking ID', description: 'This order does not have a tracking ID yet.', variant: 'destructive'});
        return;
    }
    setIsTrackingLoading(true);
    setTrackingInfo([]);
    try {
        const response = await fetch(`/api/track/redx/${trackingId}`);
        const data = await response.json();
        if (response.ok) {
            setTrackingInfo(data.tracking);
        } else {
             toast({ title: 'Tracking Failed', description: data.error || 'Could not fetch tracking information.', variant: 'destructive'});
        }
    } catch (error) {
        console.error("Error fetching tracking info:", error);
        toast({ title: 'Error', description: 'An error occurred while tracking the package.', variant: 'destructive'});
    } finally {
        setIsTrackingLoading(false);
    }
  };
  
  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found.</p>;
  
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Fulfilled'];
  let currentStatusIndex = validStatuses.indexOf(order.status);
  if(order.status === 'Cancelled' || order.status === 'In-house Delivery' || order.status === 'Returning to Warehouse' || order.status === 'Received & Closed' || order.status === 'In-Transit') {
      currentStatusIndex = -1; // Or some other value to indicate it's off the normal path
  }
  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return new Date().toLocaleString();
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };
  const paymentMethodDisplay = order.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment';

  const isRefundable = order.payment.method === 'bkash' && (order.status === 'Processing' || order.status === 'Fulfilled' || order.status === 'Cancelled') && order.paymentDetails?.trxID;

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
            {order.status !== 'Cancelled' && order.status !== 'In-house Delivery' && order.status !== 'Returning to Warehouse' && order.status !== 'Received & Closed' && order.status !== 'In-Transit' ? (
                <Stepper initialStep={0} activeStep={currentStatusIndex + 1} steps={orderSteps.map(s => ({label: s.label}))} />
            ) : (
                 <div className="text-center p-4 bg-destructive/10 rounded-lg text-destructive font-semibold">Order Status: {order.status}</div>
            )}
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {order.payment.method === 'cod' && (
            <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800 [&>svg]:text-yellow-500">
                <AlertTriangle className="h-4 w-4"/>
                <AlertTitle>Cash on Delivery Order</AlertTitle>
                <AlertDescription>
                    This is a COD order. Payment will be collected upon delivery. Please verify the order before processing.
                </AlertDescription>
            </Alert>
          )}
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
                    {order.payment.giftCard && (
                         <div className="flex justify-between text-blue-600">
                            <span>Gift Card ({order.payment.giftCard.code.substring(0,9)}...)</span>
                            <span className='font-semibold'>- ৳{order.payment.giftCard.usedAmount.toFixed(2)}</span>
                        </div>
                    )}
                     <Separator />
                     <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>৳{order.payment.total.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className='font-semibold'>{paymentMethodDisplay}</span>
                    </div>
                    {order.payment.method !== 'cod' && (
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment Status</span>
                            <span className='font-semibold capitalize'>{order.paymentDetails?.status || 'Unknown'}</span>
                        </div>
                    )}
                 </div>
             </CardContent>
          </Card>
           {trackingId && (
            <Card>
              <CardHeader>
                <CardTitle>Shipment Tracking</CardTitle>
                <CardDescription>
                  Live tracking updates for your shipment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleTrackPackage} disabled={isTrackingLoading}>
                  {isTrackingLoading ? "Tracking..." : "Track Package"}
                </Button>
                {trackingInfo.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {trackingInfo.map((update, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center ring-4 ring-primary/20">
                            <Truck className="h-3 w-3 text-white" />
                          </div>
                          {index < trackingInfo.length - 1 && (
                            <div className="w-px flex-1 bg-border" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{update.message_bn}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(update.time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
                        <SelectItem value="In-house Delivery">In-house Delivery</SelectItem>
                        <SelectItem value="In-Transit">In-Transit (Shipped)</SelectItem>
                        <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                        <SelectItem value="Received & Closed">Received & Closed</SelectItem>
                        <SelectItem value="Returning to Warehouse">Returning to Warehouse</SelectItem>
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
                    <CardTitle>Shipping Management</CardTitle>
                    <CardDescription>Create parcel for shipping and track it.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor='tracking-id'>Tracking ID</Label>
                        <Input id="tracking-id" placeholder="Tracking ID will appear here" value={trackingId} readOnly />
                    </div>
                     <Button className="w-full" variant="secondary" onClick={handleCreateParcel} disabled={!!trackingId || isCreatingParcel}>
                         <Truck className="mr-2 h-4 w-4"/> {isCreatingParcel ? "Creating..." : "Create RedX Parcel"}
                    </Button>
                </CardContent>
            </Card>
             {isRefundable && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Undo2 className="h-5 w-5"/> Refund Payment</CardTitle>
                        <CardDescription>Issue a full or partial refund for this bKash transaction.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="refund-amount">Refund Amount (Max: ৳{order.payment.total})</Label>
                            <Input id="refund-amount" type="number" placeholder="Enter amount" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} disabled={isRefunding} />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="refund-reason">Reason for Refund</Label>
                            <Input id="refund-reason" placeholder="e.g., Item returned" value={refundReason} onChange={e => setRefundReason(e.target.value)} disabled={isRefunding} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="destructive" className="w-full" onClick={handleRefund} disabled={isRefunding}>
                            {isRefunding ? 'Refunding...' : 'Process Refund'}
                        </Button>
                    </CardFooter>
                 </Card>
            )}
            <Card>
                 <CardHeader>
                    <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-3 max-h-48 overflow-y-auto">
                        {order.notes?.map(note => (
                            <div key={note.id} className="text-xs">
                                <p className="text-muted-foreground">{formatDate(note.date)} by <span className="font-semibold text-foreground">{note.author}</span></p>
                                <p>{note.note}</p>
                            </div>
                        ))}
                     </div>
                     <Textarea placeholder="Add a note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                     <Button size="sm" onClick={() => handleAddNote(newNote, user?.fullName || 'Admin')}>Add Note</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
