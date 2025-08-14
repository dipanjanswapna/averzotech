
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Home, Mail, Phone } from 'lucide-react';

export default function ContactUsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold">Contact Us</h1>
          <p className="text-lg text-muted-foreground mt-2">We'd love to hear from you. Get in touch with us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form and our team will get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Kamal Hasan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="e.g. Order Inquiry" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message..." rows={5} />
                </div>
                <Button size="lg" className="w-full">Send Message</Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
                 <h2 className="text-2xl font-semibold">Contact Information</h2>
                 <div className="space-y-3 text-muted-foreground">
                     <div className="flex items-start gap-4">
                        <Home className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold text-foreground">Our Address</h3>
                            <p>123 Averzo Avenue, Fashion Street, Dhaka 1213, Bangladesh</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary mt-1" />
                         <div>
                            <h3 className="font-semibold text-foreground">Email Us</h3>
                            <p>contact@averzo.com</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 text-primary mt-1" />
                         <div>
                            <h3 className="font-semibold text-foreground">Call Us</h3>
                            <p>+880 96XX XXXXXX</p>
                        </div>
                    </div>
                 </div>
            </div>
             <div className="space-y-4">
                 <h2 className="text-2xl font-semibold">Find us on Map</h2>
                  <div className="aspect-video w-full rounded-lg overflow-hidden border">
                     <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902445890288!2d90.3887390154034!3d23.75083808458925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8bcd681372b%3A0x5c2b8755e3a0735!2sDhaka!5e0!3m2!1sen!2sbd!4v1676458535123!5m2!1sen!2sbd" 
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                  </div>
             </div>

          </div>
        </div>
      </main>
    </div>
  );
}
