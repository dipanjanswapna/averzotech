
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Info, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"


interface SavedAddress {
    id: string;
    name: string;
    streetAddress: string;
    division: string;
    district: string;
    upazila: string;
    phone: string;
    isDefault: boolean;
}

export default function ShippingPage() {
    const { cart, subTotal, appliedCoupon, total, setShippingInfo } = useCart();
    const { user, loading: authLoading } = useAuth();
    const [savedAddresses, setSavedAddresses] = React.useState<SavedAddress[]>([]);
    const [loadingAddresses, setLoadingAddresses] = React.useState(true);
    const [selectedAddressId, setSelectedAddressId] = React.useState<string | undefined>();
    const [shippingMethod, setShippingMethod] = React.useState<string | undefined>('standard');
    const [activeTab, setActiveTab] = React.useState("saved-address");
    const { toast } = useToast();
    const router = useRouter();

    React.useEffect(() => {
        if (!user) return;
        
        const fetchAddresses = async () => {
            setLoadingAddresses(true);
            const addressesCol = collection(db, 'users', user.uid, 'addresses');
            const addressSnapshot = await getDocs(addressesCol);
            const addressList = addressSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedAddress));
            setSavedAddresses(addressList);

            // Pre-select default address or the first one
            const defaultAddress = addressList.find(addr => addr.isDefault) || addressList[0];
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            }
            setLoadingAddresses(false);
        };
        
        fetchAddresses();

    }, [user]);


    const isSelectionComplete = selectedAddressId && shippingMethod;

    const shippingFee = subTotal === 0 ? 0 : (shippingMethod === 'express' ? 250 : 120);
    const taxes = subTotal * 0.05; // 5% tax
    const finalTotal = subTotal - (appliedCoupon?.discountAmount || 0) + shippingFee + taxes;

    const handleProceedToPayment = () => {
        if (!isSelectionComplete) {
            toast({
                title: "Incomplete Information",
                description: "Please select a shipping address and shipping method to continue.",
                variant: "destructive",
            });
            return;
        } 
        
        const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);

        if (selectedAddress) {
             setShippingInfo({
                name: selectedAddress.name,
                email: user?.email || 'customer@example.com',
                phone: selectedAddress.phone,
                fullAddress: `${selectedAddress.streetAddress}, ${selectedAddress.upazila}, ${selectedAddress.district}, ${selectedAddress.division}`,
                method: shippingMethod === 'express' ? 'Express Shipping (1-3 Days)' : 'Standard Shipping (7-10 Days)',
            });
            router.push('/payment');
        } else {
             toast({
                title: "Address not found",
                description: "The selected address could not be found. Please try again.",
                variant: "destructive",
            });
        }
    }

    const fullAddressString = (addr: SavedAddress) => `${addr.streetAddress}, ${addr.upazila}, ${addr.district}, ${addr.division}`;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
                    <div className="lg:col-span-1 lg:order-1 order-2">
                        <div className="mb-6">
                            <p className="text-sm text-muted-foreground">
                                <Link href="/cart" className="hover:text-primary">Cart</Link>
                                <ChevronRight className="inline-block h-4 w-4 mx-1" />
                                <span className="font-semibold text-primary">Shipping</span>
                                <ChevronRight className="inline-block h-4 w-4 mx-1 text-muted-foreground" />
                                <span className="text-muted-foreground">Payment</span>
                            </p>
                        </div>

                        <div className="space-y-8">
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-headline mb-4">Shipping Address</h2>
                                     {loadingAddresses ? (
                                        <p>Loading addresses...</p>
                                     ) : savedAddresses.length > 0 ? (
                                        <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="space-y-4">
                                            {savedAddresses.map((address) => (
                                                <Label key={address.id} htmlFor={address.id} className={cn("flex items-start justify-between rounded-lg border p-4 cursor-pointer transition-colors", selectedAddressId === address.id && "bg-secondary border-primary")}>
                                                    <div className="flex items-start space-x-4">
                                                        <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                                                        <div>
                                                            <p className="font-semibold">{address.name}</p>
                                                            <p className="text-sm text-muted-foreground">{fullAddressString(address)}</p>
                                                            <p className="text-sm text-muted-foreground">Phone: {address.phone}</p>
                                                        </div>
                                                    </div>
                                                </Label>
                                            ))}
                                        </RadioGroup>
                                     ) : (
                                        <div className="text-center py-8">
                                            <p className="text-muted-foreground mb-4">You have no saved addresses.</p>
                                            <Button asChild>
                                                <Link href="/profile/addresses"><PlusCircle className="mr-2 h-4 w-4"/> Add Address</Link>
                                            </Button>
                                        </div>
                                     )}
                                </CardContent>
                            </Card>
                            
                            <div>
                                <h2 className="text-2xl font-headline mt-8 mb-4">Shipping Method</h2>
                                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-4">
                                    <Label htmlFor="standard-shipping" className={cn("flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors", shippingMethod === 'standard' && "bg-secondary border-primary")}>
                                        <div className="flex items-center space-x-4">
                                            <RadioGroupItem value="standard" id="standard-shipping" />
                                            <div>
                                                <p className="font-semibold">Standard Shipping</p>
                                                <p className="text-sm text-muted-foreground">7-10 Days</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold">৳120</p>
                                    </Label>
                                    <Label htmlFor="express-shipping" className={cn("flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors", shippingMethod === 'express' && "bg-secondary border-primary")}>
                                        <div className="flex items-center space-x-4">
                                            <RadioGroupItem value="express" id="express-shipping" />
                                            <div>
                                                <p className="font-semibold">Express Shipping</p>
                                                <p className="text-sm text-muted-foreground">1-3 Days</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold">৳250</p>
                                    </Label>
                                </RadioGroup>
                            </div>
                        </div>
                         <div className="mt-8 flex justify-between items-center">
                            <Button variant="outline" asChild>
                                <Link href="/cart">
                                    <ChevronRight className="mr-2 h-4 w-4 transform rotate-180" /> Back to Cart
                                </Link>
                            </Button>
                            <Button 
                                className="w-auto" 
                                size="lg"
                                disabled={!isSelectionComplete}
                                onClick={handleProceedToPayment}
                            >
                               Continue to Payment
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-1 lg:order-2 order-1 lg:sticky lg:top-24 self-start">
                      <div className="bg-secondary p-8 rounded-lg">
                          <h2 className="text-2xl font-headline mb-6">Your Cart</h2>
                          <div className="space-y-4">
                              {cart.map((item) => (
                              <div key={item.id} className="flex items-center gap-4">
                                  <div className="relative">
                                      <Image src={item.images[0] || 'https://placehold.co/80x80.png'} alt={item.name} width={64} height={64} className="rounded-md" />
                                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                                  </div>
                                  <div className="flex-grow">
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">{item.selectedSize} / {item.selectedColor}</p>
                                  </div>
                                  <p className="font-semibold">৳{item.pricing.price.toFixed(2)}</p>
                              </div>
                              ))}
                          </div>

                          <Separator className="my-6" />

                          <div className="space-y-2">
                              <div className="flex justify-between">
                                  <p className="text-muted-foreground">Subtotal</p>
                                  <p className="font-semibold">৳{subTotal.toFixed(2)}</p>
                              </div>
                               {appliedCoupon && (
                                 <div className="flex justify-between text-green-600">
                                     <p>Discount ({appliedCoupon.code})</p>
                                     <p className="font-semibold">- ৳{appliedCoupon.discountAmount.toFixed(2)}</p>
                                 </div>
                               )}
                              <div className="flex justify-between">
                                  <p className="text-muted-foreground">Shipping</p>
                                  <p className="font-semibold">৳{shippingFee.toFixed(2)}</p>
                              </div>
                              <div className="flex justify-between">
                                  <p className="flex items-center gap-1 text-muted-foreground">
                                      Estimated taxes
                                      <TooltipProvider>
                                          <Tooltip>
                                              <TooltipTrigger asChild>
                                                  <Info className="h-4 w-4" />
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                  <p>Taxes are calculated based on your shipping address.</p>
                                              </TooltipContent>
                                          </Tooltip>
                                      </TooltipProvider>
                                  </p>
                                  <p className="font-semibold">৳{taxes.toFixed(2)}</p>
                              </div>
                          </div>

                          <Separator className="my-6" />

                          <div className="flex justify-between text-xl font-bold mb-6">
                              <p>Total</p>
                              <p>৳{finalTotal.toFixed(2)}</p>
                          </div>
                      </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}

    