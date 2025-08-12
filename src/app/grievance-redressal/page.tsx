
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Mail, Phone } from 'lucide-react';

export default function GrievanceRedressalPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold">Grievance Redressal</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Our commitment to resolving your issues.
            </p>
          </div>

          <div className="prose lg:prose-xl max-w-none text-foreground space-y-6">
            <p>
              At AVERZO, we are dedicated to providing you with the best possible shopping experience. However, if you feel that your concerns have not been adequately addressed by our customer support team, you can escalate the matter through our Grievance Redressal mechanism.
            </p>

            <h2 className="font-semibold text-2xl">How to Escalate a Grievance</h2>
            <p>
              Before escalating, please ensure you have already contacted our customer support team through the <a href="/contact-us">Contact Us</a> page and have a ticket or reference number for your issue.
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong>Level 1: Customer Support:</strong> For any initial complaints, please contact our customer support team via email or phone. We aim to resolve all issues within 48 hours.
              </li>
              <li>
                <strong>Level 2: Escalation to Grievance Officer:</strong> If you are not satisfied with the resolution from our customer support, you can write to our Grievance Officer with your ticket number and a detailed explanation of your issue.
              </li>
            </ol>
            

            <h2 className="font-semibold text-2xl">Grievance Officer Contact Details</h2>
            <p>
              You can contact our Grievance Officer for issues that have not been resolved to your satisfaction at the primary level.
            </p>
            <div className="not-prose bg-secondary p-6 rounded-lg">
                 <div className="space-y-3 text-muted-foreground">
                     <p className="font-semibold text-foreground text-lg">Mr. Grievance Officer</p>
                     <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary mt-1" />
                         <div>
                            <h3 className="font-semibold text-foreground">Email</h3>
                            <p>grievance.officer@averzo.com</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 text-primary mt-1" />
                         <div>
                            <h3 className="font-semibold text-foreground">Phone</h3>
                            <p>+880 96XX XXXXXX (10 AM to 6 PM, Sunday - Thursday)</p>
                        </div>
                    </div>
                 </div>
            </div>
            <p>We are committed to addressing your grievances promptly and fairly. Please allow 7-10 business days for our Grievance Officer to review and respond to your case.</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
