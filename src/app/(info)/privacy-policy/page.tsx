import React from "react"
import { Metadata } from "next"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { CornerFlourish } from "@/components/illustrations"
import { Shield, Database, UserCheck, Eye, Lock, Mail } from "lucide-react"
import { connectDB } from "@/lib/mongodb"
import PageContent from "@/models/PageContent"

export const dynamic = "force-dynamic"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://colonelspickle.in';

export const metadata: Metadata = {
  title: "Privacy Policy | Colonel's Pickle",
  description: "Privacy Policy for Colonel's Pickle. Learn how we protect your data and personal information.",
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policy | Colonel's Pickle",
    description:
      "Learn how Colonel's Pickle protects your personal information and data privacy.",
    url: `${SITE_URL}/privacy-policy`,
    type: 'website',
    siteName: "Colonel's Pickle",
    locale: 'en_IN',
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Colonel's Pickle — Privacy Policy",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Privacy Policy | Colonel's Pickle",
    description:
      "Learn how Colonel's Pickle protects your personal information and data privacy.",
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
            <div className="w-20 h-20 bg-gradient-to-br from-cp-olive to-cp-olive-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-cp-text">
              Privacy
              <span className="block bg-gradient-to-r from-cp-olive to-cp-terracotta bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-cp-text-muted mb-4">
              Your privacy is important to us
            </p>
            <p className="text-base text-cp-text-light">
              Last Updated: December 2025
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 md:py-24 bg-cp-cream">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
            {/* Introduction */}
            <AnimatedSection direction="up" duration={0.65} delay={0.1}>
              <div className="bg-gradient-to-br from-cp-beige to-white rounded-2xl p-8 shadow-sm border border-cp-border">
                <p className="text-cp-text-muted leading-relaxed">
                  Colonel&apos;s Pickle by Ridhwika Agro Organics respects customer privacy and is committed to protecting personal information shared with us.
                </p>
              </div>
            </AnimatedSection>

            {/* Information We Collect */}
            <AnimatedSection direction="up" duration={0.65} delay={0.2}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-olive to-cp-olive-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-cp-text mb-3">Information We Collect</h2>
                    <p className="text-cp-text-muted leading-relaxed mb-3">
                      We may collect:
                    </p>
                    <ul className="space-y-2 text-cp-text-muted">
                      <li>• Name, phone number, email address</li>
                      <li>• Billing and shipping address</li>
                      <li>• Order and transaction details</li>
                      <li>• Website usage data for analytics and improvement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Use of Information */}
            <AnimatedSection direction="up" duration={0.65} delay={0.3}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-olive to-cp-olive-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-cp-text mb-3">Use of Information</h2>
                    <p className="text-cp-text-muted leading-relaxed mb-3">
                      Customer information is used for:
                    </p>
                    <ul className="space-y-2 text-cp-text-muted">
                      <li>• Order processing and delivery</li>
                      <li>• Customer support and communication</li>
                      <li>• Improving website functionality and services</li>
                      <li>• Legal and regulatory compliance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Data Protection & Security */}
            <AnimatedSection direction="up" duration={0.65} delay={0.4}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-olive to-cp-olive-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-cp-text mb-3">Data Protection & Security</h2>
                    <p className="text-cp-text-muted leading-relaxed mb-3">
                      We take strict security measures to protect customer data:
                    </p>
                    <ul className="space-y-2 text-cp-text-muted">
                      <li>• Secure and encrypted servers</li>
                      <li>• Trusted and licensed software</li>
                      <li>• Restricted internal access</li>
                      <li>• Regular system monitoring</li>
                    </ul>
                    <p className="text-cp-text-muted leading-relaxed mt-4">
                      We ensure that customer data is protected from unauthorized access, data leakage, misuse, or loss.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Data Sharing */}
            <AnimatedSection direction="up" duration={0.65} delay={0.5}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-olive to-cp-olive-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-cp-text mb-3">Data Sharing</h2>
                    <p className="text-cp-text-muted leading-relaxed mb-3">
                      Customer data is never sold, rented, or shared with any third party.
                    </p>
                    <p className="text-cp-text-muted leading-relaxed">
                      Data may be shared only with trusted service providers (payment gateways, courier partners) strictly for order fulfillment purposes.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Payment Gateway Security */}
            <AnimatedSection direction="up" duration={0.65} delay={0.6}>
              <div className="bg-gradient-to-br from-cp-beige to-white rounded-2xl p-8 shadow-sm border border-cp-border">
                <h2 className="text-2xl font-bold text-cp-text mb-4">Payment Gateway Security</h2>
                <div className="space-y-3 text-cp-text-muted">
                  <p className="leading-relaxed">
                    We use trusted, secure, and PCI-DSS compliant payment gateways.
                  </p>
                  <p className="leading-relaxed">
                    Colonel&apos;s Pickle by Ridhwika Agro Organics does not store or process any debit card, credit card, UPI, or net-banking details.
                  </p>
                  <p className="leading-relaxed">
                    All payment transactions are encrypted and handled directly by the payment gateway provider.
                  </p>
                  <p className="leading-relaxed">
                    Colonel&apos;s Pickle by Ridhwika Agro Organics shall not be liable for any technical or operational issues arising from the payment gateway or banking institutions.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Customer Consent */}
            <AnimatedSection direction="up" duration={0.65} delay={0.7}>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-cp-text">Customer Consent</h2>
                <p className="text-cp-text-muted leading-relaxed">
                  By using our website and placing an order, customers consent to this Privacy Policy.
                </p>
              </div>
            </AnimatedSection>

            {/* Policy Updates */}
            <AnimatedSection direction="up" duration={0.65} delay={0.8}>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-cp-text">Policy Updates</h2>
                <p className="text-cp-text-muted leading-relaxed">
                  This Privacy Policy may be updated from time to time. Updates will be reflected on our website.
                </p>
              </div>
            </AnimatedSection>

            {/* Contact Information */}
            <AnimatedSection direction="up" duration={0.65} delay={0.9}>
              <div className="bg-gradient-to-br from-cp-beige to-white rounded-2xl p-8 shadow-sm border border-cp-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cp-olive to-cp-olive-dark rounded-lg flex items-center justify-center flex-shrink-0">
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
        </div>
      </section>
      </main>
    )
  }

async function fetchPageContent(): Promise<any> {
  try {
    await connectDB()
    const page = await PageContent.findOne({
      slug: 'privacy-policy',
      isPublished: true,
    }).lean()
    return page
  } catch (error) {
    console.error('Error fetching privacy policy content:', error)
    return null
  }
}

export default async function PrivacyPolicyPage() {
  const pageContent = await fetchPageContent()

  if (pageContent?.isPublished) {
    return (
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-cp-cream via-white to-cp-terracotta-light py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-cp-terracotta to-cp-terracotta-deep rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
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