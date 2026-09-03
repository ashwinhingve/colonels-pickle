import React from "react"
import { Metadata } from "next"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { CornerFlourish, SpilledJarIllustration } from "@/components/illustrations"
import { RefreshCcw, AlertCircle, PackageCheck, Phone, Mail, Camera } from "lucide-react"
import { connectDB } from "@/lib/mongodb"
import PageContent from "@/models/PageContent"

export const dynamic = "force-dynamic"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://colonelspickle.in';

export const metadata: Metadata = {
  title: "Refund & Return Policy | Colonel's Pickle",
  description: "Refund and Return Policy for Colonel's Pickle. Learn about our hassle-free replacements.",
  alternates: {
    canonical: `${SITE_URL}/refund-policy`,
  },
  openGraph: {
    title: "Refund & Return Policy | Colonel's Pickle",
    description:
      "Understand Colonel's Pickle refund and return policy for damaged, incorrect, or defective products.",
    url: `${SITE_URL}/refund-policy`,
    type: 'website',
    siteName: "Colonel's Pickle",
    locale: 'en_IN',
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Colonel's Pickle — Refund & Return Policy",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Refund & Return Policy | Colonel's Pickle",
    description:
      "Understand Colonel's Pickle refund and return policy for damaged, incorrect, or defective products.",
    images: [`${SITE_URL}/logo.png`],
  },
}

