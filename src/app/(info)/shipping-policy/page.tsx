import React from "react"
import { Metadata } from "next"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { CornerFlourish, DeliveryTruckIllustration } from "@/components/illustrations"
import { Truck, MapPin, Clock, Package, Phone, Mail, IndianRupee, AlertCircle } from "lucide-react"
import { connectDB } from "@/lib/mongodb"
import PageContent from "@/models/PageContent"

export const dynamic = "force-dynamic"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://colonelspickle.in';

export const metadata: Metadata = {
  title: "Shipping Policy | Colonel's Pickle",
  description: "Shipping Policy for Colonel's Pickle. Fast, reliable delivery across India.",
  alternates: {
    canonical: `${SITE_URL}/shipping-policy`,
  },
  openGraph: {
    title: "Shipping Policy | Colonel's Pickle",
    description:
      "Learn about Colonel's Pickle shipping options, costs, and delivery timelines across India.",
    url: `${SITE_URL}/shipping-policy`,
    type: 'website',
    siteName: "Colonel's Pickle",
    locale: 'en_IN',
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Colonel's Pickle — Shipping Policy",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shipping Policy | Colonel's Pickle",
    description:
      "Learn about Colonel's Pickle shipping options, costs, and delivery timelines across India.",
    images: [`${SITE_URL}/logo.png`],
  },
}

