import { Hero } from '@/components/layout/hero';
import { ProductGrid } from '@/components/product/product-grid';
import { getFeaturedProducts, getNewArrivals, getBestSellers } from '@/lib/queries/products';
import { getActiveBanners } from '@/lib/queries/banners';

export default async function HomePage() {
  const [featured, newArrivals, bestSellers, banners] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getBestSellers(),
    getActiveBanners(),
  ]);

  return (
    <>
      <Hero banners={banners} />
      <ProductGrid products={featured} title="Featured Pieces" />
      <div className="bg-brand-pink/10">
        <ProductGrid products={newArrivals} title="New Arrivals" />
      </div>
      <ProductGrid products={bestSellers} title="Best Sellers" />
    </>
  );
}