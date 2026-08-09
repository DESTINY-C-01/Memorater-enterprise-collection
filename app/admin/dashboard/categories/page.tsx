import { createClient } from '@/lib/supabase/server';

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order');
  return data ?? [];
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Categories</h1>
      <div className="border border-black/10 rounded-xl2 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/5 text-left text-xs text-brand-black/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-brand-black/50">{c.slug}</td>
                <td className="px-4 py-3">{c.is_active ? 'Yes' : 'No'}</td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-brand-black/40">
                  No categories yet — seed some in Supabase or build the add-form here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
