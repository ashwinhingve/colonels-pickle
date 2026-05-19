'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Truck,
  Users,
  Package,
  Film,
  Tags,
  Settings,
  UserCheck,
  TicketPercent,
  BarChart2,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    label: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    label: 'Shipments',
    href: '/admin/shipments',
    icon: Truck,
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: Tags,
  },
  {
    label: 'Production',
    href: '/admin/production',
    icon: Film,
  },
  {
    label: 'Team',
    href: '/admin/team',
    icon: UserCheck,
  },
  {
    label: 'Offers',
    href: '/admin/offers',
    icon: TicketPercent,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Site Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    label: 'Marketing',
    href: '/admin/marketing',
    icon: BarChart2,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-cp-crimson border-r border-cp-crimson-dark pt-5 pb-4 overflow-y-auto">
          {/* Brand */}
          <div className="flex items-center flex-shrink-0 px-6 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-extrabold text-white">
                  Colonel&apos;s Pickle
                </h2>
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  Admin
                </span>
              </div>
              <p className="mt-1 text-sm text-white/70">By Ridhwika Agro Organics</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150
                    ${
                      isActive
                        ? 'bg-white text-cp-crimson border-l-4 border-white'
                        : 'text-white/85 hover:bg-white/15 hover:text-white border-l-4 border-transparent'
                    }
                  `}
                >
                  <Icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0 transition-colors
                      ${isActive ? 'text-cp-crimson' : 'text-white/70 group-hover:text-white'}
                    `}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/20">
            <p className="text-xs text-white/60">
              Admin access only. All actions are logged.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
