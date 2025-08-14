
import { SiteHeader } from '@/components/site-header';
import { Truck, Clock, MapPin } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold">Shipping Policy</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Everything you need to know about how we get your order to you.
            </p>
          </div>

          <div className="prose lg:prose-xl max-w-none text-foreground space-y-8">
            <div className="flex items-start gap-4">
              <Truck className="h-8 w-8 text-primary mt-1" />
              <div>
                <h2 className="font-semibold text-2xl mt-0">Shipping Partners</h2>
                <p>We partner with leading courier services to ensure your order reaches you safely and on time. Our primary partners include Pathao, REDX, and Sundarban Courier Service.</p>
              </div>
            </div>

             <div className="flex items-start gap-4">
              <Clock className="h-8 w-8 text-primary mt-1" />
              <div>
                <h2 className="font-semibold text-2xl mt-0">Delivery Timeframes</h2>
                <p>Delivery times are estimated and commence from the date of shipping, rather than the date of order. Estimated delivery times are as follows:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Inside Dhaka:</strong> 2-3 business days.</li>
                    <li><strong>Outside Dhaka:</strong> 5-7 business days.</li>
                </ul>
                <p>Please note that business days do not include weekends or public holidays.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="h-8 w-8 text-primary mt-1" />
              <div>
                <h2 className="font-semibold text-2xl mt-0">Shipping Costs</h2>
                 <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Inside Dhaka:</strong> ৳60</li>
                    <li><strong>Outside Dhaka:</strong> ৳120</li>
                    <li><strong>Free Shipping:</strong> We offer free shipping on all pre-paid orders over ৳2000.</li>
                </ul>
              </div>
            </div>
            
            <h2 className="font-semibold text-2xl">Order Tracking</h2>
            <p>
              Once your order has been shipped, you will receive an email and/or SMS notification with a tracking number. You can use this number to track your order's status on the respective courier's website. You can also find the tracking information in the 'My Orders' section of your account.
            </p>

             <h2 className="font-semibold text-2xl">Important Notes</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Order processing can take up to 1-2 business days before shipping.</li>
                <li>Delivery times may be longer during peak periods such as Eid or major sales campaigns.</li>
                <li>We are not responsible for delays caused by the courier service or due to unforeseen circumstances like natural disasters or political unrest.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
