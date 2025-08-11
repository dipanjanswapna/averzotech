
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ChevronLeft, ChevronRight, CreditCard, Home, MapPin, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Stepper, StepperItem, useStepper } from "@/components/ui/stepper"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import Link from "next/link"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

const deliveryInfoSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  apartment: z.string().optional(),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  postalCode: z.string().min(5, { message: "Postal code must be at least 5 characters." }),
  country: z.string().min(2, { message: "Country must be at least 2 characters." }),
  deliveryInstructions: z.string().optional(),
})

const paymentInfoSchema = z.object({
    cardNumber: z.string().min(16, { message: "Card number must be 16 digits."}).max(16),
    cardName: z.string().min(2, { message: "Name on card is required."}),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: "Invalid expiry date (MM/YY)."}),
    cvv: z.string().min(3, { message: "CVV must be 3 digits."}).max(4),
})


const steps = [
  { label: "Delivery Information", icon: Home },
  { label: "Shipping Method", icon: Truck },
  { label: "Payment", icon: CreditCard },
]

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-secondary">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-headline text-primary">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase securely and quickly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
                <CheckoutStepper />
            </div>
            <div className="lg:col-span-1">
                <OrderSummary />
            </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function CheckoutStepper() {
    return (
      <div className="flex w-full flex-col gap-4">
        <Stepper initialStep={0} steps={steps}>
          {steps.map((step, index) => {
              return (
                  <StepperItem key={step.label} {...step}>
                      <div className="min-h-[400px] flex-col justify-start items-start gap-4">
                          {index === 0 && <DeliveryInfoForm />}
                          {index === 1 && <ShippingMethodForm />}
                          {index === 2 && <PaymentForm />}
                      </div>
                  </StepperItem>
              )
          })}
          <StepperFooter />
        </Stepper>
      </div>
    )
  }

function DeliveryInfoForm() {
    const form = useForm<z.infer<typeof deliveryInfoSchema>>({
        resolver: zodResolver(deliveryInfoSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            apartment: "",
            city: "",
            postalCode: "",
            country: "Bangladesh",
            deliveryInstructions: "",
        },
    })

    function onSubmit(values: z.infer<typeof deliveryInfoSchema>) {
        console.log(values)
        // Here you would typically proceed to the next step
    }

    return (
        <div className="bg-background rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-headline font-bold mb-4 flex items-center text-primary"><MapPin className="mr-2 h-5 w-5"/> Shipping Address</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="m@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+880123456789" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="1234 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="apartment"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Apartment, suite, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="Dhaka" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="1212" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input {...field} readOnly/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="deliveryInstructions"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Delivery Instructions (optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Leave at the front door." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    )
}

function ShippingMethodForm() {
     return (
        <div className="bg-background rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-headline font-bold mb-4 flex items-center text-primary"><Truck className="mr-2 h-5 w-5"/> Shipping Method</h3>
            <RadioGroup defaultValue="standard" className="space-y-4">
                 <Label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors">
                    <div className="flex items-center space-x-4">
                       <RadioGroupItem value="standard" id="standard" />
                        <div>
                            <p className="font-semibold">Standard Shipping</p>
                            <p className="text-sm text-muted-foreground">4-6 business days</p>
                        </div>
                    </div>
                    <p className="font-semibold">BDT 50.00</p>
                 </Label>
                 <Label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors">
                    <div className="flex items-center space-x-4">
                        <RadioGroupItem value="express" id="express" />
                         <div>
                            <p className="font-semibold">Express Shipping</p>
                            <p className="text-sm text-muted-foreground">1-2 business days</p>
                        </div>
                    </div>
                    <p className="font-semibold">BDT 100.00</p>
                 </Label>
            </RadioGroup>
        </div>
    )
}

