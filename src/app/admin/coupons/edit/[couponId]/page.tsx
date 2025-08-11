
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
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
import { ChevronLeft, CalendarIcon, Info, PlusCircle, XCircle, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { collection, getDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  images: string[];
}

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const couponId = params.couponId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Coupon fields
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [limit, setLimit] = useState('');
  const [minPurchase, setMinPurchase] = useState('');
  const [applicability, setApplicability] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  
  // Product selection modal
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);

  useEffect(() => {
    if (!couponId) return;

    const fetchCouponAndProducts = async () => {
      setIsFetching(true);
      try {
        // Fetch coupon data
        const couponRef = doc(db, 'coupons', couponId);
        const couponSnap = await getDoc(couponRef);

        if (couponSnap.exists()) {
          const data = couponSnap.data();
          setCode(data.code);
          setDescription(data.description || '');
          setType(data.type);
          setValue(String(data.value));
          setStartDate(new Date(data.startDate));
          setEndDate(new Date(data.endDate));
          setLimit(data.limit ? String(data.limit) : '');
          setMinPurchase(data.minPurchase ? String(data.minPurchase) : '');
          setApplicability(data.applicability?.type || 'all');

          // Fetch all products for selector
          const productsCollection = collection(db, 'products');
          const productSnapshot = await getDocs(productsCollection);
          const productList = productSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Product));
          setAllProducts(productList);
          
          // Pre-select products if applicable
          if (data.applicability?.type === 'products' && data.applicability.ids.length > 0) {
            const applicableProducts = productList.filter(p => data.applicability.ids.includes(p.id));
            setSelectedProducts(applicableProducts);
          }
        } else {
          toast({ title: "Error", description: "Coupon not found.", variant: "destructive" });
          router.push('/admin/coupons');
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast({ title: "Error", description: "Could not fetch coupon details.", variant: "destructive" });
      } finally {
        setIsFetching(false);
      }
    };

    fetchCouponAndProducts();
  }, [couponId, router, toast]);

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

  const handleUpdateCoupon = async () => {
    if (!code || !value || !startDate || !endDate) {
      toast({ title: 'Missing Fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    if (applicability === 'products' && selectedProducts.length === 0) {
        toast({ title: "No Products Selected", description: "Please select at least one product for this coupon.", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    try {
      const couponRef = doc(db, 'coupons', couponId);
      await updateDoc(couponRef, {
        code,
        description,
        type,
        value: parseFloat(value),
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        limit: limit ? parseInt(limit, 10) : null,
        minPurchase: minPurchase ? parseFloat(minPurchase) : 0,
        applicability: {
            type: applicability,
            ids: applicability === 'products' ? selectedProducts.map(p => p.id) : [],
        },
      });
      toast({
        title: 'Coupon Updated',
        description: `Coupon "${code}" has been successfully updated.`,
      });
      router.push('/admin/coupons');
    } catch (error: any) {
      console.error('Error updating coupon: ', error);
      toast({ title: 'Error', description: 'There was a problem updating the coupon.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
      return <div className="p-8">Loading coupon details...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/coupons">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Coupon</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Coupon Details</CardTitle>
              <CardDescription>
                Modify the details for your coupon.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coupon-code">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input id="coupon-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupon-description">Description (Optional)</Label>
                <Input id="coupon-description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isLoading} />
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
                  <SelectTrigger id="coupon-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2 flex-1">
                <Label htmlFor="coupon-value">Value</Label>
                <Input id="coupon-value" type="number" value={value} onChange={(e) => setValue(e.target.value)} disabled={isLoading} />
              </div>
            </CardContent>
          </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Coupon Applicability</CardTitle>
                    <CardDescription>Specify which products this coupon applies to.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={applicability} onValueChange={setApplicability} className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all-products" /><Label htmlFor="all-products">All Products</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="products" id="specific-products" /><Label htmlFor="specific-products">Specific Products</Label>
                        </div>
                    </RadioGroup>
                    {applicability === 'products' && (
                        <div className="pt-4">
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
                                     <div className="max-h-32 overflow-y-auto space-y-1 pr-2">
                                        {selectedProducts.map(p => (
                                            <div key={p.id} className="flex items-center justify-between text-sm bg-secondary p-1.5 rounded-md">
                                                <span>{p.name}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleToggleProduct(p)}><XCircle className="h-4 w-4 text-destructive" /></Button>
                                            </div>
                                        ))}
                                     </div>
                                )}
                            </div>
                        </div>
                    )}
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
                      <TooltipProvider><Tooltip><TooltipTrigger asChild><Info className="h-3 w-3 text-muted-foreground inline-block" /></TooltipTrigger><TooltipContent><p>How many times this coupon can be used in total. Leave blank for unlimited.</p></TooltipContent></Tooltip></TooltipProvider>
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
                <Button onClick={handleUpdateCoupon} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
