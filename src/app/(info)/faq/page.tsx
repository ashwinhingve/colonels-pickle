import type { Metadata } from "next";
import { FAQAccordion, type FAQItem } from "@/components/shared/FAQAccordion";
import { SectionHeader } from "@/components/common/SectionHeader";
import { BRAND, WHATSAPP_URL, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions | Colonel's Pickle",
  description:
    "Answers to common questions about Colonel's Pickle products, shipping, payment, returns, and wholesale. FSSAI certified, no artificial preservatives.",
};

const FAQ_PRODUCTS: FAQItem[] = [
  {
    question: "What makes Colonel's Pickle different from other brands?",
    answer:
      "Colonel's Pickle stands apart through our unwavering commitment to purity and tradition. We use absolutely NO artificial preservatives, colours, or flavours—ever. Our recipes are based on time-honoured family traditions passed down through generations. Every jar contains 24 whole spices sourced carefully, Kachi Ghani (wooden cold-press) mustard oil, rock salt, black salt, and premium Afghani asafoetida (hing) sourced at ₹35,000/kg. Every batch is FSSAI certified (License: 12223026002188) and prepared with the same love that goes into home cooking.",
  },
  {
    question: "Are the pickles completely free of artificial preservatives?",
    answer:
      "Yes, absolutely. We do not use any artificial preservatives, synthetic colours, or artificial flavours in any of our products. The natural oil layer on top of each pickle acts as a traditional preservative, keeping the contents fresh and authentic. This is the same method that Indian households have used for centuries.",
  },
  {
    question: "What is the shelf life of Colonel's Pickle products?",
    answer:
      "Our pickles have a shelf life of 12 months from the date of manufacture when stored in an unopened, sealed jar at room temperature in a cool, dry place. After opening, we recommend refrigerating the jar and consuming within 3–4 months. Always remember to use a clean, dry spoon when taking pickles out—never use a wet spoon, as moisture can affect quality.",
  },
  {
    question: "Why do I see an oil layer on top of the pickle jar?",
    answer:
      "The oil layer is the heart of traditional Indian pickle-making. It serves as a natural preservative, preventing oxidation and keeping the pickles fresh and crispy. This layer—made from our Kachi Ghani cold-pressed mustard oil—locks in flavour and extends shelf life without any chemical additives. It's a feature, not a defect.",
  },
  {
    question: "What spices are used in the pickles?",
    answer:
      "Each Colonel's Pickle variety is crafted with 24 carefully selected whole spices, sun-dried, roasted, and ground fresh at our Jaipur facility. These include traditional Indian spices like fenugreek, cumin, coriander, mustard seeds, fenugreek seeds, asafoetida (hing), turmeric, and many others. All spices are sourced for premium quality and authenticity.",
  },
  {
    question: "Is the mustard oil cold-pressed (Kachi Ghani)?",
    answer:
      "Yes. We use only 100% Kachi Ghani (wooden cold-press) mustard oil. This traditional extraction method preserves the natural nutrients, flavour, and aroma of the mustard seeds without using heat or chemicals. Cold-pressed oil is far superior to chemically extracted oil and is the preferred choice in authentic Indian kitchens.",
  },
  {
    question: "What is Afghani Hing (asafoetida) and why is it in your products?",
    answer:
      "Afghani asafoetida (hing) is the finest quality hing available in the world, sourced from the mountains of Afghanistan. It imparts a distinctive, authentic flavour to Indian pickles and aids digestion. Our hing is sourced at premium rates (₹35,000/kg) to ensure the highest quality. It is a key ingredient in authentic Indian cooking and a hallmark of Colonel's Pickle's commitment to quality.",
  },
];

const FAQ_ORDERS: FAQItem[] = [
  {
    question: "What is the minimum order quantity?",
    answer:
      "The minimum order is 6 jars of 100g OR 2 jars of 250g (or any equivalent combination). This ensures freshness and viability of shipping while keeping costs manageable. These quantities are announced on the website and in product listings.",
  },
  {
    question: "Can I place an order via WhatsApp?",
    answer:
      "Absolutely! You can place orders, ask questions, and get personalized recommendations via WhatsApp. Message us at +91 9350406289 or click the WhatsApp link on the website. Our team responds during business hours: Mon–Sat 9 AM–7 PM, Sunday 10 AM–5 PM (IST).",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept two payment methods: (1) Cash on Delivery (COD)—pay when the package arrives, and (2) Online Payment via Cashfree gateway, which supports all major credit/debit cards, net banking, and UPI. Choose whichever is most convenient for you.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes. We use Cashfree's PCI-DSS compliant payment gateway for all online transactions. Your card details are encrypted end-to-end and never stored on our servers. COD orders require no online payment, so your financial information remains completely private.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Orders can only be cancelled before they are packed and shipped. Once packed, cancellation may not be possible. If you need to cancel, please contact us immediately via WhatsApp (+91 9350406289) or email (colonelspickle@proton.me). We'll do our best to help.",
  },
];

