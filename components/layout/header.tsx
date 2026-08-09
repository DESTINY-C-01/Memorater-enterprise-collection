'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Menu, X, Heart, Search } from 'lucide-react';
import { CurrencySwitcher } from './currency-switcher';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/products', label: 'Shop' },
  { href: '/products?category=heels', label: 'Heels' },
  { href: '/products?category=bags', label: 'Bags' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = useCart((s) => s.totalItems());

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            className="lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/" className="font-display text-xl sm:text-2xl tracking-wide text-gradient-gold">
            Memorater
            <span className="block text-[0.55rem] tracking-[0.35em] text-brand-black/70 font-body">
              INTERPRISE COLLECTION
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-brand-gold transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <CurrencySwitcher />
            <Link href="/products" aria-label="Search" className="hidden sm:block hover:text-brand-gold">
              <Search size={20} />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:block hover:text-brand-gold">
              <Heart size={20} />
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative hover:text-brand-gold">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300 bg-brand-white border-t border-brand-gold/10',
          menuOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-2 text-sm font-medium border-b border-brand-black/5 last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
