/**
 * Generic JSON-LD component for structured data
 * Renders structured data as a script tag with proper escaping
 */

interface JsonLdProps {
  data: Record<string, any>;
}

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

/**
 * Build a Product schema for a Colonel's Pickle product
 */
export function buildProductSchema({
  name,
  description,
  sku,
  slug,
  price,
  stock,
  images,
  averageRating = 0,
  totalReviews = 0,
  siteUrl = 'https://www.colonelspicklebyridhwika.com',
}: {
  name: string;
  description: string;
  sku: string;
  slug: string;
  price: number;
  stock: number;
  images?: Array<{ url: string }>;
  averageRating?: number;
  totalReviews?: number;
  siteUrl?: string;
}): Record<string, any> {
  const canonicalUrl = `${siteUrl}/products/${slug}`;
  const firstImage = images?.[0]?.url;

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    sku,
    brand: {
      '@type': 'Brand',
      name: "Colonel's Pickle",
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'INR',
      price,
      availability:
        stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  // Add image if available
  if (firstImage) {
    schema.image = firstImage;
  }

  // Add aggregateRating if there are reviews
  if (totalReviews > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Math.min(averageRating || 0, 5),
      reviewCount: totalReviews,
    };
  }

  return schema;
}

/**
 * Build an Organization/LocalBusiness schema for Colonel's Pickle
 */
export function buildOrganizationSchema(
  siteUrl = 'https://www.colonelspicklebyridhwika.com'
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#organization`,
    name: "Colonel's Pickle",
    alternateName: "Colonel's Pickle® by Ridhwika Agro Organics",
    description:
      "Colonel's Pickle (Kernel Pickle) — authentic homemade Indian pickles (achaar), gulkand and cold-press mustard oil. No preservatives, no vinegar, 20 to 24 whole spices. FSSAI certified, Jaipur.",
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/brand/ridhwika-crest.png`,
      width: 512,
      height: 512,
    },
    image: `${siteUrl}/og-image.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'B-6/374, Vaishali Nagar',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      postalCode: '302020',
      addressCountry: 'IN',
    },
    email: 'colonelspickle.ridhwika@gmail.com',
    telephone: '+91-9717243306',
    priceRange: '₹250-₹1500',
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'FSSAI License',
      credentialCategory: 'Food Safety License',
      identifier: '12226026000060',
    },
    sameAs: [
      'https://instagram.com/colonels.pickle',
      'https://beacons.ai/colonelspickle',
    ],
  };
}

/**
 * Build a BreadcrumbList schema
 */
export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
  siteUrl = 'https://www.colonelspicklebyridhwika.com'
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
