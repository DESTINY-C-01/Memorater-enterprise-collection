import Link from 'next/link';
import { Instagram, MessageCircle } from 'lucide-react';
import { TikTokIcon } from '@/components/ui/tiktok-icon';
import { BUSINESS_SOCIALS, WHATSAPP_NUMBERS, instagramUrl, tiktokUrl, whatsappUrl } from '@/lib/site-config';

export function Footer() {
  return (
    <footer className="bg-brand-black text-brand-white mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-xl text-gradient-gold mb-3">Memorater</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Premium women&apos;s shoes, bags, and accessories — curated for elegance,
            ordered with ease.
          </p>
          <div className="flex gap-4 mt-5">
            <a href={instagramUrl(BUSINESS_SOCIALS.instagram)} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={18} className="text-white/70 hover:text-brand-gold cursor-pointer" />
            </a>
            <a href={tiktokUrl(BUSINESS_SOCIALS.tiktok)} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <TikTokIcon size={18} className="text-white/70 hover:text-brand-gold cursor-pointer" />
            </a>
            <a href={whatsappUrl(WHATSAPP_NUMBERS.primary)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <MessageCircle size={18} className="text-white/70 hover:text-brand-gold cursor-pointer" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wide mb-4 text-brand-gold">Shop</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/products?category=heels" className="hover:text-white">Heels</Link></li>
            <li><Link href="/products?category=sneakers" className="hover:text-white">Sneakers</Link></li>
            <li><Link href="/products?category=bags" className="hover:text-white">Bags</Link></li>
            <li><Link href="/products?category=sandals" className="hover:text-white">Sandals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wide mb-4 text-brand-gold">Support</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wide mb-4 text-brand-gold">How Ordering Works</h4>
          <p className="text-sm text-white/60 leading-relaxed">
            Add items to your bag, share your delivery details, and confirm your order
            directly on WhatsApp — no online payment required.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Memorater Interprise Collection. All rights reserved.
      </div>
    </footer>
  );
}