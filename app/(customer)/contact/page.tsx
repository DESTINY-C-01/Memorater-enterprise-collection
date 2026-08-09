import { MessageCircle, Mail, MapPin, Instagram } from 'lucide-react';
import { TikTokIcon } from '@/components/ui/tiktok-icon';
import {
  WHATSAPP_NUMBERS,
  BUSINESS_EMAILS,
  BUSINESS_SOCIALS,
  whatsappUrl,
  instagramUrl,
  tiktokUrl,
} from '@/lib/site-config';

export const metadata = { title: 'Contact Us' };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl mb-8">Get in Touch</h1>
      <div className="space-y-4">
        <a
          href={whatsappUrl(WHATSAPP_NUMBERS.primary)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 border border-black/10 rounded-xl2 p-5 hover:border-brand-gold transition-colors"
        >
          <MessageCircle className="text-[#25D366]" />
          <div>
            <p className="font-medium text-sm">Chat with us on WhatsApp</p>
            <p className="text-xs text-brand-black/50">+{WHATSAPP_NUMBERS.primary} — primary line</p>
          </div>
        </a>

        <a
          href={whatsappUrl(WHATSAPP_NUMBERS.secondary)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 border border-black/10 rounded-xl2 p-5 hover:border-brand-gold transition-colors"
        >
          <MessageCircle className="text-[#25D366]" />
          <div>
            <p className="font-medium text-sm">Alternative WhatsApp line</p>
            <p className="text-xs text-brand-black/50">+{WHATSAPP_NUMBERS.secondary}</p>
          </div>
        </a>

        {BUSINESS_EMAILS.map((email) => (
          <a
            key={email}
            href={`mailto:${email}`}
            className="flex items-center gap-4 border border-black/10 rounded-xl2 p-5 hover:border-brand-gold transition-colors"
          >
            <Mail className="text-brand-gold" />
            <div>
              <p className="font-medium text-sm">{email}</p>
              <p className="text-xs text-brand-black/50">General enquiries</p>
            </div>
          </a>
        ))}

        <div className="flex items-center gap-4 border border-black/10 rounded-xl2 p-5">
          <MapPin className="text-brand-gold" />
          <div>
            <p className="font-medium text-sm">West Africa</p>
            <p className="text-xs text-brand-black/50">Shipping across Nigeria, Ghana &amp; Togo</p>
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <a
            href={instagramUrl(BUSINESS_SOCIALS.instagram)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-brand-black/70 hover:text-brand-gold transition-colors"
          >
            <Instagram size={16} /> @{BUSINESS_SOCIALS.instagram}
          </a>
          <a
            href={tiktokUrl(BUSINESS_SOCIALS.tiktok)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-brand-black/70 hover:text-brand-gold transition-colors"
          >
            <TikTokIcon size={16} /> @{BUSINESS_SOCIALS.tiktok}
          </a>
        </div>
      </div>
    </div>
  );
}