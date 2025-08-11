
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function NewCouponPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [limit, setLimit] = useState('');
  const [minPurchase, setMinPurchase] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateRandomCode = () => {
    const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
    setCode(randomString);
  };

  const handleSaveCoupon = async () => {
    if (!code || !value || !startDate || !endDate) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'coupons'), {
        code,
        description,
        type,
        value: parseFloat(value),
        startDate: startDate.toISOString().split('T')[0], // Store as YYYY-MM-DD
        endDate: endDate.toISOString().split('T')[0], // Store as YYYY-MM-DD
        limit: limit ? parseInt(limit, 10) : null,
        minPurchase: minPurchase ? parseFloat(minPurchase) : 0,
        used: 0,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Coupon Created',
        description: `Coupon "${code}" has been successfully created.`,
      });
      router.push('/admin/coupons');
    } catch (error: any) {
      console.error('Error creating coupon: ', error);
      toast({
        title: 'Error',
        description: 'There was a problem creating the coupon.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/coupons">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create Coupon</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Coupon Details</CardTitle>
              <CardDescription>
                Fill in the details for your new coupon.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coupon-code">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="coupon-code"
                    placeholder="e.g. SUMMER20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    disabled={isLoading}
                  />
                  <Button variant="secondary" onClick={generateRandomCode} disabled={isLoading}>
                    Generate Code
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupon-description">Description (Optional)</Label>
                <Input
                  id="coupon-description"
                  placeholder="e.g. Summer sale campaign"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Discount</CardTitle>
               <CardDescription>Choose the type and value of the discount.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="coupon-type">Discount Type</Label>
                <Select value={type} onValueChange={setType} disabled={isLoading}>
                  <SelectTrigger id="coupon-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2 flex-1">
                <Label htmlFor="coupon-value">Value</Label>
                <Input
                  id="coupon-value"
                  type="number"
                  placeholder={type === 'percentage' ? '20' : '500'}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Usage Limits</CardTitle>
              <CardDescription>Set limits on how this coupon can be used.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                   <Label htmlFor="usage-limit">
                     <span className="mr-2">Total Usage Limit</span> 
                      <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground inline-block" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>How many times this coupon can be used in total. Leave blank for unlimited.</p>
                            </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                   <Input id="usage-limit" type="number" placeholder="e.g. 100" value={limit} onChange={e => setLimit(e.target.value)} disabled={isLoading} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="min-purchase">Minimum Purchase Amount (৳)</Label>
                    <Input id="min-purchase" type="number" placeholder="e.g. 2000" value={minPurchase} onChange={e => setMinPurchase(e.target.value)} disabled={isLoading} />
                </div>
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1 space-y-8 sticky top-8">
            <Card>
                <CardHeader>
                    <CardTitle>Validity</CardTitle>
                    <CardDescription>Set the date range when this coupon is active.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !startDate && "text-muted-foreground"
                                )}
                                disabled={isLoading}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                     </div>
                     <div className="space-y-2">
                        <Label>End Date</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !endDate && "text-muted-foreground"
                                )}
                                disabled={isLoading}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                disabled={(date) =>
                                    startDate ? date < startDate : false
                                }
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                     </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline" disabled={isLoading} onClick={() => router.back()}>Discard</Button>
                <Button onClick={handleSaveCoupon} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Coupon'}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
