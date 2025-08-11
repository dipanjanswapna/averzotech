
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
import { Heart } from 'lucide-react';

export default function Home() {
  const heroImages = [
    { src: 'https://placehold.co/800x450.png', alt: 'Fashion sale banner', dataAiHint: 'fashion sale' },
    { src: 'https://placehold.co/800x450.png', alt: 'New arrivals banner', dataAiHint: 'new arrivals' },
    { src: 'https://placehold.co/800x450.png', alt: 'Ethnic wear banner', dataAiHint: 'ethnic wear' },
  ];

  const brands = [
    { src: 'https://placehold.co/800x450.png', alt: 'Brand 1', dataAiHint: 'fashion logo' },
    { src: 'https://placehold.co/800x450.png', alt: 'Brand 2', dataAiHint: 'clothing brand' },
    { src: 'https://placehold.co/800x450.png', alt: 'Brand 3', dataAiHint: 'luxury logo' },
    { src: 'https://placehold.co/800x450.png', alt: 'Brand 4', dataAiHint: 'shoe brand' },
    { src: 'https://placehold.co/800x450.png', alt: 'Brand 5', dataAiHint: 'watch brand' },
    { src: 'https://placehold.co/800x450.png', alt: 'Brand 6', dataAiHint: 'cosmetics logo' },
    { src: 'https://placehold.co/800x450.png', alt: 'Brand 7', dataAiHint: 'sports brand' },
    { src: 'https://placehold.co/800x450.png', alt: 'Brand 8', dataAiHint: 'eyewear logo' },
    { src: 'https://placehold.co/800x450.png', alt: 'Brand 9', dataAiHint: 'handbag brand' },
    { src: 'https://placehold.co/800x450.png', alt: 'Brand 10', dataAiHint: 'jewelry logo' },
  ];

  const categories = [
    { name: 'Shirts', src: 'https://placehold.co/800x450.png', dataAiHint: 'man wearing shirt' },
    { name: 'Jeans', src: 'https://placehold.co/800x450.png', dataAiHint: 'woman wearing jeans' },
    { name: 'Dresses', src: 'https://placehold.co/800x450.png', dataAiHint: 'woman in dress' },
    { name: 'Shoes', src: 'https://placehold.co/800x450.png', dataAiHint: 'stylish shoes' },
    { name: 'Watches', src: 'https://placehold.co/800x450.png', dataAiHint: 'luxury watch' },
    { name: 'Handbags', src: 'https://placehold.co/800x450.png', dataAiHint: 'leather handbag' },
  ];

  const deals = [
    {
      brand: 'Tokyo Talkies',
      name: 'Women Cropped Shirt',
      size: 'S',
      price: '639',
      originalPrice: '1599',
      discount: '60% OFF',
      src: 'https://placehold.co/800x450.png',
      dataAiHint: 'woman white shirt'
    },
    {
      brand: 'H&M',
      name: 'Slim Fit Jeans',
      size: '32',
      price: '1499',
      originalPrice: '2999',
      discount: '50% OFF',
      src: 'https://placehold.co/800x450.png',
      dataAiHint: 'blue jeans'
    },
    {
      brand: 'Zara',
      name: 'Floral Print Dress',
      size: 'M',
      price: '2490',
      originalPrice: '4990',
      discount: '50% OFF',
      src: 'https://placehold.co/800x450.png',
      dataAiHint: 'summer dress'
    },
    {
      brand: 'Nike',
      name: 'Air Max Sneakers',
      size: '9',
      price: '8295',
      originalPrice: '10295',
      discount: '20% OFF',
      src: 'https://placehold.co/800x450.png',
      dataAiHint: 'running shoes'
    },
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
            <Carousel
              opts={{
                align: "start",
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {brands.map((brand, index) => (
                  <CarouselItem key={index} className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/8">
                    <Link href="#" className="block">
                      <Image
                        src={brand.src}
                        alt={brand.alt}
                        width={200}
                        height={200}
                        className="aspect-square h-auto w-full rounded-full object-cover"
                        data-ai-hint={brand.dataAiHint}
                      />
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </section>

        <section className="py-8 md:py-16">
            <div className="container">
                <h2 className="font-headline text-center text-xl font-bold uppercase tracking-wider md:text-3xl mb-6 md:mb-8">
                    Deals Of The Day
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {deals.map((deal, index) => (
                        <Link href="#" key={index} className="group block">
                            <div className="relative overflow-hidden rounded-lg">
                                <Image
                                    src={deal.src}
                                    alt={deal.name}
                                    width={400}
                                    height={500}
                                    className="h-auto w-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={deal.dataAiHint}
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                   <Button variant="outline" className="w-full bg-white hover:bg-gray-50 border-gray-300">
                                      <Heart className="mr-2 h-4 w-4" /> Wishlist
                                   </Button>
                                </div>
                            </div>
                            <div className="pt-2">
                                <h3 className="text-sm font-bold">{deal.brand}</h3>
                                <p className="text-sm text-muted-foreground truncate">{deal.name}</p>
                                <p className="text-sm font-semibold mt-1">
                                    Rs. {deal.price}{' '}
                                    <span className="text-xs text-muted-foreground line-through">Rs. {deal.originalPrice}</span>{' '}
                                    <span className="text-xs text-accent-foreground font-bold text-orange-500">({deal.discount})</span>
                                </p>
                            </div>
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
      </main>
      <SiteFooter />
    </div>
  );
}
