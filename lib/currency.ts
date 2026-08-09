import { Currency, CurrencyCode } from '@/types';

export const DEFAULT_CURRENCIES: Currency[] = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rate_to_base: 1, is_active: true },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', rate_to_base: 0.011, is_active: true },
  { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc', rate_to_base: 0.85, is_active: true },
];

/** Convert a base-currency (NGN) amount into the target currency. */
export function convertPrice(baseAmount: number, currency: Currency): number {
  return baseAmount * currency.rate_to_base;
}

export function formatMoney(amount: number, currency: Currency): string {
  const rounded = Math.round(amount);
  return `${currency.symbol}${rounded.toLocaleString('en-US')}`;
}

export function getCurrency(code: CurrencyCode, list: Currency[] = DEFAULT_CURRENCIES): Currency {
  return list.find((c) => c.code === code) ?? list[0];
}
