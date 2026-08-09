'use client';

import { useState } from 'react';
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
  Menu,
  X,
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

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between bg-brand-black text-white px-4 py-3 sticky top-0 z-40">
        <span className="font-display text-lg text-gradient-gold">Memorater</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      {/* Backdrop, mobile only, when drawer is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar: fixed drawer on mobile, static column on desktop */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-brand-black text-white flex flex-col shrink-0 z-50 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg text-gradient-gold">Memorater</h1>
            <p className="text-[10px] tracking-[0.25em] text-white/40">ADMIN</p>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
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
    </>
  );
}