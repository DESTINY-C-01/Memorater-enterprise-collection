import { createClient } from '@/lib/supabase/server';

async function getReviews() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('reviews')
    .select('id, customer_name, rating, comment, is_approved, product:products(name)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews();

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Reviews</h1>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="border border-black/10 rounded-xl2 p-4 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">{r.customer_name} — {'★'.repeat(r.rating)}</p>
              <p className="text-xs text-brand-black/50 mt-1">{r.comment}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${r.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {r.is_approved ? 'Approved' : 'Pending'}
            </span>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-brand-black/40 text-sm py-12 text-center">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
