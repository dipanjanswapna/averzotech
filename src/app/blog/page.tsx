
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const blogPosts = [
  {
    title: 'The Ultimate Guide to Summer Fashion',
    description: 'Stay cool and stylish this summer with our top fashion picks.',
    image: 'https://placehold.co/600x400.png',
    date: 'August 15, 2025',
    link: '#',
    dataAiHint: 'summer fashion',
  },
  {
    title: 'How to Choose the Perfect Pair of Jeans',
    description: 'From skinny to wide-leg, find the denim that fits you best.',
    image: 'https://placehold.co/600x400.png',
    date: 'August 10, 2025',
    link: '#',
    dataAiHint: 'jeans model',
  },
  {
    title: 'Accessorize Like a Pro: Tips & Tricks',
    description: 'Elevate any outfit with the right accessories.',
    image: 'https://placehold.co/600x400.png',
    date: 'August 5, 2025',
    link: '#',
    dataAiHint: 'fashion accessories',
  },
];

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold">Averzo Blog</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Your daily dose of fashion, lifestyle, and inspiration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Link href={post.link} key={index}>
              <Card className="overflow-hidden h-full group">
                <CardHeader className="p-0">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={post.dataAiHint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardDescription>{post.date}</CardDescription>
                  <CardTitle className="text-xl mt-2 mb-2 group-hover:text-primary transition-colors">{post.title}</CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
