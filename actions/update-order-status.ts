'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { OrderStatus } from '@/types';

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient();

  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);

  if (error) {
    return { success: false as const, error: error.message };
  }

  revalidatePath('/admin/dashboard/orders');
  return { success: true as const };
}
