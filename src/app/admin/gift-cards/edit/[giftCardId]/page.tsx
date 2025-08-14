
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
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
import { ChevronLeft, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function EditGiftCardPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const giftCardId = params.giftCardId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Gift Card Fields
  const [code, setCode] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [initialValue, setInitialValue] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Active');


  useEffect(() => {
    if (!giftCardId) return;

    const fetchGiftCard = async () => {
      setIsFetching(true);
      try {
        const docRef = doc(db, 'giftCards', giftCardId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCode(data.code);
          setRecipientEmail(data.recipientEmail);
          setInitialValue(String(data.initialValue));
          setCurrentBalance(String(data.currentBalance));
          setExpiryDate(new Date(data.expiryDate));
          setMessage(data.message || '');
          setStatus(data.status || 'Active');
        } else {
          toast({ title: 'Error', description: 'Gift card not found.', variant: 'destructive' });
          router.push('/admin/gift-cards');
        }
      } catch (error) {
        console.error('Error fetching gift card:', error);
        toast({ title: 'Error', description: 'Failed to fetch gift card details.', variant: 'destructive' });
      } finally {
        setIsFetching(false);
      }
    };
    fetchGiftCard();
  }, [giftCardId, router, toast]);

  const handleUpdateCard = async () => {
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
      const docRef = doc(db, 'giftCards', giftCardId);
      await updateDoc(docRef, {
        recipientEmail,
        initialValue: parseFloat(initialValue),
        currentBalance: parseFloat(currentBalance),
        expiryDate: expiryDate.toISOString().split('T')[0],
        message,
        status,
      });
      
      toast({
        title: 'Gift Card Updated!',
        description: 'The gift card details have been successfully updated.',
      });
      
      router.push('/admin/gift-cards');

    } catch (error: any) {
      console.error('Error updating gift card: ', error);
      toast({
        title: 'Error',
        description: 'There was a problem updating the gift card.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isFetching) {
      return <div className="p-8">Loading gift card details...</div>
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/gift-cards">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Gift Card</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gift Card Details</CardTitle>
          <CardDescription>
            Modify the details for gift card <span className="font-mono">{code}</span>.
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
                <Label htmlFor="current-balance">Current Balance (৳)</Label>
                <Input
                id="current-balance"
                type="number"
                placeholder="e.g. 500"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
                disabled={isLoading}
                />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value)} disabled={isLoading}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Used">Used</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                        <SelectItem value="Disabled">Disabled</SelectItem>
                    </SelectContent>
                </Select>
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
             <Button onClick={handleUpdateCard} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
             </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
