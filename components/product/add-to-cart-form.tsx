'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Minus, Plus } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/hooks/use-cart';
import { useCurrency } from '@/hooks/use-currency';
import { DEFAULT_CURRENCIES, convertPrice, formatMoney, getCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

export function AddToCartForm({ product }: { product: Product }) {
  const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);
  const [color, setColor] = useState<string | null>(product.colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCart((s) => s.addItem);
  const currencyCode = useCurrency((s) => s.currency);
  const currency = getCurrency(currencyCode, DEFAULT_CURRENCIES);

  const discountedBase = product.base_price * (1 - (product.discount_percent ?? 0) / 100);
  const displayPrice = formatMoney(convertPrice(discountedBase, currency), currency);

  const primaryImage =
    product.images?.find((i) => i.is_primary)?.image_url ?? product.images?.[0]?.image_url ?? null;

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: primaryImage,
      size,
      color,
      quantity,
      unitPrice: discountedBase,
    });
    toast.success(`${product.name} added to your bag`);
  }

  return (
    <div className="space-y-6">
      <div className="font-display text-3xl">{displayPrice}</div>

      {product.sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  'px-4 py-2 rounded-full border text-sm transition-colors',
                  size === s
                    ? 'bg-brand-black text-white border-brand-black'
                    : 'border-black/20 hover:border-brand-black'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Color</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  'px-4 py-2 rounded-full border text-sm transition-colors',
                  color === c
                    ? 'bg-brand-black text-white border-brand-black'
                    : 'border-black/20 hover:border-brand-black'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-medium mb-2">Quantity</p>
        <div className="flex items-center gap-3 border border-black/20 rounded-full w-fit px-3 py-1.5">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <Minus size={16} />
          </button>
          <span className="w-6 text-center text-sm">{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!product.is_available}
        className="w-full bg-brand-black text-white py-3.5 rounded-full font-medium text-sm hover:bg-brand-gold hover:text-brand-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {product.is_available ? 'Add to Bag' : 'Out of Stock'}
      </button>
    </div>
  );
}
