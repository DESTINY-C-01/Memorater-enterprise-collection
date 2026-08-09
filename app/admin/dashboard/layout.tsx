import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Image as ImageIcon,
  Star,
  Settings,
  LogOut,
} from 'lucide-react';
import { signOutAdmin } from '@/actions/auth';

const NAV = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/dashboard/products', label: 'Products', icon: Package },
  { href: '/admin/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/dashboard/categories', label: 'Categories', icon: Tags },
  { href: '/admin/dashboard/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-brand-white">
      <aside className="w-64 bg-brand-black text-white flex flex-col shrink-0">
        <div className="p-6">
          <h1 className="font-display text-lg text-gradient-gold">Memorater</h1>
          <p className="text-[10px] tracking-[0.25em] text-white/40">ADMIN</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOutAdmin} className="p-3">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors w-full">
            <LogOut size={16} />
            Sign Out
          </button>
        </form>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
