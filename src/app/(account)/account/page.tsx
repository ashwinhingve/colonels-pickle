import { requireAuth } from '@/lib/auth-helpers';
import { SectionHeader } from '@/components/common/SectionHeader';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/shared/AnimatedSection';
import { HoverLift } from '@/components/shared/HoverLift';
import { PickleJarIllustration } from '@/components/illustrations';
import Link from 'next/link';
import { Heart, Package, MapPin, User, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';

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
        {/* Hero section with illustration */}
        <AnimatedSection direction="up" className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden md:flex justify-center"
            >
              <PickleJarIllustration />
            </motion.div>

            {/* Right: Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="font-hindi text-sm text-cp-crimson mb-2">Hello,</p>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-cp-text mb-4">
                  {user?.name || user?.email}
                </h1>
                <p className="text-cp-text-muted text-lg mb-6">
                  Welcome back! Manage your orders, addresses, and preferences.
                </p>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* User info and sign out */}
        <AnimatedSection direction="up" delay={0.05} className="mb-12">
          <HoverLift lift={3} className="w-full">
            <div className="rounded-2xl border border-cp-border bg-white p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-cp-text-muted mb-1">
                    Email: {user?.email}
                  </p>
                  <p className="text-sm text-cp-text-muted">
                    Account Type: <span className="font-semibold text-cp-text capitalize">{user?.role || 'Customer'}</span>
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
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-cp-border text-cp-text font-medium hover:bg-cp-cream-dark transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </HoverLift>
        </AnimatedSection>

        {/* Account menu grid with stagger */}
        <AnimatedSection direction="up" delay={0.1}>
          <StaggerContainer staggerDelay={0.05} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {accountMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <StaggerItem key={item.id}>
                  <HoverLift lift={4} className="h-full">
                    <Link
                      href={item.href}
                      className="group flex items-start gap-4 rounded-2xl border border-cp-border bg-white p-6 transition-all duration-300 h-full hover:shadow-lg"
                    >
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        className="flex-shrink-0 rounded-lg bg-cp-crimson-light p-3 group-hover:bg-cp-crimson group-hover:text-white transition-colors"
                      >
                        <IconComponent className="w-6 h-6 text-cp-crimson group-hover:text-white" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-lg font-bold text-cp-text group-hover:text-cp-crimson transition-colors">
                          {item.label}
                        </h4>
                        <p className="text-sm text-cp-text-muted mt-1">
                          {item.description}
                        </p>
                      </div>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        className="flex-shrink-0 text-cp-border group-hover:text-cp-crimson transition-colors"
                      >
                        →
                      </motion.div>
                    </Link>
                  </HoverLift>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </AnimatedSection>

        {/* Quick stats */}
        <AnimatedSection direction="up" delay={0.15}>
          <HoverLift lift={2} className="w-full">
            <div className="rounded-2xl border border-cp-border bg-white p-6 md:p-8">
              <h3 className="font-display text-xl font-bold text-cp-text mb-6">
                Account Info
              </h3>
              <StaggerContainer staggerDelay={0.05} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Email Status", value: "Verified", color: "text-cp-green" },
                  { label: "Account Type", value: user?.role === 'admin' ? 'Administrator' : 'Customer', color: "text-cp-text" },
                  { label: "Status", value: "Active", color: "text-cp-crimson" },
                ].map((item, idx) => (
                  <StaggerItem key={item.label}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="flex flex-col"
                    >
                      <p className="text-sm text-cp-text-muted mb-2">{item.label}</p>
                      <p className={`font-semibold ${item.color}`}>{item.value}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </HoverLift>
        </AnimatedSection>
      </div>
    </div>
  );
}