function PaymentForm() {
    const form = useForm<z.infer<typeof paymentInfoSchema>>({
        resolver: zodResolver(paymentInfoSchema),
        defaultValues: {
            cardNumber: "",
            cardName: "",
            expiryDate: "",
            cvv: "",
        },
    });

    function onSubmit(values: z.infer<typeof paymentInfoSchema>) {
        console.log(values);
        // Here you would handle the payment submission
    }

    return (
         <div className="bg-background rounded-lg p-6 shadow-sm">
             <h3 className="text-xl font-headline font-bold mb-4 flex items-center text-primary"><CreditCard className="mr-2 h-5 w-5"/> Payment Details</h3>
             <Form {...form}>
                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                     <FormField
                         control={form.control}
                         name="cardNumber"
                         render={({ field }) => (
                             <FormItem>
                                 <FormLabel>Card Number</FormLabel>
                                 <FormControl>
                                     <Input placeholder="1234 5678 9101 1121" {...field} />
                                 </FormControl>
                                 <FormMessage />
                             </FormItem>
                         )}
                     />
                     <FormField
                         control={form.control}
                         name="cardName"
                         render={({ field }) => (
                             <FormItem>
                                 <FormLabel>Name on Card</FormLabel>
                                 <FormControl>
                                     <Input placeholder="John Doe" {...field} />
                                 </FormControl>
                                 <FormMessage />
                             </FormItem>
                         )}
                     />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                             control={form.control}
                             name="expiryDate"
                             render={({ field }) => (
                                 <FormItem>
                                     <FormLabel>Expiry Date</FormLabel>
                                     <FormControl>
                                         <Input placeholder="MM/YY" {...field} />
                                     </FormControl>
                                     <FormMessage />
                                 </FormItem>
                             )}
                         />
                          <FormField
                             control={form.control}
                             name="cvv"
                             render={({ field }) => (
                                 <FormItem>
                                     <FormLabel>CVV</FormLabel>
                                     <FormControl>
                                         <Input placeholder="123" {...field} />
                                     </FormControl>
                                     <FormMessage />
                                 </FormItem>
                             )}
                         />
                     </div>
                 </form>
             </Form>
        </div>
    )
}


function OrderSummary() {
    const items = [
        { name: 'Women Black Slim Fit Tights', quantity: 1, price: 639.00, image: 'https://placehold.co/100x100.png', dataAiHint: 'black tights' },
        { name: 'Slim Fit Jeans', quantity: 2, price: 1499.00, image: 'https://placehold.co/100x100.png', dataAiHint: 'blue jeans' },
    ];
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 50.00;
    const taxes = subtotal * 0.05;
    const total = subtotal + shipping + taxes;

    return (
        <div className="bg-background rounded-lg p-6 shadow-sm sticky top-24">
            <div className="block lg:hidden">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg font-headline font-bold text-primary">
                            View Order Summary
                        </AccordionTrigger>
                        <AccordionContent>
                           <OrderSummaryContent items={items} subtotal={subtotal} shipping={shipping} taxes={taxes} total={total} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
             <div className="hidden lg:block">
                <h3 className="text-xl font-headline font-bold mb-6 text-primary">Order Summary</h3>
                <OrderSummaryContent items={items} subtotal={subtotal} shipping={shipping} taxes={taxes} total={total} />
             </div>
        </div>
    )
}

function OrderSummaryContent({ items, subtotal, shipping, taxes, total }: { items: any[], subtotal: number, shipping: number, taxes: number, total: number }) {
    return (
        <>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <div className="relative">
                            <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md" data-ai-hint={item.dataAiHint} />
                            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                        </div>
                        <div className="flex-grow">
                            <p className="font-medium text-sm">{item.name}</p>
                        </div>
                        <p className="font-semibold text-sm">BDT {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-semibold">BDT {subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Shipping</p>
                    <p className="font-semibold">BDT {shipping.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Taxes</p>
                    <p className="font-semibold">BDT {taxes.toFixed(2)}</p>
                </div>
            </div>
            
            <div className="mt-4 mb-6">
                 <div className="flex gap-2">
                    <Input id="coupon" placeholder="Gift card or discount code" />
                    <Button variant="secondary">Apply</Button>
                </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-between text-lg font-bold text-primary">
                <p>Total</p>
                <p>BDT {total.toFixed(2)}</p>
            </div>
        </>
    )
}


function StepperFooter() {
  const {
    activeStep,
    isLastStep,
    isOptionalStep,
    isDisabledStep,
    nextStep,
    prevStep,
    resetSteps,
    steps,
  } = useStepper()

  return (
    <div className="flex items-center justify-end gap-2 mt-8 bg-background p-4 rounded-lg shadow-sm">
        {activeStep === 0 ? (
            <Button asChild variant="outline">
                <Link href="/cart">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Cart
                </Link>
            </Button>
        ) : (
            <Button onClick={prevStep} variant="secondary">
                 <ChevronLeft className="h-4 w-4 mr-2" />
                Back
            </Button>
        )}
      
        <Button onClick={nextStep} className="bg-teal-600 hover:bg-teal-700 text-white">
            {isLastStep ? "Place Order" : "Continue"}
            {!isLastStep && <ChevronRight className="h-4 w-4 ml-2" />}
        </Button>
    </div>
  )
}

    