// Default hardcoded content - fallback if no published DB record
function DefaultContent() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cp-beige via-white to-cp-cream py-20 md:py-32">
        <CornerFlourish className="absolute top-6 left-6 w-20 h-20 text-cp-terracotta opacity-20" />
        <CornerFlourish className="absolute bottom-6 right-6 w-20 h-20 text-cp-olive opacity-20 transform rotate-180" />
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up" duration={0.65} className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-cp-terracotta to-cp-terracotta-deep rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCcw className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-cp-text">
              Return & Refund
              <span className="block bg-gradient-to-r from-cp-terracotta to-cp-olive bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-cp-text-muted mb-4">
              Quality products with hassle-free replacements
            </p>
            <p className="text-base text-cp-text-light">
              Last Updated: December 2025
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 md:py-24 bg-cp-cream">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatedSection direction="up" duration={0.65} className="space-y-8">
            {/* Introduction */}
            <AnimatedSection direction="up" duration={0.65} delay={0.1}>
              <div className="bg-gradient-to-br from-cp-beige to-white rounded-2xl p-8 shadow-sm border border-cp-border">
                <p className="text-cp-text-muted leading-relaxed">
                  Colonel&apos;s Pickle by Ridhwika Agro Organics is committed to providing high-quality, hygienically packed food products. Due to the nature of consumable goods, please read this policy carefully before placing an order.
                </p>
                <p className="text-cp-text-muted leading-relaxed mt-4">
                  Pickles, oils, and masala products are consumable goods. We do not accept returns once the seal is broken. In case of damaged or wrong product received, please WhatsApp us a photo within 48 hours of delivery at +91 9350406289. We will arrange a replacement or full refund at our discretion.
                </p>
              </div>
            </AnimatedSection>

            {/* Non-Returnable Products */}
            <AnimatedSection direction="up" duration={0.65} delay={0.2}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-terracotta to-cp-terracotta-deep rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-cp-text mb-3">Non-Returnable Products</h2>
                    <p className="text-cp-text-muted leading-relaxed mb-3">
                      All food and consumable products sold on our website are non-returnable once delivered, due to hygiene and safety reasons, except in the following cases:
                    </p>
                    <ul className="space-y-2 text-cp-text-muted">
                      <li>• Wrong product delivered</li>
                      <li>• Product received in damaged condition</li>
                      <li>• Manufacturing defect</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Wrong/Damaged/Defective Product */}
            <AnimatedSection direction="up" duration={0.65} delay={0.3}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-terracotta to-cp-terracotta-deep rounded-lg flex items-center justify-center flex-shrink-0">
                    <PackageCheck className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-cp-text mb-3">Wrong / Damaged / Defective Product</h2>
                    <p className="text-cp-text-muted leading-relaxed mb-4">
                      If a customer receives a wrong, damaged, or defective product, the issue must be reported within <strong>48 hours of delivery</strong>.
                    </p>

                    <h3 className="text-xl font-semibold text-cp-text mb-3">How to Raise a Complaint</h3>
                    <p className="text-cp-text-muted leading-relaxed mb-3">
                      Customers may contact us via:
                    </p>
                    <div className="space-y-2 text-cp-text-muted mb-4">
                      <p>📞 Helpline: +91 9350406289</p>
                      <p>📧 Email: ridhwika.agro.organics@gmail.com</p>
                    </div>

                    <div className="bg-cp-beige rounded-lg p-6 border-l-4 border-cp-terracotta">
                      <h4 className="font-semibold text-cp-text mb-2 flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        Required Evidence
                      </h4>
                      <p className="text-cp-text-muted leading-relaxed mb-2">
                        The customer must provide:
                      </p>
                      <ul className="space-y-1 text-cp-text-muted">
                        <li>• Clear photographs of the product</li>
                        <li>• Unboxing or delivery-receiving video</li>
                      </ul>
                      <p className="text-cp-text-muted leading-relaxed mt-3 text-sm">
                        <strong>Note:</strong> Requests without proper photographic or video evidence may be rejected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Replacement or Refund */}
            <AnimatedSection direction="up" duration={0.65} delay={0.4}>
              <div className="bg-gradient-to-br from-cp-beige to-white rounded-2xl p-8 shadow-sm border border-cp-border">
                <h2 className="text-2xl font-bold text-cp-text mb-4">Replacement or Refund</h2>
                <div className="space-y-3 text-cp-text-muted">
                  <p className="leading-relaxed">
                    After verification of the submitted proof, the complaint will be reviewed.
                  </p>
                  <p className="leading-relaxed">
                    ✓ If the product is available, a <strong>replacement product</strong> will be dispatched free of cost.
                  </p>
                  <p className="leading-relaxed">
                    ✓ If the product is not available, a <strong>full refund</strong> will be processed.
                  </p>
                  <p className="leading-relaxed">
                    Refunds will be issued to the original payment method within <strong>7–10 working days</strong> after approval.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Order Cancellation */}
            <AnimatedSection direction="up" duration={0.65} delay={0.5}>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-cp-text">Order Cancellation</h2>
                <div className="text-cp-text-muted space-y-2">
                  <p className="leading-relaxed">
                    • Orders can be cancelled only <strong>before dispatch</strong>
                  </p>
                  <p className="leading-relaxed">
                    • Once dispatched, cancellations will not be accepted
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Shipping Charges */}
            <AnimatedSection direction="up" duration={0.65} delay={0.6}>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-cp-text">Shipping Charges</h2>
                <div className="text-cp-text-muted space-y-2">
                  <p className="leading-relaxed">
                    • Shipping charges are <strong>non-refundable</strong>
                  </p>
                  <p className="leading-relaxed">
                    • In case of an error from Colonel&apos;s Pickle by Ridhwika Agro Organics, shipping costs will be borne by the company
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Company Rights */}
            <AnimatedSection direction="up" duration={0.65} delay={0.7}>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-cp-text">Company Rights</h2>
                <p className="text-cp-text-muted leading-relaxed">
                  Colonel&apos;s Pickle by Ridhwika Agro Organics reserves the right to:
                </p>
                <ul className="space-y-2 text-cp-text-muted">
                  <li>• Reject claims without valid proof</li>
                  <li>• Modify this policy at any time without prior notice</li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Contact Information */}
            <AnimatedSection direction="up" duration={0.65} delay={0.8}>
              <div className="bg-gradient-to-br from-cp-beige to-white rounded-2xl p-8 shadow-sm border border-cp-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-terracotta to-cp-terracotta-deep rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-cp-text mb-4">Contact Information</h2>
                    <div className="space-y-2 text-cp-text-muted">
                      <p><strong>Colonel&apos;s Pickle by Ridhwika Agro Organics</strong></p>
                      <p>📍 B-6/374, Vaishali Nagar, Jaipur, Rajasthan - 302020</p>
                      <p>📧 Email: ridhwika.agro.organics@gmail.com</p>
                      <p>📞 Phone: +91 9717243306, +91 9416845689, +91 9350406289</p>
                      <p>🌐 Website: colonelspickle.in</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </AnimatedSection>
        </div>
      </section>
      </main>
    )
  }

async function fetchPageContent(): Promise<any> {
  try {
    await connectDB()
    const page = await PageContent.findOne({
      slug: 'refund-policy',
      isPublished: true,
    }).lean()
    return page
  } catch (error) {
    console.error('Error fetching refund policy content:', error)
    return null
  }
}

export default async function ReturnPolicyPage() {
  const pageContent = await fetchPageContent()

  if (pageContent?.isPublished) {
    return (
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-cp-cream via-white to-cp-terracotta-light py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-cp-terracotta to-cp-terracotta-deep rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCcw className="w-10 h-10 text-white" />
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