
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
import { MoreHorizontal, PlusCircle, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface GiftCard {
  id: string;
  code: string;
  recipientEmail: string;
  initialValue: number;
  currentBalance: number;
  status: 'Active' | 'Used' | 'Expired' | 'Disabled';
  expiryDate: string;
}

export default function GiftCardsPage() {
  const { toast } = useToast();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGiftCards = async () => {
      setLoading(true);
      try {
        const giftCardsCollection = collection(db, 'giftCards');
        const q = query(giftCardsCollection, orderBy('createdAt', 'desc'));
        const giftCardSnapshot = await getDocs(q);
        const giftCardList = giftCardSnapshot.docs.map(doc => {
            const data = doc.data();
            let status = data.status;
            if (status === 'Active' && new Date(data.expiryDate) < new Date()) {
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
        setGiftCards(giftCardList);
      } catch (error) {
        console.error("Error fetching gift cards: ", error);
        toast({ title: "Error", description: "Could not fetch gift cards.", variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchGiftCards();
  }, [toast]);

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gift Cards</h1>
          <p className="text-muted-foreground">
            Issue and manage gift cards for your customers.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/gift-cards/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Issue Gift Card
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Gift Cards</CardTitle>
          <CardDescription>
            A list of all issued gift cards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading gift cards...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires On</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {giftCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="font-mono text-xs">
                       <div className="flex items-center gap-2">
                          <span>{card.code}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(card.code)}>
                              <Copy className="h-3 w-3" />
                          </Button>
                      </div>
                    </TableCell>
                    <TableCell>{card.recipientEmail}</TableCell>
                     <TableCell>
                         <div className="flex flex-col gap-1">
                             <span>৳{card.currentBalance.toLocaleString()} / ৳{card.initialValue.toLocaleString()}</span>
                             <Progress value={(card.currentBalance/card.initialValue) * 100} className="h-1" />
                         </div>
                      </TableCell>
                     <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(card.status)}
                        className={getStatusBadgeClass(card.status)}
                      >
                        {card.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(card.expiryDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Resend to Customer</DropdownMenuItem>
                           <DropdownMenuItem className="text-red-600">Disable Card</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
