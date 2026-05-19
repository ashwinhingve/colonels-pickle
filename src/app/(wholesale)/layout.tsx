import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wholesale — Colonel's Pickle",
  description: "Bulk ordering and wholesale partnerships for retailers — 20% discount, monthly credit, free transportation.",
};

export default function WholesaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
