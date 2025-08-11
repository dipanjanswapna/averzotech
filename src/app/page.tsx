import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

export default function Home() {
  const heroImages = [
    { src: 'https://placehold.co/1600x800', alt: 'Fashion sale banner', dataAiHint: 'fashion sale' },
    { src: 'https://placehold.co/1600x800', alt: 'New arrivals banner', dataAiHint: 'new arrivals' },
    { src: 'https://placehold.co/1600x800', alt: 'Ethnic wear banner', dataAiHint: 'ethnic wear' },
  ];

  const brands = [
    { src: 'https://placehold.co/200x200', alt: 'Brand 1', dataAiHint: 'fashion logo' },
    { src: 'https://placehold.co/200x200', alt: 'Brand 2', dataAiHint: 'clothing brand' },
    { src: 'https://placehold.co/200x200', alt: 'Brand 3', dataAiHint: 'luxury logo' },
    { src: 'https://placehold.co/200x200', alt: 'Brand 4', dataAiHint: 'shoe brand' },
    { src: 'https://placehold.co/200x200', alt: 'Brand 5', dataAiHint: 'watch brand' },
    { src: 'https://placehold.co/200x200', alt: 'Brand 6', dataAiHint: 'cosmetics logo' },
    { src: 'https://placehold.co/200x200', alt: 'Brand 7', dataAiHint: 'sports brand' },
    { src: 'https://placehold.co/200x200', alt: 'Brand 8', dataAiHint: 'eyewear logo' },
  ];

  const categories = [
    { name: 'Shirts', src: 'https://placehold.co/400x500', dataAiHint: 'man wearing shirt' },
    { name: 'Jeans', src: 'https://placehold.co/400x500', dataAiHint: 'woman wearing jeans' },
    { name: 'Dresses', src: 'https://placehold.co/400x500', dataAiHint: 'woman in dress' },
    { name: 'Shoes', src: 'https://placehold.co/400x500', dataAiHint: 'stylish shoes' },
    { name: 'Watches', src: 'https://placehold.co/400x500', dataAiHint: 'luxury watch' },
    { name: 'Handbags', src: 'https://placehold.co/400x500', dataAiHint: 'leather handbag' },
  ];

  const deals = [
    { src: 'https://placehold.co/600x400', alt: 'Deal 1', dataAiHint: 'fashion discount' },
    { src: 'https://placehold.co/600x400', alt: 'Deal 2', dataAiHint: 'special offer' },
  ];


  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow">
        <section className="relative w-full">
          <Carousel
            className="w-full"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {heroImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[40vh] md:h-[calc(100vh-80px)]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      data-ai-hint={image.dataAiHint}
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
          </Carousel>
        </section>

        <section className="py-8 md:py-16">
          <div className="container">
            <h2 className="font-headline text-center text-xl font-bold uppercase tracking-wider md:text-3xl mb-6 md:mb-8">
              Medal-Worthy Brands To Bag
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
              {brands.map((brand, index) => (
                <Link href="#" key={index} className="block">
                  <Image
                    src={brand.src}
                    alt={brand.alt}
                    width={200}
                    height={200}
                    className="aspect-square h-auto w-full rounded-full object-cover"
                    data-ai-hint={brand.dataAiHint}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-secondary py-8 md:py-16">
          <div className="container">
            <h2 className="font-headline text-center text-xl font-bold uppercase tracking-wider md:text-3xl mb-6 md:mb-8">
              Shop By Category
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 md:gap-6">
              {categories.map((category, index) => (
                <Link href="#" key={index} className="group block relative">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={category.src}
                      alt={category.name}
                      width={400}
                      height={500}
                      className="h-auto w-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={category.dataAiHint}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <h3 className="font-headline text-white text-xl md:text-2xl font-bold">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-8 md:py-16">
            <div className="container">
                <h2 className="font-headline text-center text-xl font-bold uppercase tracking-wider md:text-3xl mb-6 md:mb-8">
                    Deals Of The Day
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {deals.map((deal, index) => (
                    <Link href="#" key={index} className="group block">
                        <div className="overflow-hidden rounded-lg">
                        <Image
                            src={deal.src}
                            alt={deal.alt}
                            width={600}
                            height={400}
                            className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={deal.dataAiHint}
                        />
                        </div>
                    </Link>
                    ))}
                </div>
            </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
