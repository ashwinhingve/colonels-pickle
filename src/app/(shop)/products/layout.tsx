import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://colonelspickle.in';

// JSON-LD for CollectionPage
const collectionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: "Shop All Products | Colonel's Pickle",
  description:
    'Authentic homemade pickles, masalas and cold-press oils — no artificial preservatives, 24 whole spices, FSSAI certified, pan-India delivery from Jaipur.',
  url: `${SITE_URL}/products`,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Achaar Collection',
        url: `${SITE_URL}/products?category=achaar`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cold Press Oils',
        url: `${SITE_URL}/products?category=oils`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Gulkand',
        url: `${SITE_URL}/products?category=organic`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Masale & More',
        url: `${SITE_URL}/products?category=masala`,
      },
    ],
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

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
    locale: 'en_IN',
    images: [
      {
        url: `${SITE_URL}/logo.png`,
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionJsonLd) }}
      />
      {children}
    </>
  );
}
