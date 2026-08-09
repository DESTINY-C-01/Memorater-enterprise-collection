'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { useCurrency } from '@/hooks/use-currency';
import { DEFAULT_CURRENCIES, convertPrice, formatMoney, getCurrency } from '@/lib/currency';

export function ProductCard({ product }: { product: Product }) {
  const currencyCode = useCurrency((s) => s.currency);
  const currency = getCurrency(currencyCode, DEFAULT_CURRENCIES);

  const discountedBase =
    product.base_price * (1 - (product.discount_percent ?? 0) / 100);
  const displayPrice = formatMoney(convertPrice(discountedBase, currency), currency);
  const originalPrice =
    product.discount_percent > 0
      ? formatMoney(convertPrice(product.base_price, currency), currency)
      : null;

  const primaryImage =
    product.images?.find((i) => i.is_primary)?.image_url ?? product.images?.[0]?.image_url;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-xl2 overflow-hidden bg-white shadow-luxe border border-black/5"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[4/5] bg-brand-pink/20 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-black/30 text-sm">
              No image
            </div>
          )}

          {product.discount_percent > 0 && (
            <span className="absolute top-3 left-3 bg-brand-gold text-white text-[10px] font-bold px-2 py-1 rounded-full">
              -{product.discount_percent}%
            </span>
          )}

          <button
            aria-label="Add to wishlist"
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <Heart size={16} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-brand-black/50 mb-1">
            {product.category?.name}
          </p>
          <h3 className="font-medium text-sm text-brand-black line-clamp-1">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-display text-base text-brand-black">{displayPrice}</span>
            {originalPrice && (
              <span className="text-xs text-brand-black/40 line-through">{originalPrice}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
