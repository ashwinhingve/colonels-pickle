import Link from "next/link";
import connectDB from "@/lib/mongodb/connection";
import Product from "@/models/Product";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { TapScale } from "@/components/shared/TapScale";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";

async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find({
      isActive: true,
      isFeatured: true,
    })
      .limit(8)
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="bg-cp-cream py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="OUR ACHAAR COLLECTION"
          title="Signature Homemade Pickles"
          subtitle="Crafted in small batches with a mother's recipe — 20 to 24 whole spices, cold-pressed mustard oil, and zero artificial preservatives."
        />

        {products.length > 0 && (
          <StaggerContainer
            staggerDelay={0.08}
            className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
          >
            {products.map((product: any) => (
              <StaggerItem key={product._id} className="h-full">
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        <div className="mt-12 text-center">
          <TapScale asChild>
            <Link
              href="/products"
              className="btn-sheen group inline-flex items-center gap-2 rounded-lg border-2 border-cp-crimson px-7 py-3 font-sans text-sm font-bold uppercase tracking-wide text-cp-crimson transition-all hover:bg-cp-crimson hover:text-white hover:shadow-lg"
            >
              <span>View All 15+ Products</span>
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </TapScale>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
