import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/admin/product-form';

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').is('deleted_at', null).order('sort_order');
  return data ?? [];
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Add Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
