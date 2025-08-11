
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function ReturnsPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold">Returns & Exchanges</h1>
            <p className="text-lg text-muted-foreground mt-2">
              We want you to be completely satisfied with your purchase. If you're not, we're here to help.
            </p>
          </div>

          <div className="prose lg:prose-xl max-w-none text-foreground space-y-6">
            <p>
              Our policy allows for returns and exchanges on most items within 14 days of receipt. To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging with all tags attached.
            </p>

            <h2 className="font-semibold text-2xl">Return Process</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong>Initiate a Return:</strong> Go to the 'My Orders' section of your account, select the order containing the item you wish to return, and click on the 'Return/Exchange' button.
              </li>
              <li>
                <strong>Prepare Your Package:</strong> Pack the items securely in the original packaging. Please include the original invoice or a note with your order number.
              </li>
              <li>
                <strong>Schedule a Pickup:</strong> Our logistics partner will contact you to schedule a pickup from your address. Please ensure the package is ready for collection.
              </li>
              <li>
                <strong>Refund/Exchange Processing:</strong> Once we receive and inspect your returned item, we will process your refund or exchange. Refunds will be credited to the original method of payment within 5-7 business days.
              </li>
            </ol>

            <h2 className="font-semibold text-2xl">Non-Returnable Items</h2>
            <p>Certain types of items cannot be returned, like:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Innerwear and lingerie</li>
              <li>Swimwear</li>
              <li>Cosmetics and beauty products</li>
              <li>Customized products</li>
              <li>Gift cards</li>
            </ul>
            <p>Please check the product page to see if an item is returnable.</p>

            <h2 className="font-semibold text-2xl">Damaged or Incorrect Items</h2>
            <p>
              If you received a damaged, defective, or incorrect item, please contact our customer support team within 48 hours of delivery. We will arrange for a replacement or a full refund at no extra cost to you.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
