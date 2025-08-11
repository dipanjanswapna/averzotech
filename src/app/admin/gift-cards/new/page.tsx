
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, CalendarIcon, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';


export default function NewGiftCardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [recipientEmail, setRecipientEmail] = useState('');
  const [initialValue, setInitialValue] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleIssueCard = async () => {
    if (!recipientEmail || !initialValue || !expiryDate) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Generate a unique, url-friendly gift card code
      const code = `AVZO-${nanoid(4)}-${nanoid(4)}-${nanoid(4)}`.toUpperCase();

      await addDoc(collection(db, 'giftCards'), {
        code,
        recipientEmail,
        initialValue: parseFloat(initialValue),
        currentBalance: parseFloat(initialValue),
        expiryDate: expiryDate.toISOString().split('T')[0],
        message,
        status: 'Active',
        history: [], // To track usage later
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: 'Gift Card Issued!',
        description: `A gift card worth ৳${initialValue} has been issued to ${recipientEmail}.`,
      });
      
      router.push('/admin/gift-cards');

    } catch (error: any) {
      console.error('Error issuing gift card: ', error);
      toast({
        title: 'Error',
        description: 'There was a problem issuing the gift card.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/gift-cards">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Issue New Gift Card</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gift Card Details</CardTitle>
          <CardDescription>
            Fill in the details to issue a new gift card to a customer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient-email">Recipient Email</Label>
            <Input
              id="recipient-email"
              type="email"
              placeholder="customer@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="initial-value">Initial Value (৳)</Label>
                <Input
                id="initial-value"
                type="number"
                placeholder="e.g. 1000"
                value={initialValue}
                onChange={(e) => setInitialValue(e.target.value)}
                disabled={isLoading}
                />
            </div>
            <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !expiryDate && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={expiryDate}
                        onSelect={setExpiryDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="personal-message">Personal Message (Optional)</Label>
            <Textarea
              id="personal-message"
              placeholder="e.g. Happy Birthday! Hope you enjoy this."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
             <Button variant="outline" disabled={isLoading} onClick={() => router.back()}>Cancel</Button>
             <Button onClick={handleIssueCard} disabled={isLoading}>
                {isLoading ? 'Issuing Card...' : 'Issue Gift Card'}
             </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

