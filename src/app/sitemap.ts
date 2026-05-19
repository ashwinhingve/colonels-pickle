import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb/connection';
import Product from '@/models/Product';

export const revalidate = 86400; // refresh sitemap every 24 hours

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://colonelspickle.in';

const staticPages: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${SITE_URL}/products`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/wholesale`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectDB();

    const products = await Product.find({ isActive: true })
      .select('slug updatedAt')
      .sort({ updatedAt: -1 })
      .lean();

    const productUrls: MetadataRoute.Sitemap = (products as any[]).map(
      (product) => ({
        url: `${SITE_URL}/products/${product.slug}`,
        lastModified: product.updatedAt
          ? new Date(product.updatedAt)
          : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    );

    return [...staticPages, ...productUrls];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return staticPages;
  }
}
