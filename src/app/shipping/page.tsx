
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import CartItem from "@/app/cart/components/cart-item";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderSummary } from "@/components/order-summary";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  phone: z.string().min(1, {
    message: "Phone number is required.",
  }),
});

const ShippingPage = () => {
  const router = useRouter();
  const cart = useCart();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
    }
  });

  const isLoading = form.formState.isSubmitting;

  const totalPrice = cart.cart.reduce((total, item) => {
    return total + Number(item.pricing.price) * item.quantity;
  }, 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(`/api/checkout`, {
        ...values,
        productIds: cart.cart.map((item) => item.id)
      });

      router.push(response.data.url);
    } catch (error: any) {
      toast({title: 'Something went wrong.', variant: 'destructive'});
    }
  };

  if(!isMounted){
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="lg:w-2/3">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} placeholder="Your Name" {...field} />
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
                        <Input disabled={isLoading} placeholder="01XXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} className="ml-auto" type="submit">
                  Next
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Review Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {cart.cart.map((item) => (
                <CartItem key={item.id} data={item} />
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="lg:w-1/3">
        <OrderSummary items={cart.cart} />
      </div>
    </div>
  );
};

export default ShippingPage;
