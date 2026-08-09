'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createProduct, uploadProductImage } from '@/actions/manage-products';
import { Category } from '@/types';

export function ProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);

    const result = await createProduct({
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
    });

    if (!result.success) {
      toast.error(result.error);
      setSubmitting(false);
      return;
    }

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await uploadProductImage(result.productId, images[i], i === 0);
      }
    }

    toast.success('Product created');
    setSubmitting(false);
    router.push('/admin/dashboard/products');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="text-sm font-medium block mb-1.5">Product Name</label>
        <input name="name" required className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm" />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Description</label>
        <textarea name="description" rows={3} className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Category</label>
          <select name="categoryId" className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm">
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
          <input name="productCode" className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Base Price (₦)</label>
          <input
            name="basePrice"
            type="number"
            step="0.01"
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
            defaultValue={0}
            className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Sizes (comma-separated)</label>
          <input name="sizes" placeholder="36, 37, 38, 39" className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Colors (comma-separated)</label>
          <input name="colors" placeholder="Black, Gold, Pink" className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          className="w-full text-sm"
        />
        <p className="text-xs text-brand-black/40 mt-1">First image will be used as the primary image.</p>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isNewArrival" /> New Arrival
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isBestSeller" /> Best Seller
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-brand-black text-white px-6 py-3 rounded-full text-sm hover:bg-brand-gold hover:text-brand-black transition-colors disabled:opacity-50"
      >
        {submitting ? 'Saving…' : 'Save Product'}
      </button>
    </form>
  );
}
