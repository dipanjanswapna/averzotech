
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface GiftCard {
  id: string;
  code: string;
  recipientEmail: string;
  initialValue: number;
  currentBalance: number;
  status: 'Active' | 'Used' | 'Expired' | 'Disabled';
  expiryDate: string;
}

export default function MyGiftCardsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        const fetchGiftCards = async () => {
            setLoading(true);
            try {
                const giftCardsRef = collection(db, 'giftCards');
                const q = query(giftCardsRef, where("recipientEmail", "==", user.email));
                const querySnapshot = await getDocs(q);
                const cardsList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    let status = data.status;

                    const expiryDate = new Date(data.expiryDate);
                    expiryDate.setHours(23, 59, 59, 999);

                    if (status === 'Active' && expiryDate < new Date()) {
                        status = 'Expired';
                    }
                    if (status === 'Active' && data.currentBalance <= 0) {
                        status = 'Used';
                    }
                    return {
                        id: doc.id,
                        ...data,
                        status,
                    } as GiftCard
                });
                setGiftCards(cardsList);
            } catch (error) {
                console.error("Error fetching gift cards:", error);
                toast({ title: "Error", description: "Could not fetch your gift cards.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        fetchGiftCards();
    }, [user, toast]);
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
        title: "Copied!",
        description: "Gift card code copied to clipboard.",
        });
    };

    const getStatusBadgeVariant = (status: GiftCard['status']) => {
        switch(status) {
            case 'Active': return 'default';
            case 'Used': return 'secondary';
            case 'Expired': 
            case 'Disabled': 
                return 'destructive';
            default: return 'outline';
        }
    }

    const getStatusBadgeClass = (status: GiftCard['status']) => {
        switch(status) {
            case 'Active': return 'bg-green-100 text-green-800';
            default: return '';
        }
    }


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Gift Cards</h1>
                    <p className="text-muted-foreground">View and manage your gift cards.</p>
                </div>
            </div>
            {loading ? (
                <p>Loading your gift cards...</p>
            ) : giftCards.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {giftCards.map((card) => (
                        <Card key={card.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2"><Gift className="w-5 h-5 text-primary"/> Gift Card</CardTitle>
                                         <p className="text-sm font-mono text-muted-foreground mt-1">{card.code}</p>
                                    </div>
                                    <Badge variant={getStatusBadgeVariant(card.status)} className={getStatusBadgeClass(card.status)}>
                                        {card.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-sm text-muted-foreground">Current Balance</span>
                                        <span className="text-2xl font-bold">৳{card.currentBalance.toLocaleString()}</span>
                                    </div>
                                    <Progress value={(card.currentBalance / card.initialValue) * 100} className="h-2"/>
                                    <p className="text-xs text-muted-foreground text-right mt-1">Initial: ৳{card.initialValue.toLocaleString()}</p>
                                </div>
                                 <div className="text-xs text-muted-foreground">
                                    Expires on: {new Date(card.expiryDate).toLocaleDateString()}
                                </div>
                            </CardContent>
                            <CardContent>
                                <Button variant="secondary" className="w-full" onClick={() => copyToClipboard(card.code)}>
                                    <Copy className="mr-2 h-4 w-4"/> Copy Code
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            ) : (
                <div className="col-span-full text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                    <p>You do not have any gift cards associated with your email.</p>
                </div>
            )}
        </div>
    );
}
