import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import SessionProvider from "@/components/providers/SessionProvider";
import MotionProvider from "@/components/providers/MotionProvider";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { connectDB } from "@/lib/mongodb";
import MarketingSettings from "@/models/MarketingSettings";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.colonelspicklebyridhwika.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Colonel's Pickle® — Homemade Indian Pickles Online (Kernel Pickle)",
    template: "%s | Colonel's Pickle",
  },
  description:
    "Buy Colonel's Pickle — authentic homemade Indian pickles (achaar), gulkand & cold-press mustard oil made by the mother of an Indian Army Colonel. No preservatives, no vinegar, 20–24 whole spices. FSSAI licensed, with pan-India delivery from Jaipur.",
  keywords: [
    "colonels pickle",
    "colonel's pickle",
    "kernel pickle",
    "kernal pickle",
    "colonel pickle",
    "colonel ka achar",
    "colonel's pickle jaipur",
    "indian pickle",
    "indian pickles online",
    "buy pickle online india",
    "homemade pickle",
    "homemade achaar",
    "achaar online",
    "ghar ka achar",
    "mango pickle",
    "aam ka achar",
    "green chilli pickle",
    "hari mirch ka achar",
    "garlic pickle",
    "lehsun ka achar",
    "mixed pickle",
    "organic gulkand",
    "cold press mustard oil",
    "kachi ghani oil",
    "Rajasthani pickle",
    "no preservatives pickle",
    "no vinegar pickle",
    "FSSAI pickle",
    "Jaipur pickle",
    "Ridhwika Agro Organics",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  // Favicon + apple-touch icon come from src/app/icon.png & src/app/apple-icon.png
  // (Ridhwika crest), auto-emitted by Next.js — no explicit icons config needed.
  openGraph: {
    title: "Colonel's Pickle® (Kernel Pickle) — Homemade Indian Pickles Online",
    description:
      "Authentic homemade Indian pickles (achaar), gulkand & cold-press mustard oil. No preservatives, no vinegar, 20–24 whole spices, a mother's recipe. FSSAI certified, pan-India delivery from Jaipur.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Colonel's Pickle® — homemade Indian pickles · Maa Ka Pyaar, Ghar Ka Achaar",
      },
    ],
    siteName: "Colonel's Pickle by Ridhwika Agro Organics",
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Colonel's Pickle® (Kernel Pickle) — Homemade Indian Pickles Online",
    description:
      "Authentic homemade Indian pickles, gulkand & cold-press oils. No preservatives, no vinegar, 20–24 whole spices, FSSAI certified. Pan-India delivery from Jaipur.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  "name": "Colonel's Pickle",
  // "Colonel" is pronounced "kernel" — list the spellings people actually search
  // so Google resolves all of them to this one brand entity.
  "alternateName": [
    "Colonel's Pickle by Ridhwika Agro Organics",
    "Kernel Pickle",
    "Colonels Pickle",
    "Colonel Pickle",
    "Ridhwika Agro Organics",
  ],
  "url": SITE_URL,
  "logo": {
    "@type": "ImageObject",
    "url": `${SITE_URL}/images/brand/ridhwika-crest.png`,
    "width": 512,
    "height": 512,
  },
  "image": `${SITE_URL}/og-image.jpg`,
  "description": "Colonel's Pickle (Kernel Pickle) — authentic homemade Indian pickles (achaar), gulkand and cold-press mustard oil. No preservatives, no vinegar, 20 to 24 whole spices. FSSAI certified, Jaipur.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "B-6/374, Vaishali Nagar",
    "addressLocality": "Jaipur",
    "addressRegion": "Rajasthan",
    "postalCode": "302020",
    "addressCountry": "IN",
  },
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "name": "FSSAI License",
    "credentialCategory": "Food Safety License",
    "identifier": "12226026000060",
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9717243306",
    "email": "colonelspickle.ridhwika@gmail.com",
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": ["en", "hi"],
  },
  "sameAs": [
    "https://instagram.com/colonels.pickle",
    "https://beacons.ai/colonelspickle",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  "url": SITE_URL,
  "name": "Colonel's Pickle",
  "description": "Authentic homemade pickles, gulkand & cold press oils — Maa Ka Pyaar, Ghar Ka Achaar",
  "publisher": {
    "@id": `${SITE_URL}/#organization`,
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SITE_URL}/products?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

async function getMarketingSettings() {
  try {
    await connectDB();
    const settings = await MarketingSettings.findOne({ key: 'global' }).lean() as any;
    return {
      gtm_id: settings?.gtm_id || '',
      gtm_enabled: settings?.gtm_enabled ?? false,
      google_analytics_id: settings?.google_analytics_id || '',
      google_ads_conversion_id: settings?.google_ads_conversion_id || '',
      google_ads_label: settings?.google_ads_label || '',
      meta_pixel_id: settings?.meta_pixel_id || '',
    };
  } catch {
    // If DB is unreachable, inject nothing — don't crash the layout
    return {
      gtm_id: '',
      gtm_enabled: false,
      google_analytics_id: '',
      google_ads_conversion_id: '',
      google_ads_label: '',
      meta_pixel_id: '',
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const marketing = await getMarketingSettings();

  return (
    <html lang="en">
      <head>
        {/* Preconnect + Google Fonts stylesheet — moved out of the CSS @import
            so it is discovered early and loaded in parallel (better FCP/LCP). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router root layout: this <head> applies to every route, not a single page */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Mukta:wght@300;400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap"
        />

        {/* Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(orgJsonLd) }}
        />
        {/* WebSite structured data with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd) }}
        />

        {/* === TRACKING SCRIPTS === */}

        {/* Google Tag Manager — primary hub (suppresses all direct scripts below) */}
        {marketing.gtm_enabled && marketing.gtm_id && (
          <Script id="gtm-head" strategy="beforeInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${marketing.gtm_id}');`}
          </Script>
        )}

        {/* Google Analytics 4 + Google Ads — only when GTM is OFF
            Single gtag.js load; both IDs configured in one init block */}
        {!marketing.gtm_enabled && (marketing.google_analytics_id || marketing.google_ads_conversion_id) && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${marketing.google_analytics_id || marketing.google_ads_conversion_id}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${
                marketing.google_analytics_id ? `gtag('config','${marketing.google_analytics_id}');` : ''
              }${
                marketing.google_ads_conversion_id ? `gtag('config','${marketing.google_ads_conversion_id}');` : ''
              }`}
            </Script>
          </>
        )}

        {/* Meta Pixel — only when GTM is OFF */}
        {!marketing.gtm_enabled && marketing.meta_pixel_id && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${marketing.meta_pixel_id}');fbq('track','PageView');`}
          </Script>
        )}
      </head>
      <body>
        {/* GTM noscript fallback — must be immediately after <body> */}
        {marketing.gtm_enabled && marketing.gtm_id && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${marketing.gtm_id}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <SessionProvider>
          <MotionProvider>
            <ScrollProgress />
            <AnnouncementBar />
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <CartDrawer />
            <WhatsAppFloat />
          </MotionProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
