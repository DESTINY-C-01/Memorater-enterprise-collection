import { createClient } from '@/lib/supabase/server';
import { Banner } from '@/types';

export async function getActiveBanners(): Promise<Banner[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('banners')
    .select('id, title, subtitle, image_url, link_url, is_active')
    .eq('is_active', true)
    .order('sort_order');

  return data ?? [];
}