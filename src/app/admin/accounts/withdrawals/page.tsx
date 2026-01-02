
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
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/firebase';
import { WithdrawalRequest } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';


export default function WithdrawalRequestsPage() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { db } = useFirebase();
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [newStatus, setNewStatus] = useState<'Processing' | 'Completed' | 'Rejected'>('Processing');
  const [transactionId, setTransactionId] = useState('');

  const fetchRequests = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const reqCollection = collection(db, 'withdrawalRequests');
      const q = query(reqCollection, orderBy('requestedAt', 'desc'));
      const reqSnapshot = await getDocs(q);
      const reqList = reqSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as WithdrawalRequest));
      setRequests(reqList);
    } catch (error) {
      console.error("Error fetching withdrawal requests: ", error);
      toast({ title: "Error", description: "Could not fetch requests.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [db]);
  
  const handleUpdateStatus = async () => {
      if (!selectedRequest || !db) return;

      const docRef = doc(db, 'withdrawalRequests', selectedRequest.id);
      try {
          await updateDoc(docRef, {
              status: newStatus,
              processedAt: serverTimestamp(),
              ...(newStatus === 'Completed' && { transactionId: transactionId })
          });
          toast({ title: 'Status Updated', description: `Request status set to ${newStatus}.` });
          fetchRequests(); // Refresh list
          setSelectedRequest(null); // Close dialog
      } catch (error) {
           toast({ title: 'Update Failed', description: 'Could not update request status.', variant: 'destructive' });
      }
  }


  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return '';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
        <p>Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
        <p className="text-muted-foreground">
          Review and process fund withdrawal requests from vendors.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>
            A list of all pending and processed withdrawal requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono text-xs">{req.id.substring(0,10)}...</TableCell>
                  <TableCell className="font-medium">{req.vendorName}</TableCell>
                  <TableCell>{formatDate(req.requestedAt)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(getStatusBadgeClass(req.status))}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ৳{req.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <AlertDialog open={selectedRequest?.id === req.id} onOpenChange={(isOpen) => !isOpen && setSelectedRequest(null)}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <AlertDialogTrigger asChild>
                             <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setSelectedRequest(req); setNewStatus(req.status as any); }}>Update Status</DropdownMenuItem>
                           </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                       <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Update Request #{selectedRequest?.id.substring(0,7)}</AlertDialogTitle>
                                <AlertDialogDescription>Change the status of this withdrawal request.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-4">
                               <Select value={newStatus} onValueChange={(val) => setNewStatus(val as any)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Processing">Processing</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                    </SelectContent>
                               </Select>
                               {newStatus === 'Completed' && (
                                   <Input placeholder="Enter Transaction ID" value={transactionId} onChange={e => setTransactionId(e.target.value)} />
                               )}
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleUpdateStatus}>Save</AlertDialogAction>
                            </AlertDialogFooter>
                       </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                        No withdrawal requests found.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
