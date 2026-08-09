import { Product } from '@/types';
import { ProductCard } from './product-card';

export function ProductGrid({ products, title }: { products: Product[]; title?: string }) {
  if (!products.length) {
    return (
      <div className="text-center py-16 text-brand-black/50 text-sm">
        No products found yet — check back soon.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      {title && (
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
