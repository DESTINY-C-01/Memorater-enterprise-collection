'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { Star, Trash2 } from 'lucide-react';
import {
  updateProduct,
  uploadProductImage,
  deleteProductImage,
  setPrimaryImage,
  deleteProduct,
} from '@/actions/manage-products';
import { Category, Product } from '@/types';

export function ProductEditForm({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);

    const result = await updateProduct(product.id, {
      name: String(form.get('name')),
      description: String(form.get('description') ?? ''),
      categoryId: String(form.get('categoryId') || '') || null,
      basePrice: Number(form.get('basePrice')),
      discountPercent: Number(form.get('discountPercent') || 0),
      productCode: String(form.get('productCode') ?? ''),
      sizes: String(form.get('sizes') ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      colors: String(form.get('colors') ?? '')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      isFeatured: form.get('isFeatured') === 'on',
      isNewArrival: form.get('isNewArrival') === 'on',
      isBestSeller: form.get('isBestSeller') === 'on',
      isAvailable: form.get('isAvailable') === 'on',
    });

    if (newImages && newImages.length > 0) {
      for (let i = 0; i < newImages.length; i++) {
        await uploadProductImage(product.id, newImages[i], false);
      }
    }

    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Product updated');
    router.refresh();
  }

  function handleDeleteImage(imageId: string) {
    startTransition(async () => {
      const result = await deleteProductImage(imageId, product.id);
      if (!result.success) toast.error(result.error);
      else router.refresh();
    });
  }

  function handleSetPrimary(imageId: string) {
    startTransition(async () => {
      const result = await setPrimaryImage(imageId, product.id);
      if (!result.success) toast.error(result.error);
      else router.refresh();
    });
  }

  function handleDeleteProduct() {
    if (!confirm(`Delete "${product.name}"? This removes it from the storefront.`)) return;
    startTransition(async () => {
      const result = await deleteProduct(product.id);
      if (!result.success) toast.error(result.error);
      else {
        toast.success('Product deleted');
        router.push('/admin/dashboard/products');
      }
    });
  }

  return (
    <div className="max-w-2xl space-y-10">
      {product.images && product.images.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">Current Images</p>
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img) => (
              <div key={img.id} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-brand-pink/10 border border-black/10">
                  <Image src={img.image_url} alt={product.name} fill className="object-cover" />
                </div>
                {img.is_primary && (
                  <span className="absolute top-1 left-1 bg-brand-gold text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    Primary
                  </span>
                )}
                <div className="flex items-center justify-center gap-2 mt-1.5">
                  {!img.is_primary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img.id)}
                      disabled={isPending}
                      title="Set as primary"
                      className="text-brand-black/40 hover:text-brand-gold"
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    disabled={isPending}
                    title="Delete image"
                    className="text-brand-black/40 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium block mb-1.5">Product Name</label>
          <input
            name="name"
            defaultValue={product.name}
            required
            className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Description</label>
          <textarea
            name="description"
            defaultValue={product.description ?? ''}
            rows={3}
            className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Category</label>
            <select
              name="categoryId"
              defaultValue={product.category_id ?? ''}
              className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Product Code</label>
            <input
              name="productCode"
              defaultValue={product.product_code ?? ''}
              className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Base Price (₦)</label>
            <input
              name="basePrice"
              type="number"
              step="0.01"
              defaultValue={product.base_price}
              required
              className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Discount %</label>
            <input
              name="discountPercent"
              type="number"
              step="0.01"
              defaultValue={product.discount_percent}
              className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Sizes (comma-separated)</label>
            <input
              name="sizes"
              defaultValue={product.sizes.join(', ')}
              className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Colors (comma-separated)</label>
            <input
              name="colors"
              defaultValue={product.colors.join(', ')}
              className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Add More Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewImages(e.target.files)}
            className="w-full text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isFeatured" defaultChecked={product.is_featured} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isNewArrival" defaultChecked={product.is_new_arrival} /> New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isBestSeller" defaultChecked={product.is_best_seller} /> Best Seller
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isAvailable" defaultChecked={product.is_available} /> Available
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-brand-black text-white px-6 py-3 rounded-full text-sm hover:bg-brand-gold hover:text-brand-black transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDeleteProduct}
            disabled={isPending}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Delete Product
          </button>
        </div>
      </form>
    </div>
  );
}