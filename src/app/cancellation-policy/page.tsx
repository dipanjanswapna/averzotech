
import { SiteHeader } from '@/components/site-header';
import { XCircle, Clock, CheckCircle } from 'lucide-react';

export default function CancellationPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold">Cancellation Policy</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Understand how you can cancel your order with AVERZO.
            </p>
          </div>

          <div className="prose lg:prose-xl max-w-none text-foreground space-y-8">
            <div className="flex items-start gap-4">
              <XCircle className="h-8 w-8 text-primary mt-1" />
              <div>
                <h2 className="font-semibold text-2xl mt-0">How to Cancel an Order</h2>
                <p>
                    You can cancel your order at any time before it has been processed for shipping. To cancel your order, please follow these steps:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                    <li>Log in to your AVERZO account.</li>
                    <li>Go to the "My Orders" section.</li>
                    <li>Find the order you wish to cancel and click on the "Cancel Order" button.</li>
                    <li>Select a reason for cancellation and confirm.</li>
                </ol>
                <p>If the "Cancel Order" button is not visible, it means your order has already been shipped, and it can no longer be cancelled.</p>
              </div>
            </div>

             <div className="flex items-start gap-4">
              <Clock className="h-8 w-8 text-primary mt-1" />
              <div>
                <h2 className="font-semibold text-2xl mt-0">Cancellation After Shipping</h2>
                 <p>
                    If your order has already been shipped, you will not be able to cancel it. However, you can refuse to accept the delivery from the courier. Once the product is returned to us, we will process the refund for pre-paid orders.
                 </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="h-8 w-8 text-primary mt-1" />
              <div>
                <h2 className="font-semibold text-2xl mt-0">Refunds for Cancelled Orders</h2>
                 <p>
                    For pre-paid orders that are successfully cancelled, the refund will be processed to the original payment method within 5-7 business days. For Cash on Delivery orders, no refund is necessary as no payment was made.
                 </p>
              </div>
            </div>

             <h2 className="font-semibold text-2xl">Cancellation by AVERZO</h2>
            <p>
              AVERZO reserves the right to cancel any order for various reasons, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The product is out of stock or discontinued.</li>
              <li>Inaccuracies or errors in product or pricing information.</li>
              <li>Issues identified by our credit and fraud avoidance department.</li>
            </ul>
            <p>If your order is cancelled by us, you will be notified, and a full refund will be issued for any pre-paid orders.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
