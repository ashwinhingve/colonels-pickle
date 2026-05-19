import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import connectDB from "@/lib/mongodb/connection";
import Product from "@/models/Product";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductPurchase } from "@/components/products/ProductPurchase";
import { ProductAccordion } from "@/components/products/ProductAccordion";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { SectionHeader } from "@/components/common/SectionHeader";
import { getProductTheme } from "@/lib/productTheme";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://colonelspickle.in";

const CATEGORY_LABELS: Record<string, string> = {
  achaar: "Achaar Collection",
  masala: "Achaar Masale",
  oils: "Cold Press Oils",
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
          {/* Left: colored image block */}
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
            <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {related.map((r: any) => (
                <ProductCard key={r._id} product={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
