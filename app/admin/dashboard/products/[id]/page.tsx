import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductEditForm } from '@/components/admin/product-edit-form';
import { Product } from '@/types';

const PRODUCT_SELECT = `
  id, category_id, name, slug, description, product_code, base_price,
  discount_percent, sizes, colors, is_featured, is_new_arrival, is_best_seller,
  is_available,
  images:product_images(id, product_id, image_url, alt_text, sort_order, is_primary)
`;

async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('products').select(PRODUCT_SELECT).eq('id', id).single();
  return (data as unknown as Product) ?? null;
}

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').is('deleted_at', null).order('sort_order');
  return data ?? [];
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProduct(id), getCategories()]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Edit Product</h1>
      <ProductEditForm product={product} categories={categories} />
    </div>
  );
}