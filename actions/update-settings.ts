'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

interface UpdateSettingsInput {
  siteName: string;
  tagline: string;
  whatsappNumber: string;
  baseCurrency: string;
}

export async function updateSettings(input: UpdateSettingsInput) {
  const supabase = await createClient();

  const updates = [
    supabase
      .from('settings')
      .update({ value: { name: input.siteName, tagline: input.tagline } })
      .eq('key', 'site_info'),
    supabase
      .from('settings')
      .update({ value: input.whatsappNumber })
      .eq('key', 'whatsapp_number'),
    supabase
      .from('settings')
      .update({ value: input.baseCurrency })
      .eq('key', 'base_currency'),
  ];

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);

  if (failed?.error) {
    return { success: false as const, error: failed.error.message };
  }

  revalidatePath('/admin/dashboard/settings');
  return { success: true as const };
}