const FAQ_SHIPPING: FAQItem[] = [
  {
    question: "Do you ship pan-India?",
    answer:
      "Yes! We ship to every corner of India using trusted logistics partners Delhivery and Shiprocket. Whether you're in a metro city or a small town, we can reach you. Shipping timelines are typically 3–7 business days from order confirmation, depending on your location.",
  },
  {
    question: "What is the shipping cost?",
    answer: `FREE shipping on orders above ₹${FREE_DELIVERY_THRESHOLD} (pan-India). For orders below ₹${FREE_DELIVERY_THRESHOLD}, a standard shipping charge of ₹49 applies. Additionally, customers in Jaipur get FREE delivery on orders above ₹1500, which supports our local community.`,
  },
  {
    question: "How will I know my order has been shipped?",
    answer:
      "Once your order is shipped, you'll receive a tracking link via email and SMS (if you provided your mobile number). You can use this link to track your package in real-time with Delhivery or Shiprocket.",
  },
  {
    question: "What if my order arrives damaged or leaking?",
    answer:
      "Food safety is our top priority. If your order arrives damaged, leaking, or tampered with, please report it within 48 hours with photos/video evidence. Contact us via WhatsApp (+91 9350406289) or email (colonelspickle@proton.me). We will immediately send you a replacement at no extra cost.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship only within India. We're exploring international shipping options and will announce them soon. For overseas enquiries, please contact us via WhatsApp.",
  },
];

const FAQ_RETURNS: FAQItem[] = [
  {
    question: "Can I return pickles if I don't like the taste?",
    answer:
      "Our pickles are food products and cannot be returned for taste preferences or subjective reasons. However, if the product is damaged, leaking, expired, or incorrect, we'll happily replace it. Report any such issues within 48 hours of delivery with photographic evidence.",
  },
  {
    question: "What if I received the wrong product?",
    answer:
      "Mistakes happen, and we take them seriously. If you received the wrong product, please contact us immediately with photos/video. We'll send the correct item right away and arrange to collect the wrong one, entirely at our cost.",
  },
  {
    question: "What if the jar is leaking or broken?",
    answer:
      "Please report it within 48 hours of delivery with clear photos or video showing the damage, the jar label, and the shipping package. Send these to our WhatsApp (+91 9350406289) or email. We'll send a replacement immediately without any deduction or hassle.",
  },
  {
    question: "Is there a warranty or guarantee on products?",
    answer:
      "Yes. We guarantee that all Colonel's Pickle products are fresh, authentic, FSSAI certified, and free of artificial preservatives or adulterants. If any product falls short of these standards, we will replace it immediately. Your satisfaction and trust are our guarantee.",
  },
];

const FAQ_WHOLESALE: FAQItem[] = [
  {
    question: "Do you offer wholesale or bulk pricing?",
    answer:
      "Yes! We offer 20% discount on MRP for registered businesses and wholesale buyers. Larger quantities may qualify for even better rates. Wholesale orders are typically supplied on a credit basis (net 30 or 45 days) for registered enterprises.",
  },
  {
    question: "How do I become a wholesale partner?",
    answer:
      "To explore wholesale opportunities, visit our dedicated B2B wholesale portal at /wholesale or contact us directly via WhatsApp (+91 9350406289). Share your business details, location, and expected monthly order volume. Our wholesale team will guide you through the registration and credit approval process.",
  },
  {
    question: "What documents are required for wholesale registration?",
    answer:
      "Typically, we require: (1) GST registration certificate, (2) PAN or Aadhar, (3) business bank account details, and (4) a signed wholesale agreement. Exact requirements may vary—our team will confirm during the registration process.",
  },
  {
    question: "What is the minimum wholesale order?",
    answer:
      "Wholesale orders typically start at ₹10,000+ value to ensure efficient logistics and billing. Bulk customization and custom packaging may be available for larger orders. Contact our wholesale team for specific arrangements.",
  },
];

