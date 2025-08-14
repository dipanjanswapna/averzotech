
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
import { MoreHorizontal, PlusCircle, Copy, Trash2, Pencil, ToggleRight, ToggleLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
} from "@/components/ui/alert-dialog"
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
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

  const fetchGiftCards = async () => {
    setLoading(true);
    try {
      const giftCardsCollection = collection(db, 'giftCards');
      const q = query(giftCardsCollection, orderBy('createdAt', 'desc'));
      const giftCardSnapshot = await getDocs(q);
      const giftCardList = giftCardSnapshot.docs.map(doc => {
          const data = doc.data();
          let status: GiftCard['status'] = data.status;

          // Only check for expiry if the card is currently Active
          if (status === 'Active') {
            const expiryDate = new Date(data.expiryDate);
            expiryDate.setHours(23, 59, 59, 999); 
            if (expiryDate < new Date()) {
                status = 'Expired';
            }
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

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Gift card code copied to clipboard.",
    });
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteDoc(doc(db, "giftCards", cardId));
      toast({
        title: "Gift Card Deleted",
        description: "The gift card has been removed.",
      });
      fetchGiftCards();
    } catch (error) {
       console.error("Error deleting gift card: ", error);
       toast({ title: "Error", description: "Could not delete the gift card.", variant: 'destructive' });
    }
  };

  const handleToggleStatus = async (card: GiftCard) => {
      const newStatus = card.status === 'Disabled' ? 'Active' : 'Disabled';
      const cardRef = doc(db, 'giftCards', card.id);
      try {
          await updateDoc(cardRef, { status: newStatus });
          toast({ title: "Status Updated", description: `Card is now ${newStatus}.` });
          fetchGiftCards();
      } catch (error) {
          console.error("Error updating status: ", error);
          toast({ title: "Error", description: "Failed to update card status.", variant: "destructive" });
      }
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
        case 'Disabled': return 'bg-gray-100 text-gray-800 border-gray-300';
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
                       <AlertDialog>
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
                              <DropdownMenuItem asChild>
                                 <Link href={`/admin/gift-cards/edit/${card.id}`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(card)} disabled={card.status === 'Expired' || card.status === 'Used'}>
                                {card.status === 'Disabled' ? <ToggleRight className="mr-2 h-4 w-4" /> : <ToggleLeft className="mr-2 h-4 w-4" />}
                                {card.status === 'Disabled' ? 'Enable' : 'Disable'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                               <AlertDialogTrigger asChild>
                                 <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                               </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                           <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the gift card <span className="font-bold">{card.code}</span>.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteCard(card.id)} className="bg-destructive hover:bg-destructive/90">
                                      Continue
                                  </AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                       </AlertDialog>
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
