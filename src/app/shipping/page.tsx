
"use client";

import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart, ShippingInfo } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { OrderSummary } from "@/components/order-summary"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"

interface Address {
    id: string;
    type: string;
    name: string;
    streetAddress: string;
    division: string;
    district: string;
    upazila: string;
    phone: string;
    isDefault: boolean;
}

export default function ShippingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { cart, setShippingInfo, shippingInfo, availableShippingMethods } = useCart();
    const { toast } = useToast();

    const [addresses, setAddresses] = React.useState<Address[]>([]);
    const [loadingAddresses, setLoadingAddresses] = React.useState(true);
    const [selectedAddress, setSelectedAddress] = React.useState<Address | null>(null);
    const [selectedShippingMethod, setSelectedShippingMethod] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchAddresses = async () => {
            setLoadingAddresses(true);
            const addressesCol = collection(db, 'users', user.uid, 'addresses');
            const addressSnapshot = await getDocs(addressesCol);
            const addressList = addressSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address));
            setAddresses(addressList);
            
            // Set default address based on shippingInfo or isDefault flag or first address
            const currentShippingAddress = shippingInfo ? addressList.find(a => a.name === shippingInfo.name && a.phone === shippingInfo.phone) : null;
            const defaultAddress = addressList.find(a => a.isDefault);
            setSelectedAddress(currentShippingAddress || defaultAddress || (addressList.length > 0 ? addressList[0] : null));

            setLoadingAddresses(false);
        };
        fetchAddresses();
    }, [user, router]);
    
    React.useEffect(() => {
        if (shippingInfo?.method && availableShippingMethods.some(m => m.name === shippingInfo.method)) {
            setSelectedShippingMethod(shippingInfo.method);
        } else if (availableShippingMethods.length > 0) {
             setSelectedShippingMethod(availableShippingMethods[0].name);
        } else {
             setSelectedShippingMethod(null);
        }
    }, [availableShippingMethods, shippingInfo]);

    // Effect to update shipping info in the cart hook whenever selection changes
    React.useEffect(() => {
        if (selectedAddress && selectedShippingMethod) {
            const newShippingInfo: ShippingInfo = {
                name: selectedAddress.name,
                email: user?.email || '',
                phone: selectedAddress.phone,
                fullAddress: `${selectedAddress.streetAddress}, ${selectedAddress.upazila}, ${selectedAddress.district}, ${selectedAddress.division}`,
                method: selectedShippingMethod,
            };
             if (JSON.stringify(newShippingInfo) !== JSON.stringify(shippingInfo)) {
                setShippingInfo(newShippingInfo);
            }
        } else if (shippingInfo) {
            // Clear shipping info if no method or address is selected
            setShippingInfo(null);
        }
    }, [selectedAddress, selectedShippingMethod, user, setShippingInfo, shippingInfo]);


    const handleContinue = () => {
        if (!selectedAddress || !selectedShippingMethod) {
            toast({
                title: "Information Missing",
                description: "Please select a shipping address and a delivery method.",
                variant: "destructive"
            });
            return;
        }
        router.push('/payment');
    };
    
     if (!user) return null;

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
                             <Button variant="outline" asChild><Link href="/profile/addresses"><PlusCircle className="mr-2 h-4 w-4"/> Manage Addresses</Link></Button>
                          </CardHeader>
                          <CardContent>
                            {loadingAddresses ? (
                                <p>Loading addresses...</p>
                            ) : addresses.length > 0 ? (
                                <RadioGroup value={selectedAddress?.id} onValueChange={(id) => setSelectedAddress(addresses.find(a => a.id === id) || null)}>
                                    <div className="space-y-4">
                                        {addresses.map((addr) => (
                                            <Label key={addr.id} htmlFor={addr.id} className={cn("flex items-start gap-4 border p-4 rounded-lg cursor-pointer", { "border-primary ring-1 ring-primary": selectedAddress?.id === addr.id })}>
                                                <RadioGroupItem value={addr.id} id={addr.id} className="mt-1"/>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-semibold">{addr.type} <span className="font-normal text-muted-foreground">({addr.name})</span></p>
                                                        {addr.isDefault && <Badge>Default</Badge>}
                                                    </div>
                                                    <address className="not-italic text-sm text-muted-foreground">
                                                        {addr.streetAddress}, {addr.upazila}, {addr.district} <br/>
                                                        {addr.division}<br/>
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
                                    <Button asChild><Link href="/profile/addresses"><PlusCircle className="mr-2 h-4 w-4"/> Add Address</Link></Button>
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
                                {availableShippingMethods.length > 0 ? (
                                    <RadioGroup value={selectedShippingMethod || ''} onValueChange={setSelectedShippingMethod}>
                                        <div className="space-y-4">
                                            {availableShippingMethods.map(method => (
                                                 <Label key={method.name} htmlFor={method.name} className={cn("flex items-center justify-between border p-4 rounded-lg cursor-pointer", { "border-primary ring-1 ring-primary": selectedShippingMethod === method.name })}>
                                                    <div>
                                                        <p className="font-semibold">{method.name}</p>
                                                        <p className="text-sm text-muted-foreground">{method.estimatedDelivery}</p>
                                                    </div>
                                                    <p className="font-semibold">৳{method.fee}</p>
                                                    <RadioGroupItem value={method.name} id={method.name} className="ml-4"/>
                                                </Label>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                ) : (
                                     <p className="text-muted-foreground">No shipping methods available for the items in your cart.</p>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                           <OrderSummary />
                             <Button size="lg" className="w-full mt-6" onClick={handleContinue} disabled={!selectedAddress || !selectedShippingMethod}>
                                Continue to Payment
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
