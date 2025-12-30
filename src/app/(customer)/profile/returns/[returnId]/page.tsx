
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Camera } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useFirebase } from '@/firebase/provider';

interface ReturnItem {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
    reason: string;
    comment: string;
    photoUrl?: string;
}

interface ReturnRequest {
    id: string;
    orderId: string;
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
    const { db } = useFirebase();
    
    const [request, setRequest] = useState<ReturnRequest | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (returnId && db) {
            const returnRef = doc(db, 'returns', returnId);
            const notesRef = collection(db, 'returns', returnId, 'notes');
            const qNotes = query(notesRef, orderBy('date', 'asc'));

            const unsubscribeReturn = onSnapshot(returnRef, (docSnap) => {
                if (docSnap.exists()) {
                    setRequest({ id: docSnap.id, ...docSnap.data() } as ReturnRequest);
                } else {
                    toast({ title: "Error", description: "Return request not found.", variant: "destructive" });
                    router.push('/profile/returns');
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
    }, [returnId, toast, router, db]);

    if (loading) return <p>Loading return request details...</p>;
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
                    <Link href="/profile/returns">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Return Request #{request.id.substring(0, 7)}</h1>
                    <p className="text-muted-foreground text-sm">From order <Link href={`/order-confirmation?orderId=${request.orderId}`} className="text-primary hover:underline">#{request.orderId.substring(0,7)}</Link></p>
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
                </div>

                <div className="lg:col-span-1 space-y-8 sticky top-24">
                     <Card>
                        <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-3 max-h-96 overflow-y-auto">
                                <div className="text-xs">
                                    <p className="font-semibold text-foreground">Request Created</p>
                                    <p className="text-muted-foreground">{formatDate(request.createdAt)}</p>
                                </div>
                                {request.notes?.map((note, index) => (
                                    <div key={index} className="text-xs">
                                        <p className="font-semibold text-foreground">{note.note}</p>
                                        <p className="text-muted-foreground">{formatDate(note.date)} by <span className="font-medium text-foreground">{note.author}</span></p>
                                    </div>
                                ))}
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
