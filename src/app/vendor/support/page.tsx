
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import { SupportTicket } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function VendorSupportPage() {
  const { user, db } = useFirebase();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // New Ticket Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState<'Accounts' | 'Logistics' | 'General'>('General');
  const [message, setMessage] = useState('');


  const fetchTickets = async () => {
    if (!user || !db) return;
    setLoading(true);
    try {
      const ticketsRef = collection(db, 'supportTickets');
      const q = query(ticketsRef, where("vendorId", "==", user.uid), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ticketsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
      setTickets(ticketsList);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast({ title: 'Error', description: 'Could not fetch your support tickets.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user, db]);
  
  const handleCreateTicket = async () => {
    if (!user || !subject.trim() || !message.trim()) {
      toast({ title: 'Missing Information', description: 'Please fill out all fields.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
        await addDoc(collection(db, 'supportTickets'), {
            vendorId: user.uid,
            vendorName: user.fullName,
            subject,
            department,
            message,
            status: 'Open',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        toast({ title: 'Ticket Created', description: 'Your support ticket has been submitted.'});
        setIsDialogOpen(false);
        setSubject('');
        setMessage('');
        fetchTickets();
    } catch (error) {
         toast({ title: 'Error', description: 'Could not create your ticket.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">
            Create and track your support requests with our team.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New Ticket
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new support ticket</DialogTitle>
                    <DialogDescription>Describe your issue and we'll get back to you as soon as possible.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select value={department} onValueChange={(val) => setDepartment(val as any)}>
                            <SelectTrigger id="department"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="General">General Inquiry</SelectItem>
                                <SelectItem value="Accounts">Accounts & Payments</SelectItem>
                                <SelectItem value="Logistics">Logistics & Products</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={6} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleCreateTicket} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Ticket"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Tickets</CardTitle>
          <CardDescription>
            A list of all your support tickets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading your tickets...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length > 0 ? tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id.substring(0, 7)}...</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.department}</TableCell>
                    <TableCell>{formatDate(ticket.updatedAt)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(getStatusBadgeClass(ticket.status))}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/support/${ticket.id}`}>View</Link>
                        </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                     <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                            You have not created any support tickets yet.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
