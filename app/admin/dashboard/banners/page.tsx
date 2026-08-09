import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { BannerControls } from '@/components/admin/banner-controls';

async function getBanners() {
  const supabase = await createClient();
  const { data } = await supabase.from('banners').select('*').order('sort_order');
  return data ?? [];
}

export default async function AdminBannersPage() {
  const banners = await getBanners();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Banners</h1>
        <Link
          href="/admin/dashboard/banners/new"
          className="flex items-center gap-2 bg-brand-black text-white text-sm px-4 py-2.5 rounded-full hover:bg-brand-gold hover:text-brand-black transition-colors"
        >
          <Plus size={16} /> Add Banner
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="border border-black/10 rounded-xl2 overflow-hidden">
            <div className="relative aspect-video bg-brand-pink/10">
              <Image src={b.image_url} alt={b.title} fill className="object-cover" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium">{b.title}</p>
              <p className="text-xs text-brand-black/50">{b.is_active ? 'Active' : 'Inactive'}</p>
              <BannerControls bannerId={b.id} isActive={b.is_active} />
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <p className="text-brand-black/40 text-sm col-span-full py-12 text-center">
            No banners yet — add your first one.
          </p>
        )}
      </div>
    </div>
  );
}