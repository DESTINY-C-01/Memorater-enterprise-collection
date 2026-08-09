import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://memorater.com';
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .is('deleted_at', null)
    .eq('is_available', true);

  const staticRoutes = ['', '/products', '/about', '/contact', '/faq'].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = (products ?? []).map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
