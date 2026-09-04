import React from "react"
import { Metadata } from "next"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { CornerFlourish, CertSeal } from "@/components/illustrations"
import { FileText, ShoppingCart, CreditCard, Package, Scale, Mail, BadgeCheck } from "lucide-react"
import { connectDB } from "@/lib/mongodb"
import PageContent from "@/models/PageContent"
import { REGISTRATIONS } from "@/lib/constants"

export const dynamic = "force-dynamic"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://colonelspickle.in';

export const metadata: Metadata = {
  title: "Terms & Conditions | Colonel's Pickle",
  description: "Terms and Conditions for Colonel's Pickle. Please read before placing an order.",
  alternates: {
    canonical: `${SITE_URL}/terms-and-conditions`,
  },
  openGraph: {
    title: "Terms & Conditions | Colonel's Pickle",
    description:
      "Read Colonel's Pickle Terms and Conditions before placing your order.",
    url: `${SITE_URL}/terms-and-conditions`,
    type: 'website',
    siteName: "Colonel's Pickle",
    locale: 'en_IN',
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Colonel's Pickle — Terms & Conditions",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Terms & Conditions | Colonel's Pickle",
    description:
      "Read Colonel's Pickle Terms and Conditions before placing your order.",
    images: [`${SITE_URL}/logo.png`],
  },
}

// Default hardcoded content - fallback if no published DB record
function DefaultContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cp-beige via-white to-cp-cream py-20 md:py-32">
        <CornerFlourish className="absolute top-6 left-6 w-20 h-20 text-cp-olive opacity-20" />
        <CornerFlourish className="absolute bottom-6 right-6 w-20 h-20 text-cp-terracotta opacity-20 transform rotate-180" />
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up" duration={0.65} className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-cp-olive to-cp-olive-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-cp-text">
              Terms &
              <span className="block bg-gradient-to-r from-cp-olive to-cp-terracotta bg-clip-text text-transparent">
                Conditions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-cp-text-muted mb-4">
              Please read these terms carefully
            </p>
            <p className="text-base text-cp-text-light">
              Last Updated: December 2025
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 md:py-24 bg-cp-cream">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatedSection direction="up" duration={0.65} className="space-y-8">
            {/* Introduction */}
            <AnimatedSection direction="up" duration={0.65} delay={0.1}>
              <div className="bg-gradient-to-br from-cp-beige to-white rounded-2xl p-8 shadow-sm border border-cp-border">
                <p className="text-cp-text-muted leading-relaxed">
                  By accessing or using <strong>colonelspickle.in</strong>, you agree to the following terms and conditions. Please read them carefully before placing an order.
                </p>
              </div>
            </AnimatedSection>

            {/* General */}
            <AnimatedSection direction="up" duration={0.65} delay={0.2}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-olive to-cp-olive-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-cp-text mb-3">General</h2>
                    <ul className="space-y-2 text-cp-text-muted">
                      <li>• All products are intended for personal consumption, unless otherwise stated</li>
                      <li>• Prices, availability, and offers may change without prior notice</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Product Information */}
            <AnimatedSection direction="up" duration={0.65} delay={0.3}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-olive to-cp-olive-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-cp-text mb-3">Product Information</h2>
                    <p className="text-cp-text-muted leading-relaxed mb-3">
                      We strive to provide accurate product descriptions.
                    </p>
                    <p className="text-cp-text-muted leading-relaxed">
                      Minor variations in color, texture, weight, or packaging may occur due to natural or processing factors.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Orders & Payments */}
            <AnimatedSection direction="up" duration={0.65} delay={0.4}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-olive to-cp-olive-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-cp-text mb-3">Orders & Payments</h2>
                    <ul className="space-y-2 text-cp-text-muted">
                      <li>• Orders are confirmed only after successful payment</li>
                      <li>• We reserve the right to cancel orders due to stock issues, pricing errors, or suspicious activity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Payment Gateway Disclaimer */}
            <AnimatedSection direction="up" duration={0.65} delay={0.5}>
              <div className="bg-gradient-to-br from-cp-beige to-white rounded-2xl p-8 shadow-sm border border-cp-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-terracotta to-cp-terracotta-deep rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-cp-text mb-4">Payment Gateway Disclaimer</h2>
                    <div className="space-y-3 text-cp-text-muted">
                      <p className="leading-relaxed">
                        All payments are processed through secure and trusted third-party payment gateways.
                      </p>
                      <p className="leading-relaxed">
                        Colonel&apos;s Pickle by Ridhwika Agro Organics does not have access to customer payment credentials.
                      </p>
                      <p className="leading-relaxed">
                        Transaction delays, failures, or refunds are subject to the policies of the respective banks and payment gateway providers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Shipping & Delivery */}
            <AnimatedSection direction="up" duration={0.65} delay={0.6}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-olive to-cp-olive-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-cp-text mb-3">Shipping & Delivery</h2>
                    <ul className="space-y-2 text-cp-text-muted">
                      <li>• Delivery timelines are estimated and may vary due to logistics partners or unforeseen circumstances</li>
                      <li>• Colonel&apos;s Pickle by Ridhwika Agro Organics is not liable for courier-related delays</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Intellectual Property */}
            <AnimatedSection direction="up" duration={0.65} delay={0.7}>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-cp-text">Intellectual Property</h2>
                <p className="text-cp-text-muted leading-relaxed">
                  All website content, logos, images, and branding are the exclusive property of Colonel&apos;s Pickle by Ridhwika Agro Organics and may not be used without written permission.
                </p>
              </div>
            </AnimatedSection>

            {/* Limitation of Liability */}
            <AnimatedSection direction="up" duration={0.65} delay={0.8}>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-cp-text">Limitation of Liability</h2>
                <p className="text-cp-text-muted leading-relaxed mb-3">
                  Colonel&apos;s Pickle by Ridhwika Agro Organics shall not be liable for:
                </p>
                <ul className="space-y-2 text-cp-text-muted">
                  <li>• Indirect or consequential damages</li>
                  <li>• Personal taste preferences</li>
                  <li>• Improper storage or misuse of products</li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Governing Law */}
            <AnimatedSection direction="up" duration={0.65} delay={0.9}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-olive to-cp-olive-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-cp-text mb-3">Governing Law</h2>
                    <p className="text-cp-text-muted leading-relaxed">
                      These terms shall be governed by the laws of India, and courts located in Jaipur, Rajasthan shall have exclusive jurisdiction.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Information */}
            <AnimatedSection direction="up" duration={0.65} delay={1}>
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
      </>
    )
  }

