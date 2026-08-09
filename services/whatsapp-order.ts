import { CartItem, CheckoutDetails, Currency } from '@/types';
import { convertPrice, formatMoney } from '@/lib/currency';

interface BuildOrderMessageArgs {
  orderNumber: string;
  customer: CheckoutDetails;
  items: CartItem[];
  currency: Currency;
}

/**
 * Builds a clean, readable order summary and returns both the plain text
 * (for storage) and a URL-encoded version (for the wa.me link).
 */
export function buildWhatsAppOrderMessage({
  orderNumber,
  customer,
  items,
  currency,
}: BuildOrderMessageArgs) {
  const lines: string[] = [];

  lines.push(`*New Order — Memorater Enterprise Collection*`);
  lines.push(`Order #: ${orderNumber}`);
  lines.push('');
  lines.push(`*Customer:* ${customer.fullName}`);
  lines.push(`*Phone:* ${customer.phoneNumber}`);
  lines.push(`*Delivery Location:* ${customer.deliveryLocation}`);
  lines.push('');
  lines.push('*Items:*');

  let subtotalBase = 0;

  items.forEach((item, idx) => {
    const lineTotalBase = item.unitPrice * item.quantity;
    subtotalBase += lineTotalBase;

    const unitConverted = convertPrice(item.unitPrice, currency);
    const lineConverted = convertPrice(lineTotalBase, currency);

    const variant = [item.size ? `Size: ${item.size}` : null, item.color ? `Color: ${item.color}` : null]
      .filter(Boolean)
      .join(', ');

    lines.push(
      `${idx + 1}. ${item.name}${variant ? ` (${variant})` : ''} — Qty: ${item.quantity} × ${formatMoney(
        unitConverted,
        currency
      )} = ${formatMoney(lineConverted, currency)}`
    );
  });

  const totalConverted = convertPrice(subtotalBase, currency);

  lines.push('');
  lines.push(`*Total: ${formatMoney(totalConverted, currency)} (${currency.code})*`);

  if (customer.notes) {
    lines.push('');
    lines.push(`*Notes:* ${customer.notes}`);
  }

  lines.push('');
  lines.push('Please confirm availability and send payment instructions. Thank you!');

  const plainText = lines.join('\n');
  const encoded = encodeURIComponent(plainText);

  return {
    plainText,
    encoded,
    subtotalBase,
    totalConverted,
  };
}

export function buildWhatsAppLink(phoneNumber: string, encodedMessage: string): string {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${digitsOnly}?text=${encodedMessage}`;
}
