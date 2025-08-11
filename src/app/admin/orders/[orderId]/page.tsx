
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
import { ChevronLeft, Copy, Package, Truck, User, FileText } from 'lucide-react';
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

// Mock data for a single order
const order = {
  orderId: 'ORD-001',
  date: '2023-11-23',
  status: 'Fulfilled',
  total: 2499.0,
  customer: {
    name: 'Kamal Hasan',
    email: 'kamal.h@example.com',
    phone: '+8801712345678',
    shippingAddress: 'House 123, Road 4, Block F, Banani, Dhaka, 1213, Bangladesh',
  },
  items: [
    {
      id: 'prod-001',
      name: 'Graphic Print T-Shirt',
      image: 'https://placehold.co/64x64.png',
      dataAiHint: 'men graphic t-shirt',
      sku: 'TSH-GR-BLK-M',
      price: 1299,
      quantity: 1,
    },
    {
      id: 'prod-002',
      name: 'Embroidered Kurta',
      image: 'https://placehold.co/64x64.png',
      dataAiHint: 'woman ethnic wear',
      sku: 'KUR-EMB-RED-L',
      price: 1200,
      quantity: 1,
    },
  ],
  payment: {
    method: 'Cash on Delivery',
    subtotal: 2499,
    shipping: 60,
    tax: 0,
    total: 2559,
  },
  notes: [
      { id: 1, author: 'Admin', date: '2023-11-23 11:00 AM', note: 'Customer called to confirm the address. Address verified.'},
      { id: 2, author: 'System', date: '2023-11-23 10:05 AM', note: 'Order status changed from Pending to Processing.'},
  ]
};

const orderSteps = [
    { label: 'Order Placed', date: 'Nov 23, 2023 10:00 AM' },
    { label: 'Processing', date: 'Nov 23, 2023 10:05 AM' },
    { label: 'Shipped', date: 'Nov 23, 2023 05:00 PM' },
    { label: 'Delivered', date: 'Nov 24, 2023 02:00 PM' }
];
const currentStatusIndex = orderSteps.findIndex(step => step.label === (order.status === 'Fulfilled' ? 'Delivered' : order.status)) + 1;


export default function OrderDetailsPage({ params }: { params: { orderId: string } }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/orders">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
            <h1 className="text-2xl font-bold">Order {params.orderId}</h1>
            <p className="text-muted-foreground text-sm">Date: {order.date}</p>
        </div>
      </div>
        <div className="mx-auto w-full max-w-5xl">
            <Stepper initialStep={0} activeStep={currentStatusIndex} steps={orderSteps.map(s => ({label: s.label, description: s.date}))} />
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
                            src={item.image}
                            width="64"
                            data-ai-hint={item.dataAiHint}
                            />
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
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
                    <p className="font-semibold">{order.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                    <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                    <Separator className="my-4"/>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <address className="text-sm not-italic text-muted-foreground">
                        {order.customer.shippingAddress}
                    </address>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Update Status</CardTitle>
                </CardHeader>
                <CardContent>
                     <Select defaultValue={order.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                </CardContent>
                 <CardFooter>
                    <Button className="w-full">Update Order</Button>
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
                                <p className="text-muted-foreground">{note.date} by <span className="font-semibold text-foreground">{note.author}</span></p>
                                <p>{note.note}</p>
                            </div>
                        ))}
                     </div>
                     <Textarea placeholder="Add a note..."/>
                     <Button size="sm">Add Note</Button>
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
