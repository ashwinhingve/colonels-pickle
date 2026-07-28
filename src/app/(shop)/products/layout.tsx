import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://colonelspickle.in';

export const metadata: Metadata = {
  title: "Shop All Products | Colonel's Pickle",
  description:
    'Browse authentic homemade pickles, traditional masalas and cold-press oils — made with 24 whole spices and zero artificial preservatives. FSSAI certified. Pan-India delivery from Jaipur.',
  keywords: [
    'buy pickle online India',
    'homemade achar online',
    'preservative-free pickle',
    'cold press mustard oil online',
    'buy masala online',
    "Colonel's Pickle shop",
    'authentic Rajasthani achar',
    'Ridhwika Agro Organics products',
    'traditional Indian pickle',
    'FSSAI certified pickle',
  ],
  alternates: {
    canonical: `${SITE_URL}/products`,
  },
  openGraph: {
    title: "Shop All Products | Colonel's Pickle",
    description:
      'Authentic homemade pickles, masalas and cold-press oils. No artificial preservatives. FSSAI certified. Pan-India delivery from Jaipur.',
    url: `${SITE_URL}/products`,
    type: 'website',
    siteName: "Colonel's Pickle",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: "Colonel's Pickle — Shop All Products",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shop All Products | Colonel's Pickle",
    description:
      'Authentic homemade pickles, masalas and cold-press oils. No artificial preservatives.',
    images: ['/logo.png'],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
