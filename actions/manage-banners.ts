'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

interface CreateBannerInput {
  title: string;
  subtitle: string;
  linkUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export async function createBanner(input: CreateBannerInput, imageFile: File) {
  const supabase = await createClient();

  const fileExt = imageFile.name.split('.').pop();
  const filePath = `${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from('banners').upload(filePath, imageFile);

  if (uploadError) {
    return { success: false as const, error: uploadError.message };
  }

  const { data: publicUrl } = supabase.storage.from('banners').getPublicUrl(filePath);

  const { error: insertError } = await supabase.from('banners').insert({
    title: input.title,
    subtitle: input.subtitle || null,
    link_url: input.linkUrl || null,
    sort_order: input.sortOrder,
    is_active: input.isActive,
    image_url: publicUrl.publicUrl,
  });

  if (insertError) {
    return { success: false as const, error: insertError.message };
  }

  revalidatePath('/admin/dashboard/banners');
  revalidatePath('/');
  return { success: true as const };
}

export async function toggleBannerActive(bannerId: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from('banners').update({ is_active: isActive }).eq('id', bannerId);

  if (error) return { success: false as const, error: error.message };

  revalidatePath('/admin/dashboard/banners');
  revalidatePath('/');
  return { success: true as const };
}

export async function deleteBanner(bannerId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('banners').delete().eq('id', bannerId);

  if (error) return { success: false as const, error: error.message };

  revalidatePath('/admin/dashboard/banners');
  revalidatePath('/');
  return { success: true as const };
}