const FAQ_OTHER: FAQItem[] = [
  {
    question: "Why is Colonel's Pickle FSSAI certified?",
    answer: `FSSAI (Food Safety and Standards Authority of India) certification (License: ${BRAND.fssai}) proves that every batch of Colonel's Pickle meets India's strictest food safety and quality standards. No artificial preservatives, no contaminants, no compromises. This is the gold standard for packaged foods in India.`,
  },
  {
    question: "How do I contact Colonel's Pickle?",
    answer: `You can reach us via: WhatsApp: +91 9350406289, Email: colonelspickle@proton.me, Phone: +91 9717243306 / 9416845689 / 9350406289, Address: Plot A-207, Block A, Vardhman Nagar, Gali No. 24, Ajmer Road, Jaipur, Rajasthan – 302019. Visit us during business hours: Mon–Sat 9 AM–7 PM, Sunday 10 AM–5 PM (IST).`,
  },
  {
    question: "Do you have a physical store in Jaipur?",
    answer:
      "Yes! We're located in Jaipur at Plot A-207, Block A, Vardhman Nagar, Gali No. 24, Ajmer Road. Local customers are welcome to visit and meet our team. We offer free delivery on Jaipur orders above ₹1500. For directions, check Google Maps: https://maps.app.goo.gl/FCraoQErzuMnHLBz9",
  },
  {
    question: "Are there any certifications besides FSSAI?",
    answer:
      "Yes! Colonel's Pickle is certified and registered with: (1) FSSAI (Food Safety & Standards Authority of India), (2) Udhyam Registration (Udyam Register for MSME enterprises), and (3) BNI (Business Network International—Vishwakarma Chapter, Jaipur). These certifications affirm our commitment to quality, legality, and ethical business practices.",
  },
  {
    question: "Can I follow Colonel's Pickle on social media?",
    answer:
      "Absolutely! Follow us on Instagram: @colonels.pickle (https://instagram.com/colonels.pickle). We share recipes, behind-the-scenes stories, new product launches, and customer features. You can also check out our link bio at https://beacons.ai/colonelspickle for all our links in one place.",
  },
];

// Combine all FAQ sections
const ALL_FAQS = [
  ...FAQ_PRODUCTS,
  ...FAQ_ORDERS,
  ...FAQ_SHIPPING,
  ...FAQ_RETURNS,
  ...FAQ_WHOLESALE,
  ...FAQ_OTHER,
];

// Generate FAQPage JSON-LD structured data
const generateFAQSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
};

export default function FAQPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema()),
        }}
      />

      {/* 1. Hero/Header Section */}
      <section className="bg-cp-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader
            eyebrow="QUESTIONS & ANSWERS"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about Colonel's Pickle — from our ingredients to shipping, payments, and more."
          />
        </div>
      </section>

      {/* 2. Products & Ingredients */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10">
            <p className="font-hindi text-xs font-bold uppercase tracking-widest text-cp-crimson">
              PRODUCTS & INGREDIENTS
            </p>
            <h3 className="mt-2 font-display text-2xl font-extrabold text-cp-text md:text-3xl">
              Know Your Pickle
            </h3>
          </div>
          <FAQAccordion items={FAQ_PRODUCTS} />
        </div>
      </section>

      {/* 3. Orders & Payment */}
      <section className="bg-cp-cream py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10">
            <p className="font-hindi text-xs font-bold uppercase tracking-widest text-cp-crimson">
              ORDERS & PAYMENT
            </p>
            <h3 className="mt-2 font-display text-2xl font-extrabold text-cp-text md:text-3xl">
              Placing Your Order
            </h3>
          </div>
          <FAQAccordion items={FAQ_ORDERS} />
        </div>
      </section>

      {/* 4. Shipping & Delivery */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10">
            <p className="font-hindi text-xs font-bold uppercase tracking-widest text-cp-crimson">
              SHIPPING & DELIVERY
            </p>
            <h3 className="mt-2 font-display text-2xl font-extrabold text-cp-text md:text-3xl">
              Getting Your Pickles to You
            </h3>
          </div>
          <FAQAccordion items={FAQ_SHIPPING} />
        </div>
      </section>

      {/* 5. Returns */}
      <section className="bg-cp-cream py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10">
            <p className="font-hindi text-xs font-bold uppercase tracking-widest text-cp-crimson">
              RETURNS & REPLACEMENTS
            </p>
            <h3 className="mt-2 font-display text-2xl font-extrabold text-cp-text md:text-3xl">
              Peace of Mind Guaranteed
            </h3>
          </div>
          <FAQAccordion items={FAQ_RETURNS} />
        </div>
      </section>

      {/* 6. Wholesale */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10">
            <p className="font-hindi text-xs font-bold uppercase tracking-widest text-cp-crimson">
              WHOLESALE & B2B
            </p>
            <h3 className="mt-2 font-display text-2xl font-extrabold text-cp-text md:text-3xl">
              Partner With Us
            </h3>
          </div>
          <FAQAccordion items={FAQ_WHOLESALE} />
        </div>
      </section>

      {/* 7. Other & Contact */}
      <section className="bg-cp-cream py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10">
            <p className="font-hindi text-xs font-bold uppercase tracking-widest text-cp-crimson">
              GENERAL
            </p>
            <h3 className="mt-2 font-display text-2xl font-extrabold text-cp-text md:text-3xl">
              About Us & Support
            </h3>
          </div>
          <FAQAccordion items={FAQ_OTHER} />
        </div>
      </section>

      {/* 8. CTA Section */}
      <section className="bg-cp-crimson py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <h3 className="font-display text-2xl font-extrabold md:text-3xl">
            Still Have Questions?
          </h3>
          <p className="mt-4 font-serif text-[15px] leading-relaxed">
            Our team is here to help. Reach out via WhatsApp for instant support.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-block rounded-lg bg-[#25D366] px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-px"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
