
import { SiteHeader } from '@/components/site-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | AVERZO',
  description: 'Read the terms and conditions for using the AVERZO website and services.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold">Terms & Conditions</h1>
            <p className="text-lg text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose lg:prose-xl max-w-none text-foreground space-y-6">
            <p>Welcome to AVERZO. These terms and conditions outline the rules and regulations for the use of AVERZO's Website, located at averzo.com.</p>
            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use AVERZO if you do not agree to take all of the terms and conditions stated on this page.</p>

            <h2 className="font-semibold text-2xl">1. Introduction</h2>
            <p>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Averzo accessible at averzo.com.</p>

            <h2 className="font-semibold text-2xl">2. Intellectual Property Rights</h2>
            <p>Other than the content you own, under these Terms, AVERZO and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.</p>

            <h2 className="font-semibold text-2xl">3. Restrictions</h2>
            <p>You are specifically restricted from all of the following:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>publishing any Website material in any other media;</li>
              <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
              <li>publicly performing and/or showing any Website material;</li>
              <li>using this Website in any way that is or may be damaging to this Website;</li>
              <li>using this Website in any way that impacts user access to this Website;</li>
              <li>using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;</li>
              <li>engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;</li>
              <li>using this Website to engage in any advertising or marketing.</li>
            </ul>

            <h2 className="font-semibold text-2xl">4. Your Content</h2>
            <p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant AVERZO a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>

            <h2 className="font-semibold text-2xl">5. No warranties</h2>
            <p>This Website is provided “as is,” with all faults, and AVERZO express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.</p>

            <h2 className="font-semibold text-2xl">6. Limitation of liability</h2>
            <p>In no event shall AVERZO, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. AVERZO, including its officers, directors and employees shall not not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>

            <h2 className="font-semibold text-2xl">7. Governing Law & Jurisdiction</h2>
            <p>These Terms will be governed by and interpreted in accordance with the laws of Bangladesh, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Bangladesh for the resolution of any disputes.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
