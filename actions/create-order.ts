'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateOrderNumber } from '@/lib/utils';
import { buildWhatsAppOrderMessage, buildWhatsAppLink } from '@/services/whatsapp-order';
import { DEFAULT_CURRENCIES, getCurrency } from '@/lib/currency';
import { WHATSAPP_NUMBERS } from '@/lib/site-config';
import { CartItem, CurrencyCode } from '@/types';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  phoneNumber: z.string().min(7, 'Please enter a valid phone number'),
  deliveryLocation: z.string().min(3, 'Please enter your delivery location'),
  notes: z.string().optional(),
});

interface CreateOrderInput {
  customer: {
    fullName: string;
    phoneNumber: string;
    deliveryLocation: string;
    notes?: string;
  };
  items: CartItem[];
  currencyCode: CurrencyCode;
}

export async function createOrder(input: CreateOrderInput) {
  const parsed = checkoutSchema.safeParse(input.customer);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid details' };
  }

  if (!input.items.length) {
    return { success: false as const, error: 'Your cart is empty' };
  }

  const currency = getCurrency(input.currencyCode, DEFAULT_CURRENCIES);
  const orderNumber = generateOrderNumber();

  const { plainText, encoded, subtotalBase, totalConverted } = buildWhatsAppOrderMessage({
    orderNumber,
    customer: parsed.data,
    items: input.items,
    currency,
  });

  const supabase = createAdminClient();

  // Upsert a lightweight customer record
  const { data: customerRow } = await supabase
    .from('customers')
    .insert({
      full_name: parsed.data.fullName,
      phone_number: parsed.data.phoneNumber,
      delivery_location: parsed.data.deliveryLocation,
    })
    .select('id')
    .single();

  const { data: orderRow, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_id: customerRow?.id ?? null,
      customer_name: parsed.data.fullName,
      phone_number: parsed.data.phoneNumber,
      delivery_location: parsed.data.deliveryLocation,
      currency: currency.code,
      subtotal: subtotalBase,
      total_amount: subtotalBase,
      notes: parsed.data.notes ?? null,
      whatsapp_message: plainText,
      status: 'pending',
    })
    .select('id')
    .single();

  if (orderError || !orderRow) {
    return { success: false as const, error: 'Could not save order. Please try again.' };
  }

  const orderItemsPayload = input.items.map((item) => ({
    order_id: orderRow.id,
    product_id: item.productId,
    product_name: item.name,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    line_total: item.unitPrice * item.quantity,
  }));

  await supabase.from('order_items').insert(orderItemsPayload);

  
  const whatsappLink = buildWhatsAppLink(WHATSAPP_NUMBERS.primary, encoded);

  return {
    success: true as const,
    orderNumber,
    whatsappLink,
    totalFormatted: totalConverted,
  };
}
