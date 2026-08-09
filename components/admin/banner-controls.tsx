'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { toggleBannerActive, deleteBanner } from '@/actions/manage-banners';

export function BannerControls({ bannerId, isActive }: { bannerId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleBannerActive(bannerId, !isActive);
      if (!result.success) toast.error(result.error);
    });
  }

  function handleDelete() {
    if (!confirm('Delete this banner? This cannot be undone.')) return;
    startTransition(async () => {
      const result = await deleteBanner(bannerId);
      if (!result.success) toast.error(result.error);
      else toast.success('Banner deleted');
    });
  }

  return (
    <div className="flex items-center gap-3 mt-2">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="text-xs text-brand-black/60 hover:text-brand-gold underline"
      >
        {isActive ? 'Deactivate' : 'Activate'}
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs text-red-500 hover:text-red-700 underline"
      >
        Delete
      </button>
    </div>
  );
}