// Company & registration details — always rendered after the terms body,
// regardless of whether the CMS or default content is shown above, so Udyam
// and GST stay reliably documented on this legal page.
function RegistrationDetailsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <AnimatedSection direction="up" duration={0.65}>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cp-olive to-cp-olive-dark">
              <BadgeCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-3 text-2xl font-bold text-cp-text">
                Company &amp; Registration Details
              </h2>
              <p className="mb-8 leading-relaxed text-cp-text-muted">
                Colonel&apos;s Pickle is operated by Ridhwika Agro Organics and
                is fully licensed and registered with the Government of India.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {REGISTRATIONS.map((r) => (
              <div
                key={r.key}
                className="flex items-center gap-4 rounded-2xl border border-cp-border bg-gradient-to-br from-cp-beige to-white p-5 shadow-sm"
              >
                <CertSeal label={r.label.split(" ")[0]} className="h-14 w-14 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-cp-text">{r.label}</p>
                  <p className="text-xs text-cp-text-muted">{r.fullName}</p>
                  <p className="mt-1 select-all break-all font-mono text-[13px] font-semibold text-cp-terracotta">
                    {r.number}
                  </p>
                  <p className="mt-0.5 text-xs text-cp-text-light">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

async function fetchPageContent(): Promise<any> {
  try {
    await connectDB()
    const page = await PageContent.findOne({
      slug: 'terms-and-conditions',
      isPublished: true,
    }).lean()
    return page
  } catch (error) {
    console.error('Error fetching terms and conditions content:', error)
    return null
  }
}

function CmsBody({ pageContent }: { pageContent: any }) {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-cp-cream via-white to-cp-terracotta-light py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-cp-terracotta to-cp-terracotta-deep rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
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
    </>
  )
}

export default async function TermsConditionsPage() {
  const pageContent = await fetchPageContent()

  return (
    <main>
      {pageContent?.isPublished ? (
        <CmsBody pageContent={pageContent} />
      ) : (
        <DefaultContent />
      )}
      <RegistrationDetailsSection />
    </main>
  )
}