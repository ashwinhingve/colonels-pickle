import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your Colonel's Pickle account profile.",
};

function fmtDate(d?: Date | string) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default async function ProfilePage() {
  const session = await requireAuth();

  type LeanUser = {
    name?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    provider?: string;
    role?: string;
    createdAt?: Date;
  };
  let user: LeanUser | null = null;

  try {
    await connectDB();
    user = (await User.findById(session.user.id).lean()) as unknown as LeanUser | null;
  } catch {
    // If DB is unreachable, fall back to session data below
  }

  const rows: { label: string; value: string }[] = [
    { label: "Full Name", value: user?.name || user?.fullName || session.user?.name || "—" },
    { label: "Email", value: user?.email || session.user?.email || "—" },
    { label: "Phone", value: user?.phoneNumber || "—" },
    {
      label: "Sign-in Method",
      value:
        user?.provider === "google"
          ? "Google"
          : user?.provider === "sms"
            ? "Mobile OTP"
            : user?.provider === "email"
              ? "Email OTP"
              : "—",
    },
    { label: "Account Type", value: (user?.role || "client") === "admin" ? "Administrator" : "Customer" },
    { label: "Member Since", value: fmtDate(user?.createdAt) },
  ];

  return (
    <section className="min-h-screen bg-cp-cream py-12">
      <div className="mx-auto max-w-3xl px-4">
        <AnimatedSection direction="up">
          <Link
            href="/account"
            className="mb-6 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-cp-text-muted transition-colors hover:text-cp-crimson"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Account
          </Link>

          <SectionHeader
            eyebrow="MY ACCOUNT"
            title="Profile Details"
            subtitle="Your account information with Colonel's Pickle."
            align="left"
          />
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.05} className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-cp-border bg-white shadow-sm hover:shadow-md transition-shadow">
            <dl className="divide-y divide-cp-border">
              <StaggerContainer staggerDelay={0.03}>
                {rows.map((r) => (
                  <StaggerItem key={r.label}>
                    <div className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-3 sm:gap-4 hover:bg-cp-cream transition-colors">
                      <dt className="font-sans text-sm font-semibold text-cp-text-muted">{r.label}</dt>
                      <dd className="font-serif text-[15px] text-cp-text sm:col-span-2">{r.value}</dd>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </dl>
          </div>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.1} className="mt-6">
          <p className="font-serif text-sm text-cp-text-muted">
            Need to update your details? Reach us on{" "}
            <a
              href="https://wa.me/919350406289"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cp-crimson hover:underline"
            >
              WhatsApp
            </a>{" "}
            and we&apos;ll help you out.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
