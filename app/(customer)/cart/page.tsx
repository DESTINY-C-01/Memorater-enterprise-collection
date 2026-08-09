'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useCurrency } from '@/hooks/use-currency';
import { DEFAULT_CURRENCIES, convertPrice, formatMoney, getCurrency } from '@/lib/currency';
import { CheckoutForm } from '@/components/cart/checkout-form';

export default function CartPage() {
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotalBase = useCart((s) => s.subtotal());

  const currencyCode = useCurrency((s) => s.currency);
  const currency = getCurrency(currencyCode, DEFAULT_CURRENCIES);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl mb-3">Your bag is empty</h1>
        <p className="text-brand-black/60 text-sm mb-8">
          Browse the collection and add something you love.
        </p>
        <Link
          href="/products"
          className="inline-block bg-brand-black text-white px-7 py-3 rounded-full text-sm hover:bg-brand-gold hover:text-brand-black transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="font-display text-2xl mb-4">Your Bag</h1>
        {items.map((item) => {
          const lineTotal = formatMoney(convertPrice(item.unitPrice * item.quantity, currency), currency);
          return (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex gap-4 border border-black/10 rounded-xl2 p-4"
            >
              <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-brand-pink/10 shrink-0">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    aria-label="Remove item"
                    className="text-brand-black/40 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-xs text-brand-black/50 mt-1">
                  {[item.size, item.color].filter(Boolean).join(' · ')}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3 border border-black/15 rounded-full px-3 py-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                      }
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-medium text-sm">{lineTotal}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lg:col-span-1">
        <div className="border border-black/10 rounded-xl2 p-6 sticky top-24">
          <h2 className="font-display text-xl mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-brand-black/60">Subtotal</span>
            <span className="font-medium">
              {formatMoney(convertPrice(subtotalBase, currency), currency)}
            </span>
          </div>
          <p className="text-xs text-brand-black/40 mb-6">
            Delivery fees are confirmed with you on WhatsApp.
          </p>
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}
