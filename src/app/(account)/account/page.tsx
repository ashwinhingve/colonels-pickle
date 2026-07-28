import { requireAuth } from '@/lib/auth-helpers';
import { SectionHeader } from '@/components/common/SectionHeader';
import Link from 'next/link';
import { Heart, Package, MapPin, User, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export const metadata = {
  title: "My Account — Colonel's Pickle",
  description: 'Manage your account, orders, addresses, and wishlist.',
};

export default async function AccountPage() {
  const session = await requireAuth();
  const user = session?.user;

  const accountMenuItems = [
    {
      id: 'orders',
      icon: Package,
      label: 'My Orders',
      description: 'Track and manage your orders',
      href: '/orders',
    },
    {
      id: 'wishlist',
      icon: Heart,
      label: 'Wishlist',
      description: 'Your saved products',
      href: '/account/wishlist',
    },
    {
      id: 'addresses',
      icon: MapPin,
      label: 'Saved Addresses',
      description: 'Manage delivery addresses',
      href: '/account/addresses',
    },
    {
      id: 'profile',
      icon: User,
      label: 'Profile Details',
      description: 'Update your information',
      href: '/account/profile',
    },
  ];

  return (
    <div className="min-h-screen bg-cp-cream py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <SectionHeader
          title="My Account"
          subtitle="Welcome back! Manage your orders, addresses, and preferences."
          className="mb-12"
        />

        {/* User greeting */}
        <div className="mb-10 rounded-2xl border border-cp-border bg-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-hindi text-sm text-cp-crimson mb-1">Hello,</p>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-cp-text">
                {user?.name || user?.email}
              </h3>
              <p className="mt-2 text-sm text-cp-text-muted">
                Email: {user?.email}
              </p>
            </div>
            <form
              action={async () => {
                'use server';
                await signOut({ redirect: true });
              }}
              className="w-full md:w-auto"
            >
              <button
                type="submit"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-cp-border text-cp-text font-medium hover:bg-cp-cream-dark transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Account menu grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accountMenuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group flex items-start gap-4 rounded-2xl border border-cp-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex-shrink-0 rounded-lg bg-cp-crimson-light p-3 group-hover:bg-cp-crimson group-hover:text-white transition-colors">
                  <IconComponent className="w-6 h-6 text-cp-crimson group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-lg font-bold text-cp-text group-hover:text-cp-crimson transition-colors">
                    {item.label}
                  </h4>
                  <p className="text-sm text-cp-text-muted mt-1">
                    {item.description}
                  </p>
                </div>
                <div className="flex-shrink-0 text-cp-border group-hover:text-cp-crimson transition-colors">
                  →
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick stats */}
        <div className="mt-12 rounded-2xl border border-cp-border bg-white p-6 md:p-8">
          <h3 className="font-display text-xl font-bold text-cp-text mb-6">
            Account Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <p className="text-sm text-cp-text-muted mb-2">Email Status</p>
              <p className="font-semibold text-cp-green">Verified</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-cp-text-muted mb-2">Account Type</p>
              <p className="font-semibold text-cp-text capitalize">
                {user?.role || 'Customer'}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-cp-text-muted mb-2">Status</p>
              <p className="font-semibold text-cp-crimson">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