// Default hardcoded content - fallback if no published DB record
function DefaultContent() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cp-beige via-white to-cp-cream py-20 md:py-32">
        <CornerFlourish className="absolute top-6 left-6 w-20 h-20 text-cp-olive opacity-20" />
        <CornerFlourish className="absolute bottom-6 right-6 w-20 h-20 text-cp-terracotta opacity-20 transform rotate-180" />
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up" duration={0.65} className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-cp-terracotta to-cp-terracotta-deep rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-cp-text">
              Shipping
              <span className="block bg-gradient-to-r from-cp-terracotta to-cp-olive bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-cp-text-muted mb-4">
              Fast, reliable delivery across India
            </p>
            <p className="text-base text-cp-text-light">
              Last Updated: February 2026
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-cp-cream">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            {/* Delivery Coverage */}
            <AnimatedSection direction="up" duration={0.65}>
              <div className="bg-gradient-to-br from-cp-beige to-cp-cream rounded-2xl p-8 border border-cp-border">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-cp-terracotta" />
                  <h2 className="text-2xl font-bold text-cp-text">Delivery Coverage</h2>
                </div>
                <ul className="space-y-3 text-cp-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">-</span>
                    We deliver across India through our logistics partner <strong>Delhivery</strong>.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">-</span>
                    Delivery availability is based on PIN code serviceability. You can check if your area is serviceable during checkout.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">-</span>
                    We currently do not ship internationally.
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Shipping Summary */}
            <AnimatedSection direction="up" duration={0.65}>
              <div className="bg-gradient-to-br from-cp-beige to-cp-cream rounded-2xl p-8 border border-cp-border">
                <p className="text-cp-text-muted leading-relaxed">
                  We ship pan-India via our logistics partners. Estimated delivery: 3–7 business days. Free delivery on all orders above ₹999. For orders below ₹999, a flat ₹49 shipping charge applies. Minimum order quantity: 6 jars of 100g or 2 jars of 250g of any variety.
                </p>
              </div>
            </AnimatedSection>

            {/* Delivery Timeline */}
            <AnimatedSection direction="up" duration={0.65}>
              <div className="bg-white rounded-2xl p-8 border border-cp-border shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-cp-terracotta" />
                  <h2 className="text-2xl font-bold text-cp-text">Estimated Delivery Time</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-cp-green-light rounded-xl p-5 border border-cp-green">
                    <h3 className="font-semibold text-cp-green-dark mb-2">Metro Cities</h3>
                    <p className="text-3xl font-bold text-cp-green">3-5</p>
                    <p className="text-sm text-cp-green-dark">business days</p>
                  </div>
                  <div className="bg-cp-olive-light rounded-xl p-5 border border-cp-olive">
                    <h3 className="font-semibold text-cp-olive-dark mb-2">Other Locations</h3>
                    <p className="text-3xl font-bold text-cp-olive">5-7</p>
                    <p className="text-sm text-cp-olive-dark">business days</p>
                  </div>
                </div>
                <p className="text-sm text-cp-text-light mt-4">
                  Delivery times are estimates and may vary depending on location, weather conditions, and public holidays. Orders placed after 2:00 PM IST will be processed the next business day.
                </p>
              </div>
            </AnimatedSection>

            {/* Shipping Charges */}
            <AnimatedSection direction="up" duration={0.65}>
              <div className="bg-white rounded-2xl p-8 border border-cp-border shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <IndianRupee className="w-6 h-6 text-cp-terracotta" />
                  <h2 className="text-2xl font-bold text-cp-text">Shipping Charges</h2>
                </div>
                <ul className="space-y-3 text-cp-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">-</span>
                    Shipping charges are calculated at checkout based on order weight and destination.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">-</span>
                    <strong>Free shipping</strong> is available on orders above a certain amount (displayed at checkout).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">-</span>
                    All prices displayed on the website are inclusive of applicable taxes.
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Order Processing */}
            <AnimatedSection direction="up" duration={0.65}>
              <div className="bg-white rounded-2xl p-8 border border-cp-border shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-6 h-6 text-cp-terracotta" />
                  <h2 className="text-2xl font-bold text-cp-text">Order Processing</h2>
                </div>
                <ul className="space-y-3 text-cp-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">1.</span>
                    Once your payment is confirmed, we begin processing your order immediately.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">2.</span>
                    A shipment is automatically created with Delhivery and you receive a tracking number via email/SMS.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">3.</span>
                    You can track your order in real-time from your account under &quot;My Orders&quot;.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">4.</span>
                    An invoice is generated and available for download from your order details page.
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Important Notes */}
            <AnimatedSection direction="up" duration={0.65}>
              <div className="bg-cp-beige rounded-2xl p-8 border border-cp-border">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-cp-terracotta" />
                  <h2 className="text-2xl font-bold text-cp-text">Important Notes</h2>
                </div>
                <ul className="space-y-3 text-cp-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">-</span>
                    Please ensure someone is available at the delivery address to receive the package.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">-</span>
                    If a delivery attempt fails, the courier will make up to 2 additional attempts before returning the package.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">-</span>
                    Our products are food items and are packaged to maintain freshness during transit.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cp-terracotta font-bold mt-1">-</span>
                    In case of any damage during shipping, please contact us within 24 hours of delivery with photos of the damaged package.
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Contact */}
            <AnimatedSection direction="up" duration={0.65}>
              <div className="bg-gradient-to-r from-cp-olive to-cp-olive-dark rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Questions About Shipping?</h2>
                <p className="text-cp-beige mb-6">
                  Our customer support team is happy to help with any shipping-related queries.
                </p>
                <div className="flex flex-wrap gap-6">
                  <a href="mailto:ridhwika.agro.organics@gmail.com" className="flex items-center gap-2 text-white hover:text-cp-gold-light transition">
                    <Mail className="w-5 h-5" />
                    ridhwika.agro.organics@gmail.com
                  </a>
                  <a href="tel:+919350406289" className="flex items-center gap-2 text-white hover:text-cp-gold-light transition">
                    <Phone className="w-5 h-5" />
                    +91 93504 06289
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      </main>
    )
  }

async function fetchPageContent(): Promise<any> {
  try {
    await connectDB()
    const page = await PageContent.findOne({
      slug: 'shipping-policy',
      isPublished: true,
    }).lean()
    return page
  } catch (error) {
    console.error('Error fetching shipping policy content:', error)
    return null
  }
}

export default async function ShippingPolicyPage() {
  const pageContent = await fetchPageContent()

  if (pageContent?.isPublished) {
    return (
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-cp-cream via-white to-cp-terracotta-light py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-cp-terracotta to-cp-terracotta-deep rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900">
                {pageContent.title}
              </h1>
              {pageContent.subtitle && (
                <p className="text-xl md:text-2xl text-gray-700 mb-4">{pageContent.subtitle}</p>
              )}
              <p className="text-base text-gray-600">Last Updated: {pageContent.lastUpdated}</p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: pageContent.bodyHtml }}
            />
          </div>
        </section>
      </main>
    )
  }

  return <DefaultContent />
}
