import Link from "next/link";
import connectDB from "@/lib/mongodb/connection";
import Product from "@/models/Product";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { TapScale } from "@/components/shared/TapScale";

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
          eyebrow="⚔️ SOLDIER'S SELECTION"
          title="Signature Homemade Pickles"
          subtitle="Crafted in small batches with a mother's recipe — 24 whole spices, cold-pressed mustard oil, and zero artificial preservatives."
        />

        {products.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <TapScale asChild>
            <Link
              href="/products"
              className="inline-block rounded-lg border-2 border-cp-olive bg-cp-olive px-7 py-3 font-sans text-sm font-bold uppercase tracking-[0.08em] text-white transition-all hover:bg-cp-olive-dark hover:shadow-[0_8px_20px_rgba(212,160,23,0.3)]"
            >
              VIEW FULL ARSENAL ⚔️
            </Link>
          </TapScale>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
