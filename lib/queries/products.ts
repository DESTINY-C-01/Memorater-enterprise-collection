import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';

const PRODUCT_SELECT = `
  id, category_id, name, slug, description, product_code, base_price,
  discount_percent, sizes, colors, is_featured, is_new_arrival, is_best_seller,
  is_available,
  category:categories(id, name, slug),
  images:product_images(id, product_id, image_url, alt_text, sort_order, is_primary)
`;

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_featured', true)
    .eq('is_available', true)
    .is('deleted_at', null)
    .limit(limit);

  return (data as unknown as Product[]) ?? [];
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_new_arrival', true)
    .eq('is_available', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data as unknown as Product[]) ?? [];
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_best_seller', true)
    .eq('is_available', true)
    .is('deleted_at', null)
    .limit(limit);

  return (data as unknown as Product[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .is('deleted_at', null)
    .single();

  return (data as unknown as Product) ?? null;
}

interface SearchProductsParams {
  query?: string;
  categorySlug?: string;
  page?: number;
  pageSize?: number;
}

export async function searchProducts({
  query,
  categorySlug,
  page = 1,
  pageSize = 12,
}: SearchProductsParams) {
  const supabase = await createClient();
  let builder = supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .eq('is_available', true)
    .is('deleted_at', null);

  if (query) {
    builder = builder.textSearch('name', query, { type: 'websearch' });
  }

  if (categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    if (category) builder = builder.eq('category_id', category.id);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await builder.range(from, to);

  return {
    products: (data as unknown as Product[]) ?? [],
    total: count ?? 0,
  };
}
