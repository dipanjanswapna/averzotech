
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Info, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const cartItems = [
  {
    id: '1',
    name: 'Men Top Black Puffed Jacket',
    variant: 'Men\'s Black',
    price: 999.00,
    quantity: 1,
    image: 'https://placehold.co/80x80.png',
    dataAiHint: 'puffed jacket',
  },
  {
    id: '2',
    name: 'Women Jacket',
    variant: 'Women top',
    price: 1200.00,
    quantity: 1,
    image: 'https://placehold.co/80x80.png',
    dataAiHint: 'women jacket',
  },
];

const savedAddresses = [
    {
        id: 'addr1',
        name: 'Divyansh Agarwal',
        address: '123, Webyansh, Bangalore, Karnataka - 560021',
        phone: '+91 6377588843',
    },
    {
        id: 'addr2',
        name: 'John Doe',
        address: '456, Tech Park, Bangalore, Karnataka - 560066',
        phone: '+91 9876543210',
    }
]

const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
const shippingFee = 9.00;
const taxes = 5.00;
const total = subtotal + shippingFee + taxes;


export default function ShippingPage() {
    const [selectedAddress, setSelectedAddress] = React.useState<string | undefined>();
    const [shippingMethod, setShippingMethod] = React.useState<string | undefined>();
    const [activeTab, setActiveTab] = React.useState("saved-address");

    const isSelectionComplete = selectedAddress && shippingMethod;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="lg:col-span-1">
                        <div className="mb-6">
                            <p className="text-sm text-muted-foreground">
                                <Link href="/cart" className="hover:text-primary">Cart</Link>
                                <ChevronRight className="inline-block h-4 w-4 mx-1" />
                                <span className="font-semibold text-primary">Shipping</span>
                                <ChevronRight className="inline-block h-4 w-4 mx-1" />
                                <span>Payment</span>
                            </p>
                        </div>

                        <div className="space-y-8">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="saved-address">Select Address</TabsTrigger>
                                    <TabsTrigger value="new-address">Add New Address</TabsTrigger>
                                </TabsList>
                                <TabsContent value="saved-address">
                                    <Card>
                                        <CardContent className="p-6">
                                            <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
                                            <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress} className="space-y-4">
                                                {savedAddresses.map((address) => (
                                                    <Label key={address.id} htmlFor={address.id} className={cn("flex items-start justify-between rounded-lg border p-4 cursor-pointer transition-colors", selectedAddress === address.id && "bg-accent border-primary")}>
                                                        <div className="flex items-start space-x-4">
                                                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                                                            <div>
                                                                <p className="font-semibold">{address.name}</p>
                                                                <p className="text-sm text-muted-foreground">{address.address}</p>
                                                                <p className="text-sm text-muted-foreground">Phone: {address.phone}</p>
                                                            </div>
                                                        </div>
                                                    </Label>
                                                ))}
                                                <div 
                                                    className="flex items-center justify-center rounded-lg border-2 border-dashed p-4 cursor-pointer hover:border-primary transition-colors"
                                                    onClick={() => setActiveTab("new-address")}
                                                >
                                                     <div className="text-center">
                                                        <PlusCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                                        <p className="font-semibold">Add New Address</p>
                                                     </div>
                                                </div>
                                            </RadioGroup>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="new-address">
                                     <Card>
                                        <CardContent className="p-6">
                                            <h2 className="text-2xl font-semibold mb-4">Add New Address</h2>
                                            <form className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="first-name">First Name*</Label>
                                                        <Input id="first-name" placeholder="Divyansh" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="last-name">Last Name*</Label>
                                                        <Input id="last-name" placeholder="Agarwal" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email*</Label>
                                                    <Input id="email" type="email" placeholder="m@example.com" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Phone number*</Label>
                                                    <div className="flex">
                                                        <Select defaultValue="in">
                                                            <SelectTrigger className="w-[80px]">
                                                                <SelectValue placeholder="Country" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="in">IND</SelectItem>
                                                                <SelectItem value="us">USA</SelectItem>
                                                                <SelectItem value="uk">UK</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Input id="phone" placeholder="+91 1234567890" className="flex-1" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="address">Address*</Label>
                                                    <Textarea id="address" placeholder="Enter your full address..." />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="city">City*</Label>
                                                        <Input id="city" placeholder="Bangalore" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="state">State*</Label>
                                                        <Input id="state" placeholder="Karnataka" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="zip">Zip Code*</Label>
                                                        <Input id="zip" placeholder="560021" />
                                                    </div>
                                                </div>
                                                <Button type="submit" className="w-full">Save Address</Button>
                                            </form>
                                        </CardContent>
                                     </Card>
                                </TabsContent>
                            </Tabs>
                            
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Shipping Method</h2>
                                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-4">
                                    <Label htmlFor="free-shipping" className={cn("flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors", shippingMethod === 'free' && "bg-accent border-primary")}>
                                        <div className="flex items-center space-x-4">
                                            <RadioGroupItem value="free" id="free-shipping" />
                                            <div>
                                                <p className="font-semibold">Free Shipping</p>
                                                <p className="text-sm text-muted-foreground">7-20 Days</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold">$0</p>
                                    </Label>
                                    <Label htmlFor="express-shipping" className={cn("flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors", shippingMethod === 'express' && "bg-accent border-primary")}>
                                        <div className="flex items-center space-x-4">
                                            <RadioGroupItem value="express" id="express-shipping" />
                                            <div>
                                                <p className="font-semibold">Express Shipping</p>
                                                <p className="text-sm text-muted-foreground">1-3 Days</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold">$9</p>
                                    </Label>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1 bg-secondary/50 p-8 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="relative">
                                    <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md" data-ai-hint={item.dataAiHint} />
                                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.variant}</p>
                                </div>
                                <p className="font-semibold">${item.price.toFixed(2)}</p>
                            </div>
                            ))}
                        </div>

                        <Separator className="my-6" />

                        <div className="flex gap-2 mb-6">
                            <Input placeholder="Discount code" />
                            <Button variant="secondary">Apply</Button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">Subtotal</p>
                                <p className="font-semibold">${subtotal.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">Shipping</p>
                                <p className="font-semibold">${shippingFee.toFixed(2)}</p>
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
                                <p className="font-semibold">${taxes.toFixed(2)}</p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="flex justify-between text-xl font-bold mb-6">
                            <p>Total</p>
                            <p>${total.toFixed(2)}</p>
                        </div>
                        
                        <Button 
                            className="w-full bg-black text-white hover:bg-gray-800" 
                            size="lg"
                            disabled={!isSelectionComplete}
                        >
                            Continue to Payment
                        </Button>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )

    

    