
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const jobOpenings = [
  {
    title: 'Senior Frontend Developer',
    location: 'Dhaka, Bangladesh',
    type: 'Full-time',
    department: 'Engineering',
  },
  {
    title: 'Digital Marketing Manager',
    location: 'Dhaka, Bangladesh',
    type: 'Full-time',
    department: 'Marketing',
  },
  {
    title: 'Product Manager - Mobile Apps',
    location: 'Remote',
    type: 'Full-time',
    department: 'Product',
  },
  {
    title: 'UI/UX Designer',
    location: 'Dhaka, Bangladesh',
    type: 'Contract',
    department: 'Design',
  },
];

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow">
        <section className="bg-primary/5 py-20 text-center">
            <div className="container">
                <h1 className="text-4xl font-headline font-bold">Join Our Team</h1>
                <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                    Be a part of a passionate team that is reshaping the future of e-commerce in Bangladesh.
                </p>
                <Button size="lg" className="mt-6">View Open Positions</Button>
            </div>
        </section>
        
        <section className="container py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Current Openings</h2>
            <div className="max-w-4xl mx-auto space-y-6">
                {jobOpenings.map((job, index) => (
                     <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                           <div>
                                <h3 className="text-xl font-semibold text-primary">{job.title}</h3>
                                <p className="text-muted-foreground mt-1">{job.department} • {job.location} • {job.type}</p>
                           </div>
                            <Button asChild variant="outline">
                                <Link href="#">
                                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                     </Card>
                ))}
            </div>
             <div className="text-center mt-12">
                <p className="text-muted-foreground">Don't see a role that fits? Send your resume to</p>
                <a href="mailto:careers@averzo.com" className="text-primary font-semibold hover:underline">careers@averzo.com</a>
            </div>
        </section>

      </main>
    </div>
  );
}
