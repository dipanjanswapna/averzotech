import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'AVERZO - The Ultimate Shopping Destination',
    template: '%s | AVERZO',
  },
  description: 'Discover the latest trends in fashion, electronics, home decor and more at AVERZO. Shop now for the best deals and exclusive offers.',
  keywords: ['averzo', 'online shopping', 'fashion', 'electronics', 'home decor', 'bangladesh'],
  authors: [{ name: 'AVERZO' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    siteName: 'AVERZO',
    title: 'AVERZO - The Ultimate Shopping Destination',
    description: 'Discover the latest trends in fashion, electronics, home decor and more at AVERZO. Shop now for the best deals and exclusive offers.',
    images: [{
      url: `${baseUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: 'AVERZO',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVERZO - The Ultimate Shopping Destination',
    description: 'Discover the latest trends in fashion, electronics, home decor and more at AVERZO. Shop now for the best deals and exclusive offers.',
    images: [`${baseUrl}/twitter-image.png`],
    creator: '@averzo',
  },
  manifest: `${baseUrl}/manifest.json`,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};