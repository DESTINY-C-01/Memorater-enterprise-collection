'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCart } from '@/hooks/use-cart';
import { useCurrency } from '@/hooks/use-currency';
import { createOrder } from '@/actions/create-order';

const schema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  phoneNumber: z.string().min(7, 'Enter a valid phone number'),
  deliveryLocation: z.string().min(3, 'Enter your delivery location'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutForm() {
  const [submitting, setSubmitting] = useState(false);
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clearCart);
  const currency = useCurrency((s) => s.currency);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    if (!items.length) {
      toast.error('Your bag is empty');
      return;
    }

    setSubmitting(true);
    const result = await createOrder({
      customer: values,
      items,
      currencyCode: currency,
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    clearCart();
    window.location.href = result.whatsappLink;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="text-sm font-medium block mb-1.5">Full Name</label>
        <input
          {...register('fullName')}
          className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
          placeholder="Jane Doe"
        />
        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Phone Number</label>
        <input
          {...register('phoneNumber')}
          className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
          placeholder="e.g. 2348012345678"
        />
        {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Delivery Location</label>
        <input
          {...register('deliveryLocation')}
          className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
          placeholder="City, area / street address"
        />
        {errors.deliveryLocation && (
          <p className="text-xs text-red-500 mt-1">{errors.deliveryLocation.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Notes (optional)</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
          placeholder="Any special instructions"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#25D366] text-white py-3.5 rounded-full font-medium text-sm hover:bg-[#1ebc59] transition-colors disabled:opacity-50"
      >
        {submitting ? 'Preparing your order…' : 'Order on WhatsApp'}
      </button>
    </form>
  );
}
