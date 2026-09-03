'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, AlertTriangle, Truck, Users } from 'lucide-react';

interface TabItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabItem[] = [
  {
    label: 'Overview',
    href: '/admin/inventory',
    icon: Package,
  },
  {
    label: 'Raw Materials',
    href: '/admin/inventory/raw-materials',
    icon: AlertTriangle,
  },
  {
    label: 'Suppliers',
    href: '/admin/inventory/suppliers',
    icon: Users,
  },
  {
    label: 'Movements',
    href: '/admin/inventory/movements',
    icon: Truck,
  },
];

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8" aria-label="Inventory tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              pathname === tab.href ||
              (tab.href !== '/admin/inventory' &&
                pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  flex items-center gap-2 pb-3 text-sm font-medium
                  border-b-2 transition-all duration-150
                  ${
                    isActive
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {children}
    </div>
  );
}
