/**
 * Central place for business contact info, owner profile, and socials.
 * Edit the values below — they're used across the About, Contact,
 * Footer, and checkout WhatsApp flow.
 */

export const OWNER = {
  name: 'Pretty precious Akayahweh', // ← replace with the owner's real display name if different
  photo: '/images/owner.jpg',
  instagram: 'iamprettypressh',
  tiktok: 'iamprettypressh',
};

export const BUSINESS_SOCIALS = {
  instagram: 'memorater_interprise_shoes',
  tiktok: 'memorater.interprise',
};

// First number is used as the primary WhatsApp ordering number
// (the one the checkout flow redirects to). The second is shown
// as an alternative contact option on the Contact page.
export const WHATSAPP_NUMBERS = {
  primary: '22892333067',
  secondary: '22890273775',
};

export const BUSINESS_EMAILS = [
  'elenmapretty596@gmail.com',
  'prettypreciousakayahweh@gmail.com',
];

export function instagramUrl(handle: string) {
  return `https://instagram.com/${handle}`;
}

export function tiktokUrl(handle: string) {
  return `https://www.tiktok.com/@${handle}`;
}

export function whatsappUrl(number: string, message?: string) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}