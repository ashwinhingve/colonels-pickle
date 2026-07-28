import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAuth } from "@/lib/auth-helpers";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AddressManager } from "@/components/account/AddressManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Saved Addresses",
  description: "Manage your Colonel's Pickle delivery addresses.",
};

export default async function AddressesPage() {
  await requireAuth();

  return (
    <section className="min-h-screen bg-cp-cream py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-cp-text-muted transition-colors hover:text-cp-crimson"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Account
        </Link>

        <SectionHeader
          eyebrow="MY ACCOUNT"
          title="Saved Addresses"
          subtitle="Manage where we deliver your orders."
          align="left"
        />

        <div className="mt-8">
          <AddressManager />
        </div>
      </div>
    </section>
  );
}
