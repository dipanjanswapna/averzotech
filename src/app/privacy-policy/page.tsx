
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground mt-2">Your privacy is important to us. It is AVERZO's policy to respect your privacy regarding any information we may collect from you across our website.</p>
          </div>

          <div className="prose lg:prose-xl max-w-none text-foreground space-y-6">
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>

            <h2 className="font-semibold text-2xl">1. Information We Collect</h2>
            <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information. This includes information for order processing, account creation, and customer support.</p>
             <ul className="list-disc pl-6 space-y-2">
                <li><strong>Log data:</strong> Like most website operators, we collect information that your browser sends whenever you visit our site. This may include your IP address, browser type, browser version, the pages you visit, and the time and date of your visit.</li>
                <li><strong>Personal Information:</strong> We may ask you for personal information, such as your name, email address, mailing address, and phone number, for order processing and account management.</li>
                <li><strong>Payment Information:</strong> When you make a purchase, we process your payment information through a secure third-party payment processor. We do not store your full credit card details on our servers.</li>
            </ul>

            <h2 className="font-semibold text-2xl">2. How We Use Your Information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                <li>Process your transactions and prevent fraud</li>
            </ul>
            
            <h2 className="font-semibold text-2xl">3. Security of Your Information</h2>
            <p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>
            
            <h2 className="font-semibold text-2xl">4. Cookies</h2>
            <p>We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits, and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>

            <h2 className="font-semibold text-2xl">5. Links to Other Sites</h2>
            <p>Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>

            <h2 className="font-semibold text-2xl">6. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.</p>

            <h2 className="font-semibold text-2xl">Contact Us</h2>
            <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
