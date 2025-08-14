
import Link from 'next/link';
import Image from 'next/image';

export function PreFooterCta() {
    return (
        <section className="container py-8 md:py-12">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <Link href="/shop?category=Kids">
                        <div className="relative aspect-[2.4/1] w-full overflow-hidden rounded-lg group">
                            <Image src="https://i.postimg.cc/Pq3pLM5g/kids-bedding.jpg" alt="Kids bedding" fill className="object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint="kids bedding"/>
                            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-4 text-center">
                                <h3 className="text-2xl font-bold">Snug & Fun</h3>
                                <p className="text-sm">Kid, live, play</p>
                                <span className="mt-2 text-xs font-bold underline">SHOP NOW</span>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-span-1">
                    <Link href="/shop?category=Women&group=Jewellery%20&%20Accessories">
                        <div className="relative aspect-[1/1] w-full overflow-hidden rounded-lg group">
                            <Image src="https://i.postimg.cc/t4G2m1B3/turquoise-jewel.jpg" alt="Turquoise jewelry" fill className="object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint="turquoise jewelry"/>
                            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-4 text-center">
                                <h3 className="text-2xl font-bold">Turquoise Novelty</h3>
                                <p className="text-sm">Explore gallery</p>
                                <span className="mt-2 text-xs font-bold underline">SHOP NOW</span>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-span-1">
                    <Link href="/shop?category=Women&group=Jewellery%20&%20Accessories">
                        <div className="relative aspect-[1/1] w-full overflow-hidden rounded-lg group">
                            <Image src="https://i.postimg.cc/d1h2pWzK/teal-handbag.jpg" alt="Teal handbag" fill className="object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint="teal handbag"/>
                            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-4 text-center">
                                <h3 className="text-2xl font-bold">A Vivid Teal</h3>
                                <p className="text-sm">Explore accessories</p>
                                <span className="mt-2 text-xs font-bold underline">SHOP NOW</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
