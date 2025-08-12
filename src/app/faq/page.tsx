
'use client';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';

const faqData = [
    {
        category: "Account",
        questions: [
            {
                q: "How do I create an account?",
                a: "You can create an account by clicking on the 'Sign Up' or 'Register' button on the homepage. Fill in the required details, and you're good to go!"
            },
            {
                q: "How can I reset my password?",
                a: "On the login page, click the 'Forgot Password' link. Enter your registered email address, and we'll send you instructions to reset your password."
            },
            {
                q: "How do I update my personal information?",
                a: "Once logged in, go to your 'Profile' or 'My Account' section. You will find options to edit your name, address, and other personal details."
            }
        ]
    },
    {
        category: "Payment",
        questions: [
            {
                q: "What payment methods do you accept?",
                a: "We accept all major credit and debit cards (Visa, MasterCard), mobile banking (bKash, Nagad), and Cash on Delivery (COD) for eligible orders."
            },
            {
                q: "Is it safe to use my card on your website?",
                a: "Absolutely. We use industry-standard SSL encryption to protect your details. Your payment information is processed securely and is never stored on our servers."
            }
        ]
    },
     {
        category: "Shipping & Delivery",
        questions: [
            {
                q: "How can I track my order?",
                a: "Once your order is shipped, you will receive an email with a tracking number and a link. You can use this to track your order's journey to your doorstep."
            },
            {
                q: "What are the delivery charges?",
                a: "Delivery charges vary based on your location and the shipping method selected. The final shipping cost will be displayed at checkout before you confirm your order."
            },
             {
                q: "How long does delivery take?",
                a: "Standard delivery usually takes 5-7 business days, while Express delivery takes 1-3 business days within major cities. Delivery times may vary for remote locations."
            }
        ]
    },
     {
        category: "Returns & Cancellation",
        questions: [
            {
                q: "What is your return policy?",
                a: "We offer a 14-day return policy for most items. The product must be in its original condition, unused, with all tags attached. Please check our 'Returns' page for more details."
            },
            {
                q: "How do I cancel my order?",
                a: "You can cancel your order from the 'My Orders' section of your account as long as it has not been shipped. If it has been shipped, you can refuse the delivery or initiate a return once you receive it."
            }
        ]
    }
]

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground mt-2">Find answers to the most common questions.</p>
        </div>

        <div className="max-w-3xl mx-auto">
            {faqData.map(category => (
                <div key={category.category} className="mb-8">
                    <h2 className="text-2xl font-semibold border-b pb-2 mb-4">{category.category}</h2>
                     <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((item, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-left hover:no-underline">{item.q}</AccordionTrigger>
                                <AccordionContent>
                                   {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                     </Accordion>
                </div>
            ))}
        </div>
        
        <div className="max-w-3xl mx-auto mt-16 text-center border-t pt-8">
             <h3 className="text-xl font-semibold">Can't find the answer you're looking for?</h3>
             <p className="text-muted-foreground mt-2">Our team is here to help. Reach out to us for any questions.</p>
             <div className="mt-4 flex justify-center gap-6">
                <Link href="/contact-us" className="font-semibold text-primary hover:underline flex items-center gap-2">
                    <Mail className="h-5 w-5" /> Contact Us
                </Link>
             </div>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}
