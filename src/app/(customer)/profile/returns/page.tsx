
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
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Undo2 } from 'lucide-react';

interface ReturnRequest {
  id: string;
  orderId: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processing' | 'Completed';
  createdAt: any;
  items: { name: string; quantity: number }[];
}

export default function MyReturnsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchReturnRequests = async () => {
      setLoading(true);
      try {
        const returnsRef = collection(db, 'returns');
        const q = query(returnsRef, where("userId", "==", user.uid), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const requestsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ReturnRequest));
        setRequests(requestsList);
      } catch (error) {
        console.error("Error fetching return requests:", error);
        toast({ title: "Error", description: "Could not fetch your return requests.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchReturnRequests();
  }, [user, toast]);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Returns</h1>
          <p className="text-muted-foreground">View the status of your return requests.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Return History</CardTitle>
          <CardDescription>
            A list of all your return and exchange requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading your return history...</p>
          ) : requests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
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
                        <Link href={`/order-confirmation?orderId=${req.orderId}`} className="text-primary hover:underline">
                            {req.orderId.substring(0, 7)}...
                        </Link>
                    </TableCell>
                    <TableCell>{formatDate(req.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(getStatusBadgeClass(req.status))}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{req.items.reduce((sum, i) => sum + i.quantity, 0)}</TableCell>
                    <TableCell>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/profile/returns/${req.id}`}>View Details</Link>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="col-span-full text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                <Undo2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No Return Requests Found</h3>
                <p className="mt-1 text-sm">You haven't made any return requests yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
