import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://colonelspickle.in';

// JSON-LD for CollectionPage
const collectionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: "Shop All Products | Colonel's Pickle",
  description:
    'Authentic homemade pickles, masalas and cold-press oils — no artificial preservatives, 20 to 24 whole spices, FSSAI certified, pan-India delivery from Jaipur.',
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
  // Brand baked in: the (shop) route group's layout sets a plain-string title,
  // which stops the root `%s | Colonel's Pickle` template from reaching here.
  title: "Shop Homemade Indian Pickles, Oils & Gulkand | Colonel's Pickle",
  description:
    'Buy Colonel\'s Pickle (Kernel Pickle) online — authentic homemade Indian pickles (achaar), traditional masalas, gulkand and cold-press mustard oil. 20 to 24 whole spices, zero artificial preservatives, no vinegar. FSSAI certified, pan-India delivery from Jaipur.',
  keywords: [
    'buy pickle online india',
    'indian pickles online',
    'kernel pickle',
    'homemade achar online',
    'mango pickle online',
    'green chilli pickle',
    'garlic pickle',
    'preservative-free pickle',
    'cold press mustard oil online',
    'buy masala online',
    'gulkand online',
    "Colonel's Pickle shop",
    'authentic Rajasthani achar',
    'traditional Indian pickle',
    'FSSAI certified pickle',
  ],
  alternates: {
    canonical: `${SITE_URL}/products`,
  },
  openGraph: {
    title: "Shop Homemade Indian Pickles, Oils & Gulkand | Colonel's Pickle",
    description:
      'Authentic homemade Indian pickles, masalas, gulkand and cold-press oils. No preservatives, no vinegar. FSSAI certified. Pan-India delivery from Jaipur.',
    url: `${SITE_URL}/products`,
    type: 'website',
    siteName: "Colonel's Pickle",
    locale: 'en_IN',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Colonel's Pickle — shop homemade Indian pickles, oils & gulkand",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shop Homemade Indian Pickles, Oils & Gulkand | Colonel's Pickle",
    description:
      'Authentic homemade Indian pickles, masalas and cold-press oils. No preservatives, no vinegar.',
    images: [`${SITE_URL}/og-image.jpg`],
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
