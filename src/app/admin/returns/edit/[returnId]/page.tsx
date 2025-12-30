
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Camera } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ReturnItem {
    id: string;
    name: string;
    image: string;
    quantity: number;
    reason: string;
    comment: string;
    photoUrl?: string;
}

interface ReturnRequest {
    id: string;
    orderId: string;
    userId: string;
    userName: string;
    items: ReturnItem[];
    status: 'Pending' | 'Approved' | 'Rejected' | 'Processing' | 'Completed';
    createdAt: any;
    notes?: { author: string; note: string; date: any }[];
}

export default function ReturnDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const returnId = params.returnId as string;
    const { toast } = useToast();
    const { user } = useAuth();
    
    const [request, setRequest] = useState<ReturnRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [newStatus, setNewStatus] = useState('');
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        if (returnId) {
            const returnRef = doc(db, 'returns', returnId);
            const notesRef = collection(db, 'returns', returnId, 'notes');
            const qNotes = query(notesRef, orderBy('date', 'asc'));

            const unsubscribeReturn = onSnapshot(returnRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() } as ReturnRequest;
                    setRequest(prev => ({...prev, ...data}));
                    setNewStatus(data.status);
                } else {
                    toast({ title: "Error", description: "Return request not found.", variant: "destructive" });
                    router.push('/admin/returns');
                }
                setLoading(false);
            });
            
             const unsubscribeNotes = onSnapshot(qNotes, (snapshot) => {
                const notesData = snapshot.docs.map(doc => doc.data() as {author: string, note: string, date: any});
                setRequest(prev => prev ? { ...prev, notes: notesData } : null);
            });

            return () => {
                unsubscribeReturn();
                unsubscribeNotes();
            };
        }
    }, [returnId, toast, router]);

    const handleUpdateStatus = async () => {
        if (!request || !newStatus || newStatus === request.status) return;

        const returnRef = doc(db, 'returns', returnId);
        try {
            await updateDoc(returnRef, { status: newStatus, updatedAt: serverTimestamp() });
            const noteContent = `Status changed from ${request.status} to ${newStatus}.`;
            await handleAddNote(noteContent, user?.fullName || 'Admin');
            toast({ title: "Status Updated", description: "The return request status has been updated." });
        } catch (error) {
            console.error("Error updating status:", error);
            toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
        }
    };
    
    const handleAddNote = async (noteContent: string, author: string) => {
        if (!request || !noteContent.trim()) return;
        const notesCollection = collection(db, 'returns', request.id, 'notes');
        try {
            await addDoc(notesCollection, { note: noteContent, author: author, date: serverTimestamp() });
            setNewNote('');
            toast({ title: "Note Added" });
        } catch (error) {
             toast({ title: "Error", description: "Failed to add note.", variant: "destructive" });
        }
    };

    if (loading) return <p>Loading return request...</p>;
    if (!request) return null;

    const formatDate = (timestamp: any) => {
        if (!timestamp || !timestamp.seconds) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleString();
    };
    
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

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/returns">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Return Request #{request.id.substring(0, 7)}</h1>
                    <p className="text-muted-foreground text-sm">From order <Link href={`/admin/orders/${request.orderId}`} className="text-primary hover:underline">#{request.orderId.substring(0,7)}</Link></p>
                </div>
                <Badge variant="outline" className={cn("ml-auto", getStatusBadgeClass(request.status))}>
                    {request.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader><CardTitle>Items to Return</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {request.items.map(item => (
                                <div key={item.id} className="border p-4 rounded-lg">
                                    <div className="flex items-start gap-4">
                                        <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md" />
                                        <div className="flex-1">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                            <p className="text-sm font-bold">Reason: {item.reason}</p>
                                            {item.comment && <p className="text-sm text-muted-foreground mt-2">"{item.comment}"</p>}
                                        </div>
                                         {item.photoUrl && (
                                             <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm"><Camera className="mr-2 h-4 w-4"/>View Photo</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <Image src={item.photoUrl} alt="Customer provided photo" width={500} height={500} className="rounded-md mx-auto" />
                                                </DialogContent>
                                             </Dialog>
                                         )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Internal Notes</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-3 max-h-48 overflow-y-auto">
                                {request.notes?.map((note, index) => (
                                    <div key={index} className="text-xs bg-secondary/50 p-2 rounded-md">
                                        <p className="text-muted-foreground">{formatDate(note.date)} by <span className="font-semibold text-foreground">{note.author}</span></p>
                                        <p>{note.note}</p>
                                    </div>
                                ))}
                             </div>
                             <div className="space-y-2">
                                <Textarea placeholder="Add a note for your team..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                                <Button size="sm" onClick={() => handleAddNote(newNote, user?.fullName || 'Admin')}>Add Note</Button>
                             </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-8 sticky top-24">
                    <Card>
                        <CardHeader><CardTitle>Customer Details</CardTitle></CardHeader>
                        <CardContent>
                            <p className="font-semibold">{request.userName}</p>
                            <p className="text-sm text-muted-foreground">{request.userId}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
                        <CardContent>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                    <SelectItem value="Processing">Processing</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleUpdateStatus}>Update Status</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
