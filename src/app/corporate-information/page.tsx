
import { SiteHeader } from '@/components/site-header';
import { Building, Target, Users, Handshake } from 'lucide-react';

export default function CorporateInformationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold">Corporate Information</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Learn more about Averzo and our commitment to excellence.
            </p>
          </div>

          <div className="prose lg:prose-xl max-w-none text-foreground space-y-10">
             <div className="flex items-start gap-6">
              <Building className="h-10 w-10 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-2xl mt-0">About Averzo</h2>
                <p>
                  Founded in 2024, Averzo is Bangladesh's premier online shopping destination. We aim to provide a joyful and seamless shopping experience to customers nationwide with the widest range of brands and products on our portal.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <Target className="h-10 w-10 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-2xl mt-0">Our Mission</h2>
                <p>
                  Our mission is to democratize fashion and lifestyle, making it accessible to everyone across Bangladesh. We are committed to delivering the latest trends, high-quality products, and exceptional customer service.
                </p>
              </div>
            </div>

             <div className="flex items-start gap-6">
              <Users className="h-10 w-10 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-2xl mt-0">Our Team</h2>
                <p>
                  We are a team of passionate, energetic, and innovative individuals who are dedicated to building a world-class e-commerce platform. Our diverse team brings together expertise in technology, fashion, logistics, and customer service.
                </p>
              </div>
            </div>
            
             <div className="flex items-start gap-6">
              <Handshake className="h-10 w-10 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-2xl mt-0">Partner with Us</h2>
                <p>
                  Are you a brand or a seller looking to reach millions of customers? We offer a robust platform for vendors to showcase their products and grow their business. Visit our 'Sell on Averzo' page or contact us at <a href="mailto:partners@averzo.com">partners@averzo.com</a> to learn more.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
