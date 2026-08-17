import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import connectDB from "@/lib/mongodb/connection";
import Product from "@/models/Product";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductPurchase } from "@/components/products/ProductPurchase";
import { ProductAccordion } from "@/components/products/ProductAccordion";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { ShieldCheckIcon, NoPreservativeIcon } from "@/components/illustrations";
import { getProductTheme } from "@/lib/productTheme";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://colonelspickle.in";

const CATEGORY_LABELS: Record<string, string> = {
  achaar: "Achaar Collection",
  masala: "Achaar Masale",
  oils: "Cold Press Oils",
  organic: "Organic & More",
};

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true })
      .select("slug")
      .lean();
    return products.map((p: any) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const product = (await Product.findOne({ slug, isActive: true }).lean()) as any;

  if (!product) return { title: "Product Not Found" };

  const title = product.seo?.metaTitle || `${product.name} | Colonel's Pickle`;
  const description = product.seo?.metaDescription || product.description;
  const canonicalUrl = `${SITE_URL}/products/${product.slug}`;

  // Determine OG image: prefer seo.ogImage, fallback to first product image, then logo
  const ogImageUrl =
    product.seo?.ogImage ||
    product.images?.[0]?.url ||
    `${SITE_URL}/logo.png`;

  return {
    title,
    description,
    keywords: product.seo?.keywords?.length
      ? product.seo.keywords
      : product.tags || [],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: product.seo?.metaTitle || product.name,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "Colonel's Pickle",
      locale: "en_IN",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.seo?.metaTitle || product.name,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  await connectDB();

  const productDoc = (await Product.findOne({ slug, isActive: true })
    .select("-__v")
    .lean()) as any;

  if (!productDoc) notFound();

  const relatedDocs = await Product.find({
    category: productDoc.category,
    isActive: true,
    _id: { $ne: productDoc._id },
  })
    .limit(4)
    .lean();

  const product = JSON.parse(JSON.stringify(productDoc));
  const related = JSON.parse(JSON.stringify(relatedDocs));
  const theme = getProductTheme(product.slug);
  const categoryLabel =
    CATEGORY_LABELS[product.category] || product.category;
  const canonicalUrl = `${SITE_URL}/products/${product.slug}`;

  const productJsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images?.[0]?.url || `${SITE_URL}/logo.png`,
    brand: { "@type": "Brand", name: "Colonel's Pickle" },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  // Add aggregateRating if there are reviews
  if (product.totalReviews && product.totalReviews > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Math.min(product.averageRating || 0, 5),
      reviewCount: product.totalReviews,
    };
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${SITE_URL}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryLabel,
        item: `${SITE_URL}/products?category=${product.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <div className="bg-cp-cream py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4">
        {/* Breadcrumb */}
        <nav className="font-sans text-sm text-cp-text-muted">
          <Link href="/" className="hover:text-cp-crimson">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link href="/products" className="hover:text-cp-crimson">
            Products
          </Link>
          <span className="mx-2">›</span>
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-cp-crimson"
          >
            {categoryLabel}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-cp-text">{product.name}</span>
        </nav>

        {/* Main */}
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left: real images, or colored fallback block */}
          {Array.isArray(product.images) && product.images.length > 0 ? (
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              videoUrl={product.videoUrl}
            />
          ) : (
            <div
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl"
              style={{
                background: `linear-gradient(145deg, ${theme.themeColor}, ${theme.themeColor}CC)`,
              }}
            >
              <RajasthaniPattern
                variant="medallion"
                opacity={0.08}
                color="#ffffff"
              />
              <div className="relative z-10 px-8 text-center">
                <div className="text-[88px]">{theme.icon}</div>
                <p className="mt-4 font-display text-2xl font-extrabold text-white">
                  {product.name}
                </p>
                {theme.nameHindi ? (
                  <p className="mt-1 font-sans text-base text-white/80">
                    {theme.nameHindi}
                  </p>
                ) : null}
              </div>
            </div>
          )}

          {/* Right: details */}
          <div>
            <ProductPurchase product={product} theme={theme} />
            <div className="mt-8">
              <ProductAccordion product={product} />
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {related.length > 0 && (
          <div className="mt-20">
            <SectionHeader
              eyebrow="FROM THE SAME RANGE"
              title="You May Also Like"
            />
            <AnimatedSection direction="up" className="mt-10">
              <StaggerContainer>
                <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                  {related.map((r: any) => (
                    <StaggerItem key={r._id}>
                      <ProductCard product={r} />
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </AnimatedSection>
          </div>
        )}

        {/* Trust & Certification Strip */}
        <div className="mt-16 rounded-2xl border border-cp-border bg-white p-8">
          <h3 className="font-display text-lg font-bold text-cp-text mb-6">
            Why You&apos;ll Love This
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 mb-3 text-cp-olive">
                <NoPreservativeIcon />
              </div>
              <p className="font-sans text-sm font-semibold text-cp-text">
                No Preservatives
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 mb-3 text-cp-olive">
                <ShieldCheckIcon />
              </div>
              <p className="font-sans text-sm font-semibold text-cp-text">
                FSSAI Certified
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 mb-3 text-cp-olive">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm-2 15l-5-5 1.41-1.41L10 12.17l7.59-7.59L19 6l-9 9z" />
                </svg>
              </div>
              <p className="font-sans text-sm font-semibold text-cp-text">
                Homemade Recipe
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 mb-3 text-cp-olive">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
              <p className="font-sans text-sm font-semibold text-cp-text">
                Authentic Taste
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
