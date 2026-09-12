import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <>
      {/* Single crawlable H1 for SEO — both banners bake their headline into the
          image, so the semantic H1 lives here (visually hidden, one per page). */}
      <h1 className="sr-only">
        Colonel&apos;s Pickle — Buy Homemade Indian Pickles Online · No
        Preservatives, No Vinegar
      </h1>

      {/* ── DESKTOP / TABLET: the client's designed landscape hero banner ── */}
      <section
        aria-label="Colonel's Pickle — homemade Indian achaar"
        className="relative hidden w-full bg-cp-beige md:block"
      >
        <Link
          href="/products"
          aria-label="Shop Colonel's Pickle achaars"
          className="group relative block w-full overflow-hidden"
        >
          {/* Full-bleed banner: edge to edge, full width, native aspect ratio —
              nothing cropped, no letterbox margins. */}
          <Image
            src="/hero/hero-banner-1.jpg"
            alt="Colonel's Pickle homemade Indian achaar — maa ka pyaar, ghar ka achar. No vinegar, no artificial preservatives, natural ingredients, loved by families."
            width={1671}
            height={941}
            priority
            sizes="100vw"
            className="block h-auto w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
          />
          {/* Soft fade into the next section for a premium seam */}
          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cp-beige to-transparent"
            aria-hidden="true"
          />
        </Link>
      </section>

      {/* ── MOBILE: the same designed poster, portrait crop for phones ── */}
      <section
        aria-label="Colonel's Pickle — homemade Indian achaar"
        className="relative w-full bg-cp-beige md:hidden"
      >
        <Link
          href="/products"
          aria-label="Shop Colonel's Pickle achaars"
          className="group relative block w-full overflow-hidden"
        >
          {/* Full-bleed portrait banner — fills the phone screen edge to edge,
              nothing cropped or letterboxed. */}
          <Image
            src="/hero/hero-banner-mobile.jpg"
            alt="Colonel's Pickle homemade Indian achaar — maa ka pyaar, ghar ka achar. No vinegar, no artificial preservatives, natural ingredients, loved by families."
            width={1086}
            height={1448}
            priority
            sizes="100vw"
            className="block h-auto w-full"
          />
          {/* Soft fade into the next section for a premium seam */}
          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cp-beige to-transparent"
            aria-hidden="true"
          />
        </Link>
      </section>
    </>
  );
}

export default HeroSection;
