
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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface GiftCard {
  id: string;
  code: string;
  initialValue: number;
  currentBalance: number;
  customer: string;
  status: 'Partially Used' | 'Active' | 'Used' | 'Expired';
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
        const giftCardSnapshot = await getDocs(giftCardsCollection);
        const giftCardList = giftCardSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as GiftCard));
        setGiftCards(giftCardList);
      } catch (error) {
        console.error("Error fetching gift cards: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftCards();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Gift card code copied to clipboard.",
    });
  };

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
                  <TableHead>Customer</TableHead>
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
                          <span>{card.code.substring(0, 14)}...</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(card.code)}>
                              <Copy className="h-3 w-3" />
                          </Button>
                      </div>
                    </TableCell>
                    <TableCell>{card.customer}</TableCell>
                     <TableCell>
                         <div className="flex flex-col gap-1">
                             <span>৳{card.currentBalance.toLocaleString()} / ৳{card.initialValue.toLocaleString()}</span>
                             <Progress value={(card.currentBalance/card.initialValue) * 100} className="h-1" />
                         </div>
                      </TableCell>
                     <TableCell>
                      <Badge
                        variant={
                          card.status === 'Active' || card.status === 'Partially Used' ? 'default' :
                          card.status === 'Used' ? 'secondary' : 'destructive'
                        }
                         className={card.status === 'Active' || card.status === 'Partially Used' ? 'bg-blue-100 text-blue-800' : ''}
                      >
                        {card.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{card.expiryDate}</TableCell>
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
