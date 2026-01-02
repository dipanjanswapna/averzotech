
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, collection, query, orderBy, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useFirebase } from '@/firebase/provider';
import { SupportTicket, TicketReply } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function AdminTicketDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const ticketId = params.ticketId as string;
    const { toast } = useToast();
    const { user, db } = useFirebase();
    
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [replies, setReplies] = useState<TicketReply[]>([]);
    const [loading, setLoading] = useState(true);
    const [newReply, setNewReply] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    useEffect(() => {
        if (ticketId && db) {
            const ticketRef = doc(db, 'supportTickets', ticketId);
            const repliesRef = collection(db, 'supportTickets', ticketId, 'replies');
            const qReplies = query(repliesRef, orderBy('createdAt', 'asc'));

            const unsubscribeTicket = onSnapshot(ticketRef, (docSnap) => {
                if (docSnap.exists()) {
                    setTicket({ id: docSnap.id, ...docSnap.data() } as SupportTicket);
                } else {
                    toast({ title: "Error", description: "Ticket not found.", variant: "destructive" });
                    router.push('/admin/support');
                }
                setLoading(false);
            });
            
             const unsubscribeReplies = onSnapshot(qReplies, (snapshot) => {
                const repliesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TicketReply));
                setReplies(repliesData);
            });

            return () => {
                unsubscribeTicket();
                unsubscribeReplies();
            };
        }
    }, [ticketId, toast, router, db]);

    const handleAddReply = async () => {
        if (!user || !newReply.trim() || !ticket) return;
        setIsReplying(true);
        try {
            const repliesRef = collection(db, 'supportTickets', ticket.id, 'replies');
            await addDoc(repliesRef, {
                authorId: user.uid,
                authorName: user.fullName,
                message: newReply,
                createdAt: serverTimestamp(),
            });

            const ticketRef = doc(db, 'supportTickets', ticket.id);
            await updateDoc(ticketRef, {
                status: 'In Progress',
                updatedAt: serverTimestamp(),
            });

            setNewReply('');
            toast({ title: "Reply Sent" });

        } catch (error) {
            console.error("Error sending reply:", error);
            toast({ title: 'Error', description: 'Could not send reply.', variant: 'destructive'});
        } finally {
            setIsReplying(false);
        }
    };
    
    const handleStatusChange = async (status: string) => {
        if (!ticket) return;
         try {
            const ticketRef = doc(db, 'supportTickets', ticket.id);
            await updateDoc(ticketRef, { status: status, updatedAt: serverTimestamp() });
            toast({ title: 'Status Updated', description: `Ticket marked as ${status}.`});
         } catch(error) {
            console.error("Error updating status:", error);
            toast({ title: 'Error', description: 'Could not update status.', variant: 'destructive'});
         }
    };

    if (loading) return <p className="p-8">Loading ticket...</p>;
    if (!ticket) return null;

    const formatDate = (timestamp: any) => {
        if (!timestamp?.seconds) return 'now';
        return new Date(timestamp.seconds * 1000).toLocaleString();
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-yellow-100 text-yellow-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Closed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/support">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Support Ticket #{ticket.id.substring(0, 7)}</h1>
                    <p className="text-muted-foreground text-sm">From: {ticket.vendorName}</p>
                </div>
                <Badge variant="outline" className={cn("ml-auto capitalize", getStatusBadgeClass(ticket.status))}>
                    {ticket.status}
                </Badge>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{ticket.subject}</CardTitle>
                    <CardDescription>Department: {ticket.department} | Opened: {formatDate(ticket.createdAt)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="border bg-secondary/50 p-4 rounded-lg">
                        <p className="text-sm">{ticket.message}</p>
                    </div>

                    <Separator />
                    
                     <div className="space-y-4">
                        <h3 className="font-semibold">Conversation</h3>
                        {replies.map(reply => (
                            <div key={reply.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{reply.authorName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-sm">{reply.authorName}</p>
                                        <p className="text-xs text-muted-foreground">{formatDate(reply.createdAt)}</p>
                                    </div>
                                    <div className="p-3 bg-background border rounded-md mt-1 text-sm">{reply.message}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                     <div className="space-y-2 pt-4 border-t">
                        <Label htmlFor="new-reply">Your Reply</Label>
                        <Textarea id="new-reply" placeholder="Type your response here..." value={newReply} onChange={e => setNewReply(e.target.value)} />
                        <Button onClick={handleAddReply} disabled={isReplying || !newReply.trim()}>
                            {isReplying ? 'Sending...' : 'Send Reply'}
                        </Button>
                     </div>
                </CardContent>
                 <CardFooter className="flex justify-end gap-4">
                    <Select onValueChange={handleStatusChange} defaultValue={ticket.status}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                 </CardFooter>
            </Card>
        </div>
    )
}
