import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { TikTokIcon } from '@/components/ui/tiktok-icon';
import { OWNER, BUSINESS_SOCIALS, instagramUrl, tiktokUrl } from '@/lib/site-config';

export const metadata = { title: 'About Us' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl mb-6">Our Story</h1>
      <div className="space-y-4 text-brand-black/70 text-sm leading-relaxed">
        <p>
          Memorater Interprise Collection was founded in 15 june 2023 on a simple belief: every
          woman deserves to feel elegant, confident, and effortlessly put together.
          We curate premium shoes, bags, and accessories that blend timeless
          craftsmanship with contemporary style.
        </p>
        <p>
          Every order is handled personally — no impersonal checkout, no hidden
          fees. Browse the collection, add your favorites to your bag, and confirm
          your order directly with us on WhatsApp. We&apos;ll walk you through
          availability, sizing, and payment ourselves.
        </p>
      </div>

      {/* Owner profile */}
      <div className="mt-14 border border-black/10 rounded-xl2 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden shrink-0 shadow-gold">
          <Image src={OWNER.photo} alt={OWNER.name} fill className="object-cover" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-xs uppercase tracking-wider text-brand-gold mb-1">Founder</p>
          <h2 className="font-display text-2xl mb-3">{OWNER.name}</h2>
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <a
              href={instagramUrl(OWNER.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-brand-black/70 hover:text-brand-gold transition-colors"
            >
              <Instagram size={16} /> @{OWNER.instagram}
            </a>
            <a
              href={tiktokUrl(OWNER.tiktok)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-brand-black/70 hover:text-brand-gold transition-colors"
            >
              <TikTokIcon size={16} /> @{OWNER.tiktok}
            </a>
          </div>
        </div>
      </div>

      {/* Follow the brand */}
      <div className="mt-6 text-center">
        <p className="text-xs uppercase tracking-wider text-brand-black/50 mb-3">
          Follow Memorater Interprise Collection
        </p>
        <div className="flex items-center justify-center gap-5">
          <a
            href={instagramUrl(BUSINESS_SOCIALS.instagram)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm hover:text-brand-gold transition-colors"
          >
            <Instagram size={16} /> @{BUSINESS_SOCIALS.instagram}
          </a>
          <a
            href={tiktokUrl(BUSINESS_SOCIALS.tiktok)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm hover:text-brand-gold transition-colors"
          >
            <TikTokIcon size={16} /> @{BUSINESS_SOCIALS.tiktok}
          </a>
        </div>
      </div>
    </div>
  );
}