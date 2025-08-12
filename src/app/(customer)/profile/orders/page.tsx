
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

export default function MyOrdersPage() {
  const orders = [
    {
      id: 'ORD75649',
      date: 'June 1, 2024',
      status: 'Delivered',
      total: 2599,
    },
    {
      id: 'ORD89421',
      date: 'May 25, 2024',
      status: 'Cancelled',
      total: 1250,
    },
     {
      id: 'ORD91234',
      date: 'June 5, 2024',
      status: 'Processing',
      total: 4500,
    },
  ];
  
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Delivered':
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
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Processing':
                return 'bg-blue-100 text-blue-800';
            default:
                return '';
        }
    };


  return (
    <Card>
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
        <CardDescription>
          View your order history and track current orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
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
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
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
                <TableCell className="text-right">
                   <Button variant="outline" size="sm" asChild>
                    <Link href="#">View Details</Link>
                   </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
