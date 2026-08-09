export const metadata = { title: 'Wishlist' };

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
      <h1 className="font-display text-2xl mb-3">Your Wishlist</h1>
      <p className="text-sm text-brand-black/60">
        Wishlist items you save will appear here. Tap the heart icon on any
        product to add it.
      </p>
    </div>
  );
}
