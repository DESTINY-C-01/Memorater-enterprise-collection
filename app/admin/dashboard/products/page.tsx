import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

async function getProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('id, name, base_price, is_available, is_featured, images:product_images(image_url, is_primary)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  return data ?? [];
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Products</h1>
        <Link
          href="/admin/dashboard/products/new"
          className="flex items-center gap-2 bg-brand-black text-white text-sm px-4 py-2.5 rounded-full hover:bg-brand-gold hover:text-brand-black transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => {
          const image = product.images?.find((i) => i.is_primary)?.image_url ?? product.images?.[0]?.image_url;
          return (
            <Link
              key={product.id}
              href={`/admin/dashboard/products/${product.id}`}
              className="border border-black/10 rounded-xl2 overflow-hidden hover:border-brand-gold transition-colors"
            >
              <div className="relative aspect-square bg-brand-pink/10">
                {image && <Image src={image} alt={product.name} fill className="object-cover" />}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                <p className="text-xs text-brand-black/50 mt-1">₦{product.base_price}</p>
              </div>
            </Link>
          );
        })}
        {products.length === 0 && (
          <p className="text-brand-black/40 text-sm col-span-full py-12 text-center">
            No products yet — add your first one.
          </p>
        )}
      </div>
    </div>
  );
}
