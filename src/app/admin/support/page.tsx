
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
import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { cn } from '@/lib/utils';
import { SupportTicket } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function AdminSupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = useFirebase();
  const { toast } = useToast();

  useEffect(() => {
    if (!db) return;

    setLoading(true);
    const ticketsQuery = query(collection(db, 'supportTickets'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(ticketsQuery, (snapshot) => {
        const ticketList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
        setTickets(ticketList);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching tickets: ", error);
        toast({ title: "Error", description: "Could not fetch support tickets.", variant: "destructive" });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [db, toast]);

  const { openTickets, inProgressTickets, closedTickets } = useMemo(() => {
    return {
      openTickets: tickets.filter(t => t.status === 'Open'),
      inProgressTickets: tickets.filter(t => t.status === 'In Progress'),
      closedTickets: tickets.filter(t => t.status === 'Closed'),
    };
  }, [tickets]);


  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <p>Loading tickets from vendors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage and respond to support tickets from vendors.
          </p>
        </div>
      </div>

       <Tabs defaultValue="open" className="w-full">
        <TabsList>
            <TabsTrigger value="open">
                Open ({openTickets.length})
                {openTickets.length > 0 && <span className="relative flex h-3 w-3 ml-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span></span>}
            </TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({inProgressTickets.length})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({closedTickets.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="open">
            <TicketTable title="Open Tickets" description="These tickets are awaiting a response." tickets={openTickets} />
        </TabsContent>
        <TabsContent value="in-progress">
             <TicketTable title="In Progress" description="These tickets are currently being worked on." tickets={inProgressTickets} />
        </TabsContent>
        <TabsContent value="closed">
             <TicketTable title="Closed" description="A history of all resolved tickets." tickets={closedTickets} />
        </TabsContent>
        </Tabs>
    </div>
  );
}

function TicketTable({ title, description, tickets }: { title: string, description: string, tickets: SupportTicket[]}) {
    
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-yellow-100 text-yellow-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Closed': return 'bg-green-100 text-green-800';
            default: return '';
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp || !timestamp.seconds) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleString();
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
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Vendor</TableHead>
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
                        <TableCell className="font-mono text-xs">{ticket.id.substring(0, 7)}...</TableCell>
                        <TableCell className="font-medium">{ticket.vendorName}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>{ticket.department}</TableCell>
                        <TableCell>{formatDate(ticket.updatedAt || ticket.createdAt)}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={cn("capitalize", getStatusBadgeClass(ticket.status))}>
                            {ticket.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/support/${ticket.id}`}>
                                    View
                                </Link>
                           </Button>
                        </TableCell>
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center h-24">
                            No tickets found in this category.
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    )
}
