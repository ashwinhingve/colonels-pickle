import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop — Colonel's Pickle",
  description: "Browse authentic homemade pickles, masalas and cold-press oils — no artificial preservatives. FSSAI certified, pan-India delivery from Jaipur.",
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
