import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import '@/styles/globals.css';

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://memorater.com'),
  title: {
    default: 'Memorater Interprise Collection | Premium Women\'s Fashion',
    template: '%s | Memorater Interprise Collection',
  },
  description:
    'Shop premium women\'s shoes, heels, sneakers, sandals, bags and accessories. Browse, select, and order directly via WhatsApp.',
  openGraph: {
    title: 'Memorater Interprise Collection',
    description: 'Premium women\'s fashion, ordered directly via WhatsApp.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
