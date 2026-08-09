'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createBanner } from '@/actions/manage-banners';

export function BannerForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!imageFile) {
      toast.error('Please choose a banner image');
      return;
    }

    setSubmitting(true);
    const form = new FormData(e.currentTarget);

    const result = await createBanner(
      {
        title: String(form.get('title')),
        subtitle: String(form.get('subtitle') ?? ''),
        linkUrl: String(form.get('linkUrl') ?? ''),
        sortOrder: Number(form.get('sortOrder') || 0),
        isActive: form.get('isActive') === 'on',
      },
      imageFile
    );

    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Banner created');
    router.push('/admin/dashboard/banners');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="text-sm font-medium block mb-1.5">Title</label>
        <input
          name="title"
          required
          placeholder="New Season Sale"
          className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Subtitle (optional)</label>
        <input
          name="subtitle"
          placeholder="20% off selected heels"
          className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Link URL (optional)</label>
        <input
          name="linkUrl"
          placeholder="/products?category=heels"
          className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Banner Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm"
        />
        <p className="text-xs text-brand-black/40 mt-1">
          Wide images work best (e.g. 1600×700px).
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className="text-sm font-medium block mb-1.5">Sort Order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={0}
            className="w-24 border border-black/15 rounded-lg px-4 py-2.5 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm mt-6">
          <input type="checkbox" name="isActive" defaultChecked /> Active
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-brand-black text-white px-6 py-3 rounded-full text-sm hover:bg-brand-gold hover:text-brand-black transition-colors disabled:opacity-50"
      >
        {submitting ? 'Saving…' : 'Save Banner'}
      </button>
    </form>
  );
}