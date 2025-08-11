
'use client';

import { useState, useEffect } from 'react';
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
import { ChevronLeft, CalendarIcon, PlusCircle, XCircle, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  images: string[];
}

export default function NewCampaignPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Campaign fields
  const [name, setName] = useState('');
  const [type, setType] = useState('Flash Sale');
  const [status, setStatus] = useState('Scheduled');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  
  // Product selection modal
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setAllProducts(productList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };
    fetchProducts();
  }, []);
  
  const handleToggleProduct = (product: Product) => {
    setSelectedProducts(prevSelected => {
        const isSelected = prevSelected.some(p => p.id === product.id);
        if (isSelected) {
            return prevSelected.filter(p => p.id !== product.id);
        } else {
            return [...prevSelected, product];
        }
    })
  }

  const handleSaveCampaign = async () => {
    if (!name || !type || !status || !startDate || !endDate) {
      toast({ title: 'Missing Fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
     if (selectedProducts.length === 0) {
        toast({ title: "No Products Selected", description: "Please select at least one product for this campaign.", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'campaigns'), {
        name,
        type,
        status,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        products: selectedProducts.map(p => p.id),
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Campaign Created',
        description: `Campaign "${name}" has been successfully created.`,
      });
      router.push('/admin/campaigns');
    } catch (error: any) {
      console.error('Error creating campaign: ', error);
      toast({ title: 'Error', description: 'There was a problem creating the campaign.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/campaigns">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create Campaign</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>
                Fill in the details for your new campaign.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input id="campaign-name" placeholder="e.g. Eid Flash Sale" value={name} onChange={e => setName(e.target.value)} disabled={isLoading} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="campaign-type">Campaign Type</Label>
                        <Select value={type} onValueChange={setType} disabled={isLoading}>
                            <SelectTrigger id="campaign-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Flash Sale">Flash Sale</SelectItem>
                                <SelectItem value="Pre-booking">Pre-booking</SelectItem>
                                <SelectItem value="Special Offer">Special Offer</SelectItem>
                                <SelectItem value="New Arrival">New Arrival</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="campaign-status">Status</Label>
                        <Select value={status} onValueChange={setStatus} disabled={isLoading}>
                            <SelectTrigger id="campaign-status"><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Scheduled">Scheduled</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Finished">Finished</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Applicable Products</CardTitle>
               <CardDescription>Select the products that are part of this campaign.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Dialog open={isProductSelectorOpen} onOpenChange={setIsProductSelectorOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Select Products</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader><DialogTitle>Select Applicable Products</DialogTitle></DialogHeader>
                        <ScrollArea className="h-96">
                            <div className="grid grid-cols-1 gap-2 p-4">
                                {allProducts.map(product => {
                                    const isSelected = selectedProducts.some(p => p.id === product.id);
                                    return (
                                        <div key={product.id} className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${isSelected ? 'bg-secondary' : ''}`} onClick={() => handleToggleProduct(product)}>
                                            <div className="flex items-center gap-4">
                                                <Image src={product.images[0] || 'https://placehold.co/64x64.png'} alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                                                <span className="font-medium">{product.name}</span>
                                            </div>
                                            {isSelected && <Check className="h-5 w-5 text-primary" />}
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>

                 <div className="mt-4 space-y-2">
                    <Label>{selectedProducts.length} product(s) selected</Label>
                    {selectedProducts.length > 0 && (
                         <div className="max-h-60 overflow-y-auto space-y-1 pr-2">
                            {selectedProducts.map(p => (
                                <div key={p.id} className="flex items-center justify-between text-sm bg-secondary p-1.5 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <Image src={p.images[0] || 'https://placehold.co/32x32.png'} alt={p.name} width={24} height={24} className="rounded-sm object-cover" />
                                        <span>{p.name}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleToggleProduct(p)}><XCircle className="h-4 w-4 text-destructive" /></Button>
                                </div>
                            ))}
                         </div>
                    )}
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8 sticky top-8">
            <Card>
                <CardHeader>
                    <CardTitle>Campaign Schedule</CardTitle>
                    <CardDescription>Set the start and end date for the campaign.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!startDate && "text-muted-foreground")} disabled={isLoading}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus /></PopoverContent>
                        </Popover>
                     </div>
                     <div className="space-y-2">
                        <Label>End Date</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")} disabled={isLoading}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(date) => startDate ? date < startDate : false} initialFocus /></PopoverContent>
                        </Popover>
                     </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline" disabled={isLoading} onClick={() => router.back()}>Discard</Button>
                <Button onClick={handleSaveCampaign} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Campaign'}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

