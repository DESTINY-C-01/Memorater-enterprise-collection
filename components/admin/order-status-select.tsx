'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { updateOrderStatus } from '@/actions/update-order-status';
import { OrderStatus } from '@/types';

const STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'completed',
  'cancelled',
];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(newStatus: OrderStatus) {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (!result.success) {
        toast.error('Could not update status');
      } else {
        toast.success('Order status updated');
      }
    });
  }

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      className="text-xs border border-black/15 rounded-full px-3 py-1 capitalize focus:outline-none focus:ring-1 focus:ring-brand-gold"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
