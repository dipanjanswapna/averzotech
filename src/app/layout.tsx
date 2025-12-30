
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/hooks/use-cart';
import { WishlistProvider } from '@/hooks/use-wishlist';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { SiteFooter } from '@/components/site-footer';
import { Roboto } from 'next/font/google';
import { DynamicComponents } from '@/components/dynamic-components';
import { CartSheet } from '@/components/cart-sheet';
import { FirebaseProvider } from '@/firebase/provider';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
});

import { defaultMetadata } from '@/config/metadata';
export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${roboto.variable}`}>
      <body className="font-sans antialiased">
        <FirebaseProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex flex-col min-h-screen">
                <main className="flex-grow">{children}</main>
                <CartSheet />
                <DynamicComponents />
                <SiteFooter />
              </div>
              <MobileBottomNav />
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
