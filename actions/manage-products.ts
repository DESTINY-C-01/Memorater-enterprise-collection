'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';

interface CreateProductInput {
  name: string;
  description: string;
  categoryId: string | null;
  basePrice: number;
  discountPercent: number;
  productCode: string;
  sizes: string[];
  colors: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

export async function createProduct(input: CreateProductInput) {
  const supabase = await createClient();

  const slug = `${slugify(input.name)}-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from('products')
    .insert({
      name: input.name,
      slug,
      description: input.description,
      category_id: input.categoryId,
      base_price: input.basePrice,
      discount_percent: input.discountPercent,
      product_code: input.productCode || null,
      sizes: input.sizes,
      colors: input.colors,
      is_featured: input.isFeatured,
      is_new_arrival: input.isNewArrival,
      is_best_seller: input.isBestSeller,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { success: false as const, error: error?.message ?? 'Could not create product' };
  }

  revalidatePath('/admin/dashboard/products');
  return { success: true as const, productId: data.id };
}

export async function uploadProductImage(productId: string, file: File, isPrimary: boolean) {
  const supabase = await createClient();

  const fileExt = file.name.split('.').pop();
  const filePath = `${productId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);

  if (uploadError) {
    return { success: false as const, error: uploadError.message };
  }

  const { data: publicUrl } = supabase.storage.from('product-images').getPublicUrl(filePath);

  const { error: insertError } = await supabase.from('product_images').insert({
    product_id: productId,
    image_url: publicUrl.publicUrl,
    is_primary: isPrimary,
  });

  if (insertError) {
    return { success: false as const, error: insertError.message };
  }

  revalidatePath('/admin/dashboard/products');
  return { success: true as const };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', productId);

  if (error) return { success: false as const, error: error.message };

  revalidatePath('/admin/dashboard/products');
  return { success: true as const };
}

interface UpdateProductInput {
  name: string;
  description: string;
  categoryId: string | null;
  basePrice: number;
  discountPercent: number;
  productCode: string;
  sizes: string[];
  colors: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isAvailable: boolean;
}

export async function updateProduct(productId: string, input: UpdateProductInput) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('products')
    .update({
      name: input.name,
      description: input.description,
      category_id: input.categoryId,
      base_price: input.basePrice,
      discount_percent: input.discountPercent,
      product_code: input.productCode || null,
      sizes: input.sizes,
      colors: input.colors,
      is_featured: input.isFeatured,
      is_new_arrival: input.isNewArrival,
      is_best_seller: input.isBestSeller,
      is_available: input.isAvailable,
    })
    .eq('id', productId);

  if (error) return { success: false as const, error: error.message };

  revalidatePath('/admin/dashboard/products');
  revalidatePath(`/admin/dashboard/products/${productId}`);
  return { success: true as const };
}

export async function deleteProductImage(imageId: string, productId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('product_images').delete().eq('id', imageId);

  if (error) return { success: false as const, error: error.message };

  revalidatePath(`/admin/dashboard/products/${productId}`);
  return { success: true as const };
}

export async function setPrimaryImage(imageId: string, productId: string) {
  const supabase = await createClient();

  // Clear existing primary flag, then set the chosen one
  await supabase.from('product_images').update({ is_primary: false }).eq('product_id', productId);
  const { error } = await supabase.from('product_images').update({ is_primary: true }).eq('id', imageId);

  if (error) return { success: false as const, error: error.message };

  revalidatePath(`/admin/dashboard/products/${productId}`);
  revalidatePath('/admin/dashboard/products');
  return { success: true as const };
}