import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-cp-cream px-4 text-center">
      <Image
        src="/logo.png"
        alt="Colonel's Pickle by Ridhwika Agro Organics"
        width={72}
        height={72}
        className="object-contain mb-4"
      />
      <span className="text-[80px]">🫙</span>
      <h1 className="mt-2 font-display text-7xl font-extrabold text-cp-crimson">
        404
      </h1>
      <h2 className="mt-2 font-display text-2xl font-bold text-cp-text">
        Page not found
      </h2>
      <p className="mt-3 max-w-md font-serif text-cp-text-muted">
        Looks like this jar is empty. The page you&apos;re after doesn&apos;t
        exist or has moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/products"
          className="rounded-lg bg-cp-crimson px-6 py-3 font-sans text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-cp-crimson-dark"
        >
          Back to Shop
        </Link>
        <Link
          href="/"
          className="rounded-lg border-2 border-cp-crimson px-6 py-3 font-sans text-sm font-bold uppercase tracking-wide text-cp-crimson transition-colors hover:bg-cp-crimson hover:text-white"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
