import { ProductGrid } from '@/components/product/product-grid';
import { searchProducts } from '@/lib/queries/products';

interface ProductsPageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  const { products, total } = await searchProducts({
    query: params.q,
    categorySlug: params.category,
    page,
  });

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <h1 className="font-display text-3xl">
          {params.category
            ? params.category.charAt(0).toUpperCase() + params.category.slice(1)
            : 'All Products'}
        </h1>
        <p className="text-sm text-brand-black/50 mt-1">{total} items</p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
