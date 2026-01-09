
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, PlusCircle, Home, Truck, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart, ShippingInfo } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { OrderSummary } from '@/components/order-summary';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { useFirebase, useCollection } from '@/firebase';
import { getSundarbanThanas } from '@/lib/location';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Address {
  id: string;
  type: string;
  name: string;
  streetAddress: string;
  division: string;
  district: string;
  thana: string;
  phone: string;
  isDefault: boolean;
  delivery_area: string;
  delivery_area_id: number;
}

export default function ShippingPage() {
  const router = useRouter();
  const { user } = useFirebase();
  const { cart, setShippingInfo, shippingInfo } = useCart();
  const { toast } = useToast();
  
  const { data: addresses, loading: loadingAddresses } = useCollection<Address>(user ? `users/${user.uid}/addresses` : '');

  const [selectedAddress, setSelectedAddress] = React.useState<Address | null>(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = React.useState<string | null>(null);
  
  const [sundarbanThanas, setSundarbanThanas] = React.useState<string[]>([]);
  const [selectedSundarbanThana, setSelectedSundarbanThana] = React.useState<string>('');

  const availableShippingMethods = React.useMemo(() => {
    const methods = [{ name: 'Standard Courier (RedX)', estimatedDelivery: '2-4 business days', fee: 60 }];
    if (selectedAddress && getSundarbanThanas(selectedAddress.district).length > 0) {
        methods.push({ name: 'Pickup from Store', estimatedDelivery: '3-5 business days', fee: 120 });
    }
    return methods;
  }, [selectedAddress]);


  React.useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!loadingAddresses && cart.length === 0) {
      toast({ title: 'Your cart is empty!', description: 'Add items to your cart to proceed to shipping.' });
      router.push('/');
      return;
    }

    if (!loadingAddresses && addresses.length > 0) {
        const currentShippingAddress = shippingInfo ? addresses.find(a => a.id === (shippingInfo as any).id) : null;
        const defaultAddress = addresses.find(a => a.isDefault);
        const initialAddress = currentShippingAddress || defaultAddress || addresses[0];
        setSelectedAddress(initialAddress);
    }
    
  }, [user, addresses, loadingAddresses, router, cart.length, toast, shippingInfo]);
  
  React.useEffect(() => {
      if (selectedAddress) {
          const thanas = getSundarbanThanas(selectedAddress.district);
          setSundarbanThanas(thanas);
          if (thanas.length > 0) {
            setSelectedSundarbanThana(thanas.includes(selectedAddress.thana) ? selectedAddress.thana : thanas[0]);
          } else {
            setSelectedSundarbanThana('');
          }
      }
  }, [selectedAddress]);

  React.useEffect(() => {
    if (shippingInfo?.method && availableShippingMethods.some(m => m.name === shippingInfo.method)) {
      setSelectedShippingMethod(shippingInfo.method);
    } else if (availableShippingMethods.length > 0) {
      setSelectedShippingMethod(availableShippingMethods[0].name);
    } else {
      setSelectedShippingMethod(null);
    }
  }, [availableShippingMethods, shippingInfo]);

  React.useEffect(() => {
    if (selectedAddress && selectedShippingMethod) {
        let newShippingInfo: ShippingInfo;
        if (selectedShippingMethod === 'Pickup from Store') {
            if(!selectedSundarbanThana){
                // Don't set shipping info if thana is not selected yet for pickup
                setShippingInfo(null);
                return;
            }
            newShippingInfo = {
                id: selectedAddress.id,
                name: selectedAddress.name,
                email: user?.email || '',
                phone: selectedAddress.phone,
                fullAddress: `Pickup from Sundarban Courier, ${selectedSundarbanThana}, ${selectedAddress.district}`,
                method: 'Pickup from Store',
                delivery_area: selectedSundarbanThana, // Storing thana as delivery area
                delivery_area_id: -1, // Use a special ID for pickup
                district: selectedAddress.district,
                division: selectedAddress.division,
                upazila: selectedSundarbanThana,
            };
        } else {
            newShippingInfo = {
                ...(selectedAddress as any),
                name: selectedAddress.name,
                email: user?.email || '',
                phone: selectedAddress.phone,
                fullAddress: `${selectedAddress.streetAddress}, ${selectedAddress.thana}, ${selectedAddress.district}`,
                method: 'Standard Courier (RedX)',
            };
        }
        
        // Only update if there's a change to avoid loops
        if (JSON.stringify(newShippingInfo) !== JSON.stringify(shippingInfo)) {
            setShippingInfo(newShippingInfo);
        }
    } else if (shippingInfo) {
      // Clear shipping info if no address or method is selected
      setShippingInfo(null);
    }
}, [selectedAddress, selectedShippingMethod, selectedSundarbanThana, user, setShippingInfo, shippingInfo]);


  const handleContinue = () => {
    if (!selectedAddress || !selectedShippingMethod) {
      toast({
        title: 'Information Missing',
        description: 'Please select a shipping address and a delivery method.',
        variant: 'destructive',
      });
      return;
    }
     if (selectedShippingMethod === 'Pickup from Store' && !selectedSundarbanThana) {
        toast({
        title: 'Pickup Branch Required',
        description: 'Please select a Sundarban Courier branch for pickup.',
        variant: 'destructive',
      });
      return;
    }
    router.push('/payment');
  };

  if (!user && !loadingAddresses) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            <Link href="/cart" className="hover:text-primary">Cart</Link>
            <ChevronRight className="inline-block h-4 w-4 mx-1" />
            <span className="font-semibold text-primary">Shipping</span>
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Select Shipping Address</CardTitle>
                  <CardDescription>Choose from your saved addresses or add a new one.</CardDescription>
                </div>
                <Button variant="outline" asChild><Link href="/profile/addresses"><PlusCircle className="mr-2 h-4 w-4" /> Manage Addresses</Link></Button>
              </CardHeader>
              <CardContent>
                {loadingAddresses ? (
                  <p>Loading addresses...</p>
                ) : addresses.length > 0 ? (
                  <RadioGroup value={selectedAddress?.id} onValueChange={(id) => setSelectedAddress(addresses.find(a => a.id === id) || null)}>
                    <div className="space-y-4">
                      {addresses.map((addr) => (
                        <Label key={addr.id} htmlFor={addr.id} className={cn('flex items-start gap-4 border p-4 rounded-lg cursor-pointer', { 'border-primary ring-1 ring-primary': selectedAddress?.id === addr.id })}>
                          <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">{addr.type} <span className="font-normal text-muted-foreground">({addr.name})</span></p>
                              {addr.isDefault && <Badge>Default</Badge>}
                            </div>
                            <address className="not-italic text-sm text-muted-foreground">
                              {addr.streetAddress}, {addr.thana}, {addr.district} <br />
                              {addr.division}<br />
                              Phone: {addr.phone}
                            </address>
                          </div>
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="text-center p-8 border-2 border-dashed rounded-lg">
                    <p className="mb-4 text-muted-foreground">You have no saved addresses.</p>
                    <Button asChild><Link href="/profile/addresses"><PlusCircle className="mr-2 h-4 w-4" /> Add Address</Link></Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Select Shipping Method</CardTitle>
                <CardDescription>Choose how you'd like to receive your order.</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedAddress ? (
                <RadioGroup value={selectedShippingMethod || ''} onValueChange={setSelectedShippingMethod} className="space-y-4">
                    {availableShippingMethods.map(method => (
                        <Label key={method.name} htmlFor={method.name} className={cn("flex items-start justify-between border p-4 rounded-lg cursor-pointer", { "border-primary ring-1 ring-primary": selectedShippingMethod === method.name })}>
                            <div className="flex items-center gap-3">
                                {method.name === 'Pickup from Store' ? <Store className="h-6 w-6 text-muted-foreground" /> : <Truck className="h-6 w-6 text-muted-foreground" />}
                                <div className='flex-1'>
                                    <p className="font-semibold">{method.name}</p>
                                    <p className="text-sm text-muted-foreground">{method.estimatedDelivery}</p>
                                    {method.name === 'Pickup from Store' && selectedShippingMethod === 'Pickup from Store' && (
                                         <Select value={selectedSundarbanThana} onValueChange={setSelectedSundarbanThana}>
                                            <SelectTrigger className="w-full md:w-[280px] mt-2 h-8">
                                                <SelectValue placeholder="Select Pickup Branch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sundarbanThanas.map(thana => (
                                                    <SelectItem key={thana} value={thana}>{thana}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                     )}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <p className="font-semibold mr-4">৳{method.fee.toFixed(2)}</p>
                                <RadioGroupItem value={method.name} id={method.name} />
                            </div>
                        </Label>
                    ))}
                </RadioGroup>
                 ) : (
                    <p className="text-muted-foreground text-sm">Please select a shipping address to see available shipping methods.</p>
                )}
              </CardContent>
            </Card>

          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummary />
              <Button size="lg" className="w-full mt-6" onClick={handleContinue} disabled={!selectedAddress || !selectedShippingMethod || (selectedShippingMethod === 'Pickup from Store' && !selectedSundarbanThana)}>
                Continue to Payment
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

    