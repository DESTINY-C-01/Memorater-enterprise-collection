import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/queries/products';
import { AddToCartForm } from '@/components/product/add-to-cart-form';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.images?.map((i) => ({ url: i.image_url })) ?? [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const primaryImage =
    product.images?.find((i) => i.is_primary)?.image_url ?? product.images?.[0]?.image_url;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <div className="relative aspect-[4/5] rounded-xl2 overflow-hidden bg-brand-pink/10">
          {primaryImage && (
            <Image src={primaryImage} alt={product.name} fill className="object-cover" priority />
          )}
        </div>
        {product.images && product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {product.images.slice(0, 4).map((img) => (
              <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-brand-pink/10">
                <Image src={img.image_url} alt={img.alt_text ?? product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-brand-black/50 mb-2">
          {product.category?.name}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl mb-4">{product.name}</h1>
        {product.description && (
          <p className="text-sm text-brand-black/70 leading-relaxed mb-6">{product.description}</p>
        )}

        <AddToCartForm product={product} />

        {product.product_code && (
          <p className="text-xs text-brand-black/40 mt-6">Product Code: {product.product_code}</p>
        )}
      </div>
    </div>
  );
}
