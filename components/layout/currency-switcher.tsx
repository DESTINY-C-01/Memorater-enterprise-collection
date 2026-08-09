'use client';

import { useCurrency } from '@/hooks/use-currency';
import { DEFAULT_CURRENCIES } from '@/lib/currency';
import { CurrencyCode } from '@/types';

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
      className="bg-transparent text-sm font-medium border border-brand-gold/40 rounded-full px-3 py-1.5 cursor-pointer hover:border-brand-gold transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold"
      aria-label="Select currency"
    >
      {DEFAULT_CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.code} {c.symbol}
        </option>
      ))}
    </select>
  );
}
