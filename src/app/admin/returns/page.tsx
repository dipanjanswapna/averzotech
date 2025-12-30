
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
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/firebase';

interface ReturnRequest {
  id: string;
  orderId: string;
  userName: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processing' | 'Completed';
  createdAt: any;
  items: { name: string; quantity: number }[];
}

export default function ReturnsPage() {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { db } = useFirebase();

  useEffect(() => {
    if (!db) return;
    const fetchReturnRequests = async () => {
      setLoading(true);
      try {
        const returnsCollection = collection(db, 'returns');
        const q = query(returnsCollection, orderBy('createdAt', 'desc'));
        const requestSnapshot = await getDocs(q);
        const requestList = requestSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ReturnRequest));
        setRequests(requestList);
      } catch (error) {
        console.error("Error fetching return requests: ", error);
        toast({ title: "Error", description: "Could not fetch return requests.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchReturnRequests();
  }, [toast, db]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-primary/20 text-primary';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Return Requests</h1>
        <p className="text-muted-foreground">
          Manage and process customer return and exchange requests.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Return Requests</CardTitle>
          <CardDescription>
            Review incoming requests and update their status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading requests...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.id.substring(0, 7)}...</TableCell>
                    <TableCell>
                      <Link href={`/admin/orders/${req.orderId}`} className="text-primary hover:underline">{req.orderId.substring(0, 7)}...</Link>
                    </TableCell>
                    <TableCell>{req.userName}</TableCell>
                    <TableCell>{req.items.reduce((sum, i) => sum + i.quantity, 0)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(getStatusBadgeClass(req.status))}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(req.createdAt)}</TableCell>
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
                                <Link href={`/admin/returns/edit/${req.id}`}>Edit</Link>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
           {requests.length === 0 && !loading && (
             <div className="text-center p-8 text-muted-foreground">
                No return requests found.
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
